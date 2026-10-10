import { readEvidenceBase64, storeEvidence } from './files';
import { canon, fingerprint, sha256Hex, signText, verifyText } from './keys';
import { LIVE } from './measure';
import { RULEBOOK } from './rules';
import { FIELDS, isSoon, KIND_LABEL, validate, type CheckId, type MemberKind, type Spec, type SpecPayload, type SpecValues } from './spec';
import { actions, getState, keyOf, ROLE_LABEL, when, type ApprovalPayload, type Capture, type Inspection, type Peer, type RequestPayload, type Role, type Signed } from './store';

// Packs move between phones as JSON files through Office Kit. The laptop only carries them; it holds no key.

export const CAPTURE = 'sariya.capture/1';
export const APPROVAL = 'sariya.approval/1';
export const REQUEST = 'sariya.request/1';
export const SPEC = 'sariya.spec/1';
const QR_PREFIX = 'SARIYA1 ';
export const KEY_PREFIX = 'SARIYA-KEY ';

type CapturePack = { format: typeof CAPTURE; body: ReturnType<typeof captureBody>; hash: string; sig: string; signer: Peer; images: Record<string, string> };

export function me(): Peer | null {
  const s = getState();
  if (!s.me || !s.role) return null;
  return { name: s.name, role: s.role, pub: s.me.pub, fp: s.me.fp };
}

// Exactly what the operator signs: locked values, bands, sources, image hashes, spec revision, readings and versions.
// Captures signed before the model was wired in carry no engine and were signed as 'simulated'; keep that so they still verify.
export function captureBody(r: Inspection, engine = r.capture ? (r.capture.engine ?? 'simulated') : LIVE.engine) {
  const locks = r.locks
    .filter((l) => !l.superseded)
    .map(({ image, superseded: _s, ...l }) => ({ ...l, image: image ? { hash: image.hash, w: image.w, h: image.h } : undefined }));
  return {
    k: 'capture' as const,
    id: r.id,
    rev: r.rev,
    parent: r.parent,
    name: r.name,
    member: r.member,
    createdAt: r.createdAt,
    spec: r.spec,
    locks,
    readings: r.readings,
    corrected: r.corrected,
    rulebook: RULEBOOK,
    liveEngine: engine,
  };
}

export function signCapture(r: Inspection): Capture {
  const signer = me();
  if (!signer) throw new Error('Set up this phone first.');
  const hash = sha256Hex(canon(captureBody(r, LIVE.engine)));
  return { hash, sig: signText(hash), signer, at: Date.now(), engine: LIVE.engine };
}

export const packName = (r: Inspection, kind: 'capture' | 'approval' | 'request') => `${r.id}-r${r.rev}-${kind}.sariya.json`;

export async function capturePack(r: Inspection) {
  if (!r.capture) throw new Error('Sign the record first.');
  const images: Record<string, string> = {};
  for (const l of r.locks) {
    if (!l.superseded && l.image) images[l.image.hash] = await readEvidenceBase64(l.image.file);
  }
  const pack: CapturePack = { format: CAPTURE, body: captureBody(r), hash: r.capture.hash, sig: r.capture.sig, signer: r.capture.signer, images };
  return JSON.stringify(pack);
}

function sign<P extends object>(payload: P): Signed<P> {
  const signer = me();
  if (!signer) throw new Error('Set up this phone first.');
  return { payload, sig: signText(canon(payload)), signer };
}

export function makeApproval(r: Inspection) {
  const s = getState();
  return sign<ApprovalPayload>({ k: 'approval', h: r.capture!.hash, r: r.id, v: r.rev, n: r.name, t: Date.now(), e: s.name, f: s.me!.fp });
}

export function makeRequest(r: Inspection, checks: CheckId[], note: string) {
  const s = getState();
  return sign<RequestPayload>({ k: 'request', h: r.capture!.hash, r: r.id, v: r.rev, n: r.name, checks, note: note.trim(), t: Date.now(), e: s.name, f: s.me!.fp });
}

