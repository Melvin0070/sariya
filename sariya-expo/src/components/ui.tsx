import * as Haptics from 'expo-haptics';
import { Image, type ImageStyle } from 'expo-image';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Circle, EyeOff, Minus, RotateCw, Ruler, Tag, X, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, Text, View, type AccessibilityRole, type AccessibilityState, type TextProps } from 'react-native';
import Animated, { FadeInDown, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Outcome, Source } from '@/lib/rules';

// ---- tokens -------------------------------------------------------------------

export const C = {
  ink: '#000000',
  ink2: '#5E5E5E',
  ink3: '#8A8A8A',
  ink4: '#BDBDBD',
  paper: '#FFFFFF',
  tile: '#F3F3F3',
  pill: '#EEEEEE',
  line: '#E8E8E8',
  accent: '#FF6A13',
  pass: '#05944F',
  fail: '#E11900',
  warn: '#C77700',
};

// Two elevations only: cards resting on the page, and things floating over it.
export const SHADOW = {
  card: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  float: { shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
};

// Snappy, never bouncy: press feedback lands in ~100 ms, entrances in ~250 ms.
export const SPRING = { damping: 22, stiffness: 320, mass: 0.7 };
const PRESS_IN = { duration: 90 };

export const tap = () => Haptics.selectionAsync().catch(() => {});
export const thud = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
export const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

// ---- type ---------------------------------------------------------------------
// Scale: display 32/38 · h2 20/26 · lead 17/24 · body 15/21 · caption 13/18 · overline 12. Hierarchy comes from size and weight; grey is for secondary text only.

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
const W: Record<Weight, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
};

export function T({ w = 'regular', className = '', ...p }: TextProps & { w?: Weight; className?: string }) {
  return <Text {...p} className={`${W[w]} text-ink ${className}`} />;
}

// Measurements line up and don't jitter as they change.
export function Num({ className = '', style, ...p }: TextProps & { w?: Weight; className?: string }) {
  return <T w="bold" {...p} className={className} style={[{ fontVariant: ['tabular-nums'] }, style]} />;
}

export function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <T w="bold" className={`text-[32px] leading-[38px] tracking-[-1px] ${className}`}>
      {children}
    </T>
  );
}

