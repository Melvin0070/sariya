import { useCallback, useRef, useState } from 'react';

import type { VisionFrame } from '../../modules/sariya-vision';
import { apply, convex, dist, homography, type Pt } from './homography';
import { FIELD_FLOOR_MM, gapsOf } from './rules';
import { MARKERS, type Spec, type Target } from './spec';
import { actions, uid, type Accel, type Coverage, type Lock, type Overlay } from './store';

// The live engine: segmentation model v2 on the phone (NPU, else GPU, else CPU) finds the bars, the printed card or
// strip gives the mm scale. Locks from it carry source 'auto'. Older records may still hold 'simulated' locks.
export const LIVE = {
  source: 'auto' as const,
  engine: 'seg-v2',
  title: 'Model v2 live',
  note: 'Bars are found by the on-phone segmentation model (v2) and scaled by the printed card or strip. If it cannot see the bars, use By hand.',
};
export const SIMULATED_NOTE = 'These values came from the earlier simulated engine, not the camera. Re-scan those zones before signing.';

export type LiveStatus = 'searching' | 'partial' | 'closer' | 'nobars' | 'blurred' | 'steady' | 'ready' | 'model';

export const LIVE_COPY: Record<LiveStatus, { label: string; color: string }> = {
  searching: { label: 'Find the card', color: '#FFFFFF' },
  partial: { label: 'Show the whole card', color: '#FFC043' },
  closer: { label: 'Move closer', color: '#FFC043' },
  nobars: { label: 'No bars found', color: '#FFC043' },
  blurred: { label: 'Blurred: hold still', color: '#FFC043' },
  steady: { label: 'Hold steady', color: '#FFC043' },
  ready: { label: 'Ready to lock', color: '#3AD07A' },
  model: { label: 'Model not running', color: '#FF6A6A' },
};

const STABLE_FRAMES = 6;
const STABLE_MM = 2;
const MIN_LOCK_FRAMES = 5;
const MIN_CARD_CORNERS = 12;
const MIN_STRIP_MARKERS = 2;
const MODEL_INPUT_W = 1152;
const WEAK_SHARE = 0.3; // a partly seen bar must show up in this share of the locked frames
const SAME_BAR_MM = 10;
// Sharpness is compared within one scan only: a frame well below the sharpest recent one is motion-blurred or
// out of focus, whatever the camera or light.
const BLUR_WINDOW = 30;
const LIVE_SHARP_SHARE = 0.6;
const LOCK_SHARP_SHARE = 0.7;

const r1 = (v: number) => Math.round(v * 10) / 10;
const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const sd = (v: number[]) => {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, v.length - 1));
};

export function frameStatus(f: VisionFrame | null): LiveStatus {
  if (!f || !f.pose) return 'searching';
  if (f.modelError || f.accel === 'none') return 'model';
  const enough = f.pose.kind === 'card' ? f.pose.points >= MIN_CARD_CORNERS : f.pose.points >= MIN_STRIP_MARKERS;
  if (!enough) return 'partial';
  if (f.pose.markerPx < f.minMarkerPx) return 'closer';
  if (f.bars.length < 2) return 'nobars';
  return 'steady';
}

const usable = (f: VisionFrame) => frameStatus(f) === 'steady';
const positionsOf = (f: VisionFrame) => f.bars.map((b) => b.pos);

function stable(frames: VisionFrame[]) {
  if (frames.length < STABLE_FRAMES) return false;
  const n = frames[0].bars.length;
  if (!frames.every((f) => usable(f) && f.bars.length === n)) return false;
  for (let i = 0; i < n; i++) {
    const p = frames.map((f) => f.bars[i].pos);
    const m = median(p);
    if (p.some((v) => Math.abs(v - m) > STABLE_MM)) return false;
  }
  return true;
}

export type Live = { frame: VisionFrame | null; status: LiveStatus; positions: number[]; progress: number };

