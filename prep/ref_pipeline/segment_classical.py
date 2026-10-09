"""Weights-free bar mask: Frangi/Sato ridge filter + hysteresis threshold.

This is the "if pre-trained weights are disallowed" path from vision-stack.md section 1 and the
stand-in for the U-Net at bench time.  The U-Net replaces only this file; the mask contract is
the same: bool array at full image resolution, True on bar pixels, fiducial regions blanked.
Kotlin port of the classical path is optional (the NPU model is the primary); if ported, use
Imgproc on a 1920-wide working copy exactly as here.
"""
from __future__ import annotations

import cv2
import numpy as np
from skimage.filters import frangi, sato, apply_hysteresis_threshold, threshold_otsu
from skimage.morphology import remove_small_objects


def _ridge(img01: np.ndarray, sigmas, black: bool, method: str) -> np.ndarray:
    if method == "sato":
        r = sato(img01, sigmas=sigmas, black_ridges=black)
    else:
        r = frangi(img01, sigmas=sigmas, black_ridges=black, beta=0.5, gamma=None)
    hi = np.percentile(r, 99.9)
    return r / hi if hi > 0 else r


def bar_mask(gray: np.ndarray, bar_width_px: float, polarity: str = "auto",
             exclude_polys_px: list[np.ndarray] | None = None, work_width: int = 1920,
             method: str = "frangi", low_frac: float = 0.4) -> tuple[np.ndarray, dict]:
    """gray: undistorted 8-bit image.  bar_width_px: expected bar width in FULL-RES px (dia / GSD).

    Ridge scales bracket the bar half-width; hysteresis keeps faint rib-shadowed stretches
    connected to confidently detected ones without dropping the threshold everywhere.
    """
    h, w = gray.shape[:2]
    s = min(1.0, work_width / w)
    small = cv2.resize(gray, (int(round(w * s)), int(round(h * s))), interpolation=cv2.INTER_AREA) if s < 1 else gray
    img01 = small.astype(np.float32) / 255.0
    bw = max(2.0, bar_width_px * s)
    sigmas = [bw * 0.25, bw * 0.35, bw * 0.5]

    if polarity == "auto":
        rd = _ridge(img01, sigmas, True, method)
        rb = _ridge(img01, sigmas, False, method)
        # The true polarity has the heavier tail: more pixels near the top of the response.
        pol = "dark" if np.mean(rd > 0.3) >= np.mean(rb > 0.3) else "bright"
        r = rd if pol == "dark" else rb
    else:
        pol = polarity
        r = _ridge(img01, sigmas, pol == "dark", method)

    if exclude_polys_px:
        pad = int(np.ceil(bw * 1.5))
        ex = np.zeros(r.shape, np.uint8)
        for poly in exclude_polys_px:
            cv2.fillPoly(ex, [np.round(np.asarray(poly, np.float64) * s).astype(np.int32)], 255)
        ex = cv2.dilate(ex, np.ones((2 * pad + 1, 2 * pad + 1), np.uint8))
        r[ex > 0] = 0
    # The image border is a ridge to the Hessian; blank it.
    b = int(np.ceil(bw))
    r[:b, :] = 0; r[-b:, :] = 0; r[:, :b] = 0; r[:, -b:] = 0

    hi = float(threshold_otsu(r[r > 0.02])) if np.any(r > 0.02) else 0.5
    m = apply_hysteresis_threshold(r, hi * low_frac, hi)
    m = remove_small_objects(m, max_size=int(bw * bw * 3))
    if s < 1:
        m = cv2.resize(m.astype(np.uint8), (w, h), interpolation=cv2.INTER_NEAREST).astype(bool)
    info = {"polarity": pol, "method": method, "work_scale": round(s, 4), "sigmas_work_px": [round(x, 2) for x in sigmas],
            "threshold_high": round(hi, 4), "threshold_low": round(hi * low_frac, 4), "mask_frac": round(float(m.mean()), 5)}
    return m, info
