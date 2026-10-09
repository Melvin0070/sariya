"""End to end: synthetic slab mesh + card at a known pose -> count exact, spacing error < 1 mm."""
import json

import numpy as np
import pytest

from . import synth
from ..card_pose import px_to_mm
from ..run_one import run

PPMM = 4.0
SX, SY = 150.0, 120.0          # bars along y every 150 mm in x; bars along x every 120 mm in y
XS = [100 + SX * i for i in range(6)]
YS = [80 + SY * j for j in range(5)]
CARD_ORIGIN = np.array([940.0, 420.0])   # canvas mm of the card's chess origin
# Plane coordinates in results are CARD mm (origin at the chess pattern's top-left corner), so the
# zone and the truth are expressed there: canvas mm minus the card origin.
ZONE = (np.array([[60, 100], [900, 100], [900, 620], [60, 620]], float) - CARD_ORIGIN).tolist()
N_X_IN_ZONE = 4                          # y = 200, 320, 440, 560 (80 is outside the zone)


@pytest.fixture(scope="module")
def scene():
    canvas = synth.blank_canvas(1300, 760, PPMM)
    for x in XS:
        synth.draw_bar(canvas, PPMM, (x, 0), (x, 760), 10)
    for y in YS:
        synth.draw_bar(canvas, PPMM, (0, y), (1300, y), 10)
    synth.paste_card(canvas, PPMM, 3, tuple(CARD_ORIGIN))
    K = synth.K_of()
    R = synth.rot(tilt_x_deg=8.0, roll_deg=3.0)
    C = synth.camera_looking_at((600, 350), 800.0, R)
    img, H_true = synth.project_canvas(canvas, PPMM, K, R, C)
    depth = (R @ (np.array([CARD_ORIGIN[0] + 90, CARD_ORIGIN[1] + 90, 0.0]) - C))[2] / 1000.0
    return img, K, H_true, depth


def test_slab_count_and_spacing(scene, tmp_path):
    img, K, H_true, depth = scene
    spec = {"member": "slab", "fiducial": "card", "zone_mm": ZONE, "bar_dia_mm": 10, "polarity": "auto",
            "main_axis": "y", "n_spec": {"main": 6, "dist": N_X_IN_ZONE}, "s_spec": {"main": 150, "dist": 120},
            "d": 101, "D": 125, "dia": {"main": 10, "dist": 10}}
    res, overlay = run(np.repeat(img[:, :, None], 3, axis=2), synth.intrinsics_dict(K), spec)
    json.dumps(res)                                     # must be serialisable
    import cv2
    cv2.imwrite(str(tmp_path / "overlay.png"), overlay)
    assert res["abstain"] == [], res["abstain"]
    assert res["pose"]["fid_id"] == 3
    assert res["pose"]["n_points"] >= 20
    assert abs(res["pose"]["distance_m"] - depth) < 0.01
    assert abs(res["pose"]["tilt_deg"] - 8.0) < 0.5
    assert res["coverage_ok"]
    fy, fx = res["families"]["y"], res["families"]["x"]
    assert fy["count"] == 6 and fx["count"] == N_X_IN_ZONE
    assert len(fy["spacings_mm"]) == 5 and len(fx["spacings_mm"]) == N_X_IN_ZONE - 1
    err_y = np.abs(np.array(fy["spacings_mm"]) - SX)
    err_x = np.abs(np.array(fx["spacings_mm"]) - SY)
    assert err_y.max() < 1.0, fy["spacings_mm"]
    assert err_x.max() < 1.0, fx["spacings_mm"]
    assert all(fy["spacing_continuity_ok"]) and all(fx["spacing_continuity_ok"])
    # Bands are populated and the 2-sigma model sits below the 5 mm field floor at 0.8 m.
    assert all(b == pytest.approx(5.0) for b in fy["bands_mm"])
    assert all(t["two_sigma"] < 5.0 for t in fy["band_terms"])
    v = {(r["rule_id"], r["label"]): r["verdict"] for r in res["verdicts"]}
    assert v[("DWG-COUNT", "[main]")] == "within" and v[("DWG-COUNT", "[dist]")] == "within"
    assert v[("DWG-SPACING-MEAN", "[main]")] == "within"
    assert v[("DWG-SPACING-MEAN", "[dist]")] == "within"
    assert v[("IS456-SLAB-MAIN-SMAX", "[main]")] == "within"
    assert res["summary"]["outside"] == 0 and res["summary"]["rescan"] == 0


def test_homography_matches_truth(scene):
    img, K, H_true, depth = scene
    from ..card_pose import detect_card
    pose = detect_card(img, K)
    assert pose is not None and pose.fid_id == 3
    # Absolute position far from the card is limited by the tilt term (x_off^2/H * dtheta); what
    # the pipeline needs is the spacing between neighbours, which stays sub-0.5 mm across the view.
    xs, ys = (100, 250, 400, 550, 700, 850), (80, 200, 320, 440, 560)
    pts_mm = np.array([[x, y] for x in xs for y in ys], float)
    px = (H_true @ np.column_stack([pts_mm, np.ones(len(pts_mm))]).T).T
    px = px[:, :2] / px[:, 2:3]
    back = (px_to_mm(pose.H_img2mm, px) + CARD_ORIGIN).reshape(len(xs), len(ys), 2)
    assert np.linalg.norm(back.reshape(-1, 2) - pts_mm, axis=1).max() < 2.0
    dx = np.diff(back[:, :, 0], axis=0); dy = np.diff(back[:, :, 1], axis=1)
    assert np.abs(dx - 150).max() < 0.5 and np.abs(dy - 120).max() < 0.5, (dx, dy)
    assert pose.homog_rms_px < 0.5
    assert abs(pose.tilt_deg - 8.0) < 0.5 and abs(pose.distance_m - depth) < 0.01


def test_missing_bar_and_near_limit(scene):
    """F1 and F4 from the fault deck: a count mismatch is 'outside'; a spacing inside the band is 'rescan'."""
    img, K, _, _ = scene
    spec = {"member": "slab", "zone_mm": ZONE, "bar_dia_mm": 10, "polarity": "dark", "main_axis": "y",
            "n_spec": {"main": 7, "dist": N_X_IN_ZONE}, "s_spec": {"main": 142, "dist": 120}, "d": 101, "D": 125,
            "dia": {"main": 10, "dist": 10}}
    res, _ = run(np.repeat(img[:, :, None], 3, axis=2), synth.intrinsics_dict(K), spec)
    v = {(r["rule_id"], r["label"]): r for r in res["verdicts"]}
    assert v[("DWG-COUNT", "[main]")]["verdict"] == "outside"
    # mean 150 vs limit 142 + max(10, 7.1) = 152: band 5 straddles -> rescan
    assert v[("DWG-SPACING-MEAN", "[main]")]["verdict"] == "rescan"
