// bun test src/lib/live.test.ts — live preview: bar smoothing and gap colours.
import { expect, mock, test } from 'bun:test';

mock.module('./store', () => ({ actions: { addTimings: () => {} }, uid: () => 'x', activeLock: () => undefined }));
mock.module('react-native', () => ({}));
const { LiveFeed } = await import('./measure');
const { gapTone } = await import('./rules');

const frame = (xs: number[]) =>
  ({
    w: 1080, h: 1920, model: 'v3', modelSha: '', accel: 'NPU', inferMs: 20, frameMs: 40, minMarkerPx: 10, maskPts: 500, sharp: 100,
    pose: { kind: 'card', points: 25, markerPx: 40, pxPerMm: 3, outline: [], outlineMm: [], footprintMm: [] },
    bars: xs.map((x) => ({ pos: x, seg: [0, 0, 0, 0], mm: [x, -100, x, 100], support: 100 })),
    weak: [],
  }) as never;

test('smoothed bars move toward new detections, keep identity, and fade out when lost', () => {
  const f = new LiveFeed();
  f.push(frame([0, 50, 100]));
  f.push(frame([2, 50, 100]));
  const s = f.get().smooth;
  expect(s.length).toBe(3);
  expect(s[0].pos).toBeGreaterThan(0);
  expect(s[0].pos).toBeLessThan(2); // averaged, not jumped
  expect(s[0].seen).toBe(2);
  f.push(frame([2, 50])); // bar at 100 not detected: kept briefly
  expect(f.get().smooth.length).toBe(3);
  f.push(frame([2, 50]));
  f.push(frame([2, 50]));
  expect(f.get().smooth.length).toBe(2); // dropped after SMOOTH_KEEP misses
});

test('gap colours follow the single-gap limit (spec + max(15, 25 %)) with the 5 mm floor', () => {
  // spec 50 -> limit 65
  expect(gapTone(50, 50)).toBe('within');
  expect(gapTone(62, 50)).toBe('near'); // 62 + 5 > 65, 62 - 5 < 65
  expect(gapTone(80, 50)).toBe('outside');
  expect(gapTone(80, null)).toBeNull();
});
