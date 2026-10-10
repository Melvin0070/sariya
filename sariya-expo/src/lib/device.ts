import { LANG_CODE } from './fix';
import { LocalAuth, Speech } from './native';
import type { Lang } from './store';

// Readiness facts for the setup screen. Each one is checked, never assumed.

export type Voices = Record<Lang, boolean>;

export async function voices(): Promise<Voices> {
  const none = { hi: false, kn: false, en: false };
  if (!Speech) return none;
  try {
    let list = await Speech.getAvailableVoicesAsync();
    // Android's TTS engine can report no voices until it has started once.
    if (!list.length) {
      await new Promise((r) => setTimeout(r, 700));
      list = await Speech.getAvailableVoicesAsync();
    }
    const has = (l: Lang) => list.some((v) => v.language?.toLowerCase().startsWith(l));
    return { hi: has('hi'), kn: has('kn'), en: has('en') };
  } catch {
    return none;
  }
}

export function speak(text: string, lang: Lang, onEnd: () => void) {
  if (!Speech) return false;
  Speech.speak(text, { language: LANG_CODE[lang], rate: 0.9, onDone: onEnd, onStopped: onEnd, onError: onEnd });
  return true;
}

export const stopSpeaking = () => Speech?.stop();

export type Biometric = 'enrolled' | 'not_enrolled' | 'no_hardware' | 'missing';

export async function biometric(): Promise<Biometric> {
  if (!LocalAuth) return 'missing';
  try {
    if (!(await LocalAuth.hasHardwareAsync())) return 'no_hardware';
    return (await LocalAuth.isEnrolledAsync()) ? 'enrolled' : 'not_enrolled';
  } catch {
    return 'missing';
  }
}

export const BIOMETRIC_COPY: Record<Biometric, string> = {
  enrolled: 'Fingerprint set up',
  not_enrolled: 'No fingerprint enrolled: add one in Settings › Security',
  no_hardware: 'No fingerprint sensor: the phone PIN is used',
  missing: 'Fingerprint module missing from this build',
};

// The approval key is used only after this succeeds. Cancel means nothing is signed.
export async function confirmIdentity(prompt: string): Promise<{ ok: true } | { ok: false; why: string }> {
  if (!LocalAuth) return { ok: false, why: BIOMETRIC_COPY.missing };
  try {
    const r = await LocalAuth.authenticateAsync({ promptMessage: prompt, cancelLabel: 'Cancel' });
    if (r.success) return { ok: true };
    return { ok: false, why: r.error === 'user_cancel' || r.error === 'system_cancel' ? 'Fingerprint cancelled. Nothing was signed.' : `Not confirmed (${r.error}). Nothing was signed.` };
  } catch (e) {
    return { ok: false, why: `Could not ask for a fingerprint: ${(e as Error).message}` };
  }
}
