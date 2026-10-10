import { getPublicKey, hashes, sign, verify } from '@noble/ed25519';
import { sha256, sha512 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { getRandomBytes } from 'expo-crypto';

import { SecureStore } from './native';

hashes.sha512 = sha512;

const SK = 'sariya_device_sk';
let secret: Uint8Array | null = null;

// Shown on screen as the real protection level: the signing itself runs in JS, not inside the Keystore.
export const PROTECTION = 'Ed25519 key, encrypted at rest by Android Keystore';

export type DeviceKey = { pub: string; fp: string };

export function fingerprint(pubHex: string) {
  const h = bytesToHex(sha256(hexToBytes(pubHex))).toUpperCase();
  return (h.slice(0, 16).match(/.{4}/g) ?? []).join(' ');
}

// One key per phone, created on first launch. The private half never leaves SecureStore.
export function loadDeviceKey(): DeviceKey | null {
  if (!SecureStore) return null;
  try {
    let hex = SecureStore.getItem(SK);
    if (!hex) {
      hex = bytesToHex(getRandomBytes(32));
      SecureStore.setItem(SK, hex);
    }
    secret = hexToBytes(hex);
    const pub = bytesToHex(getPublicKey(secret));
    return { pub, fp: fingerprint(pub) };
  } catch {
    return null;
  }
}

export const sha256Hex = (s: string) => bytesToHex(sha256(utf8ToBytes(s)));

export function signText(s: string) {
  if (!secret) throw new Error('This phone has no signing key. Reinstall the current build.');
  return bytesToHex(sign(utf8ToBytes(s), secret));
}

export function verifyText(s: string, sig: string, pub: string) {
  try {
    return verify(hexToBytes(sig), utf8ToBytes(s), hexToBytes(pub));
  } catch {
    return false;
  }
}

// Canonical JSON: sorted keys, undefined dropped. Signatures and hashes are always over this form.
export function canon(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map((x) => (x === undefined ? 'null' : canon(x))).join(',')}]`;
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o)
    .filter((k) => o[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canon(o[k])}`).join(',')}}`;
}

export const short = (h?: string) => (h ? `${h.slice(0, 6)}…${h.slice(-4)}` : '—');
