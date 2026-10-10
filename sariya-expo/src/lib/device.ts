import { LANG_CODE } from './fix';
import { Speech } from './native';
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
