import type { Fix, Finding } from './rules';
import type { MemberKind } from './spec';
import type { Lang } from './store';

// Fix sentences for the mason, filled only from the finding's numbers; nothing here recomputes a verdict.
// Hindi and Kannada wording still needs a native speaker's check on site.

export type Said = { head: string; body: string[]; action: string };

const NOUN: Record<MemberKind, Record<Lang, [string, string]>> = {
  slab: { en: ['bar', 'bars'], hi: ['सरिया', 'सरिया'], kn: ['ಸರಳು', 'ಸರಳು'] },
  beam: { en: ['ring', 'rings'], hi: ['रिंग', 'रिंग'], kn: ['ರಿಂಗ್', 'ರಿಂಗ್'] },
  column: { en: ['tie', 'ties'], hi: ['रिंग', 'रिंग'], kn: ['ರಿಂಗ್', 'ರಿಂಗ್'] },
};

function en(f: Fix, noun: (n: number) => string): [string[], string] {
  switch (f.kind) {
    case 'add_bars':
      return [[`${f.count} ${noun(f.count)} are in place.`, `Drawing asks for ${f.spec}.`], `Add ${f.n} more ${noun(f.n)}.`];
    case 'extra_bars':
      return [[`${f.count} ${noun(f.count)} are in place.`, `Drawing asks for ${f.spec}.`], 'Stop. Ask the engineer before changing anything.'];
    case 'add_in_gap':
      return [[`Gap ${f.gap} is ${f.gapMm} mm.`, `Drawing says ${f.spec} mm.`], `Add ${f.n} ${noun(f.n)} in gap ${f.gap}.`];
    case 'move_bar':
      return [[`Gap ${f.gap} is ${f.gapMm} mm.`, `Drawing says ${f.spec} mm.`], `Move the ${noun(1)} between gap ${f.gap} and gap ${f.other} by ${f.by} mm, into gap ${f.gap}.`];
    case 'respace':
      return [[`${noun(2)[0].toUpperCase()}${noun(2).slice(1)} are about ${f.mean} mm apart.`, `Drawing says ${f.spec} mm.`], `Re-space them at ${f.spec} mm.`];
    case 'add_rings_zone':
      return [[`${noun(2)[0].toUpperCase()}${noun(2).slice(1)} are at ${f.gapMm} mm.`, `Drawing says ${f.spec} mm for the first ${f.zoneMm} mm.`], `Add ${f.n} ${noun(f.n)}.`];
    case 'cover_low':
      return [[`Cover is ${f.value} mm.`, `Drawing says ${f.spec} mm.`], 'Put cover blocks under the bars.'];
    case 'cover_high':
      return [[`Cover is ${f.value} mm.`, `Drawing says ${f.spec} mm.`], 'Cover is too thick. Ask the engineer.'];
    case 'dia':
      return [[`This ${f.lengthMm} mm piece weighs ${f.massG} g: ${f.cls ? `it matches ${f.cls} mm steel` : 'it matches no bar size'}.`, `Drawing says ${f.spec} mm.`], 'Stop. Show this to the engineer before the pour.'];
    case 'hook':
      return [['Hooks are bent to 90°.', 'Drawing asks for 135°.'], 'Bend the hooks to 135°.'];
  }
}