// Frames from the native view, the live status they imply, and a buffer the Lock fuses.
export function useVisionLive() {
  const recent = useRef<VisionFrame[]>([]);
  const sharpness = useRef<number[]>([]);
  const capture = useRef<VisionFrame[] | null>(null);
  const [live, setLive] = useState<Live>({ frame: null, status: 'searching', positions: [], progress: 0 });

  const onFrame = useCallback((f: VisionFrame) => {
    recordTiming(f);
    capture.current?.push(f);
    const r = [...recent.current, f].slice(-STABLE_FRAMES);
    recent.current = r;
    sharpness.current = [...sharpness.current, f.sharp].slice(-BLUR_WINDOW);
    let status = frameStatus(f);
    if (status === 'steady' && f.sharp < LIVE_SHARP_SHARE * Math.max(...sharpness.current)) status = 'blurred';
    let run = 0;
    for (let i = r.length - 1; i >= 0 && usable(r[i]) && r[i].bars.length === f.bars.length; i--) run++;
    if (status === 'steady' && stable(r)) status = 'ready';
    setLive({ frame: f, status, positions: positionsOf(f), progress: status === 'ready' ? 1 : usable(f) ? run / STABLE_FRAMES : 0 });
  }, []);

  const startCapture = useCallback(() => {
    capture.current = [];
  }, []);
  const stopCapture = useCallback(() => {
    const got = capture.current ?? [];
    capture.current = null;
    return got;
  }, []);
  const reset = useCallback(() => {
    recent.current = [];
    sharpness.current = [];
    setLive({ frame: null, status: 'searching', positions: [], progress: 0 });
  }, []);

  return { live, onFrame, startCapture, stopCapture, reset };
}

// Fuse the frames seen while the Lock button was held: the most common bar count wins, each bar takes its median
// position, and the band adds the frame-to-frame scatter to the mask-edge and scale terms.
export function autoLock(target: Target, frames: VisionFrame[], frozen: VisionFrame | null, image: Lock['image']): Lock {
  const steady = frames.filter(usable);
  const sharpest = Math.max(0, ...steady.map((f) => f.sharp));
  const ok = steady.filter((f) => f.sharp >= LOCK_SHARP_SHARE * sharpest);
  const blurred = steady.length - ok.length;
  const counts = new Map<number, number>();
  for (const f of ok) counts.set(f.bars.length, (counts.get(f.bars.length) ?? 0) + 1);
  const n = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  const used = ok.filter((f) => f.bars.length === n);
  const base = { id: uid(), target: target.id, at: Date.now(), source: LIVE.source, frames: used.length, image };
  const last = used[used.length - 1] ?? frozen;
  const engine = last ? `seg ${last.model} ${last.modelSha} · ${last.accel} · ${Math.round(median(used.map((f) => f.inferMs).filter((v) => v >= 0)) || 0)} ms` : undefined;

  if (used.length < MIN_LOCK_FRAMES || n < 2) {
    const positions = used.length ? positionsOf(used[used.length - 1]).map(r1) : [];
    return {
      ...base,
      engine,
      positions,
      band: FIELD_FLOOR_MM,
      overlay: overlayFor(frozen, positions),
      gate: {
        reason: used.length
          ? `Only ${used.length} sharp, steady frame${used.length > 1 ? 's' : ''} agreed on the bars${blurred ? ` (${blurred} blurred)` : ''}`
          : 'The model did not see the bars and the card together',
        action: 'Hold still until it says Ready to lock, then lock again, or mark by hand.',
      },
    };
  }

  const positions = Array.from({ length: n }, (_, i) => r1(median(used.map((f) => f.bars[i].pos))));
  const weak = fuseWeak(used, positions);
  const gaps = gapsOf(positions);
  const scatter = Math.max(0, ...gaps.map((_, i) => sd(used.map((f) => f.bars[i + 1].pos - f.bars[i].pos))));
  const pxPerMm = median(used.map((f) => f.pose!.pxPerMm));
  // The mask is predicted at model resolution, so its half-pixel edge error is in model pixels, not camera pixels.
  const edgeMm = (Math.SQRT2 * 0.5 * (Math.max(last!.w, last!.h) / MODEL_INPUT_W)) / pxPerMm;
  const band = Math.max(FIELD_FLOOR_MM, Math.ceil(2 * Math.sqrt(scatter ** 2 + edgeMm ** 2 + (0.01 * Math.max(0, ...gaps)) ** 2)));
  return { ...base, engine, positions, ...(weak.length ? { weak } : {}), band, overlay: overlayFor(frozen, positions), ...coverageOf(frozen) };
}

