"""ChArUco intrinsics from a folder of frames -> intrinsics.json.

Usage:
  python -m ref_pipeline.calibrate FRAMES_DIR --mode "iqoo15_main_4k_still_focus0.8" \
      [--square-mm 35.0] [--card] -o intrinsics.json

Intrinsics change with capture mode (binning, crop, video vs still) and focus distance, so the
mode name is stored with the numbers and the app refuses a file whose mode is not the one it is
shooting in.  Kotlin port: Calib3d.calibrateCamera on the same matched ChArUco points; the JSON
layout below is the asset format.
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import os

import cv2
import numpy as np

from . import fiducials as F


def load_intrinsics(path: str) -> dict:
    with open(path) as f:
        d = json.load(f)
    d["K"] = np.asarray(d["K"], np.float64).reshape(3, 3)
    d["dist"] = np.asarray(d["dist"], np.float64).ravel()
    return d


def collect_points(frames, board, min_corners=20, params=None):
    det = cv2.aruco.CharucoDetector(board, detectorParams=params or F.detector_params())
    obj_all, img_all, used, size = [], [], [], None
    for path, img in frames:
        gray = img if img.ndim == 2 else cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        if size is None:
            size = (gray.shape[1], gray.shape[0])
        elif size != (gray.shape[1], gray.shape[0]):
            raise ValueError(f"{path}: frame size {gray.shape[::-1]} differs from {size}; one capture mode per file")
        cc, cid, _, _ = det.detectBoard(gray)
        if cc is None or len(cc) < min_corners:
            continue
        op, ip = board.matchImagePoints(cc, cid)
        obj_all.append(op.astype(np.float32))
        img_all.append(ip.astype(np.float32))
        used.append(path)
    return obj_all, img_all, used, size


def calibrate(frames, board, mode: str, min_corners=20) -> dict:
    """frames: iterable of (name, image).  Returns the intrinsics dict (JSON-serialisable)."""
    obj_all, img_all, used, size = collect_points(frames, board, min_corners)
    if len(used) < 8:
        raise RuntimeError(f"only {len(used)} usable frames (need >= 8, want 20-30)")
    # k3 is unconstrained when the board covers only part of the frame (k1/k2/k3 trade off against
    # each other at the 0.3 px level); fix it, as the Android port must (Calib3d.CALIB_FIX_K3).
    rms, K, dist, rvecs, tvecs = cv2.calibrateCamera(obj_all, img_all, size, None, None, flags=cv2.CALIB_FIX_K3)
    per_frame = []
    for o, i, r, t in zip(obj_all, img_all, rvecs, tvecs):
        proj, _ = cv2.projectPoints(o, r, t, K, dist)
        per_frame.append(float(np.sqrt(np.mean(np.sum((proj.reshape(-1, 2) - i.reshape(-1, 2)) ** 2, axis=1)))))
    return {
        "capture_mode": mode,
        "image_size": [int(size[0]), int(size[1])],
        "K": K.round(4).tolist(),
        "dist": dist.ravel().round(6).tolist(),
        "rms_px": round(float(rms), 4),
        "per_frame_rms_px": [round(v, 3) for v in per_frame],
        "n_frames": len(used),
        "frames": [os.path.basename(p) for p in used],
        "board": {"squares": list(board.getChessboardSize()), "square_mm": float(board.getSquareLength()),
                  "marker_mm": float(board.getMarkerLength()), "dict": "DICT_5X5_1000"},
        "created": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "opencv": cv2.__version__,
    }


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("frames_dir")
    ap.add_argument("--mode", required=True, help="capture-mode name stored with the intrinsics")
    ap.add_argument("--square-mm", type=float, default=None, help="measured square pitch of the printed board")
    ap.add_argument("--card", type=int, default=None, help="calibrate with site card k instead of the A3 board")
    ap.add_argument("--min-corners", type=int, default=20)
    ap.add_argument("-o", "--out", default="intrinsics.json")
    a = ap.parse_args(argv)
    if a.card is not None:
        board = F.card_board(a.card, a.square_mm or F.CARD_SQ_MM)
    else:
        board = F.calib_board(a.square_mm or F.CALIB_SQ_MM)
    paths = sorted(p for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG") for p in glob.glob(os.path.join(a.frames_dir, ext)))
    frames = ((p, cv2.imread(p, cv2.IMREAD_GRAYSCALE)) for p in paths)
    res = calibrate(frames, board, a.mode, a.min_corners)
    with open(a.out, "w") as f:
        json.dump(res, f, indent=1)
    print(f"{res['n_frames']} frames, RMS {res['rms_px']} px (target < 0.3), f = {res['K'][0][0]:.1f}/{res['K'][1][1]:.1f} px -> {a.out}")
    if res["rms_px"] > 0.5:
        print("WARNING: RMS > 0.5 px; re-shoot with a flatter board, more tilt variety and locked focus")


if __name__ == "__main__":
    main()
