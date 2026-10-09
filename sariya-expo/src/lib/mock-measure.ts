import { useEffect, useState } from 'react';

import type { Check } from './store';

export type ScanStatus = 'searching' | 'closer' | 'steady' | 'ready';

// Stand-in for the vision pipeline: a reading that settles over ~3 s with a shrinking error band.
// Beam stirrups are deliberately off-drawing so the demo reaches the Fix screen.
function target(c: Check) {
  const d = c.drawing ?? 100;
  if (c.kind === 'count' || c.fixed) return c.kind === 'count' ? d : d + 3;
  if (c.kind === 'stirrup') return d >= 100 ? 180 : d * 1.6;
  return d + 4;
}

export function useMockMeasure(check: Check | undefined, tracking: boolean, paused: boolean) {
  const [tick, setTick] = useState({ id: '', t: 0 });
  const cid = check?.id ?? '';

  // Each new check (or resume after a lock) starts a fresh scan clock.
  useEffect(() => {
    if (paused || !cid) return;
    const start = Date.now();
    const id = setInterval(() => setTick({ id: cid, t: (Date.now() - start) / 1000 }), 120);
    return () => clearInterval(id);
  }, [paused, cid]);
  const t = tick.id === cid ? tick.t : 0;

  if (!check) return { status: 'searching' as ScanStatus, value: 0, band: 0, bars: 0 };
  const tgt = target(check);
  const settle = Math.min(1, Math.max(0, (t - 1.2) / 2));
  const noise = (Math.sin(t * 7.3) + Math.sin(t * 3.1)) * (1 - settle) * (check.kind === 'count' ? 0.6 : 18);
  const value = check.kind === 'count' ? Math.round(tgt + noise) : Math.round(tgt + noise + (1 - settle) * 25);
  const band = check.kind === 'count' ? 0 : Math.round(30 - settle * 23);
  const status: ScanStatus = !tracking || t < 0.6 ? 'searching' : t < 1.4 ? 'closer' : settle < 1 ? 'steady' : 'ready';
  const bars = check.kind === 'count' ? value : check.kind === 'stirrup' ? 5 : 6;
  return { status, value, band, bars, progress: settle };
}

export const STATUS_COPY: Record<ScanStatus, { label: string; color: string }> = {
  searching: { label: 'Find the card', color: '#FFFFFF' },
  closer: { label: 'Move closer', color: '#FFC043' },
  steady: { label: 'Hold steady', color: '#FFC043' },
  ready: { label: 'Ready to lock', color: '#3AD07A' },
};
