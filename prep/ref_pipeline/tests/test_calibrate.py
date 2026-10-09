"""Synthetic ChArUco calibration: recover a known K from 14 rendered frames of the A3 board."""
import json

import cv2
import numpy as np

from . import synth
from ..calibrate import calibrate, load_intrinsics
from .. import fiducials as F

W, H, FPX = 1920, 1080, 1500.0


def _frames(n=20):
    ppmm = 3.0
    rng = np.random.default_rng(3)
    K = synth.K_of(W, H, FPX)
    for i in range(n):
        canvas = synth.blank_canvas(560, 440, ppmm, bg=200, texture=4)
        synth.paste_calib(canvas, ppmm, (70, 70))
        R = synth.rot(tilt_x_deg=rng.uniform(-30, 30), tilt_y_deg=rng.uniform(-30, 30), roll_deg=rng.uniform(-40, 40))
        # Board fills 40-80 % of the frame, as the capture protocol asks (data-and-props.md 2.4).
        C = synth.camera_looking_at((280 + rng.uniform(-140, 140), 220 + rng.uniform(-90, 90)), rng.uniform(420, 650), R)
        img, _ = synth.project_canvas(canvas, ppmm, K, R, C, size=(W, H), bg=200, noise=2, seed=i)
        yield f"frame_{i:02d}.png", img


def test_recover_intrinsics(tmp_path):
    res = calibrate(_frames(), F.calib_board(), "synthetic_1080p")
    assert res["n_frames"] >= 10
    assert res["rms_px"] < 0.35, res["rms_px"]            # field target is < 0.3 px on a real print
    K = np.array(res["K"])
    assert abs(K[0, 0] - FPX) / FPX < 0.01 and abs(K[1, 1] - FPX) / FPX < 0.01
    assert abs(K[0, 2] - (W / 2 - 0.5)) < 10 and abs(K[1, 2] - (H / 2 - 0.5)) < 10
    # Rendered with zero distortion: k1/k2 trade off against each other where the board never
    # was, so test what matters, the undistortion displacement over the central 60 % of the frame
    # (< 1.5 px).  The corners are only trustworthy if the capture protocol puts the board there.
    g = np.array([[x, y] for x in np.linspace(0.2 * W, 0.8 * W, 7) for y in np.linspace(0.2 * H, 0.8 * H, 5)], np.float32)
    und = cv2.undistortPoints(g.reshape(-1, 1, 2), K, np.array(res["dist"]), P=K).reshape(-1, 2)
    assert np.linalg.norm(und - g, axis=1).max() < 1.5
    p = tmp_path / "intrinsics.json"
    p.write_text(json.dumps(res))
    d = load_intrinsics(str(p))
    assert d["capture_mode"] == "synthetic_1080p" and d["K"].shape == (3, 3) and d["dist"].shape == (5,)
