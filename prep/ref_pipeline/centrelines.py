"""Mask -> skeleton -> straight segments (RANSAC, in plane mm) -> two orientation families
-> per-bar centrelines -> ordered offsets -> adjacent spacings (mm) and count per zone.

All fitting happens in plane mm (after the homography), where bars are straight and the two
families are orthogonal; pixels are only used for the optional sub-pixel refinement on the
full-resolution image.  Kotlin port: same steps; Imgproc has no skeletonizer, so either port
`_skeleton` (Zhang-Suen is 40 lines) or use ximgproc.thinning from the contrib AAR.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import cv2
import numpy as np
from skimage.morphology import skeletonize

from .card_pose import px_to_mm, mm_to_px


@dataclass
class Bar:
    p: np.ndarray               # point on the centreline, plane mm
    d: np.ndarray               # unit direction, angle in [0, 180)
    angle_deg: float
    n_inliers: int
    t_min: float                # extent of the inliers along d (mm, relative to p)
    t_max: float
    continuity: float           # occupied fraction of 10 mm bins over the extent
    offset_mm: float = 0.0      # signed distance along the family normal, at the zone centre
    in_zone: bool = False
    zone_continuity: float = 0.0
    pts: np.ndarray = field(default=None, repr=False)

    def to_json(self) -> dict:
        return {"p_mm": self.p.round(3).tolist(), "d": self.d.round(5).tolist(), "angle_deg": round(self.angle_deg, 3),
                "n_inliers": int(self.n_inliers), "extent_mm": [round(self.t_min, 1), round(self.t_max, 1)],
                "continuity": round(self.continuity, 3), "offset_mm": round(self.offset_mm, 3),
                "in_zone": bool(self.in_zone), "zone_continuity": round(self.zone_continuity, 3)}


@dataclass
class Family:
    name: str                   # "x" (bars run along plane x) or "y"
    angle_deg: float
    normal: np.ndarray
    bars: list[Bar]             # all bars, sorted by offset
    count: int                  # bars crossing the zone
    spacings_mm: list[float]    # between adjacent in-zone bars
    spacing_continuity_ok: list[bool]

    def to_json(self) -> dict:
        return {"name": self.name, "angle_deg": round(self.angle_deg, 3), "normal": self.normal.round(5).tolist(),
                "count": self.count, "spacings_mm": [round(s, 2) for s in self.spacings_mm],
                "spacing_continuity_ok": self.spacing_continuity_ok,
                "mean_spacing_mm": round(float(np.mean(self.spacings_mm)), 2) if self.spacings_mm else None,
                "max_spacing_mm": round(float(np.max(self.spacings_mm)), 2) if self.spacings_mm else None,
                "bars": [b.to_json() for b in self.bars]}


# ----------------------------------------------------------------------------- skeleton
_NB = np.ones((3, 3), np.float32); _NB[1, 1] = 0


def _neighbours(skel: np.ndarray) -> np.ndarray:
    return cv2.filter2D(skel.astype(np.uint8), -1, _NB, borderType=cv2.BORDER_CONSTANT)


def skeleton_points(mask: np.ndarray, prune_px: int = 8) -> np.ndarray:
    """Zhang-Suen skeleton, spurs shorter than `prune_px` removed, returns (N, 2) px (x, y)."""
    skel = skeletonize(mask.astype(bool))
    for _ in range(prune_px):
        nb = _neighbours(skel)
        ends = skel & (nb <= 1)
        if not ends.any():
            break
        skel = skel & ~ends
    ys, xs = np.nonzero(skel)
    return np.stack([xs, ys], axis=1).astype(np.float64)


# ----------------------------------------------------------------------------- RANSAC
def _fit_pca(pts: np.ndarray):
    p = pts.mean(axis=0)
    q = pts - p
    cov = q.T @ q / max(len(q), 1)
    w, v = np.linalg.eigh(cov)
    d = v[:, 1]
    if d[0] < 0 or (d[0] == 0 and d[1] < 0):
        d = -d
    return p, d / np.linalg.norm(d)


def _continuity(t: np.ndarray, bin_mm: float = 10.0) -> tuple[float, float, float]:
    if len(t) == 0:
        return 0.0, 0.0, 0.0
    t0, t1 = float(t.min()), float(t.max())
    nb = max(1, int(np.ceil((t1 - t0) / bin_mm)))
    occ = np.zeros(nb, bool)
    occ[np.minimum(((t - t0) / bin_mm).astype(int), nb - 1)] = True
    return float(occ.mean()), t0, t1


def ransac_lines(pts: np.ndarray, tol_mm: float = 2.0, min_len_mm: float = 150.0, min_continuity: float = 0.5,
                 max_lines: int = 80, iters: int = 400, seed: int = 0) -> list[Bar]:
    """Sequential RANSAC on plane-mm points: fit, remove inliers, repeat.

    A candidate is kept only if its inlier extent is long and continuous enough; a diagonal
    through grid crossings is long but sparse, so continuity is the test that rejects it.
    """
    rng = np.random.default_rng(seed)
    rem = pts.copy()
    bars: list[Bar] = []
    while len(rem) > 20 and len(bars) < max_lines:
        best_n, best = 0, None
        for _ in range(iters):
            i, j = rng.choice(len(rem), 2, replace=False)
            d = rem[j] - rem[i]
            nrm = np.linalg.norm(d)
            if nrm < 1e-6:
                continue
            d /= nrm
            n = np.array([-d[1], d[0]])
            dist = np.abs((rem - rem[i]) @ n)
            cnt = int((dist < tol_mm).sum())
            if cnt > best_n:
                best_n, best = cnt, (rem[i], d)
        if best is None:
            break
        p, d = best
        n = np.array([-d[1], d[0]])
        inl = np.abs((rem - p) @ n) < tol_mm
        for _ in range(2):                      # refit on inliers, re-select (one Gauss-Newton step each)
            p, d = _fit_pca(rem[inl])
            n = np.array([-d[1], d[0]])
            inl = np.abs((rem - p) @ n) < tol_mm
        ipts = rem[inl]
        rem = rem[~inl]
        cont, t0, t1 = _continuity((ipts - p) @ d)
        if (t1 - t0) < min_len_mm or cont < min_continuity:
            continue
        ang = float(np.degrees(np.arctan2(d[1], d[0])) % 180.0)
        bars.append(Bar(p, d, ang, len(ipts), t0, t1, cont, pts=ipts))
    return bars


# ----------------------------------------------------------------------------- families
def _ang_dist(a: float, b: float) -> float:
    x = abs(a - b) % 180.0
    return min(x, 180.0 - x)


def cluster_families(bars: list[Bar], split_deg: float = 30.0) -> dict[str, list[Bar]]:
    """Two families by direction, named by the plane axis they run along ("x" or "y").

    Bars within `split_deg` of the x axis are family x, within it of the y axis family y; anything
    else (diagonal chairs, spacers, laps crossing at an angle) is dropped and reported.
    """
    fams: dict[str, list[Bar]] = {"x": [], "y": [], "other": []}
    for b in bars:
        if _ang_dist(b.angle_deg, 0.0) <= split_deg:
            fams["x"].append(b)
        elif _ang_dist(b.angle_deg, 90.0) <= split_deg:
            fams["y"].append(b)
        else:
            fams["other"].append(b)
    return fams


def _mean_direction(bars: list[Bar]) -> np.ndarray:
    # Average on the doubled angle so 179 deg and 1 deg agree.
    a2 = np.radians([2 * b.angle_deg for b in bars])
    w = np.array([b.n_inliers for b in bars], float)
    m = np.arctan2((w * np.sin(a2)).sum(), (w * np.cos(a2)).sum()) / 2.0
    return np.array([np.cos(m), np.sin(m)])


def merge_collinear(bars: list[Bar], normal: np.ndarray, merge_tol_mm: float) -> list[Bar]:
    """Fragments of one bar (split by the card, a chair or a shadow) share an offset: merge and refit."""
    if not bars:
        return []
    offs = np.array([b.p @ normal for b in bars])
    order = np.argsort(offs)
    groups, cur = [], [order[0]]
    for k in order[1:]:
        if offs[k] - offs[cur[-1]] < merge_tol_mm:
            cur.append(k)
        else:
            groups.append(cur); cur = [k]
    groups.append(cur)
    out = []
    for g in groups:
        pts = np.concatenate([bars[k].pts for k in g])
        p, d = _fit_pca(pts)
        cont, t0, t1 = _continuity((pts - p) @ d)
        out.append(Bar(p, d, float(np.degrees(np.arctan2(d[1], d[0])) % 180.0), len(pts), t0, t1, cont, pts=pts))
    return out


def _inside(poly: np.ndarray, q: np.ndarray) -> bool:
    return cv2.pointPolygonTest(poly.astype(np.float32), (float(q[0]), float(q[1])), False) >= 0


def build_family(name: str, bars: list[Bar], zone_mm: np.ndarray, merge_tol_mm: float,
                 min_zone_continuity: float = 0.8) -> Family | None:
    if not bars:
        return None
    d = _mean_direction(bars)
    n = np.array([-d[1], d[0]])
    # Offsets grow with +x for bars running along y and with +y for bars along x, so a beam's link
    # positions read as strip mm and a slab's bars are ordered the way the print is.
    if n[0] < 0 or (abs(n[0]) < 1e-9 and n[1] < 0):
        n = -n
    bars = merge_collinear(bars, n, merge_tol_mm)
    centre = zone_mm.mean(axis=0)
    for b in bars:
        # Offset evaluated where the bar passes the zone centre, so non-parallel bars are
        # compared at the same place.
        t = (centre - b.p) @ b.d
        q = b.p + t * b.d
        b.offset_mm = float(q @ n)
        ts = np.arange(b.t_min, b.t_max + 1e-6, 5.0)
        samples = b.p[None, :] + ts[:, None] * b.d[None, :]
        inz = np.array([_inside(zone_mm, s) for s in samples])
        b.in_zone = bool(inz.any())
        if b.in_zone:
            tz = (b.pts - b.p) @ b.d
            lo, hi = ts[inz].min(), ts[inz].max()
            b.zone_continuity = _continuity(tz[(tz >= lo) & (tz <= hi)])[0] if hi > lo else 1.0
    bars.sort(key=lambda b: b.offset_mm)
    inzone = [b for b in bars if b.in_zone]
    sp = [float(inzone[i + 1].offset_mm - inzone[i].offset_mm) for i in range(len(inzone) - 1)]
    ok = [bool(inzone[i].zone_continuity >= min_zone_continuity and inzone[i + 1].zone_continuity >= min_zone_continuity)
          for i in range(len(inzone) - 1)]
    return Family(name, float(np.degrees(np.arctan2(d[1], d[0])) % 180.0), n, bars, len(inzone), sp, ok)


# ----------------------------------------------------------------------------- refinement
def refine_on_image(bar: Bar, gray: np.ndarray, H_mm2img: np.ndarray, H_img2mm: np.ndarray,
                    bar_width_px: float, polarity: str, step_mm: float = 5.0) -> Bar:
    """Sub-pixel centreline: at samples along the bar, read the full-res intensity profile across
    the bar (in image px) and move the sample to the profile's weighted centroid, then refit in mm.
    """
    ts = np.arange(bar.t_min, bar.t_max + 1e-6, step_mm)
    if len(ts) < 4:
        return bar
    pm = bar.p[None, :] + ts[:, None] * bar.d[None, :]
    px = mm_to_px(H_mm2img, pm)
    # Image-space normal from two nearby plane points.
    px2 = mm_to_px(H_mm2img, pm + bar.d[None, :])
    tan = px2 - px
    tan /= np.linalg.norm(tan, axis=1, keepdims=True)
    nrm = np.stack([-tan[:, 1], tan[:, 0]], axis=1)
    half = max(3, int(np.ceil(bar_width_px * 0.9)))
    offs = np.arange(-half, half + 1, dtype=np.float32)
    xs = (px[:, 0:1] + offs[None, :] * nrm[:, 0:1]).astype(np.float32)
    ys = (px[:, 1:2] + offs[None, :] * nrm[:, 1:2]).astype(np.float32)
    prof = cv2.remap(gray, xs, ys, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    bg = np.maximum(prof[:, :3].mean(axis=1), prof[:, -3:].mean(axis=1)) if polarity == "dark" else \
        np.minimum(prof[:, :3].mean(axis=1), prof[:, -3:].mean(axis=1))
    w = np.clip(bg[:, None] - prof, 0, None) if polarity == "dark" else np.clip(prof - bg[:, None], 0, None)
    wsum = w.sum(axis=1)
    good = wsum > 1e-3
    if good.sum() < 4:
        return bar
    shift = (w[good] * offs[None, :]).sum(axis=1) / wsum[good]
    # Reject samples whose centroid ran to the window edge (crossing bar, card, shadow).
    keep = np.abs(shift) < half * 0.6
    if keep.sum() < 4:
        return bar
    new_px = px[good][keep] + shift[keep, None] * nrm[good][keep]
    new_mm = px_to_mm(H_img2mm, new_px)
    p, d = _fit_pca(new_mm)
    if d @ bar.d < 0:
        d = -d
    cont, t0, t1 = _continuity((new_mm - p) @ d, bin_mm=step_mm * 2)
    return Bar(p, d, float(np.degrees(np.arctan2(d[1], d[0])) % 180.0), len(new_mm), t0, t1, bar.continuity, pts=new_mm)


# ----------------------------------------------------------------------------- top level
def extract(mask: np.ndarray, H_img2mm: np.ndarray, zone_mm: np.ndarray, bar_width_mm: float = 10.0,
            gsd_mm_per_px: float = 0.3, min_len_mm: float = 150.0, tol_mm: float = 2.0,
            gray: np.ndarray | None = None, polarity: str = "dark", max_points: int = 40000, seed: int = 0) -> dict:
    """Returns {"x": Family|None, "y": Family|None, "n_other": int, "n_skeleton_px": int}."""
    pts_px = skeleton_points(mask, prune_px=int(round(bar_width_mm / gsd_mm_per_px)))
    if len(pts_px) == 0:
        return {"x": None, "y": None, "n_other": 0, "n_skeleton_px": 0}
    if len(pts_px) > max_points:
        rng = np.random.default_rng(seed)
        pts_px = pts_px[rng.choice(len(pts_px), max_points, replace=False)]
    pts_mm = px_to_mm(H_img2mm, pts_px)
    lines = ransac_lines(pts_mm, tol_mm=tol_mm, min_len_mm=min_len_mm, seed=seed)
    if gray is not None:
        H_mm2img = np.linalg.inv(H_img2mm)
        lines = [refine_on_image(b, gray, H_mm2img, H_img2mm, bar_width_mm / gsd_mm_per_px, polarity) for b in lines]
    fams = cluster_families(lines)
    merge_tol = max(1.5 * bar_width_mm, 4 * tol_mm)
    return {"x": build_family("x", fams["x"], zone_mm, merge_tol),
            "y": build_family("y", fams["y"], zone_mm, merge_tol),
            "n_other": len(fams["other"]), "n_skeleton_px": int(len(pts_px))}
