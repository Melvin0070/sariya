// bun test src/lib/zones.test.ts — ring zones: the half-scale beam prop (BUILD-PLAN §7), and column ties at both ends.
import { expect, mock, test } from 'bun:test';

mock.module('./store', () => ({
  activeLock: (r: { locks: { target: string }[] }, t: string) => r.locks.find((l) => l.target === t),
}));
const { evaluate } = await import('./rules');

const lock = (target: string, positions: number[]) => ({ target, positions, band: 3, source: 'auto', weak: [] });
const member = (m: string) => (locks: unknown[]) =>
  ({
    member: m,
    status: 'draft',
    readings: {},
    locks,
    spec: { rev: 1, at: 0, hooks135: false, preset: false, noDrawing: false, values: { stirrup_dia: 8, end_spacing: 50, end_length: 150, mid_spacing: 75, cover: 25 } },
  }) as never;
const column = member('column');
const beam = member('beam');
const by = (fs: ReturnType<typeof evaluate>, id: string) => fs.find((f) => f.def.id === id)!;

test('beam prop as built (25/75/125/200/275): both zones within; the 125-200 gap is mid-span', () => {
  const fs = evaluate(beam([lock('stirrups', [25, 75, 125, 200, 275])]));
  expect(by(fs, 'end_spacing').outcome).toBe('within');
  expect(by(fs, 'mid_spacing').outcome).toBe('within');
});

test('beam F3 (ring at 75 slid to 180): end gap 100, outside, add 1', () => {
  const end = by(evaluate(beam([lock('stirrups', [25, 125, 180, 200, 275])])), 'end_spacing');
  expect(end.outcome).toBe('outside');
  expect(end.fix).toMatchObject({ kind: 'add_rings_zone', n: 1, gapMm: 100, spec: 50 });
});

test('bottom end within, top end too wide with a tie fix, middle from the bottom scan', () => {
  const fs = evaluate(column([lock('stirrups', [10, 60, 110, 160, 235, 310]), lock('ties_top', [10, 100, 190, 265])]));
  expect(by(fs, 'end_spacing').outcome).toBe('within');
  const top = by(fs, 'top_spacing');
  expect(top.outcome).toBe('outside');
  expect(top.fix?.kind).toBe('add_rings_zone');
  expect(by(fs, 'mid_spacing').outcome).toBe('within');
});

test('top end waits for its own scan; middle falls back to the top scan when the bottom saw none', () => {
  expect(by(evaluate(column([lock('stirrups', [10, 60, 110])])), 'top_spacing').outcome).toBe('pending');
  const fs = evaluate(column([lock('stirrups', [10, 60, 110]), lock('ties_top', [10, 60, 110, 160, 260])]));
  expect(by(fs, 'mid_spacing').outcome).toBe('outside'); // 100 mm gap past lo, drawing 75
});
