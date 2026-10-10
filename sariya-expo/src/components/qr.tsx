import makeQr from 'qrcode-generator';
import { useMemo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

// The generator reads one byte per char, so names in any script go in as UTF-8 bytes.
const utf8 = (s: string) => String.fromCharCode(...new TextEncoder().encode(s));

export function QR({ value, size }: { value: string; size: number }) {
  const { d, n } = useMemo(() => {
    const q = makeQr(0, 'M');
    q.addData(utf8(value), 'Byte');
    q.make();
    const count = q.getModuleCount();
    let path = '';
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (q.isDark(r, c)) path += `M${c} ${r}h1v1h-1z`;
    return { d: path, n: count };
  }, [value]);
  return (
    <Svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`}>
      <Rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      <Path d={d} fill="#000" />
    </Svg>
  );
}
