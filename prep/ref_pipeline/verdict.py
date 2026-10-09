"""Tier-1 verdicts from rules.json (rulebook.md section D, transcribed 1:1).

Verdict enum: within | outside | rescan | needs_tape | not_seen.  Never "pass"/"safe".
`compare` abstains (rescan) whenever the error band straddles the effective limit.  The Kotlin
port must keep compare() byte-for-byte equivalent: it is the one function the jury can probe
with the F4 "near limit" card.
"""
from __future__ import annotations

import json
import math
import os
from dataclasses import dataclass, field, asdict

RULES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rules.json")
VERDICTS = ("within", "outside", "rescan", "needs_tape", "not_seen")


def load_rules(path: str = RULES_PATH) -> dict:
    with open(path, encoding="utf-8") as f:
        r = json.load(f)
    r["by_id"] = {x["id"]: x for x in r["rules"]}
    return r


@dataclass
class Measurement:
    value: float | None
    u: float = 0.0               # half-width of the band (mm); 0 for a count with proven coverage
    coverage_ok: bool = True
    n_samples: int = 0

    @staticmethod
    def absent():
        """Needs a tape reading (no camera value exists)."""
        return Measurement(None, 0.0, True, 0)

    @staticmethod
    def unseen():
        """The zone was not in frame."""
        return Measurement(None, 0.0, False, 0)


@dataclass
class Result:
    rule_id: str
    verdict: str
    measured: float | None
    u: float
    limit: float | None
    tol: float
    effective_limit: float | None
    severity: str
    clause: str
    code: str
    label: str = ""              # e.g. "[left end]", "[main]"
    note: str = ""

    def to_json(self) -> dict:
        d = asdict(self)
        for k in ("measured", "u", "limit", "tol", "effective_limit"):
            if d[k] is not None:
                d[k] = round(float(d[k]), 3)
        return d


def compare(meas: Measurement, op: str, limit: float, tol: float, u: float | None = None) -> tuple[str, float]:
    """Returns (verdict, effective_limit).  tol is the engineer-set placement tolerance; u the band."""
    u = meas.u if u is None else u
    if not meas.coverage_ok:
        return "not_seen", limit
    if meas.value is None:
        return "needs_tape", limit
    v = meas.value
    if op == "<=":
        L = limit + tol
        if v + u <= L:
            return "within", L
        if v - u > L:
            return "outside", L
        return "rescan", L
    if op == ">=":
        L = limit - tol
        if v - u >= L:
            return "within", L
        if v + u < L:
            return "outside", L
        return "rescan", L
    if op == "==":
        if u == 0:
            return ("within" if v == limit else "outside"), limit
        return ("rescan" if abs(v - limit) <= u else "outside"), limit
    raise ValueError(op)