export function makeSpec(m: MemberKind, n: string, values: SpecValues, hooks: boolean) {
  const s = getState();
  return sign<SpecPayload>({ k: 'spec', m, n, values, hooks: m === 'beam' && hooks, t: Date.now(), e: s.name, f: s.me!.fp });
}

export const specFile = (q: Signed<SpecPayload>) => JSON.stringify({ format: SPEC, ...q });
export const specName = (p: SpecPayload) => `${p.n.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'member'}-drawing.sariya.json`;

export type SpecOrigin = { kind: 'mine' | 'other' | 'changed' | 'typed' | 'none'; title: string; sub?: string };

// Where the values this capture was checked against came from. Only 'mine' means the engineer set the bar themselves.
export function specOrigin(spec: Spec | null, member: MemberKind, myFp?: string): SpecOrigin {
  if (!spec || spec.noDrawing) return { kind: 'none', title: 'No drawing: measure only' };
  const is = spec.issued;
  if (!is) return { kind: 'typed', title: 'Drawing values typed on site', sub: 'The operator entered them. Check each one against your drawing before approving.' };
  const p = is.payload;
  const valid = verifyText(canon(p), is.sig, is.signer.pub) && p.f === fingerprint(is.signer.pub);
  const same = p.m === member && canon(p.values) === canon(spec.values) && (p.m === 'beam' && p.hooks) === spec.hooks135;
  if (!valid || !same) return { kind: 'changed', title: 'Drawing values differ from the issued ones', sub: `They no longer match what ${p.e} signed on ${when(p.t)}. Ask for a new scan against the issued values.` };
  if (p.f !== myFp) return { kind: 'other', title: `Drawing values issued by ${p.e}, not by you`, sub: `Key ${p.f} · ${when(p.t)}. Check them against your drawing before approving.` };
  return { kind: 'mine', title: 'Drawing values issued by you · unchanged', sub: `Signed ${when(p.t)} · key ${p.f}` };
}

export const approvalFile = (a: Signed<ApprovalPayload>) => JSON.stringify({ format: APPROVAL, ...a });
export const requestFile = (q: Signed<RequestPayload>) => JSON.stringify({ format: REQUEST, ...q });

// ---- receiving ------------------------------------------------------------------

export type Received = { ok: boolean; title: string; sub: string; key?: string; viewOnly?: boolean };

const fail = (title: string, sub: string): Received => ({ ok: false, title, sub });

function trustedAs(pub: string, role: Role) {
  const fp = fingerprint(pub);
  return getState().trusted.find((p) => p.fp === fp && p.role === role) ?? null;
}

