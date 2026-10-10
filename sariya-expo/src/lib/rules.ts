// Deterministic verdicts from rulebook v0.1.1 (prep/ref_pipeline/rules.json). Tolerances are proposed values an engineer must confirm.
// A value is outside only when its whole band clears the limit; a band that straddles the limit means re-scan, never a guess.

import { checksFor, type CheckDef, type FieldId, type ReadingKind, type TargetId } from './spec';
import { activeLock, type Inspection, type Lock, type LockSource } from './store';

export const RULEBOOK = 'v0.1.1';
export const FIELD_FLOOR_MM = 5;

export type Outcome = 'within' | 'outside' | 'rescan' | 'tape' | 'not_seen' | 'pending' | 'measured';
export type Source = LockSource | ReadingKind;

export type Fix =
  | { kind: 'add_bars'; n: number; count: number; spec: number }
  | { kind: 'extra_bars'; count: number; spec: number }
  | { kind: 'add_in_gap'; n: number; gap: number; gapMm: number; spec: number }
  | { kind: 'move_bar'; gap: number; other: number; by: number; gapMm: number; spec: number }
  | { kind: 'respace'; mean: number; spec: number }
  | { kind: 'add_rings_zone'; n: number; zoneMm: number; gapMm: number; spec: number }
  | { kind: 'cover_low' | 'cover_high'; value: number; spec: number }
  | { kind: 'dia'; massG: number; lengthMm: number; cls: number | null; spec: number }
  | { kind: 'hook' };

export type Finding = {
  def: CheckDef;
  outcome: Outcome;
  value?: string;
  limit?: string;
  rule?: string;
  reason?: string;
  action?: string;
  source?: Source;
  fix?: Fix;
  lock?: Lock;
  hot?: number; // 0-based gap index to highlight on the frozen image
};

const r0 = Math.round;
export const gapsOf = (p: number[]) => p.slice(1).map((x, i) => x - p[i]);
const limitMean = (s: number) => s + Math.max(10, 0.05 * s);
const limitLocal = (s: number) => s + Math.max(15, 0.25 * s);

function side(v: number, band: number, limit: number): 'within' | 'outside' | 'rescan' {
  if (v - band > limit) return 'outside';
  if (v + band <= limit) return 'within';
  return 'rescan';
}

const RANK: Outcome[] = ['outside', 'rescan', 'within'];
const worst = (a: Outcome, b: Outcome) => (RANK.indexOf(a) <= RANK.indexOf(b) ? a : b);

const CLOSER = 'Move closer (about 30 cm), hold still and lock again.';
const PARTLY = 'Slide the card so it covers fewer bars, or turn the phone so the bars run up the screen, then lock again.';

const partlySeen = (k: number) => `${k} more bar${k > 1 ? 's were' : ' was'} only partly seen (under the card or blurred), so the count cannot be called`;
const weakIn = (lock: Lock, a: number, b: number) => (lock.weak ?? []).filter((w) => w > a && w < b).length;

function lockState(def: CheckDef, lock: Lock | undefined): Finding | null {
  if (!lock) return { def, outcome: 'pending', reason: 'Not scanned yet' };
  if (lock.gate) return { def, outcome: 'rescan', reason: lock.gate.reason, action: lock.gate.action, source: lock.source, lock };
  return null;
}

function count(def: CheckDef, lock: Lock | undefined, spec: number | null): Finding {
  const early = lockState(def, lock);
  if (early || !lock) return early!;
  const n = lock.positions.length;
  const base = { def, source: lock.source, lock, value: `${n} bars`, rule: 'DWG-COUNT' };
  if (spec == null) return { ...base, outcome: 'measured' };
  const limit = `drawing ${spec} bars`;
  if (n === spec) return { ...base, outcome: 'within', limit };
  // A bar the model only partly saw may be the missing one: re-scan rather than tell the mason to add steel.
  const weak = lock.weak?.length ?? 0;
  if (n < spec && weak) return { ...base, outcome: 'rescan', limit, reason: partlySeen(weak), action: PARTLY };
  if (n < spec) return { ...base, outcome: 'outside', limit, fix: { kind: 'add_bars', n: spec - n, count: n, spec } };
  return { ...base, outcome: 'outside', limit, fix: { kind: 'extra_bars', count: n, spec } };
}

type Zone = { gaps: number[]; index: number[] };

