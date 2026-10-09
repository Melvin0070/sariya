import * as Crypto from 'expo-crypto';

import type { Inspection } from './store';

// Stable digest of what was measured. Any edit after signing changes it.
export function canonical(r: Inspection) {
  return JSON.stringify({
    id: r.id,
    name: r.name,
    at: r.createdAt,
    checks: r.checks.map((c) => [c.kind, c.zone, c.drawing, c.measured ?? null, c.band ?? null, c.outcome, !!c.fixed]),
  });
}

export async function digest(r: Inspection) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, canonical(r));
}

export const short = (h?: string) => (h && h.length > 16 ? `${h.slice(0, 4)}…${h.slice(-4)}` : (h ?? '—'));