// Grey line under a title: one short sentence at most.
export function Sub({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <T className={`mt-1.5 text-[16px] leading-[22px] text-ink-2 ${className}`}>{children}</T>;
}

export function H2({ children, right, className = '' }: { children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <T w="bold" className="text-[20px] leading-[26px] tracking-[-0.4px]">
        {children}
      </T>
      {right}
    </View>
  );
}

// Small caps label above a group, Uber-style.
export function Overline({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <T w="semibold" className={`text-[12px] uppercase tracking-[0.8px] text-ink-3 ${className}`}>
      {children}
    </T>
  );
}

// ---- motion -------------------------------------------------------------------

type Feel = 'select' | 'impact' | 'none';

// Every tappable surface: shrinks a touch under the finger and gives a haptic, so the app feels instant.
// Built on Animated.View's responder props because NativeWind only styles the stock animated views; a scroll that
// starts on it steals the responder, which cancels the press.
export function Press({
  children,
  onPress,
  className = '',
  feel = 'select',
  scale = 0.97,
  disabled,
  style,
  hitSlop,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
}: {
  children?: ReactNode;
  onPress?: () => void;
  className?: string;
  feel?: Feel;
  scale?: number;
  disabled?: boolean;
  style?: object;
  hitSlop?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
}) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const fire = () => {
    if (feel === 'select') tap();
    else if (feel === 'impact') thud();
    onPress?.();
  };
  const live = !disabled && !!onPress;
  return (
    <Animated.View
      className={className}
      style={style ? [style, a] : a}
      hitSlop={hitSlop}
      accessible={live || !!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      onAccessibilityTap={live ? fire : undefined}
      onStartShouldSetResponder={() => live}
      onResponderGrant={() => {
        s.set(withTiming(scale, PRESS_IN));
      }}
      onResponderRelease={() => {
        s.set(withSpring(1, SPRING));
        fire();
      }}
      onResponderTerminate={() => {
        s.set(withSpring(1, SPRING));
      }}
    >
      {children}
    </Animated.View>
  );
}

// Content rises in on mount; pass the index to stagger a list. Respects the system reduce-motion setting.
export function Enter({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(260)
        .delay(Math.min(i, 8) * 35)
        .withInitialValues({ transform: [{ translateY: 10 }] })
        .reduceMotion(ReduceMotion.System)}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// ---- illustrations ------------------------------------------------------------

const ILLO = {
  slab: require('../../assets/images/gen/slab.webp'),
  beam: require('../../assets/images/gen/beam.webp'),
  card: require('../../assets/images/gen/card.webp'),
  tape: require('../../assets/images/gen/tape.webp'),
  phone: require('../../assets/images/gen/phone.webp'),
  records: require('../../assets/images/gen/records.webp'),
  approve: require('../../assets/images/gen/approve.webp'),
  verify: require('../../assets/images/gen/verify.webp'),
  send: require('../../assets/images/gen/send.webp'),
  speak: require('../../assets/images/gen/speak.webp'),
  operator: require('../../assets/images/gen/operator.webp'),
  engineer: require('../../assets/images/gen/engineer.webp'),
  empty: require('../../assets/images/gen/empty.webp'),
};
export type IlloName = keyof typeof ILLO;
export const HERO = require('../../assets/images/gen/hero.webp');

// 3D clay illustration, square. Decorative: screen readers skip it.
export function Illo({ name, size = 96, style }: { name: IlloName; size?: number; style?: ImageStyle }) {
  return <Image source={ILLO[name]} style={[{ width: size, height: size }, style]} contentFit="contain" cachePolicy="memory" transition={0} accessible={false} />;
}

// ---- layout -----------------------------------------------------------------

// The footer sits in normal flow under the scroll view, so both move up when the keyboard opens.
export function Screen({
  children,
  tabs = false,
  footer,
  scrollRef,
}: {
  children: ReactNode;
  tabs?: boolean;
  footer?: ReactNode;
  scrollRef?: RefObject<ScrollView | null>;
}) {
  const i = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-paper">
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingTop: i.top + 8, paddingBottom: tabs ? 120 : footer ? 24 : 40 }}
        contentContainerClassName="px-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <View className="border-t border-line bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 10 }}>
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function IconBtn({ icon: Icon, onPress, label, tone = 'pill' }: { icon: LucideIcon; onPress: () => void; label: string; tone?: 'pill' | 'glass' }) {
  return (
    <Press accessibilityLabel={label} accessibilityRole="button" onPress={onPress} hitSlop={8} scale={0.9} className={`h-11 w-11 items-center justify-center rounded-full ${tone === 'glass' ? 'bg-black/45' : 'bg-pill'}`}>
      <Icon size={20} color={tone === 'glass' ? '#fff' : '#000'} strokeWidth={2.2} />
    </Press>
  );
}

// Back arrow, then the record this screen belongs to as a small line above the title.
export function TopBar({ name, sub, right, onBack }: { name?: string; sub?: string; right?: ReactNode; onBack?: () => void }) {
  const context = [name, sub].filter(Boolean).join(' · ');
  return (
    <View className="mb-3">
      <View className="h-12 flex-row items-center justify-between">
        <IconBtn icon={ArrowLeft} label="Back" onPress={() => (onBack ? onBack() : router.back())} />
        {right}
      </View>
      {context ? (
        <T w="semibold" className="mt-4 text-[13px] uppercase tracking-[0.6px] text-ink-3" numberOfLines={1}>
          {context}
        </T>
      ) : null}
    </View>
  );
}

// ---- surfaces -----------------------------------------------------------------

// A selectable card: grey, black outline when picked.
export function Tile({ children, onPress, className = '', on }: { children: ReactNode; onPress?: () => void; className?: string; on?: boolean }) {
  return (
    <Press
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      className={`rounded-card border-2 bg-tile ${on ? 'border-ink' : 'border-tile'} ${className}`}
    >
      {children}
    </Press>
  );
}

