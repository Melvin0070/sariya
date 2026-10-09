"""Six-term quadrature error band per spacing (vision-stack.md section 6).

Each term is one formula with a measurable input.  Returns sigma per term, the 2-sigma total,
and the reported band = max(2 sigma, field floor).  Every number here goes into the signed
record so the engineer can see why the band is what it is.  Kotlin port: same formulas, same
defaults, same floor rule.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
import math

FIELD_FLOOR_MM_DEFAULT = 5.0   # until P9 measures the 95th percentile of |app - tape|


@dataclass
class BandInputs:
    s_mm: float                  # the spacing being banded
    H_m: float                   # camera distance to the plane (from the card pose)
    f_px: float                  # focal length in pixels at the capture mode
    sigma_px: float = 1.0        # mask-edge noise per sample along the bar
    n_samples: int = 20          # skeleton samples used by the centreline fit
    b_px: float = 0.5            # systematic edge bias (ribs / shadow), from the calibration cage
    sigma_c_px: float = 0.2      # ChArUco corner error
    L_px: float = 600.0          # card span in px
    m_corners: int = 25          # corners used by the homography
    sigma_z_mm: float = 5.0      # bar height uncertainty below the card plane (5 on crowns, 15 sagging)
    delta_theta_deg: float = 0.3 # card tilt error
    x_off_mm: float = 300.0      # bar distance from the card centre
    eps_lens: float = 0.002      # calibrated 0.2 %; 1 % uncalibrated
    field_floor_mm: float = FIELD_FLOOR_MM_DEFAULT


@dataclass
class Band:
    gsd_mm_per_px: float
    centreline_random: float
    mask_edge_bias: float
    card_scale: float
    out_of_plane: float
    pose_tilt: float
    lens_residual: float
    sigma_total: float
    two_sigma: float
    field_floor: float
    band: float                  # what the phone shows: +/- band mm
    inputs: dict

    def to_json(self) -> dict:
        d = asdict(self)
        for k, v in d.items():
            if isinstance(v, float):
                d[k] = round(v, 4)
        return d


def error_band(inp: BandInputs) -> Band:
    gsd = inp.H_m * 1000.0 / inp.f_px
    t1 = math.sqrt(2) * gsd * inp.sigma_px / math.sqrt(max(inp.n_samples, 1))
    t2 = math.sqrt(2) * gsd * inp.b_px
    t3 = inp.s_mm * (inp.sigma_c_px / inp.L_px) * math.sqrt(2.0 / max(inp.m_corners, 1))
    t4 = inp.s_mm * inp.sigma_z_mm / (inp.H_m * 1000.0)
    t5 = inp.s_mm * math.radians(inp.delta_theta_deg) * (inp.x_off_mm / (inp.H_m * 1000.0))
    t6 = inp.s_mm * inp.eps_lens
    sigma = math.sqrt(t1 * t1 + t2 * t2 + t3 * t3 + t4 * t4 + t5 * t5 + t6 * t6)
    two = 2.0 * sigma
    return Band(gsd, t1, t2, t3, t4, t5, t6, sigma, two, inp.field_floor_mm, max(two, inp.field_floor_mm), asdict(inp))


def band_for_mean(bands: list[Band]) -> float:
    """Band to attach to the mean of n spacings.

    Only the centreline-random term averages down with n; every other term is systematic for the
    frame, so the mean keeps the per-gap 2-sigma of those.  Floor rule unchanged.
    """
    if not bands:
        return FIELD_FLOOR_MM_DEFAULT
    n = len(bands)
    rand = math.sqrt(sum(b.centreline_random ** 2 for b in bands)) / n
    syst = max(math.sqrt(b.sigma_total ** 2 - b.centreline_random ** 2) for b in bands)
    two = 2.0 * math.sqrt(rand * rand + syst * syst)
    return max(two, max(b.field_floor for b in bands))


if __name__ == "__main__":
    for H in (0.4, 0.6, 0.8, 1.0, 1.2):
        b = error_band(BandInputs(s_mm=150, H_m=H, f_px=2662, L_px=180 / (H * 1000 / 2662)))
        print(f"s=150 H={H}: 2sigma={b.two_sigma:.2f} mm  (oop {b.out_of_plane:.2f}, tilt {b.pose_tilt:.2f}, lens {b.lens_residual:.2f})")
    b = error_band(BandInputs(s_mm=150, H_m=0.8, f_px=2662, L_px=600, sigma_z_mm=15, eps_lens=0.01))
    print(f"bad case (sag + uncalibrated): 2sigma={b.two_sigma:.2f} mm")
