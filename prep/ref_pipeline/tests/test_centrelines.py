"""Centreline extraction on a bare mask (identity homography, mm == px): count, spacing, merge, families."""
import cv2
import numpy as np

from ..centrelines import extract, ransac_lines, cluster_families


def _mask(w=1000, h=700, xs=(), ys=(), width=10, holes=()):
    m = np.zeros((h, w), np.uint8)
    for x in xs:
        cv2.line(m, (x, 0), (x, h), 255, width)
    for y in ys:
        cv2.line(m, (0, y), (w, y), 255, width)
    for (x0, y0, x1, y1) in holes:
        m[y0:y1, x0:x1] = 0
    return m.astype(bool)


ZONE = np.array([[20, 20], [980, 20], [980, 680], [20, 680]], np.float32)


def test_grid_count_and_spacing():
    xs = [100, 250, 400, 550, 700, 850]; ys = [80, 200, 320, 440, 560]
    r = extract(_mask(xs=xs, ys=ys), np.eye(3), ZONE, bar_width_mm=10, gsd_mm_per_px=1.0)
    assert r["y"].count == 6 and r["x"].count == 5
    assert np.allclose(r["y"].spacings_mm, 150, atol=0.5)
    assert np.allclose(r["x"].spacings_mm, 120, atol=0.5)
    assert r["n_other"] == 0


def test_fragment_merge_and_continuity():
    # One bar interrupted by a 200 px gap (card lying on it): still one bar, lower continuity.
    r = extract(_mask(xs=[300, 600], holes=[(250, 250, 350, 450)]), np.eye(3), ZONE, 10, 1.0)
    assert r["y"].count == 2
    assert abs(r["y"].spacings_mm[0] - 300) < 0.5
    bar = [b for b in r["y"].bars if abs(b.offset_mm - 300) < 2][0]
    assert 0.6 < bar.zone_continuity < 0.8
    assert r["y"].spacing_continuity_ok == [False]


def test_diagonal_rejected_and_families():
    pts = []
    for x in (100, 400):
        pts += [(x + np.random.default_rng(0).normal(0, 0.3), y) for y in range(0, 700, 1)]
    for y in (100, 500):
        pts += [(x, y) for x in range(0, 1000, 1)]
    pts += [(t, t) for t in range(0, 700, 25)]            # sparse diagonal of "crossings"
    lines = ransac_lines(np.array(pts, float), tol_mm=2.0, min_len_mm=150)
    fam = cluster_families(lines)
    assert len(fam["x"]) == 2 and len(fam["y"]) == 2 and len(fam["other"]) == 0
