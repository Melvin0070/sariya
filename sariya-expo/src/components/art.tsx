import Svg, { Circle, G, Line, Polygon, Rect } from 'react-native-svg';

import type { MemberKind } from '@/lib/spec';

// One isometric style for every member: a concrete pad, rust-coloured bars, the same scale and line weight.

const STEEL = '#9A4E1C';
const STEEL_HI = '#D07A3A';
const TOP = '#ECEAE6';
const LEFT = '#BDB8B1';
const RIGHT = '#D9D6D1';

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const iso = (ox: number, oy: number, s: number) => (x: number, y: number, z: number) =>
  [ox + (x - y) * C * s, oy + (x + y) * S * s - z * s] as const;
type P = ReturnType<ReturnType<typeof iso>>;
const pts = (a: readonly P[]) => a.map((p) => p.join(',')).join(' ');

function Bar({ a, b, w = 2.4 }: { a: P; b: P; w?: number }) {
  return (
    <G>
      <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={STEEL} strokeWidth={w} strokeLinecap="round" />
      <Line x1={a[0]} y1={a[1] - w * 0.25} x2={b[0]} y2={b[1] - w * 0.25} stroke={STEEL_HI} strokeWidth={w * 0.35} strokeLinecap="round" />
    </G>
  );
}

// A concrete block from (0,0,0) to (w,d,h).
function Block({ p, w, d, h }: { p: ReturnType<typeof iso>; w: number; d: number; h: number }) {
  return (
    <G>
      <Polygon points={pts([p(0, d, h), p(w, d, h), p(w, d, 0), p(0, d, 0)])} fill={LEFT} />
      <Polygon points={pts([p(w, 0, h), p(w, d, h), p(w, d, 0), p(w, 0, 0)])} fill={RIGHT} />
      <Polygon points={pts([p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)])} fill={TOP} />
    </G>
  );
}

function Ring({ p, x0, y0, x1, y1, z0, z1, axis }: { p: ReturnType<typeof iso>; x0: number; y0: number; x1: number; y1: number; z0: number; z1: number; axis: 'x' | 'z' }) {
  const ring = axis === 'z' ? [p(x0, y0, z0), p(x1, y0, z0), p(x1, y1, z0), p(x0, y1, z0)] : [p(x0, y0, z0), p(x0, y1, z0), p(x0, y1, z1), p(x0, y0, z1)];
  return <Polygon points={pts(ring)} fill="none" stroke={STEEL} strokeWidth={1.4} strokeLinejoin="round" />;
}

// Slab: thin pad with a two-way mesh on top.
function Slab() {
  const p = iso(50, 21, 5.6);
  const bars = [];
  for (let i = 1; i < 8; i += 1.2) {
    bars.push(<Bar key={`x${i}`} a={p(i, 0.3, 1.2)} b={p(i, 7.7, 1.2)} w={2.1} />);
    bars.push(<Bar key={`y${i}`} a={p(0.3, i, 1.5)} b={p(7.7, i, 1.5)} w={2.1} />);
  }
  return (
    <G>
      <Block p={p} w={8} d={8} h={1} />
      {bars}
    </G>
  );
}

// Beam: long cage of four corner bars with stirrups, sitting on the formwork.
function Beam() {
  const p = iso(24, 32, 6.2);
  const L = 11;
  const rings = [];
  for (let x = 0.4; x <= L; x += 1.1) rings.push(<Ring key={x} p={p} x0={x} y0={0} x1={x} y1={2} z0={0.4} z1={3.2} axis="x" />);
  return (
    <G>
      <Block p={p} w={L + 0.6} d={2.6} h={0.4} />
      {rings}
      <Bar a={p(0, 0.1, 0.5)} b={p(L, 0.1, 0.5)} />
      <Bar a={p(0, 1.9, 0.5)} b={p(L, 1.9, 0.5)} />
      <Bar a={p(0, 0.1, 3.1)} b={p(L, 0.1, 3.1)} />
      <Bar a={p(0, 1.9, 3.1)} b={p(L, 1.9, 3.1)} />
    </G>
  );
}

const ART: Record<MemberKind, () => React.JSX.Element> = { slab: Slab, beam: Beam };

export function MemberArt({ kind, size = 84 }: { kind: MemberKind; size?: number }) {
  const Art = ART[kind];
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <Art />
    </Svg>
  );
}

