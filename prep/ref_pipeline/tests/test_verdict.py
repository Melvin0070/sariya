"""compare() and the Tier-1 checks on the rulebook's demo fixture numbers (rulebook.md section D)."""
import pytest

from ..verdict import Checker, Measurement, compare, load_rules, member_summary


def test_rules_json_loads_tier1():
    r = load_rules()
    tier1 = {x["id"] for x in r["rules"] if x["tier"] == 1}
    assert {"DWG-COUNT", "DWG-SPACING-MEAN", "IS456-SLAB-MAIN-SMAX", "IS13920-BEAM-END-SPACING"} <= tier1
    assert r["params_default"]["tol_spacing_mm"] == 10


@pytest.mark.parametrize("v,u,op,lim,tol,exp", [
    (150, 5, "<=", 150, 10, "within"),      # 155 <= 160
    (158, 5, "<=", 150, 10, "rescan"),      # 153..163 straddles 160
    (170, 5, "<=", 150, 10, "outside"),     # 165 > 160
    (820, 5, ">=", 818, 50, "within"),
    (765, 5, ">=", 818, 50, "rescan"),      # 760..770 straddles 768
    (700, 5, ">=", 818, 50, "outside"),
    (6, 0, "==", 6, 0, "within"),
    (5, 0, "==", 6, 0, "outside"),
    (5, 1, "==", 6, 0, "rescan"),
])
def test_compare(v, u, op, lim, tol, exp):
    assert compare(Measurement(v, u), op, lim, tol)[0] == exp


def test_compare_coverage_and_absent():
    assert compare(Measurement(5, 0, coverage_ok=False), "==", 6, 0)[0] == "not_seen"
    assert compare(Measurement.absent(), "<=", 300, 0)[0] == "needs_tape"


def test_slab_fixture():
    c = Checker()
    patch = {"main": {"count": Measurement(6, 0), "spacing_mean": Measurement(150, 5, True, 5), "spacing_max": Measurement(152, 5)},
             "dist": {"count": Measurement(5, 0), "spacing_mean": Measurement(150, 5, True, 4), "spacing_max": Measurement(151, 5)}}
    ctx = {"n_spec": {"main": 6, "dist": 5}, "s_spec": {"main": 150, "dist": 150}, "d": 101, "D": 125,
           "dia": {"main": 8, "dist": 8}, "hysd": True}
    res = c.check_slab_patch(patch, ctx)
    by = {(r.rule_id, r.label): r for r in res}
    assert by[("IS456-SLAB-MAIN-SMAX", "[main]")].limit == 300
    assert by[("IS456-SLAB-DIST-SMAX", "[dist]")].limit == 300
    ast = by[("IS456-SLAB-AST-MIN", "[main]")]
    assert ast.limit == pytest.approx(150) and ast.measured == pytest.approx(335.1, abs=0.5) and ast.verdict == "within"
    assert all(r.verdict == "within" for r in res), [(r.rule_id, r.verdict) for r in res]
    # no D: the Ast and d-based rules ask for a tape reading, never guess
    res2 = c.check_slab_patch(patch, {**ctx, "d": None, "D": None})
    assert {r.verdict for r in res2 if r.rule_id.startswith("IS456")} == {"needs_tape"}


def test_beam_fixture_zone_iii():
    c = Checker()
    beam = {"left": {"spacing_mean": Measurement(180, 6, True, 3), "first_offset": Measurement(40, 2), "close_len": Measurement(400, 6)},
            "mid": {"spacing_mean": Measurement(150, 5, True, 4)}}
    ctx = {"s_spec_end": 100, "s_spec_mid": 150, "d": 409, "dia_long_min": 16, "L_end_spec": 600, "zone": "III", "apply_13920": True}
    res = c.check_beam(beam, ctx)
    by = {(r.rule_id, r.label): r for r in res}
    assert by[("DWG-SPACING-MEAN", "[left end]")].verdict == "outside"
    assert by[("DWG-SPACING-MEAN", "[left end]")].effective_limit == 110
    assert by[("IS456-BEAM-LINK-SMAX", "[left end]")].limit == 300
    assert by[("IS13920-BEAM-END-SPACING", "[left end]")].limit == pytest.approx(96)
    assert by[("IS13920-BEAM-ENDZONE-LEN", "[left end]")].limit == pytest.approx(818)
    assert by[("IS13920-BEAM-ENDZONE-LEN", "[left end]")].verdict == "outside"
    assert by[("IS13920-BEAM-MID-SPACING", "[mid]")].limit == pytest.approx(204.5)
    assert by[("IS13920-BEAM-MID-SPACING", "[mid]")].severity == "M"
    s = member_summary(res)
    assert s["outside"] >= 3 and "within limits" in s["text"] and "PASS" not in s["text"].upper()
    # Zone II: the same rules become advisory
    res_ii = c.check_beam(beam, {**ctx, "zone": "II"})
    assert {r.severity for r in res_ii if r.rule_id.startswith("IS13920")} == {"A"}
