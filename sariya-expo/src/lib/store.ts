import { useSyncExternalStore } from 'react';

import { loadDeviceKey, type DeviceKey } from './keys';
import { FS } from './native';
import type { CheckId, MemberKind, ReadingKind, Spec, TargetId } from './spec';

export type Role = 'operator' | 'engineer' | 'verifier';
export type Lang = 'hi' | 'kn' | 'en';
export type LockSource = 'simulated' | 'auto' | 'manual';

// Overlay geometry in evidence-image pixels, so the reviewer sees exactly what the operator locked.
export type Overlay = { segs: number[][]; weak?: number[][]; labels: { x: number; y: number; text: string; hot?: boolean }[] };
export type Evidence = { hash: string; file: string; w: number; h: number };
// What the locked frame covered, in marker-plane mm: the frame's footprint, the card or strip, and the bar centrelines.
export type Coverage = { kind: 'card' | 'strip'; frame: number[][]; marker: number[][]; bars: number[][]; weak: number[][] };
export type Accel = 'NPU' | 'GPU' | 'CPU';

export type Lock = {
  id: string;
  target: TargetId;
  at: number;
  source: LockSource;
  positions: number[]; // bar centrelines along the measuring axis, mm in the marker plane
  weak?: number[]; // partly seen bar candidates, mm: not counted, they make count and spacing re-scan
  coverage?: Coverage;
  band: number; // ± mm
  frames: number;
  engine?: string; // model, accelerator and inference time, for auto locks
  image?: Evidence;
  overlay: Overlay;
  gate?: { reason: string; action: string };
  superseded?: boolean;
};

export type Reading = { kind: ReadingKind; value?: number; massG?: number; lengthMm?: number; notSeen?: boolean; by: string; at: number };

export type Peer = { name: string; role: Role; pub: string; fp: string };
export type Signed<P> = { payload: P; sig: string; signer: Peer };
export type ApprovalPayload = { k: 'approval'; h: string; r: string; v: number; n: string; t: number; e: string; f: string };
export type RequestPayload = { k: 'request'; h: string; r: string; v: number; n: string; checks: CheckId[]; note: string; t: number; e: string; f: string };
export type Capture = { hash: string; sig: string; signer: Peer; at: number; engine?: string };

export type Inspection = {
  key: string;
  id: string;
  rev: number;
  parent?: string; // capture hash of the revision this one replaces
  name: string;
  member: MemberKind;
  createdAt: number;
  spec: Spec | null;
  locks: Lock[]; // superseded locks stay as history
  readings: Partial<Record<CheckId, Reading>>;
  corrected: Partial<Record<CheckId, number>>;
  notice?: string;
  status: 'draft' | 'signed';
  origin: 'local' | 'received';
  capture?: Capture;
  sentAt?: number;
  approval?: Signed<ApprovalPayload>;
  request?: Signed<RequestPayload>;
  revised?: boolean; // a newer revision exists
  receivedAt?: number;
  trustedSigner?: boolean; // received packs only
};

export type BenchRow = {
  id: string;
  at: number;
  record: string;
  target: TargetId;
  gap: number;
  appMm: number;
  band: number;
  tapeMm: number;
  source: LockSource;
  by: string;
};

export type Verification = { at: number; ok: boolean; title: string; sub: string };

type State = {
  role: Role | null;
  name: string;
  me: DeviceKey | null;
  trusted: Peer[];
  records: Inspection[];
  draftKey: string | null;
  processed: Record<string, { at: number; decision: 'approved' | 'requested'; key: string }>;
  verifications: Verification[];
  bench: BenchRow[];
  timings: Record<Accel, number[]>; // model inference ms per live frame, newest last
  lang: Lang;
  seq: number;
};

// ---- persistence ------------------------------------------------------------

const FILE = FS ? new FS.File(FS.Paths.document, 'sariya-state.json') : null;

function load(): Partial<State> {
  try {
    if (FILE?.exists) return JSON.parse(FILE.textSync());
  } catch {}
  return {};
}

