import { useSyncExternalStore } from 'react';

export type MemberKind = 'slab' | 'beam' | 'column' | 'footing' | 'other';
export type Outcome = 'within' | 'outside' | 'rescan' | 'not_seen' | 'manual' | 'pending';
export type CheckKind = 'count' | 'spacing' | 'stirrup' | 'cover' | 'diameter';
export type Lang = 'en' | 'hi' | 'kn';

export type Check = {
  id: string;
  kind: CheckKind;
  label: string;
  zone?: string;
  drawing: number | null;
  unit: 'mm' | 'bars';
  tol: number;
  measured?: number;
  band?: number;
  outcome: Outcome;
  fixed?: boolean;
  lockedAt?: number;
};

export type Inspection = {
  id: string;
  name: string;
  kind: MemberKind;
  createdAt: number;
  status: 'draft' | 'sent' | 'signed';
  checks: Check[];
  hash?: string;
  engineer?: string;
};

// `id` tells apart two fields of the same kind (a slab mesh has a spacing each way). Defaults to `key`.
export type SpecField = { key: CheckKind; id?: string; label: string; unit: 'mm' | 'bars'; hint: string; fallback: number };

export const fieldId = (f: SpecField) => f.id ?? f.key;

export const SPEC_FIELDS: Record<MemberKind, SpecField[]> = {
  // Defaults are the half-scale stage mesh (BUILD-PLAN §7): 8 mm @ 50 c/c both ways, 5 bars a layer.
  slab: [
    { key: 'spacing', id: 'spacing_main', label: 'Main bar spacing', unit: 'mm', hint: 'Centre to centre, bars along the short span', fallback: 50 },
    { key: 'spacing', id: 'spacing_dist', label: 'Distribution bar spacing', unit: 'mm', hint: 'Centre to centre, bars laid across the main bars', fallback: 50 },
    { key: 'count', label: 'Bars per layer in the patch', unit: 'bars', hint: 'Each way, inside the area around the card', fallback: 5 },
    { key: 'diameter', label: 'Bar diameter', unit: 'mm', hint: 'Close-up, or weigh a 20 cm offcut', fallback: 8 },
    { key: 'cover', label: 'Bottom cover', unit: 'mm', hint: 'Tape reading under the bottom bars', fallback: 20 },
  ],
  beam: [
    { key: 'count', label: 'Bottom bars', unit: 'bars', hint: 'Main bars in the bottom layer', fallback: 4 },
    { key: 'stirrup', label: 'Stirrup spacing at ends', unit: 'mm', hint: 'Confinement zone near the column', fallback: 100 },
    { key: 'cover', label: 'Clear cover', unit: 'mm', hint: 'Side and bottom', fallback: 25 },
    { key: 'diameter', label: 'Main bar diameter', unit: 'mm', hint: 'Tag or tape reading', fallback: 12 },
  ],
  column: [
    { key: 'count', label: 'Vertical bars', unit: 'bars', hint: 'All bars in the cage', fallback: 6 },
    { key: 'stirrup', label: 'Tie spacing', unit: 'mm', hint: 'Ties near the beam joint', fallback: 100 },
    { key: 'cover', label: 'Clear cover', unit: 'mm', hint: 'Outer face to ties', fallback: 40 },
    { key: 'diameter', label: 'Bar diameter', unit: 'mm', hint: 'Tag or tape reading', fallback: 12 },
  ],
  footing: [
    { key: 'spacing', label: 'Mesh spacing', unit: 'mm', hint: 'Both directions', fallback: 150 },
    { key: 'cover', label: 'Clear cover', unit: 'mm', hint: 'Bottom cover on soil', fallback: 50 },
    { key: 'diameter', label: 'Bar diameter', unit: 'mm', hint: 'Tag or tape reading', fallback: 12 },
  ],
  other: [
    { key: 'spacing', label: 'Bar spacing', unit: 'mm', hint: 'Centre to centre', fallback: 150 },
    { key: 'cover', label: 'Clear cover', unit: 'mm', hint: 'Tape reading', fallback: 25 },
  ],
};

// v1 measures slabs only. Beam and column are shown greyed out.
export const SUPPORTED: MemberKind[] = ['slab'];

export const KIND_LABEL: Record<MemberKind, string> = {
  slab: 'Slab',
  beam: 'Beam',
  column: 'Column',
  footing: 'Footing',
  other: 'Other',
};

// The camera can measure count and spacing. Cover and diameter need a tape or template reading.
export const CAMERA_KINDS: CheckKind[] = ['count', 'spacing', 'stirrup'];

const TOL: Record<CheckKind, number> = { count: 0, spacing: 15, stirrup: 15, cover: 5, diameter: 0 };

export function judge(drawing: number, measured: number, band: number, tol: number): Outcome {
  const off = Math.abs(measured - drawing);
  if (off + band <= tol) return 'within';
  if (off - band > tol) return 'outside';
  return 'rescan';
}

// ---- tiny store -------------------------------------------------------------

type State = {
  current: Inspection | null;
  records: Inspection[];
  lang: Lang;
  ar: 'unknown' | 'supported' | 'install' | 'unsupported';
  deviceChecked: boolean;
};

const DAY = 86400000;
const now = Date.now();