function spacing(def: CheckDef, lock: Lock | undefined, spec: number | null, zone: Zone | null, fixFor: (z: Zone, i: number, s: number) => Fix): Finding {
  const early = lockState(def, lock);
  if (early || !lock) return early!;
  const all = gapsOf(lock.positions);
  const z = zone ?? { gaps: all, index: all.map((_, i) => i) };
  if (!z.gaps.length) {
    return { def, outcome: 'not_seen', source: lock.source, lock, reason: zone ? 'No bar gaps inside this zone in the locked frame' : 'Fewer than two bars were found', action: 'Scan so the whole zone is in view, then lock again.' };
  }
  const b = lock.band;
  const mean = z.gaps.reduce((a, x) => a + x, 0) / z.gaps.length;
  const max = Math.max(...z.gaps);
  const i = z.gaps.indexOf(max);
  const hot = z.index[i];
  const value = `mean ${r0(mean)} ± ${b} mm · widest gap ${r0(max)} ± ${b} mm (gap ${hot + 1})`;
  const base = { def, source: lock.source, lock, value, hot, rule: 'DWG-SPACING-MEAN · DWG-SPACING-LOCAL' };
  if (spec == null) return { ...base, outcome: 'measured' };

  const lm = limitMean(spec);
  const ll = limitLocal(spec);
  const om = side(mean, b, lm);
  const ol = side(max, b, ll);
  const outcome = worst(om, ol);
  const limit = `mean ≤ ${r0(lm)} mm, any gap ≤ ${r0(ll)} mm (drawing ${spec})`;
  if (outcome === 'within') return { ...base, outcome, limit };
  if (outcome === 'rescan') {
    const reason = ol === 'rescan' ? `Widest gap ${r0(max)} ± ${b} mm is too close to the ${r0(ll)} mm limit to call` : `Mean ${r0(mean)} ± ${b} mm is too close to the ${r0(lm)} mm limit to call`;
    return { ...base, outcome, limit, reason, action: CLOSER };
  }
  // A wide gap with a partly seen bar inside it is most likely that bar, not missing steel.
  const p = lock.positions;
  const hidden = ol === 'outside' ? weakIn(lock, p[hot], p[hot + 1]) : weakIn(lock, p[0], p[p.length - 1]);
  if (hidden) return { ...base, outcome: 'rescan', limit, reason: `${partlySeen(hidden).replace('the count', 'this gap')}`, action: PARTLY };
  const fix: Fix = ol === 'outside' ? fixFor(z, i, spec) : { kind: 'respace', mean: r0(mean), spec };
  return { ...base, outcome, limit, fix };
}

// A moved bar leaves one wide and one narrow gap that sum to two spacings; anything else is a missing bar.
function slabFix(z: Zone, i: number, s: number): Fix {
  const g = z.gaps[i];
  for (const j of [i + 1, i - 1]) {
    const n = z.gaps[j];
    if (n !== undefined && n < s && Math.abs(g + n - 2 * s) <= Math.max(15, 0.25 * s)) {
      return { kind: 'move_bar', gap: z.index[i] + 1, other: z.index[j] + 1, by: r0(g - s), gapMm: r0(g), spec: s };
    }
  }
  return { kind: 'add_in_gap', n: Math.max(1, r0(g / s) - 1), gap: z.index[i] + 1, gapMm: r0(g), spec: s };
}

const addInGap = (z: Zone, i: number, s: number): Fix => ({ kind: 'add_in_gap', n: Math.max(1, Math.ceil(z.gaps[i] / s) - 1), gap: z.index[i] + 1, gapMm: r0(z.gaps[i]), spec: s });

function beamZones(lock: Lock | undefined, L: number | null) {
  if (!lock || L == null) return { end: null, mid: null };
  const g = gapsOf(lock.positions);
  const end: Zone = { gaps: [], index: [] };
  const mid: Zone = { gaps: [], index: [] };
  // A gap belongs to the zone its midpoint is in (as prep/ref_pipeline run_one.beam_zones and the live colours do),
  // so the gap from the last end-zone ring into mid-span is judged against mid-span spacing.
  g.forEach((x, i) => {
    const z = lock.positions[i] + x / 2 <= L ? end : mid;
    z.gaps.push(x);
    z.index.push(i);
  });
  return { end, mid };
}