// Partly seen candidates that recur across the locked frames and are not one of the counted bars.
function fuseWeak(frames: VisionFrame[], positions: number[]) {
  const all = frames.flatMap((f) => f.weak.map((b) => b.pos)).sort((a, b) => a - b);
  const groups: number[][] = [];
  for (const p of all) {
    const g = groups[groups.length - 1];
    if (g && p - g[g.length - 1] < SAME_BAR_MM) g.push(p);
    else groups.push([p]);
  }
  return groups
    .filter((g) => g.length >= WEAK_SHARE * frames.length)
    .map((g) => r1(median(g)))
    .filter((w) => positions.every((p) => Math.abs(p - w) >= SAME_BAR_MM));
}

function coverageOf(f: VisionFrame | null): { coverage?: Coverage } {
  if (!f?.pose) return {};
  return { coverage: { kind: f.pose.kind, frame: f.pose.footprintMm.map((p) => p.map(r1)), marker: f.pose.outlineMm.map((p) => [...p]), bars: f.bars.map((b) => b.mm.map(r1)), weak: f.weak.map((b) => b.mm.map(r1)) } };
}

// Evidence lines are the frozen frame's own bars, so the reviewer sees exactly what the model drew on that photo.
function overlayFor(f: VisionFrame | null, positions: number[]): Overlay {
  if (!f) return { segs: [], labels: [] };
  const segs = f.bars.map((b) => [...b.seg]);
  if (f.pose) for (let i = 0; i < 4; i++) segs.push([...f.pose.outline[i], ...f.pose.outline[(i + 1) % 4]]);
  const weak = f.weak.map((b) => [...b.seg]);
  const gaps = gapsOf(positions);
  const hot = gaps.length ? gaps.indexOf(Math.max(...gaps)) : -1;
  const mid = (s: number[]) => ({ x: (s[0] + s[2]) / 2, y: (s[1] + s[3]) / 2 });
  const labels = f.bars.length === positions.length
    ? gaps.map((g, i) => {
        const a = mid(f.bars[i].seg);
        const b = mid(f.bars[i + 1].seg);
        return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, text: `${Math.round(g)}`, hot: i === hot };
      })
    : [];
  return { segs, ...(weak.length ? { weak } : {}), labels };
}

// Bars running across the screen's short side show less length, so less of each is seen past the card.
export function turnHint(f: VisionFrame | null) {
  if (!f || f.h <= f.w || f.bars.length + f.weak.length < 2) return false;
  const across = [...f.bars, ...f.weak].filter((b) => Math.abs(b.seg[2] - b.seg[0]) > Math.abs(b.seg[3] - b.seg[1])).length;
  return across > (f.bars.length + f.weak.length) / 2;
}

export function barDiaFor(spec: Spec | null, member: 'slab' | 'beam') {
  const v = spec?.noDrawing ? undefined : member === 'slab' ? spec?.values.dia : spec?.values.stirrup_dia;
  return v ?? 10;
}

// ---- timings ---------------------------------------------------------------------

// Buffered per frame and written to the store when the scan screen closes, so the numbers survive restarts
// without a disk write every frame.
let pending: Record<Accel, number[]> = { NPU: [], GPU: [], CPU: [] };

function recordTiming(f: VisionFrame) {
  if (f.inferMs < 0 || f.accel === 'none') return;
  pending[f.accel].push(f.inferMs);
}

export function flushTimings() {
  if (!pending.NPU.length && !pending.GPU.length && !pending.CPU.length) return;
  actions.addTimings(pending);
  pending = { NPU: [], GPU: [], CPU: [] };
}

export function timingStats(stored: Record<Accel, number[]>) {
  const pct = (v: number[], p: number) => [...v].sort((a, b) => a - b)[Math.min(v.length - 1, Math.floor(p * v.length))];
  return (['NPU', 'GPU', 'CPU'] as const).map((k) => {
    const v = [...stored[k], ...pending[k]];
    return { accel: k, n: v.length, p50: v.length ? pct(v, 0.5) : null, p95: v.length ? pct(v, 0.95) : null };
  });
}

const widest = (g: number[]) => g.indexOf(Math.max(...g));

// ---- manual marking ---------------------------------------------------------------

export const TAP_ERROR_PX = 3; // on-screen tap precision, converted to image pixels by the caller