const seed: Inspection[] = [
  {
    id: 'r-104',
    name: 'Slab S1 · first floor',
    kind: 'slab',
    createdAt: now - DAY + 3600000 * 2,
    status: 'signed',
    engineer: 'Er. Melvin',
    hash: '9f2c…e81a',
    checks: [
      { id: 'a', kind: 'count', label: 'Bar count', drawing: 7, unit: 'bars', tol: 0, measured: 7, band: 0, outcome: 'within' },
      { id: 'b', kind: 'spacing', label: 'Bar spacing', drawing: 150, unit: 'mm', tol: 15, measured: 148, band: 6, outcome: 'within' },
      { id: 'c', kind: 'cover', label: 'Clear cover', drawing: 20, unit: 'mm', tol: 5, measured: 20, band: 1, outcome: 'within' },
    ],
  },
  {
    id: 'r-103',
    name: 'Beam B2 · grid C',
    kind: 'beam',
    createdAt: now - DAY * 2 + 3600000 * 5,
    status: 'sent',
    hash: '7d3e…a2f9',
    checks: [
      { id: 'a', kind: 'stirrup', label: 'Stirrup spacing', zone: 'Left end', drawing: 100, unit: 'mm', tol: 15, measured: 180, band: 8, outcome: 'outside', fixed: true },
      { id: 'b', kind: 'count', label: 'Bottom bars', zone: 'Mid span', drawing: 4, unit: 'bars', tol: 0, measured: 4, band: 0, outcome: 'within' },
      { id: 'c', kind: 'cover', label: 'Clear cover', zone: 'Left end', drawing: 25, unit: 'mm', tol: 5, outcome: 'manual' },
    ],
  },
  {
    id: 'r-102',
    name: 'Column C4 · ground',
    kind: 'column',
    createdAt: now - DAY * 4,
    status: 'signed',
    engineer: 'Er. Alwin',
    hash: '41b0…07cd',
    checks: [
      { id: 'a', kind: 'count', label: 'Vertical bars', zone: 'Full height', drawing: 6, unit: 'bars', tol: 0, measured: 6, band: 0, outcome: 'within' },
      { id: 'b', kind: 'stirrup', label: 'Tie spacing', zone: 'Top joint', drawing: 100, unit: 'mm', tol: 15, measured: 104, band: 7, outcome: 'within' },
    ],
  },
];

let state: State = {
  current: null,
  records: seed,
  lang: 'en',
  ar: 'unknown',
  deviceChecked: false,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  emit();
};

export function useStore<T>(pick: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => pick(state),
    () => pick(state),
  );
}

export const getState = () => state;

export const actions = {
  setLang: (lang: Lang) => set({ lang }),
  setAr: (ar: State['ar']) => set({ ar, deviceChecked: true }),

  start(kind: MemberKind, name: string) {
    set({
      current: {
        id: `r-${105 + state.records.length - seed.length}`,
        name,
        kind,
        createdAt: Date.now(),
        status: 'draft',
        checks: [],
      },
    });
  },

  setSpec(values: Record<string, number | null>) {
    const cur = state.current;
    if (!cur) return;
    const checks: Check[] = SPEC_FIELDS[cur.kind].map((f) => ({
      id: fieldId(f),
      kind: f.key,
      label: f.label,
      drawing: values[fieldId(f)] ?? f.fallback,
      unit: f.unit,
      tol: TOL[f.key],
      outcome: 'pending',
    }));
    set({ current: { ...cur, checks } });
  },

  lock(id: string, measured: number, band: number, outcome?: Outcome) {
    const cur = state.current;
    if (!cur) return;
    const checks = cur.checks.map((c) =>
      c.id === id
        ? {
            ...c,
            measured,
            band,
            lockedAt: Date.now(),
            outcome: outcome ?? judge(c.drawing ?? measured, measured, band, c.tol),
          }
        : c,
    );
    set({ current: { ...cur, checks } });
  },

  reset(id: string) {
    const cur = state.current;
    if (!cur) return;
    set({ current: { ...cur, checks: cur.checks.map((c) => (c.id === id ? { ...c, outcome: 'pending' as const } : c)) } });
  },

  markFixed(id: string) {
    const cur = state.current;
    if (!cur) return;
    set({ current: { ...cur, checks: cur.checks.map((c) => (c.id === id ? { ...c, fixed: true, outcome: 'pending' } : c)) } });
  },

  send(hash: string) {
    const cur = state.current;
    if (!cur) return;
    const rec = { ...cur, status: 'sent' as const, hash };
    set({ current: null, records: [rec, ...state.records.filter((r) => r.id !== rec.id)] });
    return rec.id;
  },

  engineerSign(id: string, engineer: string) {
    set({ records: state.records.map((r) => (r.id === id ? { ...r, status: 'signed' as const, engineer } : r)) });
  },

  saveDraft() {
    const cur = state.current;
    if (!cur) return;
    set({ records: [cur, ...state.records.filter((r) => r.id !== cur.id)] });
  },

  resume(id: string) {
    const r = state.records.find((x) => x.id === id);
    if (r) set({ current: r });
  },
};

// ---- derived ---------------------------------------------------------------

export function tally(checks: Check[]) {
  const n = (o: Outcome) => checks.filter((c) => c.outcome === o).length;
  return {
    done: n('within'),
    outside: n('outside'),
    rescan: n('rescan'),
    manual: n('manual') + n('not_seen'),
    pending: n('pending'),
    total: checks.length,
  };
}

export function when(ts: number) {
  const d = new Date(ts);
  const mon = d.toLocaleString('en-IN', { month: 'short' });
  const time = d.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  return `${d.getDate()} ${mon} · ${time}`;
}
