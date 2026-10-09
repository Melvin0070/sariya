import type { Check, Lang } from './store';

// Fix sentences for the mason. Hindi and Kannada wording must be checked by a native speaker on site.

const ZONE_MM = 600; // confinement zone length assumed for the stirrup count

export function fixCount(c: Check) {
  if (c.measured == null || c.drawing == null) return 0;
  if (c.kind === 'count') return Math.max(0, c.drawing - c.measured);
  if (c.measured <= c.drawing) return 0;
  return Math.max(1, Math.round(ZONE_MM / c.drawing) - Math.round(ZONE_MM / c.measured));
}

const noun = {
  stirrup: { en: 'stirrups', hi: 'रिंग', kn: 'ರಿಂಗ್' },
  spacing: { en: 'bars', hi: 'सरिया', kn: 'ಸರಳು' },
  count: { en: 'bars', hi: 'सरिया', kn: 'ಸರಳು' },
};

export function fixLines(c: Check, member: string, lang: Lang): string[] {
  const n = fixCount(c);
  const m = Math.round(c.measured ?? 0);
  const d = c.drawing ?? 0;
  const k = (c.kind === 'stirrup' || c.kind === 'spacing' || c.kind === 'count' ? c.kind : 'spacing') as keyof typeof noun;
  const w = noun[k][lang];
  const head = c.zone ? `${member} · ${c.zone}` : member;

  if (c.kind === 'count') {
    if (lang === 'hi') return [head, `${m} सरिया दिख रहे हैं।`, `ड्रॉइंग में ${d} हैं।`, `${n} सरिया और डालिए।`];
    if (lang === 'kn') return [head, `${m} ಸರಳುಗಳು ಕಾಣುತ್ತಿವೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${d} ಇವೆ.`, `ಇನ್ನೂ ${n} ಸರಳು ಹಾಕಿ.`];
    return [head, `${m} bars are visible.`, `Drawing asks for ${d}.`, `Add ${n} bars.`];
  }

  if (lang === 'hi')
    return [head, `${w} लगभग ${m} मिमी दूर हैं।`, `ड्रॉइंग में ${d} मिमी है।`, `इस हिस्से में ${n} ${w} और लगाइए।`];
  if (lang === 'kn')
    return [head, `${w}ಗಳು ಸುಮಾರು ${m} ಮಿಮೀ ಅಂತರದಲ್ಲಿವೆ.`, `ಡ್ರಾಯಿಂಗ್ ${d} ಮಿಮೀ ಕೇಳುತ್ತದೆ.`, `ಈ ಭಾಗದಲ್ಲಿ ${n} ${w} ಸೇರಿಸಿ.`];
  const W = w[0].toUpperCase() + w.slice(1);
  return [head, `${W} are about ${m} mm apart.`, `Drawing asks for ${d} mm.`, `Add ${n} ${w} in this zone.`];
}

export const LANG_LABEL: Record<Lang, string> = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ' };
