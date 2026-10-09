"""Synthetic scene renderer for the unit tests: a plane canvas (mm) seen by a pinhole camera.

Ground truth is exact: bars are drawn at known mm positions on the canvas, the card/strip is
pasted at a known origin, and the canvas is warped with the homography of a known camera pose.
"""
from __future__ import annotations

import cv2
import numpy as np

from .. import fiducials as F

W4K, H4K, F4K = 3840, 2160, 2662.0


def K_of(w=W4K, h=H4K, f=F4K) -> np.ndarray:
    return np.array([[f, 0, w / 2 - 0.5], [0, f, h / 2 - 0.5], [0, 0, 1]], np.float64)


def rot(tilt_x_deg=0.0, tilt_y_deg=0.0, roll_deg=0.0) -> np.ndarray:
    ax, ay, az = np.radians([tilt_x_deg, tilt_y_deg, roll_deg])
    Rx = np.array([[1, 0, 0], [0, np.cos(ax), -np.sin(ax)], [0, np.sin(ax), np.cos(ax)]])
    Ry = np.array([[np.cos(ay), 0, np.sin(ay)], [0, 1, 0], [-np.sin(ay), 0, np.cos(ay)]])
    Rz = np.array([[np.cos(az), -np.sin(az), 0], [np.sin(az), np.cos(az), 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def camera_looking_at(target_mm, dist_mm, R) -> np.ndarray:
    """Camera centre C so that `target_mm` (on z=0) sits on the optical axis at `dist_mm`."""
    t = np.array([target_mm[0], target_mm[1], 0.0])
    return t - dist_mm * (R.T @ np.array([0, 0, 1.0]))


def homography_mm_to_px(K, R, C) -> np.ndarray:
    t = -R @ C
    return K @ np.column_stack([R[:, 0], R[:, 1], t])


def project_canvas(canvas: np.ndarray, ppmm: float, K, R, C, size=(W4K, H4K), bg=170, blur_px=1.0, noise=5.0, seed=0):
    H = homography_mm_to_px(K, R, C) @ np.diag([1 / ppmm, 1 / ppmm, 1.0])
    img = cv2.warpPerspective(canvas, H, size, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=bg)
    if blur_px > 0:
        img = cv2.GaussianBlur(img, (0, 0), blur_px)
    if noise > 0:
        rng = np.random.default_rng(seed)
        img = np.clip(img.astype(np.float32) + rng.normal(0, noise, img.shape), 0, 255).astype(np.uint8)
    return img, homography_mm_to_px(K, R, C)


def blank_canvas(w_mm, h_mm, ppmm, bg=170, texture=12.0, seed=1) -> np.ndarray:
    rng = np.random.default_rng(seed)
    c = np.full((int(h_mm * ppmm), int(w_mm * ppmm)), bg, np.float32)
    # Low-frequency concrete-like mottling so the ridge filter sees a non-flat background.
    low = cv2.resize(rng.normal(0, texture, (24, 36)).astype(np.float32), (c.shape[1], c.shape[0]), interpolation=cv2.INTER_CUBIC)
    return np.clip(c + low, 0, 255).astype(np.uint8)


def draw_bar(canvas, ppmm, p0_mm, p1_mm, width_mm, value=50):
    p0 = tuple(np.round(np.array(p0_mm) * ppmm).astype(int))
    p1 = tuple(np.round(np.array(p1_mm) * ppmm).astype(int))
    cv2.line(canvas, p0, p1, int(value), int(round(width_mm * ppmm)), cv2.LINE_AA)


def paste_card(canvas, ppmm, k: int, origin_mm):
    """Board origin (top-left chess corner) at origin_mm; the 200 mm print starts 10 mm before it."""
    side = int(round((F.CARD_SQUARES * F.CARD_SQ_MM + 2 * F.CARD_MARGIN_MM) * ppmm))
    img = F.card_board(k).generateImage((side, side), marginSize=int(round(F.CARD_MARGIN_MM * ppmm)), borderBits=1)
    x = int(round((origin_mm[0] - F.CARD_MARGIN_MM) * ppmm)); y = int(round((origin_mm[1] - F.CARD_MARGIN_MM) * ppmm))
    canvas[y:y + side, x:x + side] = img


def paste_strip(canvas, ppmm, origin_mm, n_markers=F.STRIP_N):
    """Strip band origin (its top-left corner) at origin_mm, running along +x."""
    w = int(round(F.STRIP_W_MM * ppmm)); L = int(round(F.STRIP_LEN_MM * ppmm))
    band = np.full((w, L), 255, np.uint8)
    mk = int(round(F.STRIP_MK_MM * ppmm))
    for i in range(n_markers):
        m = cv2.aruco.generateImageMarker(F.DICT, F.STRIP_ID0 + i, mk, borderBits=1)
        x = int(round((i * F.STRIP_PITCH_MM + (F.STRIP_PITCH_MM - F.STRIP_MK_MM) / 2) * ppmm))
        y = int(round((F.STRIP_W_MM - F.STRIP_MK_MM) / 2 * ppmm))
        band[y:y + mk, x:x + mk] = m
    x0 = int(round(origin_mm[0] * ppmm)); y0 = int(round(origin_mm[1] * ppmm))
    h, wc = canvas.shape
    L2 = min(L, wc - x0)
    canvas[y0:y0 + w, x0:x0 + L2] = band[:, :L2]


def paste_calib(canvas, ppmm, origin_mm):
    w = int(round(420 * ppmm)); h = int(round(297 * ppmm))
    img = F.calib_board().generateImage((w, h), marginSize=int(round(8.5 * ppmm)), borderBits=1)
    x = int(round(origin_mm[0] * ppmm)); y = int(round(origin_mm[1] * ppmm))
    canvas[y:y + h, x:x + w] = img
    return img


def intrinsics_dict(K, size=(W4K, H4K), mode="synthetic_4k"):
    return {"capture_mode": mode, "image_size": list(size), "K": K, "dist": np.zeros(5), "rms_px": 0.0}


def paste_strip300(canvas, ppmm, origin_mm):
    """strip_300 (ids 450-461, 20 mm markers at 25 mm pitch, 30 mm band) with its top-left corner at origin_mm."""
    S = F.STRIP300
    w = int(round(S["w"] * ppmm)); L = int(round(S["length"] * ppmm))
    band = np.full((w, L), 255, np.uint8)
    mk = int(round(S["mk"] * ppmm))
    for i in range(S["n"]):
        m = cv2.aruco.generateImageMarker(F.DICT, S["id0"] + i, mk, borderBits=1)
        x = int(round((i * S["pitch"] + (S["pitch"] - S["mk"]) / 2) * ppmm))
        y = int(round((S["w"] - S["mk"]) / 2 * ppmm))
        band[y:y + mk, x:x + mk] = m
    x0 = int(round(origin_mm[0] * ppmm)); y0 = int(round(origin_mm[1] * ppmm))
    canvas[y0:y0 + w, x0:x0 + L] = band
