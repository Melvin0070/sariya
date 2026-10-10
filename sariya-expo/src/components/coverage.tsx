import { View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';

import { T } from '@/components/ui';
import type { Coverage } from '@/lib/store';

const PAD_MM = 10;

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
    <View className="rounded-xl bg-tile p-3">
      <Svg viewBox={`${x0} ${y0} ${w} ${h}`} style={{ width: '100%', aspectRatio: w / h, maxHeight: 220 }}>
        <Polygon points={poly(c.frame)} fill="#E4E4E4" stroke="#BDBDBD" strokeWidth={s} />
        <Polygon points={poly(c.marker)} fill="rgba(255,106,19,0.18)" stroke="#FF6A13" strokeWidth={s * 1.5} />
        {c.bars.map((b, i) => (
          <Line key={i} x1={b[0]} y1={b[1]} x2={b[2]} y2={b[3]} stroke="#000" strokeWidth={s * 2.5} strokeLinecap="round" />
        ))}
        {c.weak.map((b, i) => (
          <Line key={`w${i}`} x1={b[0]} y1={b[1]} x2={b[2]} y2={b[3]} stroke="#C88A00" strokeWidth={s * 2.5} strokeDasharray={`${s * 6} ${s * 4}`} />
        ))}
      </Svg>
      <T className="mt-2 text-[13px] text-ink-2">
        Coverage in card mm · grey: seen · orange: {c.kind} · black: bars used{c.weak.length ? ' · dashed: partly seen, not counted' : ''}
      </T>
    </View>
  );
}
