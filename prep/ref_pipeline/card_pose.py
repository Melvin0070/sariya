"""Detect the ChArUco card or the ArUco strip; homography image px -> plane mm; tilt from PnP.

Inputs are UNDISTORTED grey images (run_one.py undistorts once with the calibrated K/dist, then
everything downstream uses K with zero distortion).  Kotlin port: same order of calls:
  ArucoDetector.detectMarkers -> card k from ids -> CharucoDetector(board).detectBoard
  -> board.matchImagePoints -> Calib3d.findHomography(img, obj_xy, RANSAC, 3)
  -> Calib3d.solvePnP(obj, img, K, none, SOLVEPNP_IPPE) for tilt / distance only.
Measurement uses the homography, never the PnP pose (vision-stack.md section 5.3).
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict

import cv2
import numpy as np

from . import fiducials as F


@dataclass
class PlanePose:
    kind: str                      # "card" | "strip"
    fid_id: int                    # card k; -1 for the 2 m strip, 300 for strip_300
    n_points: int                  # matched corners (card) or marker corners (strip)
    n_markers: int
    H_img2mm: np.ndarray           # 3x3, image px -> plane mm
    H_mm2img: np.ndarray
    rvec: np.ndarray
    tvec: np.ndarray
    distance_m: float              # z-depth of the fiducial centroid along the optical axis (sets the GSD)
    ray_m: float                   # straight-line distance to the fiducial centroid
    tilt_deg: float                # plane normal vs optical axis (card); along-strip tilt only (strip)
    tilt_across_deg: float         # strip only: tilt about the long axis, ill-conditioned (60 mm lever); never gated
    reproj_rms_px: float           # PnP reprojection RMS over matched points
    homog_rms_px: float            # homography residual RMS (image side)
    span_px: float                 # L_px: largest extent of the matched points in the image
    sigma_c_px: float              # corner localisation estimate used by the card-scale term
    outline_px: np.ndarray         # fiducial outline in image px (for masking)
    obj_mm: np.ndarray = field(repr=False, default=None)
    img_px: np.ndarray = field(repr=False, default=None)

    def to_json(self) -> dict:
        d = asdict(self)
        for k in ("obj_mm", "img_px"):
            d.pop(k)
        for k in ("H_img2mm", "H_mm2img", "rvec", "tvec", "outline_px"):
            d[k] = np.asarray(d[k]).round(6).tolist()
        for k in ("distance_m", "ray_m", "tilt_deg", "tilt_across_deg", "reproj_rms_px", "homog_rms_px", "span_px", "sigma_c_px"):
            d[k] = round(float(d[k]), 4)
        return d


def px_to_mm(H_img2mm: np.ndarray, pts_px: np.ndarray) -> np.ndarray:
    p = np.asarray(pts_px, np.float64).reshape(-1, 1, 2)
    return cv2.perspectiveTransform(p, H_img2mm).reshape(-1, 2)


def mm_to_px(H_mm2img: np.ndarray, pts_mm: np.ndarray) -> np.ndarray:
    p = np.asarray(pts_mm, np.float64).reshape(-1, 1, 2)
    return cv2.perspectiveTransform(p, H_mm2img).reshape(-1, 2)


def _pose_from_matches(kind, fid_id, n_markers, obj, img, K, outline_mm) -> PlanePose | None:
    obj = np.asarray(obj, np.float64).reshape(-1, 3)
    img = np.asarray(img, np.float64).reshape(-1, 2)
    n = len(obj)
    if n < 4:
        return None
    # RANSAC only pays off once there are enough points to vote; below 12 every corner is needed.
    method, thr = (cv2.RANSAC, 3.0) if n >= 12 else (0, 0.0)
    H, inl = cv2.findHomography(img, obj[:, :2], method, thr)
    if H is None:
        return None
    back = mm_to_px(np.linalg.inv(H), obj[:, :2])
    homog_rms = float(np.sqrt(np.mean(np.sum((back - img) ** 2, axis=1))))
    ok, rvec, tvec = cv2.solvePnP(obj, img, K, None, flags=cv2.SOLVEPNP_IPPE)
    if not ok:
        return None
    proj, _ = cv2.projectPoints(obj, rvec, tvec, K, None)
    reproj = float(np.sqrt(np.mean(np.sum((proj.reshape(-1, 2) - img) ** 2, axis=1))))
    R, _ = cv2.Rodrigues(rvec)
    centre_cam = R @ obj.mean(axis=0) + tvec.ravel()
    # Tilt is the plane's orientation relative to the sensor, not the angle of the viewing ray: a
    # card at the image corner is seen 25 deg off-axis while lying flat, and that is fine.
    tilt_full = float(np.degrees(np.arccos(np.clip(abs(R[2, 2]), -1, 1))))
    tilt_along = float(np.degrees(np.arcsin(np.clip(abs(R[2, 0]), -1, 1))))   # strip x-axis out of the sensor plane
    if kind == "strip":
        tilt, tilt_across = tilt_along, float(np.degrees(np.arcsin(np.clip(abs(R[2, 1]), -1, 1))))
    else:
        tilt, tilt_across = tilt_full, 0.0
    span = float(np.max(np.ptp(img, axis=0)))
    # The corner-localisation term wants the real residual, floored at the sub-pixel refiner's own limit.
    sigma_c = max(0.2, homog_rms)
    return PlanePose(kind, fid_id, n, n_markers, H, np.linalg.inv(H), rvec, tvec,
                     float(centre_cam[2] / 1000.0), float(np.linalg.norm(centre_cam) / 1000.0), tilt, tilt_across,
                     reproj, homog_rms, span, sigma_c,
                     mm_to_px(np.linalg.inv(H), outline_mm).astype(np.float32), obj, img)


def detect_markers(gray: np.ndarray):
    det = cv2.aruco.ArucoDetector(F.DICT, F.detector_params())
    corners, ids, _ = det.detectMarkers(gray)
    if ids is None:
        return [], np.zeros((0, 1), np.int32)
    return list(corners), ids


def detect_card(gray: np.ndarray, K: np.ndarray, card_id: int | None = None,
                square_mm: float | None = None) -> PlanePose | None:
    """Card k is inferred from the majority of marker ids (ids 18k..18k+17) unless given."""
    if card_id is None:
        _, ids = detect_markers(gray)
        ks = [F.card_id_from_marker(i) for i in ids.ravel()]
        ks = [k for k in ks if k is not None]
        if not ks:
            return None
        card_id = int(np.bincount(ks).argmax())
    if square_mm is None:
        square_mm = F.CARD_SQ_MM_BY_ID.get(card_id, F.CARD_SQ_MM)
    board = F.card_board(card_id, square_mm)
    det = cv2.aruco.CharucoDetector(board, detectorParams=F.detector_params())
    cc, cid, mc, mid = det.detectBoard(gray)
    if cc is None or len(cc) < 4:
        return None
    obj, img = board.matchImagePoints(cc, cid)
    return _pose_from_matches("card", card_id, 0 if mid is None else len(mid), obj, img, K,
                              F.card_outline_mm(square_mm))


def detect_strip(gray: np.ndarray, K: np.ndarray, pitch_mm: float | None = None) -> PlanePose | None:
    """Picks the 2 m strip (ids 400-439) or strip_300 (ids 450-461) by whichever has more markers in view."""
    corners, ids = detect_markers(gray)
    long_ = [(c, i) for c, i in zip(corners, ids.ravel()) if F.STRIP_ID0 <= i < F.STRIP_ID0 + F.STRIP_N]
    s300 = [(c, i) for c, i in zip(corners, ids.ravel()) if F.STRIP300["id0"] <= i < F.STRIP300["id0"] + F.STRIP300["n"]]
    half = len(s300) > len(long_)
    keep = s300 if half else long_
    if len(keep) < 2:
        return None
    if half:
        pitch_mm = pitch_mm or F.STRIP300["pitch"]
        board, outline = F.strip300_board(pitch_mm), F.strip300_outline_mm(pitch_mm)
    else:
        pitch_mm = pitch_mm or F.STRIP_PITCH_MM
        board, outline = F.strip_board(pitch_mm), F.strip_outline_mm(pitch_mm)
    c = [k[0] for k in keep]
    i = np.array([[k[1]] for k in keep], np.int32)
    obj, img = board.matchImagePoints(c, i)
    return _pose_from_matches("strip", 300 if half else -1, len(keep), obj, img, K, outline)


def detect_plane(gray: np.ndarray, K: np.ndarray, prefer: str = "card", **kw) -> PlanePose | None:
    order = ("card", "strip") if prefer == "card" else ("strip", "card")
    for kind in order:
        pose = detect_card(gray, K, **({k: v for k, v in kw.items() if k in ("card_id", "square_mm")})) if kind == "card" \
            else detect_strip(gray, K, **({k: v for k, v in kw.items() if k in ("pitch_mm",)}))
        if pose is not None:
            return pose
    return None


def gsd_mm_per_px(pose: PlanePose, K: np.ndarray) -> float:
    """Ground sample distance at the fiducial, H / f, with f the mean focal length in px."""
    f = 0.5 * (K[0, 0] + K[1, 1])
    return pose.distance_m * 1000.0 / f