// The promo tag from Uber, recoloured to the Sariya accent.
export function Badge({ children, tone = 'accent' }: { children: ReactNode; tone?: 'accent' | 'ink' }) {
  return (
    <View className={`flex-row items-center gap-1 self-start rounded-md px-2 py-[3px] ${tone === 'ink' ? 'bg-ink' : 'bg-accent'}`}>
      <Tag size={11} color="#fff" fill="#fff" />
      <T w="bold" className="text-[12px] tracking-[0.3px] text-white">
        {children}
      </T>
    </View>
  );
}

// A card of rows. Children are Row, KV or anything with px-4.
export function Group({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <View className={`overflow-hidden rounded-card border border-line bg-paper ${className}`}>{children}</View>
  );
}

// Hairline between rows, starting where the text starts.
export function Hairline({ inset = 16 }: { inset?: number }) {
  return <View className="absolute right-0 top-0 h-px bg-line" style={{ left: inset }} />;
}

// Grey placeholder that breathes while something loads; better than a spinner for known shapes.
export function Skeleton({ className = '' }: { className?: string }) {
  const o = useSharedValue(0.5);
  useEffect(() => {
    o.set(withRepeat(withTiming(1, { duration: 700 }), -1, true));
  }, [o]);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View className={`rounded-lg bg-pill ${className}`} style={a} />;
}

// A thin bar that fills smoothly; segments when given a list of colours.
export function Meter({ value, color = C.ink, className = '' }: { value: number; color?: string; className?: string }) {
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  useEffect(() => {
    x.set(withTiming(Math.max(0, Math.min(1, value)) * w, { duration: 420 }));
  }, [value, w, x]);
  const a = useAnimatedStyle(() => ({ width: x.value }));
  return (
    <View className={`h-1.5 overflow-hidden rounded-full bg-line ${className}`} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Animated.View className="h-full rounded-full" style={[{ backgroundColor: color }, a]} />
    </View>
  );
}