// Clipboard for records.
export function Clipboard({ size }: { size: number }) {
  const p = iso(50, 40, 6);
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <Polygon points={pts([p(0, 0, 0), p(6, 0, 0), p(6, 8, 0), p(0, 8, 0)])} fill="#E9E5DF" />
      <Polygon points={pts([p(0.4, 0.6, 0.15), p(5.6, 0.6, 0.15), p(5.6, 7.6, 0.15), p(0.4, 7.6, 0.15)])} fill="#fff" />
      <Polygon points={pts([p(2, -0.3, 0.3), p(4, -0.3, 0.3), p(4, 1, 0.3), p(2, 1, 0.3)])} fill="#5E5E5E" />
      {[2, 3.6, 5.2].map((y, i) => (
        <G key={y}>
          <Polygon points={pts([p(1, y, 0.2), p(1.8, y, 0.2), p(1.8, y + 0.8, 0.2), p(1, y + 0.8, 0.2)])} fill={i < 2 ? '#05944F' : '#E2E2E2'} />
          <Line x1={p(2.4, y + 0.4, 0.2)[0]} y1={p(2.4, y + 0.4, 0.2)[1]} x2={p(5, y + 0.4, 0.2)[0]} y2={p(5, y + 0.4, 0.2)[1]} stroke="#CFCFCF" strokeWidth={2} strokeLinecap="round" />
        </G>
      ))}
    </Svg>
  );
}

// ---- guide illustrations: flat and simple, same palette as the members ----

const ACCENT = '#FF6A13';

function Marker({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Rect x={x} y={y} width={12} height={12} fill="#111" />
      <Rect x={x + 3} y={y + 3} width={3} height={3} fill="#fff" />
      <Rect x={x + 6} y={y + 6} width={3} height={3} fill="#fff" />
    </G>
  );
}

// The printed scan card lying on the bars.
export function CardArt({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <G stroke={STEEL} strokeWidth={3} strokeLinecap="round">
        <Line x1={10} y1={22} x2={90} y2={22} />
        <Line x1={10} y1={40} x2={90} y2={40} />
        <Line x1={10} y1={58} x2={90} y2={58} />
      </G>
      <G transform="rotate(-8 50 40)">
        <Rect x={20} y={14} width={60} height={52} rx={4} fill="#fff" stroke={RIGHT} strokeWidth={1.2} />
        <Marker x={25} y={19} />
        <Marker x={63} y={19} />
        <Marker x={25} y={49} />
        <Marker x={63} y={49} />
        <Rect x={41} y={38} width={18} height={4} rx={2} fill={ACCENT} />
      </G>
    </Svg>
  );
}

// A tape reel with its blade pulled out.
export function TapeArt({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <Rect x={44} y={36} width={50} height={9} fill="#F2C94C" stroke="#C9A227" strokeWidth={0.8} />
      <G stroke="#333" strokeWidth={1}>
        {[52, 60, 68, 76, 84].map((x, i) => (
          <Line key={x} x1={x} y1={36} x2={x} y2={i % 2 ? 39 : 41} />
        ))}
      </G>
      <Rect x={92} y={34} width={3} height={13} rx={1} fill="#1F1F1F" />
      <Circle cx={30} cy={40} r={22} fill={ACCENT} stroke="#C94E05" strokeWidth={2.5} />
      <Circle cx={30} cy={40} r={9} fill="#1F1F1F" />
      <Circle cx={30} cy={40} r={3.5} fill="#5E5E5E" />
    </Svg>
  );
}

// The phone held over the bars, with the live overlay on screen.
export function PhoneArt({ size }: { size: number }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <G stroke={STEEL} strokeWidth={3} strokeLinecap="round">
        <Line x1={8} y1={26} x2={92} y2={26} />
        <Line x1={8} y1={54} x2={92} y2={54} />
      </G>
      <Rect x={33} y={6} width={34} height={68} rx={7} fill="#1F1F1F" />
      <Rect x={36} y={11} width={28} height={58} rx={3} fill="#2B2B2B" />
      <G stroke={STEEL_HI} strokeWidth={2.2} strokeLinecap="round">
        <Line x1={36} y1={26} x2={64} y2={26} />
        <Line x1={36} y1={54} x2={64} y2={54} />
      </G>
      <Rect x={41} y={20} width={18} height={40} fill="none" stroke={ACCENT} strokeWidth={1.8} strokeDasharray="3 2" />
      <Rect x={44} y={64} width={12} height={3} rx={1.5} fill="#fff" />
    </Svg>
  );
}