async function receiveCapture(p: CapturePack): Promise<Received> {
  const s = getState();
  if (!p.body || !p.hash || !p.sig || !p.signer?.pub) return fail('Damaged pack', 'Parts of the pack are missing. Ask the operator to send it again.');
  if (sha256Hex(canon(p.body)) !== p.hash) return fail('Edited or damaged pack', 'The contents do not match what the operator signed. Nothing was opened.');
  if (!verifyText(p.hash, p.sig, p.signer.pub)) return fail('Signature does not verify', 'This pack was not signed by the key it names. Nothing was opened.');
  const fp = fingerprint(p.signer.pub);
  const done = s.processed[p.hash];
  if (done) return fail('Rejected: already processed', `This exact record was ${done.decision === 'approved' ? 'approved' : 'sent back for another view'} on ${when(done.at)}. A new scan arrives as a new revision.`);
  if (fp === s.me?.fp) return fail('Signed by this phone', 'Approval needs a second phone and key. Open this pack on the engineer’s phone.');

  const evidence: Record<string, string> = {};
  for (const l of p.body.locks) {
    if (!l.image) continue;
    const b64 = p.images?.[l.image.hash];
    const file = b64 ? await storeEvidence(b64, l.image.hash) : null;
    if (!file) return fail('Evidence image does not match', `A photo in the pack does not match the hash the operator signed (${l.target}). Nothing was opened.`);
    evidence[l.image.hash] = file;
  }

  const trusted = trustedAs(p.signer.pub, 'operator');
  const b = p.body;
  const r: Inspection = {
    key: keyOf(b.id, b.rev),
    id: b.id,
    rev: b.rev,
    parent: b.parent,
    name: b.name,
    member: b.member,
    createdAt: b.createdAt,
    spec: b.spec,
    locks: b.locks.map((l) => ({ ...l, image: l.image ? { ...l.image, file: evidence[l.image.hash] } : undefined })),
    readings: b.readings,
    corrected: b.corrected,
    status: 'signed',
    origin: 'received',
    capture: { hash: p.hash, sig: p.sig, signer: { ...p.signer, fp }, at: b.createdAt },
    receivedAt: Date.now(),
    trustedSigner: !!trusted,
  };
  actions.receive(r);
  if (!trusted) return { ok: false, viewOnly: true, key: r.key, title: 'Unknown signer', sub: `Signed by “${p.signer.name}” (${fp}), a key this phone has not enrolled. You can read it; approval stays off until you enrol that phone.` };
  return { ok: true, key: r.key, title: 'Signature valid', sub: `${b.name} · rev ${b.rev} · signed by ${trusted.name} (${fp})` };
}

async function receiveSigned(p: Signed<ApprovalPayload | RequestPayload>): Promise<Received> {
  const s = getState();
  const { payload, sig, signer } = p;
  if (!payload || !sig || !signer?.pub) return fail('Damaged file', 'Parts of the file are missing.');
  if (!verifyText(canon(payload), sig, signer.pub) || payload.f !== fingerprint(signer.pub)) return fail('Signature does not verify', 'This file was not signed by the key it names.');
  const eng = trustedAs(signer.pub, 'engineer');
  if (!eng) return fail('Unknown engineer key', `“${signer.name}” (${fingerprint(signer.pub)}) is not enrolled on this phone. Enrol the engineer’s phone first.`);
  const rec = s.records.find((r) => r.capture?.hash === payload.h);
  if (!rec) {
    const other = s.records.find((r) => r.id === payload.r);
    return fail('No matching record', other ? `This is for ${payload.n} rev ${payload.v}, which is not on this phone or has a different hash. It cannot attach to another revision.` : `${payload.n} rev ${payload.v} is not on this phone.`);
  }
  if (payload.k === 'approval') {
    actions.attachApproval(rec.key, p as Signed<ApprovalPayload>);
    return { ok: true, key: rec.key, title: 'Approval attached', sub: `${eng.name} approved ${rec.name} rev ${rec.rev} on ${when(payload.t)}.` };
  }
  actions.attachRequest(rec.key, p as Signed<RequestPayload>);
  return { ok: true, key: rec.key, title: 'Another view requested', sub: `${eng.name}: ${(payload as RequestPayload).note || 'scan the named zones again'}.` };
}

function receiveSpec(p: Signed<SpecPayload>): Received {
  const { payload, sig, signer } = p;
  const fields = payload && FIELDS[payload.m];
  if (!fields || !payload.values || !sig || !signer?.pub) return fail('Damaged file', 'Parts of the file are missing.');
  if (!verifyText(canon(payload), sig, signer.pub) || payload.f !== fingerprint(signer.pub)) return fail('Signature does not verify', 'This file was not signed by the key it names.');
  const eng = trustedAs(signer.pub, 'engineer');
  if (!eng) return fail('Unknown engineer key', `“${signer.name}” (${fingerprint(signer.pub)}) is not enrolled on this phone. Enrol the engineer’s phone first.`);
  if (isSoon(payload.m)) return fail(`${KIND_LABEL[payload.m]} checks are coming soon`, 'This build checks slabs only. Ask the engineer to send slab values.');
  const bad = fields.find((f) => payload.values[f.id] === undefined || (payload.values[f.id] != null && validate(f, payload.values[f.id]!)));
  if (bad) return fail('Drawing values incomplete', `${bad.label} is missing or out of range. Ask the engineer to send them again.`);
  const key = actions.fromIssuedSpec(p);
  return { ok: true, key, title: 'Drawing values received', sub: `${payload.n} · ${KIND_LABEL[payload.m]} · signed by ${eng.name} on ${when(payload.t)}. Changing any value marks it as typed on site.` };
}