class Checker:
    def __init__(self, rules: dict | None = None):
        self.rules = rules or load_rules()
        self.P = self.rules["params_default"]

    def _res(self, rule_id, meas, op, limit, tol, label="", severity=None, note="") -> Result:
        r = self.rules["by_id"][rule_id]
        verdict, L = compare(meas, op, limit, tol)
        return Result(rule_id, verdict, meas.value, meas.u, limit, tol, L, severity or r["severity"],
                      r["clause"], r["code"], label, note)

    def tol_spacing(self, s_spec: float) -> float:
        return max(self.P["tol_spacing_mm"], self.P["tol_spacing_frac"] * s_spec)

    # ------------------------------------------------------------------ slab
    def check_slab_patch(self, patch: dict, ctx: dict) -> list[Result]:
        """patch: {"main": {"count": Measurement, "spacing_mean": Measurement, "spacing_max": Measurement}, "dist": {...}}
        ctx: n_spec{main,dist}, s_spec{main,dist}, d (mm or None), D (mm or None), dia{main,dist}, hysd (bool)
        """
        out = []
        for direction in ("main", "dist"):
            m = patch.get(direction)
            if m is None:
                continue
            lab = f"[{direction}]"
            n_spec, s_spec = ctx["n_spec"].get(direction), ctx["s_spec"].get(direction)
            if n_spec is not None:
                out.append(self._res("DWG-COUNT", m["count"], "==", n_spec, 0, lab))
            if s_spec is not None:
                out.append(self._res("DWG-SPACING-MEAN", m["spacing_mean"], "<=", s_spec, self.tol_spacing(s_spec), lab))
                out.append(self._res("DWG-SPACING-LOCAL", m["spacing_max"], "<=", s_spec, self.P["tol_local_mm"], lab))
            d = ctx.get("d")
            rule = "IS456-SLAB-MAIN-SMAX" if direction == "main" else "IS456-SLAB-DIST-SMAX"
            if d is None:
                out.append(self._res(rule, Measurement.absent(), "<=", 0, 0, lab, note="needs D (tape) to get d"))
            else:
                lim = min(3 * d, 300) if direction == "main" else min(5 * d, 300)
                out.append(self._res(rule, m["spacing_mean"], "<=", lim, 0, lab))
            D, dia = ctx.get("D"), (ctx.get("dia") or {}).get(direction)
            sm = m["spacing_mean"]
            if D is None or dia is None or sm.value is None or sm.value <= 0:
                out.append(self._res("IS456-SLAB-AST-MIN", Measurement.absent(), ">=", 0, 0, lab, note="needs D and bar dia"))
            else:
                As = 1000 * math.pi * dia ** 2 / 4 / sm.value
                lim = (0.0012 if ctx.get("hysd", True) else 0.0015) * 1000 * D
                out.append(self._res("IS456-SLAB-AST-MIN", Measurement(As, As * sm.u / sm.value, sm.coverage_ok, sm.n_samples),
                                     ">=", lim, 0, lab, note="dia from drawing (Tier 1 trusts the spec)"))
        return out

    # ------------------------------------------------------------------ beam
    def check_beam(self, beam: dict, ctx: dict) -> list[Result]:
        """beam: {"left": {"spacing_mean", "first_offset", "close_len"}, "right": {...}, "mid": {"spacing_mean"}}
        (each a Measurement; a missing end is skipped).
        ctx: s_spec_end, s_spec_mid, d, dia_long_min, L_end_spec (None -> 2d), zone ("II".."V"),
             apply_13920 (bool)
        """
        out = []
        d = ctx.get("d")
        L_end = ctx.get("L_end_spec") or (2 * d if d else None)
        sev13920 = "M" if ctx.get("zone") in ("III", "IV", "V") else "A"
        apply = bool(ctx.get("apply_13920"))
        for end in ("left", "right"):
            Z = beam.get(end)
            if Z is None:
                continue
            lab = f"[{end} end]"
            m_end, m_first, m_len = Z["spacing_mean"], Z.get("first_offset", Measurement.absent()), Z.get("close_len", Measurement.absent())
            s = ctx["s_spec_end"]
            out.append(self._res("DWG-SPACING-MEAN", m_end, "<=", s, self.tol_spacing(s), lab))
            if L_end is not None:
                out.append(self._res("DWG-ENDZONE-LEN", m_len, ">=", L_end, self.P["tol_len_mm"], lab))
            if d is None:
                out.append(self._res("IS456-BEAM-LINK-SMAX", Measurement.absent(), "<=", 0, 0, lab, note="needs d"))
            else:
                out.append(self._res("IS456-BEAM-LINK-SMAX", m_end, "<=", min(0.75 * d, 300), 0, lab))
            if apply:
                if d is None or ctx.get("dia_long_min") is None:
                    out.append(self._res("IS13920-BEAM-END-SPACING", Measurement.absent(), "<=", 0, 0, lab, sev13920, "needs d, dia_long_min"))
                else:
                    lim = min(d / 4, 6 * ctx["dia_long_min"], 100)
                    out.append(self._res("IS13920-BEAM-END-SPACING", m_end, "<=", lim, 0, lab, sev13920))
                    out.append(self._res("IS13920-BEAM-ENDZONE-LEN", m_len, ">=", 2 * d, self.P["tol_len_mm"], lab, sev13920))
                out.append(self._res("IS13920-BEAM-FIRST-LINK", m_first, "<=", 50, 0, lab, sev13920))
        M = beam.get("mid")
        if M is not None:
            lab = "[mid]"
            s = ctx["s_spec_mid"]
            out.append(self._res("DWG-SPACING-MEAN", M["spacing_mean"], "<=", s, self.tol_spacing(s), lab))
            if d is None:
                out.append(self._res("IS456-BEAM-LINK-SMAX", Measurement.absent(), "<=", 0, 0, lab, note="needs d"))
            else:
                out.append(self._res("IS456-BEAM-LINK-SMAX", M["spacing_mean"], "<=", min(0.75 * d, 300), 0, lab))
                if apply:
                    out.append(self._res("IS13920-BEAM-MID-SPACING", M["spacing_mean"], "<=", d / 2, 0, lab, sev13920))
        return out


def member_summary(results: list[Result]) -> dict:
    n = {"within": 0, "outside": 0, "advisory": 0, "rescan": 0, "needs_tape": 0, "not_seen": 0}
    for r in results:
        if r.verdict == "outside":
            n["outside" if r.severity == "M" else "advisory"] += 1
        else:
            n[r.verdict] += 1
    n["text"] = (f"{n['within']} within limits, {n['outside']} outside, {n['advisory']} advisory, "
                 f"{n['rescan']} re-scan, {n['needs_tape']} need a tape reading, {n['not_seen']} not seen")
    return n


def spoken_fix(r: Result, L_zone_mm: float | None = None, count_in_zone: int | None = None) -> str | None:
    """Example line for the TTS lane; the LLM lane rewrites it in Hindi/Kannada."""
    if r.verdict != "outside" or r.measured is None:
        return None
    if r.rule_id == "DWG-SPACING-MEAN" and L_zone_mm and count_in_zone is not None and r.limit:
        extra = max(0, math.ceil(L_zone_mm / r.limit) - count_in_zone)
        return f"{r.label} links at {r.measured:.0f} +/- {r.u:.0f}, drawing says {r.limit:.0f} for the first {L_zone_mm:.0f} mm. Add {extra}."
    return f"{r.label} {r.rule_id}: measured {r.measured:.0f} +/- {r.u:.0f}, limit {r.effective_limit:.0f}."
