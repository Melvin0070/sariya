"""One still -> JSON result (count, spacings, bands, verdicts) + debug overlay PNG.

  python -m ref_pipeline.run_one --image cage_01.jpg --intrinsics intrinsics.json --spec spec.json \
      --out result.json --overlay overlay.png

spec.json keys (all optional unless marked):
  member        "slab" | "beam"                       (required)
  fiducial      "card" | "strip"                      (default card for slab, strip for beam)
  card_id, square_mm, pitch_mm                        (measured print sizes; see fiducials.py)
  zone_mm       [[x,y],...] polygon in plane mm       (default: image field of view shrunk by 30 mm)
  bar_dia_mm    expected bar diameter (default 10); sets ridge scales and merge tolerance
  polarity      "dark" | "bright" | "auto" (default auto)
  refine        sub-pixel refinement on the full-res image (default true)
  main_axis     "x" | "y": which family are the main bars (slab; default "y")
  n_spec {main,dist}, s_spec {main,dist}, d, D, dia {main,dist}, hysd       slab drawing values
  s_spec_end, s_spec_mid, d, dia_long_min, L_end_spec, faces_mm [x0,x1]    beam drawing values
  zone "II".."V", apply_13920 bool
  gates  {min_corners:12, max_tilt_deg:25, h_min_m:0.35, h_max_m:1.3, sharpness_min:20}
  band   {sigma_px, b_px, sigma_z_mm, delta_theta_deg, eps_lens, field_floor_mm}
This file is the end-to-end order of operations the Kotlin port follows.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os

import cv2
import numpy as np

from . import fiducials as F
from .calibrate import load_intrinsics
from .card_pose import detect_card, detect_strip, px_to_mm, mm_to_px, gsd_mm_per_px, PlanePose
from .segment_classical import bar_mask
from .centrelines import extract, Family
from .error_band import BandInputs, error_band, band_for_mean
from .verdict import Checker, Measurement, member_summary, spoken_fix

GATES = {"min_corners": 12, "min_strip_markers": 2, "max_tilt_deg": 25.0, "h_min_m": 0.35, "h_max_m": 1.3, "sharpness_min": 20.0}


def sharpness(gray: np.ndarray, width: int = 1920) -> float:
    s = min(1.0, width / gray.shape[1])
    g = cv2.resize(gray, None, fx=s, fy=s, interpolation=cv2.INTER_AREA) if s < 1 else gray
    return float(cv2.Laplacian(g, cv2.CV_64F).var())


def default_zone(H_img2mm: np.ndarray, shape, margin_mm: float = 30.0) -> np.ndarray:
    h, w = shape[:2]
    corners = px_to_mm(H_img2mm, np.array([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]], float))
    c = corners.mean(axis=0)
    v = corners - c
    return (c + v * (1 - margin_mm / np.linalg.norm(v, axis=1, keepdims=True))).astype(np.float32)


def zone_in_frame(zone_mm: np.ndarray, H_mm2img: np.ndarray, shape, margin_px: int = 10) -> bool:
    px = mm_to_px(H_mm2img, zone_mm)
    h, w = shape[:2]
    return bool(np.all((px[:, 0] >= margin_px) & (px[:, 0] < w - margin_px) & (px[:, 1] >= margin_px) & (px[:, 1] < h - margin_px)))


def bands_for_family(fam: Family, pose: PlanePose, f_px: float, bcfg: dict, n_samples_default: int = 20) -> list[dict]:
    out = []
    inz = [b for b in fam.bars if b.in_zone]
    fid_centre = pose.obj_mm[:, :2].mean(axis=0)
    for i, s in enumerate(fam.spacings_mm):
        a, b = inz[i], inz[i + 1]
        mid = 0.5 * (a.p + b.p)
        inp = BandInputs(s_mm=s, H_m=pose.distance_m, f_px=f_px,
                         sigma_px=bcfg.get("sigma_px", 1.0), n_samples=min(a.n_inliers, b.n_inliers) or n_samples_default,
                         b_px=bcfg.get("b_px", 0.5), sigma_c_px=pose.sigma_c_px, L_px=pose.span_px, m_corners=pose.n_points,
                         sigma_z_mm=bcfg.get("sigma_z_mm", 5.0), delta_theta_deg=bcfg.get("delta_theta_deg", 0.3),
                         x_off_mm=float(np.linalg.norm(mid - fid_centre)), eps_lens=bcfg.get("eps_lens", 0.002),
                         field_floor_mm=bcfg.get("field_floor_mm", 5.0))
        out.append(error_band(inp))
    return out


def family_measurements(fam: Family | None, bands, coverage_ok: bool) -> dict:
    if fam is None or fam.count == 0:
        return {"count": Measurement(0, 0 if coverage_ok else 1, coverage_ok, 0),
                "spacing_mean": Measurement.absent(), "spacing_max": Measurement.absent()}
    cnt = Measurement(fam.count, 0 if coverage_ok else 1, coverage_ok, fam.count)
    if not fam.spacings_mm:
        return {"count": cnt, "spacing_mean": Measurement.absent(), "spacing_max": Measurement.absent()}
    sp = np.array(fam.spacings_mm)
    u_mean = band_for_mean(bands)
    imax = int(sp.argmax())
    return {"count": cnt,
            "spacing_mean": Measurement(float(sp.mean()), u_mean, coverage_ok, len(sp)),
            "spacing_max": Measurement(float(sp.max()), bands[imax].band, coverage_ok, 1)}


def beam_zones(fam: Family | None, faces: list[float] | None, L_end: float | None, s_spec_end: float,
               tol_end: float, bands) -> dict:
    """Link positions = offsets of the family perpendicular to the strip (plane x).  Zones measured
    from the column faces given in the spec, in strip mm.  Without faces the ends are not_seen."""
    beam = {}
    if fam is None or fam.count < 2:
        return beam
    inz = [b for b in fam.bars if b.in_zone]
    x = np.array([b.offset_mm for b in inz])
    sp = np.array(fam.spacings_mm)
    bd = np.array([b.band for b in bands]) if bands else np.full(len(sp), 5.0)

    def seg(mask_gaps, cov):
        if mask_gaps.sum() == 0:
            return Measurement.unseen()
        return Measurement(float(sp[mask_gaps].mean()), band_for_mean([bands[i] for i in np.nonzero(mask_gaps)[0]]) if bands else 5.0, cov, int(mask_gaps.sum()))

    if faces is None or L_end is None:
        beam["mid"] = {"spacing_mean": seg(np.ones(len(sp), bool), True)}
        beam["left"] = {"spacing_mean": Measurement(float(sp.mean()), float(bd.mean()), False, len(sp))}
        return beam
    x0, x1 = faces
    gap_mid = 0.5 * (x[:-1] + x[1:])
    for end, face, sign in (("left", x0, 1), ("right", x1, -1)):
        rel = sign * (x - face)              # distance of each link from this face, positive into the span
        in_end = (rel >= -5) & (rel <= L_end)
        gaps_in = (sign * (gap_mid - face) >= 0) & (sign * (gap_mid - face) <= L_end)
        cov = bool(in_end.any())
        first = Measurement(float(rel[in_end].min()), 2.0, cov, 1) if cov else Measurement.unseen()
        # Close zone = face to the midpoint of the first gap wider than spec + tol (where the pitch
        # changes); if the pitch never opens within view, the length is at least the last link seen.
        # Convention to confirm with the engineer (rulebook C6).
        r = np.sort(rel[rel >= -5])
        close, open_seen = (float(r[-1]) if len(r) else 0.0), False
        for a, b in zip(r[:-1], r[1:]):
            if (b - a) > s_spec_end + tol_end:
                close, open_seen = float(0.5 * (a + b)), True
                break
        beam[end] = {"spacing_mean": seg(gaps_in, cov), "first_offset": first,
                     "close_len": Measurement(close, float(bd.mean()) if len(bd) else 5.0, cov and open_seen, 1)}
    gaps_mid = ((gap_mid - x0) > L_end) & ((x1 - gap_mid) > L_end)
    beam["mid"] = {"spacing_mean": seg(gaps_mid, True)}
    return beam


def draw_overlay(img, pose: PlanePose, zone_mm, fams: dict, summary_text: str, abstain: list[str], mask=None) -> np.ndarray:
    ov = img.copy() if img.ndim == 3 else cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if mask is not None:
        ov[mask] = (0.6 * ov[mask] + 0.4 * np.array([0, 180, 255])).astype(np.uint8)
    if pose is not None:
        cv2.polylines(ov, [np.round(pose.outline_px).astype(np.int32)], True, (0, 255, 0), 3)
        for p in pose.img_px:
            cv2.circle(ov, (int(p[0]), int(p[1])), 4, (0, 255, 0), -1)
        cv2.polylines(ov, [np.round(mm_to_px(pose.H_mm2img, zone_mm)).astype(np.int32)], True, (0, 255, 255), 3)
        for name, col in (("x", (0, 0, 255)), ("y", (255, 80, 0))):
            fam = fams.get(name)
            if fam is None:
                continue
            for b in fam.bars:
                a = b.p + b.t_min * b.d
                c = b.p + b.t_max * b.d
                pa, pc = mm_to_px(pose.H_mm2img, np.stack([a, c]))
                cv2.line(ov, tuple(np.round(pa).astype(int)), tuple(np.round(pc).astype(int)), col if b.in_zone else (128, 128, 128), 3)
            inz = [b for b in fam.bars if b.in_zone]
            for i, s in enumerate(fam.spacings_mm):
                m = 0.5 * (inz[i].p + inz[i + 1].p) + 0.5 * (inz[i].offset_mm + inz[i + 1].offset_mm - inz[i].p @ fam.normal - inz[i + 1].p @ fam.normal) * fam.normal
                q = mm_to_px(pose.H_mm2img, m[None, :])[0]
                cv2.putText(ov, f"{s:.0f}", (int(q[0]), int(q[1])), cv2.FONT_HERSHEY_SIMPLEX, 1.0, col, 3)
    y = 40
    for line in [summary_text] + [f"RE-SCAN: {a}" for a in abstain]:
        cv2.putText(ov, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0, 0, 0), 5)
        cv2.putText(ov, line, (20, y), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255, 255, 255), 2)
        y += 40
    return ov


def run(img_bgr: np.ndarray, intr: dict, spec: dict, rules=None) -> tuple[dict, np.ndarray]:
    gates = {**GATES, **spec.get("gates", {})}
    bcfg = spec.get("band", {})
    member = spec["member"]
    fid = spec.get("fiducial") or ("strip" if member == "beam" else "card")
    K, dist = intr["K"], intr["dist"]
    if list(intr["image_size"]) != [img_bgr.shape[1], img_bgr.shape[0]]:
        raise ValueError(f"image {img_bgr.shape[1]}x{img_bgr.shape[0]} does not match intrinsics mode "
                         f"{intr['capture_mode']} {intr['image_size']}")
    img = cv2.undistort(img_bgr, K, dist) if np.any(dist) else img_bgr
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if img.ndim == 3 else img
    res = {"created": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "capture_mode": intr["capture_mode"],
           "member": member, "fiducial": fid, "abstain": [], "pose": None, "sharpness": round(sharpness(gray), 2)}
    abstain = res["abstain"]

    pose = detect_card(gray, K, spec.get("card_id"), spec.get("square_mm", F.CARD_SQ_MM)) if fid == "card" \
        else detect_strip(gray, K, spec.get("pitch_mm", F.STRIP_PITCH_MM))
    if pose is None:
        abstain.append("fiducial not found")
        return res, draw_overlay(img, None, None, {}, "no fiducial", abstain)
    res["pose"] = pose.to_json()
    if fid == "card" and pose.n_points < gates["min_corners"]:
        abstain.append(f"{pose.n_points} corners < {gates['min_corners']}")
    if fid == "strip" and pose.n_markers < gates["min_strip_markers"]:
        abstain.append(f"{pose.n_markers} strip markers < {gates['min_strip_markers']}")
    if pose.tilt_deg > gates["max_tilt_deg"]:
        abstain.append(f"tilt {pose.tilt_deg:.1f} deg > {gates['max_tilt_deg']}")
    if not (gates["h_min_m"] <= pose.distance_m <= gates["h_max_m"]):
        abstain.append(f"distance {pose.distance_m:.2f} m outside {gates['h_min_m']}-{gates['h_max_m']}")
    if res["sharpness"] < gates["sharpness_min"]:
        abstain.append(f"sharpness {res['sharpness']:.1f} < {gates['sharpness_min']}")
    if abstain:
        return res, draw_overlay(img, pose, default_zone(pose.H_img2mm, gray.shape), {}, "re-scan", abstain)

    gsd = gsd_mm_per_px(pose, K)
    bar_dia = float(spec.get("bar_dia_mm", 10.0))
    zone = np.asarray(spec["zone_mm"], np.float32) if spec.get("zone_mm") else default_zone(pose.H_img2mm, gray.shape)
    mask, seg_info = bar_mask(gray, bar_dia / gsd, spec.get("polarity", "auto"), [pose.outline_px])
    fams = extract(mask, pose.H_img2mm, zone, bar_dia, gsd, min_len_mm=spec.get("min_len_mm", 150.0),
                   gray=gray if spec.get("refine", True) else None, polarity=seg_info["polarity"])
    coverage_ok = zone_in_frame(zone, pose.H_mm2img, gray.shape)
    f_px = 0.5 * (K[0, 0] + K[1, 1])
    res.update({"gsd_mm_per_px": round(gsd, 4), "segmentation": seg_info, "zone_mm": zone.round(1).tolist(),
                "coverage_ok": coverage_ok, "n_skeleton_px": fams["n_skeleton_px"], "n_other_lines": fams["n_other"],
                "families": {}})
    bands = {}
    for name in ("x", "y"):
        fam = fams[name]
        if fam is None:
            res["families"][name] = None
            continue
        bands[name] = bands_for_family(fam, pose, f_px, bcfg)
        fj = fam.to_json()
        fj["bands_mm"] = [b.band for b in bands[name]]
        fj["band_terms"] = [b.to_json() for b in bands[name]]
        fj["mean_spacing_band_mm"] = round(band_for_mean(bands[name]), 3) if bands[name] else None
        res["families"][name] = fj

    checker = Checker(rules)
    results = []
    if member == "slab":
        main_axis = spec.get("main_axis", "y")
        dist_axis = "x" if main_axis == "y" else "y"
        patch = {"main": family_measurements(fams[main_axis], bands.get(main_axis, []), coverage_ok),
                 "dist": family_measurements(fams[dist_axis], bands.get(dist_axis, []), coverage_ok)}
        ctx = {"n_spec": spec.get("n_spec", {}), "s_spec": spec.get("s_spec", {}), "d": spec.get("d"), "D": spec.get("D"),
               "dia": spec.get("dia", {}), "hysd": spec.get("hysd", True)}
        if spec.get("n_spec") or spec.get("s_spec"):
            results = checker.check_slab_patch(patch, ctx)
        cont_bad = {"main": fams[main_axis] is not None and not all(fams[main_axis].spacing_continuity_ok),
                    "dist": fams[dist_axis] is not None and not all(fams[dist_axis].spacing_continuity_ok)}
    else:
        fam = fams["y"]                       # stirrups cross the strip, so they run along plane y
        tol_end = checker.tol_spacing(spec["s_spec_end"]) if "s_spec_end" in spec else 10.0
        L_end = spec.get("L_end_spec") or (2 * spec["d"] if spec.get("d") else None)
        beam = beam_zones(fam, spec.get("faces_mm"), L_end, spec.get("s_spec_end", 100.0), tol_end, bands.get("y", []))
        ctx = {"s_spec_end": spec.get("s_spec_end"), "s_spec_mid": spec.get("s_spec_mid"), "d": spec.get("d"),
               "dia_long_min": spec.get("dia_long_min"), "L_end_spec": spec.get("L_end_spec"), "zone": spec.get("zone", "II"),
               "apply_13920": spec.get("apply_13920", False)}
        if beam and spec.get("s_spec_end") and spec.get("s_spec_mid"):
            results = checker.check_beam(beam, ctx)
        cont_bad = {"links": fam is not None and not all(fam.spacing_continuity_ok)}
        res["link_positions_mm"] = [round(b.offset_mm, 2) for b in fam.bars if b.in_zone] if fam else []
    for r in results:
        key = r.label.strip("[]").split()[0] if member == "slab" else "links"
        if "SPACING" in r.rule_id and r.verdict in ("within", "outside") and cont_bad.get(key):
            r.verdict, r.note = "rescan", "a centreline is < 80 % continuous in the zone"
    if not results:
        res["mode"] = "measurement_only"
    res["verdicts"] = [r.to_json() for r in results]
    res["summary"] = member_summary(results)
    res["spoken"] = [s for s in (spoken_fix(r) for r in results) if s]
    counts = " ".join(f"{n}:{res['families'][n]['count']}" for n in ("x", "y") if res["families"].get(n))
    text = f"{member} {fid}{pose.fid_id if fid == 'card' else ''} H={pose.distance_m:.2f}m tilt={pose.tilt_deg:.0f} count {counts} | {res['summary']['text']}"
    return res, draw_overlay(img, pose, zone, fams, text, abstain, mask)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--image", required=True)
    ap.add_argument("--intrinsics", required=True)
    ap.add_argument("--spec", required=True)
    ap.add_argument("--out", default=None)
    ap.add_argument("--overlay", default=None)
    a = ap.parse_args(argv)
    img = cv2.imread(a.image, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"cannot read {a.image}")
    with open(a.spec) as f:
        spec = json.load(f)
    res, ov = run(img, load_intrinsics(a.intrinsics), spec)
    res["image"] = os.path.basename(a.image)
    out = a.out or os.path.splitext(a.image)[0] + "_result.json"
    with open(out, "w") as f:
        json.dump(res, f, indent=1)
    cv2.imwrite(a.overlay or os.path.splitext(a.image)[0] + "_overlay.png", ov)
    print(json.dumps({k: res[k] for k in ("abstain", "summary", "coverage_ok") if k in res}, indent=1))
    for n in ("x", "y"):
        fam = (res.get("families") or {}).get(n)
        if fam:
            print(f"family {n}: count {fam['count']}, spacings {fam['spacings_mm']} +/- {fam['bands_mm']}")
    for s in res.get("spoken", []):
        print("say:", s)


if __name__ == "__main__":
    main()
