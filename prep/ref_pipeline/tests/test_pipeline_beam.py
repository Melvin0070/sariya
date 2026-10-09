"""Beam: stirrups crossing the ArUco strip; link positions, end/mid spacing, first-link offset."""
import numpy as np
import pytest

from . import synth
from ..run_one import run

PPMM = 4.0
LINKS = [40 + 100 * i for i in range(6)] + [690 + 150 * i for i in range(4)] + [1260 + 100 * i for i in range(6)]


@pytest.fixture(scope="module")
def scene():
    canvas = synth.blank_canvas(2000, 700, PPMM)
    for x in LINKS:
        synth.draw_bar(canvas, PPMM, (x, 0), (x, 700), 8)
    for y in (180, 400):                       # longitudinal bars
        synth.draw_bar(canvas, PPMM, (0, y), (2000, y), 16)
    synth.paste_strip(canvas, PPMM, (0, 20))
    K = synth.K_of()
    R = synth.rot(tilt_x_deg=-6.0, roll_deg=-2.0)
    C = synth.camera_looking_at((550, 300), 800.0, R)
    img, _ = synth.project_canvas(canvas, PPMM, K, R, C)
    return img, K


def test_beam_zones(scene, tmp_path):
    img, K = scene
    spec = {"member": "beam", "fiducial": "strip", "bar_dia_mm": 8, "polarity": "dark", "min_len_mm": 120,
            "s_spec_end": 100, "s_spec_mid": 150, "d": 409, "dia_long_min": 16, "L_end_spec": 600,
            "faces_mm": [0, 1800], "zone": "III", "apply_13920": True}
    res, overlay = run(np.repeat(img[:, :, None], 3, axis=2), synth.intrinsics_dict(K), spec)
    import cv2
    cv2.imwrite(str(tmp_path / "beam_overlay.png"), overlay)
    assert res["abstain"] == [], res["abstain"]
    assert res["pose"]["kind"] == "strip" and res["pose"]["n_markers"] >= 10
    pos = np.array(res["link_positions_mm"])
    seen = [x for x in LINKS if 0 <= x <= 1120]
    assert len(pos) == len(seen), (pos, seen)
    assert np.abs(pos - np.array(seen)).max() < 1.0, pos
    v = {(r["rule_id"], r["label"]): r for r in res["verdicts"]}
    left = v[("DWG-SPACING-MEAN", "[left end]")]
    assert abs(left["measured"] - 100) < 1.0 and left["verdict"] == "within"
    mid = v[("DWG-SPACING-MEAN", "[mid]")]
    assert abs(mid["measured"] - 150) < 1.0 and mid["verdict"] == "within"
    assert v[("IS13920-BEAM-FIRST-LINK", "[left end]")]["verdict"] == "within"
    assert abs(v[("IS13920-BEAM-FIRST-LINK", "[left end]")]["measured"] - 40) < 1.0
    # close zone: links 40..540 then a 150 gap -> boundary at 615 mm vs 600 - 50
    assert v[("DWG-ENDZONE-LEN", "[left end]")]["verdict"] == "within"
    assert abs(v[("DWG-ENDZONE-LEN", "[left end]")]["measured"] - 615) < 2.0
    assert v[("IS13920-BEAM-ENDZONE-LEN", "[left end]")]["verdict"] == "outside"      # 615 < 818 - 50
    assert abs(res["pose"]["distance_m"] - 0.8) < 0.05 and res["pose"]["tilt_deg"] < 1.0
    # 96 mm IS 13920 limit vs 100 measured +/- 5: outside, mandatory in zone III
    e = v[("IS13920-BEAM-END-SPACING", "[left end]")]
    assert e["limit"] == pytest.approx(96) and e["verdict"] == "rescan" and e["severity"] == "M"
    assert v[("DWG-SPACING-MEAN", "[right end]")]["verdict"] == "not_seen"
