"""Half-scale stage props (BUILD-PLAN §7): card S, 8 mm @ 50 both ways, single-gap limit 65.

Guards the 9 Oct fixes: tol_local = max(15, 25 %) (a flat 25 made every stage fault "rescan"),
card S auto-detected from ids 360-377, distance gate down to 0.2 m, and the marker-pixel abstention.
"""
import numpy as np
import pytest

from ref_pipeline import fiducials as F
from ref_pipeline.run_one import run
from ref_pipeline.tests import synth

PPMM = 8.0
HOME = [40, 90, 140, 190, 240]
ZONE = (np.array([[30, 30], [250, 30], [250, 250], [30, 250]], float) - np.array([20, 160])).tolist()


def _scene(top_x, bot_y, dist_mm):
    canvas = synth.blank_canvas(280, 280, PPMM)
    for y in bot_y:
        synth.draw_bar(canvas, PPMM, (0, y), (280, y), 8, value=60)
    for x in top_x:
        synth.draw_bar(canvas, PPMM, (x, 0), (x, 280), 8, value=40)
    board = F.card_board(20)
    side = int(round(100 * PPMM))
    img = board.generateImage((side, side), marginSize=int(round(5 * PPMM)), borderBits=1)
    x0, y0 = int(round(15 * PPMM)), int(round(155 * PPMM))
    canvas[y0:y0 + side, x0:x0 + side] = img
    K = synth.K_of()
    R = synth.rot(tilt_x_deg=3.0, roll_deg=1.0)
    C = synth.camera_looking_at((140, 140), dist_mm, R)
    im, _ = synth.project_canvas(canvas, PPMM, K, R, C)
    return np.repeat(im[:, :, None], 3, axis=2), K


def _local(top_x, bot_y, dist_mm=300.0):
    im, K = _scene(top_x, bot_y, dist_mm)
    spec = {"member": "slab", "fiducial": "card", "bar_dia_mm": 8, "polarity": "auto", "main_axis": "y",
            "n_spec": {"main": 5, "dist": 5}, "s_spec": {"main": 50, "dist": 50}, "min_len_mm": 80, "zone_mm": ZONE}
    res, _ = run(im, synth.intrinsics_dict(K), spec)
    return res, {v["label"]: v for v in res.get("verdicts", []) if v["rule_id"] == "DWG-SPACING-LOCAL"}


def test_control_within():
    res, v = _local(HOME, HOME)
    assert not res["abstain"]
    assert v["[main]"]["verdict"] == "within" and v["[dist]"]["verdict"] == "within"
    assert v["[main]"]["effective_limit"] == pytest.approx(65.0)


@pytest.mark.parametrize("top_x,bot_y,label,gap", [
    ([40, 90, 140, 220, 240], HOME, "[main]", 80.0),   # F2
    ([40, 90, 140, 212, 240], HOME, "[main]", 72.0),   # F4
    (HOME, [40, 60, 140, 190, 240], "[dist]", 80.0),   # F12
])
def test_stage_faults_outside(top_x, bot_y, label, gap):
    _, v = _local(top_x, bot_y)
    assert v[label]["verdict"] == "outside"
    assert v[label]["measured"] == pytest.approx(gap, abs=1.5)


def test_far_scan_abstains_on_marker_size():
    res, v = _local([40, 90, 140, 212, 240], HOME, dist_mm=800.0)
    assert any("too small" in a for a in res["abstain"])
    assert not v


BEAM_HOME = [25, 75, 125, 200, 275]


def _beam(links, dist_mm=300.0):
    canvas = synth.blank_canvas(300, 125, PPMM)
    for x in links:
        synth.draw_bar(canvas, PPMM, (x, 0), (x, 125), 8)
    for y in (25, 100):                                   # two 12 mm bars, 75 apart
        synth.draw_bar(canvas, PPMM, (0, y), (300, y), 12)
    synth.paste_strip300(canvas, PPMM, (0, 47.5))
    K = synth.K_of()
    R = synth.rot(tilt_x_deg=-4.0, roll_deg=-1.5)
    C = synth.camera_looking_at((150, 62), dist_mm, R)
    img, _ = synth.project_canvas(canvas, PPMM, K, R, C)
    # Right face far away: the 300 mm prop is the left end zone plus mid-span, never a right end zone.
    spec = {"member": "beam", "fiducial": "strip", "bar_dia_mm": 8, "polarity": "dark", "min_len_mm": 80,
            "s_spec_end": 50, "s_spec_mid": 75, "L_end_spec": 150, "faces_mm": [0, 100000], "zone": "II",
            "apply_13920": False}
    res, _ = run(np.repeat(img[:, :, None], 3, axis=2), synth.intrinsics_dict(K), spec)
    return res, {(r["rule_id"], r["label"]): r for r in res.get("verdicts", [])}


def test_beam_halfscale_control():
    res, v = _beam(BEAM_HOME)
    assert res["abstain"] == [], res["abstain"]
    assert res["pose"]["n_markers"] >= 10
    assert np.abs(np.array(res["link_positions_mm"]) - np.array(BEAM_HOME)).max() < 1.5
    assert v[("DWG-SPACING-MEAN", "[left end]")]["verdict"] == "within"
    assert v[("DWG-SPACING-MEAN", "[mid]")]["verdict"] == "within"


def test_beam_halfscale_f3_add_one():
    res, v = _beam([25, 125, 180, 200, 275])              # F3: 2nd ring slid into mid-span
    left = v[("DWG-SPACING-MEAN", "[left end]")]
    assert left["verdict"] == "outside" and left["measured"] == pytest.approx(100, abs=2)
