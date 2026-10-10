import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { C } from '@/components/ui';
import type { Lock } from '@/lib/store';

// The frozen frame with the exact lines and gap labels that were locked; the widest gap is highlighted.
export function Evidence({ lock, rounded = true }: { lock: Lock; rounded?: boolean }) {
  const w = lock.image?.w ?? 1000;
  const h = lock.image?.h ?? 1333;
  const stroke = Math.max(w, h) * 0.004;
  const fs = Math.max(w, h) * 0.03;
  return (
    <View
      className={`w-full overflow-hidden bg-black ${rounded ? 'rounded-card' : ''}`}
      style={{ aspectRatio: w / h }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Locked frame, ${lock.positions.length} bars marked${lock.overlay.labels.length ? `, gaps ${lock.overlay.labels.map((l) => l.text).join(', ')}` : ''}`}
    >
      {lock.image ? <Image source={{ uri: lock.image.file }} style={StyleSheet.absoluteFill} contentFit="fill" /> : null}
      <Svg viewBox={`0 0 ${w} ${h}`} style={StyleSheet.absoluteFill}>
        {lock.overlay.segs.map((s, i) => (
          <Line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} stroke="#FFFFFF" strokeWidth={stroke} strokeLinecap="round" opacity={0.95} />
        ))}
        {lock.overlay.weak?.map((s, i) => (
          <Line key={`w${i}`} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} stroke="#FFC043" strokeWidth={stroke} strokeDasharray={`${stroke * 4} ${stroke * 3}`} opacity={0.95} />
        ))}
        {lock.overlay.labels.map((l, i) => {
          const bw = fs * (l.text.length * 0.62 + 0.9);
          return (
            <Rect key={`b${i}`} x={l.x - bw / 2} y={l.y - fs * 0.85} width={bw} height={fs * 1.25} rx={fs * 0.3} fill={l.hot ? C.accent : 'rgba(0,0,0,0.65)'} />
          );
        })}
        {lock.overlay.labels.map((l, i) => (
          <SvgText key={`t${i}`} x={l.x} y={l.y} fontSize={fs} fontWeight="700" fill="#FFFFFF" textAnchor="middle">
            {l.text}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