const MAX_TIMINGS = 5000;

let saveTimer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  if (!FILE) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const { me: _me, ...rest } = state;
      if (!FILE.exists) FILE.create();
      FILE.write(JSON.stringify(rest));
    } catch {}
  }, 250);
}

export const persistent = !!FILE;

// ---- store ----------------------------------------------------------------------

let state: State = {
  role: null,
  name: '',
  trusted: [],
  records: [],
  draftKey: null,
  processed: {},
  verifications: [],
  bench: [],
  timings: { NPU: [], GPU: [], CPU: [] },
  lang: 'hi',
  seq: 0,
  ...load(),
  me: loadDeviceKey(),
};

const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  persist();
  for (const l of listeners) l();
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
export const useDraft = () => useStore((s) => s.records.find((r) => r.key === s.draftKey) ?? null);
export const useRecord = (key?: string) => useStore((s) => s.records.find((r) => r.key === key) ?? null);

export const keyOf = (id: string, rev: number) => `${id}.r${rev}`;
export const uid = () => Math.random().toString(36).slice(2, 10);

export function activeLock(r: Inspection, target: TargetId) {
  for (let i = r.locks.length - 1; i >= 0; i--) {
    const l = r.locks[i];
    if (l.target === target && !l.superseded) return l;
  }
  return undefined;
}

function update(key: string, fn: (r: Inspection) => Inspection) {
  set({ records: state.records.map((r) => (r.key === key ? fn(r) : r)) });
}

function updateDraft(fn: (r: Inspection) => Inspection) {
  if (state.draftKey) update(state.draftKey, fn);
}

const supersede = (locks: Lock[], targets: TargetId[]) => locks.map((l) => (targets.includes(l.target) ? { ...l, superseded: true } : l));