export function manualLock(target: Target, corners: Pt[], taps: Pt[], image: NonNullable<Lock['image']>, tapErrImgPx: number): Lock {
  const m = MARKERS[target.marker];
  const plane = [
    { x: 0, y: 0 },
    { x: m.w, y: 0 },
    { x: m.w, y: m.h },
    { x: 0, y: m.h },
  ];
  const base = { id: uid(), target: target.id, at: Date.now(), source: 'manual' as const, frames: 1, image };
  const outline = corners.map((c, i) => [c.x, c.y, corners[(i + 1) % 4].x, corners[(i + 1) % 4].y]);
  const toMm = convex(corners) ? homography(corners, plane) : null;
  const toImg = toMm ? homography(plane, corners) : null;
  if (!toMm || !toImg) {
    return { ...base, positions: [], band: FIELD_FLOOR_MM, overlay: { segs: outline, labels: [] }, gate: { reason: 'The corner taps do not make the card outline', action: 'Freeze again and tap the four corners in order.' } };
  }

  const pxPerMm = (dist(corners[0], corners[1]) / m.w + dist(corners[1], corners[2]) / m.h + dist(corners[2], corners[3]) / m.w + dist(corners[3], corners[0]) / m.h) / 4;
  // Abstain like the auto path: ArUco marker under 45 px at 4K (about 0.65 m for card S).
  const minPx = (45 * Math.max(image.w, image.h)) / 3840;
  const markerPx = pxPerMm * m.marker;

  const marked = taps.map((t) => ({ t, p: apply(toMm, t) })).sort((a, b) => (target.axis === 'x' ? a.p.x - b.p.x : a.p.y - b.p.y));
  const positions = marked.map(({ p }) => r1(target.axis === 'x' ? p.x : p.y));
  const gaps = gapsOf(positions);
  const errMm = (tapErrImgPx / pxPerMm) * Math.SQRT2;
  const band = Math.max(FIELD_FLOOR_MM, Math.ceil(2 * Math.hypot(errMm, 0.01 * Math.max(0, ...gaps))));
  const hot = widest(gaps);

  const segs = [...outline];
  for (const { p } of marked) {
    const a = target.axis === 'x' ? apply(toImg, { x: p.x, y: p.y - 40 }) : apply(toImg, { x: p.x - 40, y: p.y });
    const b = target.axis === 'x' ? apply(toImg, { x: p.x, y: p.y + 40 }) : apply(toImg, { x: p.x + 40, y: p.y });
    segs.push([a.x, a.y, b.x, b.y]);
  }
  const labels = gaps.map((g, i) => ({ x: (marked[i].t.x + marked[i + 1].t.x) / 2, y: (marked[i].t.y + marked[i + 1].t.y) / 2, text: `${Math.round(g)}`, hot: i === hot }));

  const gate = markerPx < minPx ? { reason: `The ${m.name} is too small in the photo (${Math.round(markerPx)} px markers, needs ${Math.round(minPx)})`, action: 'Move to about 30 cm and freeze a new frame.' } : undefined;
  const footprint = [
    { x: 0, y: 0 },
    { x: image.w, y: 0 },
    { x: image.w, y: image.h },
    { x: 0, y: image.h },
  ].map((c) => apply(toMm, c));
  const coverage: Coverage = {
    kind: target.marker,
    frame: footprint.map((c) => [r1(c.x), r1(c.y)]),
    marker: plane.map((c) => [c.x, c.y]),
    bars: marked.map(({ p }) => (target.axis === 'x' ? [p.x, p.y - 40, p.x, p.y + 40] : [p.x - 40, p.y, p.x + 40, p.y]).map(r1)),
    weak: [],
  };
  return { ...base, positions, band, overlay: { segs, labels }, coverage, gate };
}

// Live gap labels while marking, before the lock is built.
export function previewGaps(target: Target, corners: Pt[], taps: Pt[]) {
  const m = MARKERS[target.marker];
  if (corners.length < 4 || !convex(corners)) return [];
  const toMm = homography(corners, [
    { x: 0, y: 0 },
    { x: m.w, y: 0 },
    { x: m.w, y: m.h },
    { x: 0, y: m.h },
  ]);
  if (!toMm) return [];
  const pos = taps.map((t) => apply(toMm, t)).map((p) => (target.axis === 'x' ? p.x : p.y));
  return gapsOf([...pos].sort((a, b) => a - b)).map(Math.round);
}