function hi(f: Fix, w: string): [string[], string] {
  switch (f.kind) {
    case 'add_bars':
      return [[`${f.count} ${w} लगे हैं।`, `ड्रॉइंग में ${f.spec} हैं।`], `${f.n} ${w} और डालिए।`];
    case 'extra_bars':
      return [[`${f.count} ${w} लगे हैं।`, `ड्रॉइंग में ${f.spec} हैं।`], 'रुकिए। कुछ बदलने से पहले इंजीनियर से पूछिए।'];
    case 'add_in_gap':
      return [[`गैप ${f.gap}: ${f.gapMm} मिलीमीटर है।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], `गैप ${f.gap} में ${f.n} ${w} और डालिए।`];
    case 'move_bar':
      return [[`गैप ${f.gap}: ${f.gapMm} मिलीमीटर है।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], `गैप ${f.gap} और गैप ${f.other} के बीच वाला ${w} ${f.by} मिलीमीटर गैप ${f.gap} की तरफ़ खिसकाइए।`];
    case 'respace':
      return [[`${w} लगभग ${f.mean} मिलीमीटर की दूरी पर हैं।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], `${w} ${f.spec} मिलीमीटर पर दोबारा लगाइए।`];
    case 'add_rings_zone':
      return [[`रिंग ${f.gapMm} मिलीमीटर पर हैं।`, `ड्रॉइंग में पहले ${f.zoneMm} मिलीमीटर में ${f.spec} मिलीमीटर है।`], `${f.n} रिंग और लगाइए।`];
    case 'cover_low':
      return [[`कवर ${f.value} मिलीमीटर है।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], 'सरिया के नीचे कवर ब्लॉक लगाइए।'];
    case 'cover_high':
      return [[`कवर ${f.value} मिलीमीटर है।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], 'कवर ज़्यादा है। इंजीनियर से पूछिए।'];
    case 'dia':
      return [[`यह ${f.lengthMm} मिलीमीटर का टुकड़ा ${f.massG} ग्राम का है: ${f.cls ? `यह ${f.cls} मिलीमीटर सरिया जैसा है` : 'यह किसी साइज़ से मेल नहीं खाता'}।`, `ड्रॉइंग में ${f.spec} मिलीमीटर है।`], 'रुकिए। ढलाई से पहले इंजीनियर को दिखाइए।'];
    case 'hook':
      return [['हुक 90 डिग्री पर मुड़े हैं।', 'ड्रॉइंग में 135 डिग्री है।'], 'हुक 135 डिग्री तक मोड़िए।'];
  }
}

function kn(f: Fix, w: string): [string[], string] {
  switch (f.kind) {
    case 'add_bars':
      return [[`${f.count} ${w}ಗಳಿವೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಇವೆ.`], `ಇನ್ನೂ ${f.n} ${w} ಹಾಕಿ.`];
    case 'extra_bars':
      return [[`${f.count} ${w}ಗಳಿವೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಇವೆ.`], 'ನಿಲ್ಲಿಸಿ. ಬದಲಾಯಿಸುವ ಮೊದಲು ಎಂಜಿನಿಯರ್‌ರನ್ನು ಕೇಳಿ.'];
    case 'add_in_gap':
      return [[`ಅಂತರ ${f.gap}: ${f.gapMm} ಮಿಲಿಮೀಟರ್ ಇದೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], `ಅಂತರ ${f.gap}ರಲ್ಲಿ ${f.n} ${w} ಸೇರಿಸಿ.`];
    case 'move_bar':
      return [[`ಅಂತರ ${f.gap}: ${f.gapMm} ಮಿಲಿಮೀಟರ್ ಇದೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], `ಅಂತರ ${f.gap} ಮತ್ತು ಅಂತರ ${f.other} ನಡುವಿನ ${w}ನ್ನು ${f.by} ಮಿಲಿಮೀಟರ್ ಅಂತರ ${f.gap}ರ ಕಡೆಗೆ ಸರಿಸಿ.`];
    case 'respace':
      return [[`${w}ಗಳು ಸುಮಾರು ${f.mean} ಮಿಲಿಮೀಟರ್ ಅಂತರದಲ್ಲಿವೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], `${w}ಗಳನ್ನು ${f.spec} ಮಿಲಿಮೀಟರ್‌ಗೆ ಮತ್ತೆ ಜೋಡಿಸಿ.`];
    case 'add_rings_zone':
      return [[`ರಿಂಗ್‌ಗಳು ${f.gapMm} ಮಿಲಿಮೀಟರ್ ಅಂತರದಲ್ಲಿವೆ.`, `ಮೊದಲ ${f.zoneMm} ಮಿಲಿಮೀಟರ್‌ನಲ್ಲಿ ಡ್ರಾಯಿಂಗ್ ${f.spec} ಮಿಲಿಮೀಟರ್ ಕೇಳುತ್ತದೆ.`], `ಇನ್ನೂ ${f.n} ರಿಂಗ್ ಹಾಕಿ.`];
    case 'cover_low':
      return [[`ಕವರ್ ${f.value} ಮಿಲಿಮೀಟರ್ ಇದೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], 'ಸರಳುಗಳ ಕೆಳಗೆ ಕವರ್ ಬ್ಲಾಕ್ ಇಡಿ.'];
    case 'cover_high':
      return [[`ಕವರ್ ${f.value} ಮಿಲಿಮೀಟರ್ ಇದೆ.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], 'ಕವರ್ ಹೆಚ್ಚಾಗಿದೆ. ಎಂಜಿನಿಯರ್‌ರನ್ನು ಕೇಳಿ.'];
    case 'dia':
      return [[`ಈ ${f.lengthMm} ಮಿಲಿಮೀಟರ್ ತುಂಡು ${f.massG} ಗ್ರಾಂ ತೂಗುತ್ತದೆ: ${f.cls ? `${f.cls} ಮಿಲಿಮೀಟರ್ ಸರಳಿನಂತಿದೆ` : 'ಯಾವ ಗಾತ್ರಕ್ಕೂ ಹೊಂದುವುದಿಲ್ಲ'}.`, `ಡ್ರಾಯಿಂಗ್‌ನಲ್ಲಿ ${f.spec} ಮಿಲಿಮೀಟರ್.`], 'ನಿಲ್ಲಿಸಿ. ಕಾಂಕ್ರೀಟ್ ಹಾಕುವ ಮೊದಲು ಎಂಜಿನಿಯರ್‌ಗೆ ತೋರಿಸಿ.'];
    case 'hook':
      return [['ಹುಕ್‌ಗಳು 90 ಡಿಗ್ರಿಗೆ ಬಾಗಿವೆ.', 'ಡ್ರಾಯಿಂಗ್ 135 ಡಿಗ್ರಿ ಕೇಳುತ್ತದೆ.'], 'ಹುಕ್‌ಗಳನ್ನು 135 ಡಿಗ್ರಿಗೆ ಬಾಗಿಸಿ.'];
  }
}

export function say(f: Finding, member: MemberKind, name: string, lang: Lang): Said | null {
  if (!f.fix) return null;
  const head = f.def.zone ? `${name} · ${f.def.zone}` : name;
  const nouns = NOUN[member][lang];
  let parts: [string[], string];
  if (lang === 'hi') parts = hi(f.fix, nouns[0]);
  else if (lang === 'kn') parts = kn(f.fix, nouns[0]);
  else parts = en(f.fix, (n) => (n === 1 ? nouns[0] : nouns[1]));
  return { head, body: parts[0], action: parts[1] };
}

export const spoken = (s: Said) => [...s.body, s.action].join(' ');

export const LANG_LABEL: Record<Lang, string> = { hi: 'हिन्दी', kn: 'ಕನ್ನಡ', en: 'English' };
export const LANG_CODE: Record<Lang, string> = { hi: 'hi-IN', kn: 'kn-IN', en: 'en-IN' };