// Two to four options in one pill, the selected one lifted onto white.
export function Segmented<K extends string>({ items, value, onChange }: { items: { key: K; label: string }[]; value: K; onChange: (k: K) => void }) {
  const [w, setW] = useState(0);
  const at = Math.max(0, items.findIndex((x) => x.key === value));
  const seg = w ? (w - 8) / items.length : 0;
  const x = useSharedValue(at * seg);
  useEffect(() => {
    x.set(withSpring(at * seg, SPRING));
  }, [at, seg, x]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View className="flex-row rounded-full bg-pill p-1" onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {seg ? <Animated.View className="absolute left-1 top-1 h-11 rounded-full bg-paper" style={[{ width: seg }, SHADOW.card, a]} /> : null}
      {items.map((it) => {
        const on = it.key === value;
        return (
          <Pressable
            key={it.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              if (on) return;
              tap();
              onChange(it.key);
            }}
            className="h-11 flex-1 items-center justify-center rounded-full"
          >
            <T w={on ? 'bold' : 'medium'} className={`text-[15px] ${on ? '' : 'text-ink-2'}`}>
              {it.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---- buttons ------------------------------------------------------------------

type Kind = 'primary' | 'secondary' | 'accent' | 'success';
const KIND: Record<Kind, { bg: string; fg: string }> = {
  primary: { bg: 'bg-ink', fg: '#fff' },
  secondary: { bg: 'bg-pill', fg: '#000' },
  accent: { bg: 'bg-accent', fg: '#fff' },
  success: { bg: 'bg-pass', fg: '#fff' },
};

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon: Icon,
  disabled,
  busy,
}: {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  icon?: LucideIcon;
  disabled?: boolean;
  busy?: boolean;
}) {
  const k = KIND[kind];
  return (
    <Press
      disabled={disabled || busy}
      feel="impact"
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!busy }}
      onPress={onPress}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl px-5 ${k.bg} ${disabled ? 'opacity-35' : ''}`}
    >
      {busy ? <ActivityIndicator color={k.fg} /> : Icon ? <Icon size={20} color={k.fg} strokeWidth={2.2} /> : null}
      <T w="semibold" className="text-[17px]" style={{ color: k.fg }} numberOfLines={1}>
        {label}
      </T>
    </Press>
  );
}

// Swiggy's "View cart" bar: where you are on the left, the next step on the right, one tap.
export function ActionBar({ title, sub, label, onPress, kind = 'primary', disabled }: { title: string; sub?: string; label: string; onPress: () => void; kind?: Kind; disabled?: boolean }) {
  const k = KIND[kind];
  return (
    <Press
      disabled={disabled}
      feel="impact"
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${label}`}
      onPress={onPress}
      className={`h-16 flex-row items-center rounded-2xl pl-5 pr-4 ${k.bg} ${disabled ? 'opacity-35' : ''}`}
    >
      <View className="flex-1">
        <T w="bold" className="text-[16px]" style={{ color: k.fg }} numberOfLines={1}>
          {title}
        </T>
        {sub ? (
          <T className="text-[13px] opacity-75" style={{ color: k.fg }} numberOfLines={1}>
            {sub}
          </T>
        ) : null}
      </View>
      <T w="bold" className="text-[16px]" style={{ color: k.fg }}>
        {label}
      </T>
      <ArrowRight size={20} color={k.fg} strokeWidth={2.4} style={{ marginLeft: 6 }} />
    </Press>
  );
}

// The quiet second action under a primary button.
export function TextBtn({ label, onPress, tone = 'ink', disabled }: { label: string; onPress: () => void; tone?: 'ink' | 'fail'; disabled?: boolean }) {
  return (
    <Press disabled={disabled} accessibilityRole="button" onPress={onPress} scale={0.95} className={`h-12 items-center justify-center ${disabled ? 'opacity-35' : ''}`}>
      <T w="semibold" className={`text-[16px] ${tone === 'fail' ? 'text-fail' : 'underline'}`}>
        {label}
      </T>
    </Press>
  );
}

// ---- results --------------------------------------------------------------------

// Five answers per check, plus "not checked yet" and measure-only. Never safe, PASS, certified or permit.
// Status is always text plus an icon, never colour alone.
export const OUTCOME: Record<Outcome, { label: string; bg: string; fg: string; color: string; icon: LucideIcon }> = {
  within: { label: 'Within limits', bg: 'bg-pass-soft', fg: 'text-pass', color: C.pass, icon: Check },
  outside: { label: 'Outside limits', bg: 'bg-fail-soft', fg: 'text-fail', color: C.fail, icon: X },
  rescan: { label: 'Re-scan', bg: 'bg-warn-soft', fg: 'text-warn', color: C.warn, icon: RotateCw },
  tape: { label: 'Needs a reading', bg: 'bg-warn-soft', fg: 'text-warn', color: C.warn, icon: Ruler },
  not_seen: { label: 'Not seen', bg: 'bg-pill', fg: 'text-ink-2', color: C.ink2, icon: EyeOff },
  pending: { label: 'To do', bg: 'bg-pill', fg: 'text-ink-2', color: C.ink2, icon: Circle },
  measured: { label: 'Measured', bg: 'bg-pill', fg: 'text-ink', color: C.ink, icon: Minus },
};

export function Chip({ outcome, small, label }: { outcome: Outcome; small?: boolean; label?: string }) {
  const o = OUTCOME[outcome];
  const Icon = o.icon;
  return (
    <View className={`flex-row items-center gap-1 self-start rounded-full ${o.bg} ${small ? 'px-2 py-[3px]' : 'px-3 py-1.5'}`}>
      <Icon size={small ? 12 : 14} color={o.color} strokeWidth={3} />
      <T w="semibold" className={`${small ? 'text-[12px]' : 'text-[14px]'} ${o.fg}`}>
        {label ?? o.label}
      </T>
    </View>
  );
}

const SOURCE: Record<Source, { label: string; warn?: boolean }> = {
  simulated: { label: 'SIMULATED', warn: true },
  auto: { label: 'AUTO' },
  manual: { label: 'BY HAND' },
  tape: { label: 'TAPE' },
  scale: { label: 'SCALE' },
  template: { label: 'TEMPLATE' },
};

// Where a number came from. Simulated and hand-marked values always say so.
export function SourceTag({ source }: { source: Source }) {
  const s = SOURCE[source];
  return (
    <View className={`self-start rounded px-1.5 py-[1px] ${s.warn ? 'bg-warn-soft' : 'bg-pill'}`}>
      <T w="bold" className={`text-[10px] tracking-wider ${s.warn ? 'text-warn' : 'text-ink-2'}`}>
        {s.label}
      </T>
    </View>
  );
}

const TONE = {
  warn: { bg: 'bg-warn-soft', color: C.warn },
  fail: { bg: 'bg-fail-soft', color: C.fail },
  pass: { bg: 'bg-pass-soft', color: C.pass },
  info: { bg: 'bg-tile', color: C.ink },
};

// Use at most one per screen, for something the user must act on or know before they continue.
export function Notice({ tone = 'info', title, children, className = '' }: { tone?: keyof typeof TONE; title?: string; children?: ReactNode; className?: string }) {
  const t = TONE[tone];
  return (
    <View className={`rounded-card px-4 py-3.5 ${t.bg} ${className}`}>
      {title ? (
        <T w="semibold" className="text-[15px] leading-[21px]" style={{ color: t.color }}>
          {title}
        </T>
      ) : null}
      {children ? (
        <T className={`text-[14px] leading-[20px] text-ink-2 ${title ? 'mt-0.5' : ''}`}>{children}</T>
      ) : null}
    </View>
  );
}

// A tappable list row in the Uber "recent places" style. Use inside Group.
export function Row({
  icon: Icon,
  illo,
  title,
  sub,
  onPress,
  right,
  first,
}: {
  icon?: LucideIcon;
  illo?: IlloName;
  title: string;
  sub?: string;
  onPress?: () => void;
  right?: ReactNode;
  first?: boolean;
}) {
  const lead = Icon || illo;
  return (
    <Press disabled={!onPress} onPress={onPress} scale={0.985} accessibilityRole={onPress ? 'button' : undefined} className="flex-row items-center gap-4 bg-paper px-4 py-3.5">
      {first ? null : <Hairline inset={lead ? 80 : 16} />}
      {illo ? (
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-tile">
          <Illo name={illo} size={44} />
        </View>
      ) : Icon ? (
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-tile">
          <Icon size={22} color="#000" strokeWidth={1.8} />
        </View>
      ) : null}
      <View className="flex-1">
        <T w="semibold" className="text-[16px] leading-[22px]" numberOfLines={1}>
          {title}
        </T>
        {sub ? (
          <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2" numberOfLines={2}>
            {sub}
          </T>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={20} color={C.ink4} /> : null)}
    </Press>
  );
}

// Label on the left, value on the right. Use inside Group.
export function KV({ k, v, first }: { k: string; v: string; first?: boolean }) {
  return (
    <View className="flex-row items-start gap-4 px-4 py-3.5">
      {first ? null : <Hairline />}
      <T className="flex-1 text-[15px] text-ink-2">{k}</T>
      <T w="medium" className="max-w-[62%] text-right text-[15px]">
        {v}
      </T>
    </View>
  );
}

// Technical detail (hashes, keys, engine) folded away: there for the auditor, out of the operator's way.
export function Details({ label = 'Details', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View className="mt-4">
      <Press onPress={() => setOpen(!open)} scale={0.97} accessibilityRole="button" accessibilityState={{ expanded: open }} className="h-10 flex-row items-center gap-1 self-start">
        <T w="semibold" className="text-[14px] text-ink-2">
          {label}
        </T>
        <ChevronRight size={16} color={C.ink2} style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }} />
      </Press>
      {open ? <Enter>{children}</Enter> : null}
    </View>
  );
}