export const actions = {
  setup(role: Role, name: string) {
    set({ role, name: name.trim() });
  },
  setLang: (lang: Lang) => set({ lang }),

  trust(peer: Peer) {
    set({ trusted: [peer, ...state.trusted.filter((p) => p.fp !== peer.fp)] });
  },
  untrust(fp: string) {
    set({ trusted: state.trusted.filter((p) => p.fp !== fp) });
  },

  newInspection(member: MemberKind, name: string) {
    const seq = state.seq + 1;
    const prefix = (state.me?.fp ?? 'XX').slice(0, 2);
    const id = `R${prefix}-${seq}`;
    const r: Inspection = {
      key: keyOf(id, 1),
      id,
      rev: 1,
      name,
      member,
      createdAt: Date.now(),
      spec: null,
      locks: [],
      readings: {},
      corrected: {},
      status: 'draft',
      origin: 'local',
    };
    set({ seq, records: [r, ...state.records], draftKey: r.key });
    return r.key;
  },

  openDraft(key: string) {
    set({ draftKey: key });
  },

  discard(key: string) {
    set({ records: state.records.filter((r) => r.key !== key), draftKey: state.draftKey === key ? null : state.draftKey });
  },

  // A changed drawing clears fresh measurements; the old locks stay in the record as history.
  setSpec(input: Omit<Spec, 'at'>) {
    const spec: Spec = { ...input, at: Date.now() };
    updateDraft((r) => {
      const hadLocks = r.locks.some((l) => !l.superseded);
      const changed = !!r.spec && JSON.stringify(r.spec.values) !== JSON.stringify(spec.values);
      if (!(hadLocks && changed)) return { ...r, spec };
      return {
        ...r,
        spec,
        locks: r.locks.map((l) => ({ ...l, superseded: true })),
        notice: `Drawing values changed to rev ${spec.rev}. Earlier scans are kept as history; scan again.`,
      };
    });
  },

  addLock(lock: Lock) {
    updateDraft((r) => ({ ...r, notice: undefined, locks: [...supersede(r.locks, [lock.target]), lock] }));
  },

  rescan(target: TargetId) {
    updateDraft((r) => ({ ...r, locks: supersede(r.locks, [target]) }));
  },

  // The mason fixed it: the old value stays as history and the check goes back to the scanner.
  corrected(check: CheckId, target?: TargetId) {
    updateDraft((r) => {
      const readings = { ...r.readings };
      if (!target) delete readings[check];
      return {
        ...r,
        readings,
        locks: target ? supersede(r.locks, [target]) : r.locks,
        corrected: { ...r.corrected, [check]: (r.corrected[check] ?? 0) + 1 },
      };
    });
  },

  setReading(check: CheckId, reading: Reading) {
    updateDraft((r) => ({ ...r, readings: { ...r.readings, [check]: reading } }));
  },

  signDraft(capture: Capture) {
    updateDraft((r) => ({ ...r, status: 'signed', capture, notice: undefined }));
    set({ draftKey: null });
  },

  markSent(key: string) {
    update(key, (r) => ({ ...r, sentAt: Date.now() }));
  },

  // A requested view or a fresh scan of unchanged steel: a new revision; the signed one is never edited.
  newRevision(key: string, reset: CheckId[], resetTargets: TargetId[]) {
    const old = state.records.find((r) => r.key === key);
    if (!old?.capture) return null;
    const readings = { ...old.readings };
    for (const c of reset) delete readings[c];
    const rev = old.rev + 1;
    const r: Inspection = {
      ...old,
      key: keyOf(old.id, rev),
      rev,
      parent: old.capture.hash,
      createdAt: Date.now(),
      spec: old.spec ? { ...old.spec } : null,
      locks: old.locks.filter((l) => !l.superseded && !resetTargets.includes(l.target)),
      readings,
      corrected: {},
      notice: old.request ? `Engineer asked: ${old.request.payload.note || 'another view'}` : undefined,
      status: 'draft',
      capture: undefined,
      sentAt: undefined,
      approval: undefined,
      request: undefined,
      revised: undefined,
    };
    set({
      records: [r, ...state.records.map((x) => (x.key === key ? { ...x, revised: true } : x))],
      draftKey: r.key,
    });
    return r.key;
  },

  receive(r: Inspection) {
    set({ records: [r, ...state.records.filter((x) => x.key !== r.key)] });
  },

  approve(key: string, approval: Signed<ApprovalPayload>) {
    update(key, (r) => ({ ...r, approval }));
    set({ processed: { ...state.processed, [approval.payload.h]: { at: approval.payload.t, decision: 'approved', key } } });
  },

  requestView(key: string, request: Signed<RequestPayload>) {
    update(key, (r) => ({ ...r, request }));
    set({ processed: { ...state.processed, [request.payload.h]: { at: request.payload.t, decision: 'requested', key } } });
  },

  attachApproval(key: string, approval: Signed<ApprovalPayload>) {
    update(key, (r) => ({ ...r, approval }));
  },

  attachRequest(key: string, request: Signed<RequestPayload>) {
    update(key, (r) => ({ ...r, request }));
  },

  addVerification(v: Verification) {
    set({ verifications: [v, ...state.verifications].slice(0, 20) });
  },

  addTimings(add: Record<Accel, number[]>) {
    const keep = (k: Accel) => [...state.timings[k], ...add[k]].slice(-MAX_TIMINGS);
    set({ timings: { NPU: keep('NPU'), GPU: keep('GPU'), CPU: keep('CPU') } });
  },
  addBench(row: Omit<BenchRow, 'id' | 'at'>) {
    set({ bench: [{ ...row, id: uid(), at: Date.now() }, ...state.bench] });
  },
};

export function when(ts: number) {
  const d = new Date(ts);
  const mon = d.toLocaleString('en-IN', { month: 'short' });
  const time = d.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  return `${d.getDate()} ${mon} · ${time}`;
}

export const ROLE_LABEL: Record<Role, string> = { operator: 'Operator', engineer: 'Engineer', verifier: 'Verifier' };