export async function receive(text: string, role: Role): Promise<Received> {
  let p: { format?: string };
  try {
    p = JSON.parse(text);
  } catch {
    return fail('Not a Sariya file', 'This file could not be read.');
  }
  if (p.format === CAPTURE) {
    if (role !== 'engineer') return fail('This is a capture pack', `Open it on the engineer’s phone. This phone is set up as ${ROLE_LABEL[role]}.`);
    return receiveCapture(p as CapturePack);
  }
  if (p.format === SPEC) {
    if (role !== 'operator') return fail('These are drawing values', `Open them on the operator’s phone. This phone is set up as ${ROLE_LABEL[role]}.`);
    return receiveSpec(p as unknown as Signed<SpecPayload>);
  }
  if (p.format === APPROVAL || p.format === REQUEST) {
    if (role !== 'operator') return fail(p.format === APPROVAL ? 'This is an approval' : 'This is a review request', `Open it on the operator’s phone. This phone is set up as ${ROLE_LABEL[role]}.`);
    return receiveSigned(p as unknown as Signed<ApprovalPayload>);
  }
  return fail('Not a Sariya file', 'Choose a .sariya.json file sent through Office Kit.');
}

// ---- QR -------------------------------------------------------------------------

export const signoffQr = (a: Signed<ApprovalPayload>) => QR_PREFIX + canon({ p: a.payload, s: a.sig });

export function verifyQr(text: string): { ok: boolean; title: string; sub: string } {
  if (!text.startsWith(QR_PREFIX)) return { ok: false, title: 'Not a Sariya sign-off', sub: 'This QR code is not from Sariya.' };
  let q: { p: ApprovalPayload; s: string };
  try {
    q = JSON.parse(text.slice(QR_PREFIX.length));
  } catch {
    return { ok: false, title: 'Damaged code', sub: 'The QR code could not be read. Scan again.' };
  }
  const eng = getState().trusted.find((p) => p.fp === q.p?.f && p.role === 'engineer');
  if (!eng) return { ok: false, title: 'Unknown engineer key', sub: `Key ${q.p?.f ?? '?'} is not enrolled on this phone, so this sign-off cannot be checked.` };
  if (!verifyText(canon(q.p), q.s, eng.pub)) return { ok: false, title: 'Invalid signature', sub: 'Do not rely on this record. The code was changed or not signed by this engineer.' };
  return { ok: true, title: `Valid · ${eng.name}`, sub: `${q.p.n} · rev ${q.p.v} · approved ${when(q.p.t)} · record ${q.p.h.slice(0, 8)}…` };
}

// ---- key enrolment ----------------------------------------------------------------

export const keyQr = (p: Peer) => KEY_PREFIX + canon({ n: p.name, r: p.role, p: p.pub });

export function parseKeyQr(text: string): Peer | null {
  if (!text.startsWith(KEY_PREFIX)) return null;
  try {
    const k = JSON.parse(text.slice(KEY_PREFIX.length)) as { n: string; r: Role; p: string };
    if (!/^[0-9a-f]{64}$/.test(k.p) || !ROLE_LABEL[k.r]) return null;
    return { name: k.n, role: k.r, pub: k.p, fp: fingerprint(k.p) };
  } catch {
    return null;
  }
}
