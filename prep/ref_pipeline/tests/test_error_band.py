"""The six terms reproduce the worked numbers in vision-stack.md section 6."""
import pytest

from ..error_band import BandInputs, error_band, band_for_mean


def _inp(**kw):
    base = dict(s_mm=150, H_m=0.8, f_px=2662, L_px=180 / (800 / 2662), m_corners=25)
    base.update(kw)
    return BandInputs(**base)


def test_good_case_terms():
    b = error_band(_inp())
    assert b.centreline_random == pytest.approx(0.10, abs=0.01)
    assert b.mask_edge_bias == pytest.approx(0.21, abs=0.01)
    assert b.card_scale < 0.03
    assert b.out_of_plane == pytest.approx(0.94, abs=0.01)
    assert b.pose_tilt == pytest.approx(0.29, abs=0.01)
    assert b.lens_residual == pytest.approx(0.30, abs=0.01)
    assert b.two_sigma == pytest.approx(2.1, abs=0.1)
    assert b.band == 5.0                              # floored until P9 measures the field floor


def test_bad_case():
    b = error_band(_inp(sigma_z_mm=15, eps_lens=0.01))
    assert b.two_sigma == pytest.approx(6.4, abs=0.2)
    assert b.band == pytest.approx(6.4, abs=0.2)


def test_distance_sweep_matches_doc():
    expect = {0.4: 4.0, 0.6: 2.7, 0.8: 2.1, 1.0: 1.8, 1.2: 1.6}
    for H, v in expect.items():
        b = error_band(_inp(H_m=H, L_px=180 / (H * 1000 / 2662)))
        assert b.two_sigma == pytest.approx(v, abs=0.15), H


def test_mean_band_never_below_floor_and_shrinks_random_only():
    bs = [error_band(_inp(field_floor_mm=0.0)) for _ in range(10)]
    m = band_for_mean(bs)
    assert m < bs[0].two_sigma and m > 0.9 * bs[0].two_sigma
    assert band_for_mean([error_band(_inp())]) == 5.0
