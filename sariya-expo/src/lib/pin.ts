import { bytesToHex } from '@noble/hashes/utils.js';
import { getRandomBytes } from 'expo-crypto';

import { sha256Hex } from './keys';
import { SecureStore } from './native';

// The PIN gates use of this phone's key (approving, trusting another phone). Only a salted hash is kept.
const PIN_KEY = 'sariya_pin';
const PIN_RE = /^\d{4,6}$/;
const MAX_TRIES = 5;
const LOCK_MS = 30_000;

let fails = 0;
let lockedUntil = 0;

export const pinProblem = (pin: string) => (PIN_RE.test(pin) ? null : 'Use 4 to 6 digits');

export function hasPin() {
  try {
    return !!SecureStore?.getItem(PIN_KEY);
  } catch {
    return false;
  }
}

export function savePin(pin: string) {
  if (!SecureStore) throw new Error('This build lacks secure storage, so it cannot keep a PIN.');
  if (pinProblem(pin)) throw new Error('Use 4 to 6 digits.');
  const salt = bytesToHex(getRandomBytes(16));
  SecureStore.setItem(PIN_KEY, `${salt}:${sha256Hex(salt + pin)}`);
}

export function checkPin(pin: string): { ok: true } | { ok: false; why: string } {
  const now = Date.now();
  if (now < lockedUntil) return { ok: false, why: `Too many wrong PINs. Try again in ${Math.ceil((lockedUntil - now) / 1000)} s.` };
  let saved: string | null = null;
  try {
    saved = SecureStore?.getItem(PIN_KEY) ?? null;
  } catch {}
  if (!saved) return { ok: false, why: 'No PIN on this phone. Set one in Settings › Readiness.' };
  const [salt, hash] = saved.split(':');
  if (sha256Hex(salt + pin) === hash) {
    fails = 0;
    return { ok: true };
  }
  fails += 1;
  if (fails >= MAX_TRIES) {
    fails = 0;
    lockedUntil = now + LOCK_MS;
    return { ok: false, why: `Wrong PIN ${MAX_TRIES} times. Wait ${LOCK_MS / 1000} s.` };
  }
  return { ok: false, why: `Wrong PIN. ${MAX_TRIES - fails} tries left.` };
}