// IS 1786 nominal mass (kg/m) and batch tolerance.
const MASS: Record<number, number> = { 6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.58, 20: 2.47, 25: 3.85, 32: 6.31 };
const massTol = (d: number) => (d <= 10 ? 0.07 : d <= 16 ? 0.05 : 0.03);
export const massBand = (d: number) => [MASS[d] * (1 - massTol(d)), MASS[d] * (1 + massTol(d))] as const;

export function sizeClass(kgPerM: number) {
  for (const d of Object.keys(MASS).map(Number)) {
    const [lo, hi] = massBand(d);
    if (kgPerM >= lo && kgPerM <= hi) return d;
  }
  return null;
}

function physical(def: CheckDef, r: Inspection, spec: number | null): Finding {
  const rd = r.readings[def.id];
  const kind = def.reading!;
  const ask = { tape: 'Measure with a tape and enter it.', scale: 'Weigh a 200 mm offcut on a kitchen scale.', template: 'Hold the 135° template against a hook.' }[kind];
  if (!rd) return { def, outcome: 'tape', reason: 'A camera cannot see this', action: ask };
  if (rd.notSeen) return { def, outcome: 'not_seen', source: kind, reason: 'Marked not visible by the operator' };

  if (kind === 'template') {
    const ok = rd.value === 135;
    return { def, source: kind, value: `${rd.value}°`, limit: '135° hooks', rule: 'DWG-HOOK', outcome: ok ? 'within' : 'outside', fix: ok ? undefined : { kind: 'hook' } };
  }

  if (kind === 'scale') {
    const len = rd.lengthMm ?? 200;
    const g = rd.massG ?? 0;
    const kgm = g / len;
    const cls = sizeClass(kgm);
    const value = `${len} mm weighs ${g} g → ${kgm.toFixed(3)} kg/m · ${cls ? `${cls} mm size band` : 'outside every size band'}`;
    const base = { def, source: kind, value, rule: 'DWG-DIA (IS 1786 mass bands)' };
    if (spec == null) return { ...base, outcome: 'measured' };
    const [lo, hi] = massBand(spec);
    const limit = `${spec} mm band ${lo.toFixed(3)}–${hi.toFixed(3)} kg/m`;
    if (cls === spec) return { ...base, limit, outcome: 'within' };
    return { ...base, limit, outcome: 'outside', fix: { kind: 'dia', massG: g, lengthMm: len, cls, spec } };
  }

  const v = rd.value ?? 0;
  const base = { def, source: kind, value: `${v} mm`, rule: 'Drawing cover (IS 456 26.4), +10 mm allowed' };
  if (spec == null) return { ...base, outcome: 'measured' };
  const limit = `${spec}–${spec + 10} mm`;
  if (v < spec) return { ...base, limit, outcome: 'outside', fix: { kind: 'cover_low', value: v, spec } };
  if (v > spec + 10) return { ...base, limit, outcome: 'outside', fix: { kind: 'cover_high', value: v, spec } };
  return { ...base, limit, outcome: 'within' };
}

// ---- live preview (before Lock) ---------------------------------------------------
// The drawing's values for the zone on screen, so live gaps can be coloured with the same single-gap limit Lock uses.
// Only a hint: the verdict is still the locked one, with its own band.
export type LiveTone = 'within' | 'near' | 'outside';

export function liveSpec(r: Inspection, t: TargetId): { count: number | null; spacingAt: (pos: number) => number | null } {
  const val = (f: FieldId) => (r.spec?.noDrawing ? null : (r.spec?.values[f] ?? null));
  if (t === 'main') return { count: val('main_count'), spacingAt: () => val('main_spacing') };
  if (t === 'dist') return { count: val('dist_count'), spacingAt: () => val('dist_spacing') };
  const L = val('end_length');
  return { count: null, spacingAt: (pos) => (L == null ? null : pos <= L ? val('end_spacing') : val('mid_spacing')) };
}

export function gapTone(gap: number, spec: number | null): LiveTone | null {
  if (spec == null) return null;
  const s = side(gap, FIELD_FLOOR_MM, limitLocal(spec));
  return s === 'rescan' ? 'near' : s;
}

