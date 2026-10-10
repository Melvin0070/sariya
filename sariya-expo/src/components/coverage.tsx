import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';

import { C, T } from '@/components/ui';
import type { Coverage } from '@/lib/store';

const PAD_MM = 10;
const WEAK = '#C88A00';

function Key({ swatch, label }: { swatch: ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      {swatch}
      <T className="text-[13px] text-ink-2">{label}</T>
    </View>
  );
}

// Top-down view of the bar plane in card mm: what the locked frame covered, where the card sat, and each bar the
// lock used (dashed: partly seen, not counted). Anything outside the grey area was never seen.
export function CoverageMap({ c }: { c: Coverage }) {
  const pts = [...c.frame, ...c.marker];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - PAD_MM;
  const y0 = Math.min(...ys) - PAD_MM;
  const w = Math.max(...xs) + PAD_MM - x0;
  const h = Math.max(...ys) + PAD_MM - y0;
  const s = Math.max(w, h) / 120;
  const poly = (p: number[][]) => p.map((q) => `${q[0]},${q[1]}`).join(' ');
  return (
    <View className="rounded-xl bg-tile p-3" accessibilityLabel={`Coverage map: ${c.bars.length} bars used${c.weak.length ? `, ${c.weak.length} partly seen` : ''}`}>
      <Svg viewBox={`${x0} ${y0} ${w} ${h}`} style={{ width: '100%', aspectRatio: w / h, maxHeight: 220 }}>
        <Polygon points={poly(c.frame)} fill="#E4E4E4" stroke="#BDBDBD" strokeWidth={s} />
        <Polygon points={poly(c.marker)} fill="rgba(255,106,19,0.18)" stroke={C.accent} strokeWidth={s * 1.5} />
        {c.bars.map((b, i) => (
          <Line key={i} x1={b[0]} y1={b[1]} x2={b[2]} y2={b[3]} stroke="#000" strokeWidth={s * 2.5} strokeLinecap="round" />
        ))}
        {c.weak.map((b, i) => (
          <Line key={`w${i}`} x1={b[0]} y1={b[1]} x2={b[2]} y2={b[3]} stroke={WEAK} strokeWidth={s * 2.5} strokeDasharray={`${s * 6} ${s * 4}`} />
        ))}
      </Svg>
      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1.5">
        <Key swatch={<View className="h-3 w-3 rounded-sm border border-ink-3 bg-[#E4E4E4]" />} label="Seen" />
        <Key swatch={<View className="h-3 w-3 rounded-sm border-2 border-accent bg-accent-soft" />} label={c.kind.charAt(0).toUpperCase() + c.kind.slice(1)} />
        <Key swatch={<View className="h-1 w-4 rounded-full bg-ink" />} label="Bars used" />
        {c.weak.length ? <Key swatch={<View className="h-1 w-4 rounded-full" style={{ backgroundColor: WEAK }} />} label="Partly seen, not counted" /> : null}
      </View>
    </View>
  );
}