export function evaluate(r: Inspection): Finding[] {
  const val = (f: FieldId) => (r.spec?.noDrawing ? null : (r.spec?.values[f] ?? null));
  const lock = (t: TargetId) => activeLock(r, t);
  const L = val('end_length');
  const zones = beamZones(lock('stirrups'), L);
  // A column's top scan has its own end zone; its middle gaps count only when the bottom scan saw none.
  const top = beamZones(lock('ties_top'), L);
  const midFrom: TargetId = !zones.mid?.gaps.length && top.mid?.gaps.length ? 'ties_top' : 'stirrups';

  // With no end-zone length, the end check reports every ring gap as a plain measurement.
  const endZone = (def: CheckDef, t: TargetId, z: Zone | null) =>
    spacing(def, lock(t), L == null ? null : val('end_spacing'), z, (zz, i, sp) => {
      const found = lock(t)!.positions.filter((p) => p <= L!).length;
      return { kind: 'add_rings_zone', n: Math.max(1, r0(L! / sp) - found), zoneMm: L!, gapMm: r0(zz.gaps[i]), spec: sp };
    });

  const out = checksFor(r.member, r.spec).map((def): Finding => {
    switch (def.id) {
      case 'main_count':
        return count(def, lock('main'), val('main_count'));
      case 'dist_count':
        return count(def, lock('dist'), val('dist_count'));
      case 'main_spacing':
        return spacing(def, lock('main'), val('main_spacing'), null, slabFix);
      case 'dist_spacing':
        return spacing(def, lock('dist'), val('dist_spacing'), null, slabFix);
      case 'end_spacing':
        return endZone(def, 'stirrups', zones.end);
      case 'top_spacing':
        return endZone(def, 'ties_top', top.end);
      case 'mid_spacing':
        if (L == null && lock('stirrups')) return { def, outcome: 'not_seen', reason: 'No end-zone length on the drawing, so the zones cannot be split' };
        return spacing(def, lock(midFrom), val('mid_spacing'), midFrom === 'ties_top' ? top.mid : zones.mid, addInGap);
      case 'cover':
        return physical(def, r, val('cover'));
      case 'diameter':
        return physical(def, r, val(r.member === 'slab' ? 'dia' : 'stirrup_dia'));
      case 'hook':
        return physical(def, r, 135);
    }
  });

  // Once signed, anything left unassessed is recorded as such, never as a pass.
  if (r.status !== 'signed') return out;
  return out.map((f) => {
    if (f.outcome !== 'pending') return f;
    return { ...f, outcome: f.def.target ? 'not_seen' : 'tape', reason: 'Not checked before signing' };
  });
}

export function tally(fs: Finding[]) {
  const n = (o: Outcome) => fs.filter((f) => f.outcome === o).length;
  return { within: n('within'), outside: n('outside'), rescan: n('rescan'), tape: n('tape'), notSeen: n('not_seen'), pending: n('pending'), measured: n('measured'), total: fs.length };
}

export function tallyLine(fs: Finding[]) {
  const t = tally(fs);
  const bits = [`${t.within} of ${t.total} within limits`];
  if (t.outside) bits.push(`${t.outside} outside`);
  if (t.rescan) bits.push(`${t.rescan} re-scan`);
  if (t.tape) bits.push(`${t.tape} need${t.tape === 1 ? 's' : ''} a reading`);
  if (t.notSeen) bits.push(`${t.notSeen} not seen`);
  if (t.measured) bits.push(`${t.measured} measured, no drawing`);
  if (t.pending) bits.push(`${t.pending} not checked yet`);
  return bits.join(' · ');
}

// The number a fix changes, short enough for "was → now": the bar count, or the widest gap with its band.
export function brief(f: Finding): string | undefined {
  const l = f.lock;
  if (l && f.def.id.endsWith('_count')) return `${l.positions.length} bars`;
  if (l && f.hot !== undefined) return `widest gap ${r0(gapsOf(l.positions)[f.hot])} ± ${l.band} mm`;
  return f.value;
}

export type Delta = { def: CheckDef; was: Finding; now: Finding; asked: boolean };

// Checks the engineer asked about, plus any that were outside or re-scan in the parent revision.
export function fixDelta(parent: Inspection, child: Inspection): Delta[] {
  const asked = new Set(parent.request?.payload.checks ?? []);
  const before = evaluate(parent);
  const after = evaluate(child);
  const out: Delta[] = [];
  for (const was of before) {
    const now = after.find((f) => f.def.id === was.def.id);
    const flagged = was.outcome === 'outside' || was.outcome === 'rescan';
    if (now && (asked.has(was.def.id) || flagged)) out.push({ def: was.def, was, now, asked: asked.has(was.def.id) });
  }
  return out;
}
