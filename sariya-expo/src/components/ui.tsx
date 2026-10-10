import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowLeft, Check, ChevronRight, Circle, EyeOff, Minus, RotateCw, Ruler, Tag, X, type LucideIcon } from 'lucide-react-native';
import type { ReactNode, RefObject } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Outcome, Source } from '@/lib/rules';

export const tap = () => Haptics.selectionAsync().catch(() => {});

// ---- type ---------------------------------------------------------------------

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

export function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <T w="bold" className={`text-[38px] leading-[44px] tracking-[-1.2px] ${className}`}>
      {children}
    </T>
  );
}

// Grey line under a title: one sentence at most.
export function Sub({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <T className={`mt-1.5 text-[16px] leading-[23px] text-ink-2 ${className}`}>{children}</T>;
}

export function H2({ children, right, className = '' }: { children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <T w="bold" className="text-[22px] tracking-[-0.5px]">
        {children}
      </T>
      {right}
    </View>
  );
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
        contentContainerStyle={{ paddingTop: i.top + 12, paddingBottom: tabs ? 110 : footer ? 24 : 40 }}
        contentContainerClassName="px-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <View className="bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 }}>
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export function IconBtn({ icon: Icon, onPress, label }: { icon: LucideIcon; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      hitSlop={8}
      className="h-11 w-11 items-center justify-center rounded-full bg-pill active:opacity-70"
    >
      <Icon size={20} color="#000" />
    </Pressable>
  );
}

// Back arrow, then the record this screen belongs to as a small line above the title.
export function TopBar({ name, sub, right, onBack }: { name?: string; sub?: string; right?: ReactNode; onBack?: () => void }) {
  const context = [name, sub].filter(Boolean).join(' · ');
  return (
    <View className="mb-4">
      <View className="h-11 flex-row items-center justify-between">
        <IconBtn icon={ArrowLeft} label="Back" onPress={() => (onBack ? onBack() : router.back())} />
        {right}
      </View>
      {context ? (
        <T w="medium" className="mt-5 text-[14px] text-ink-2" numberOfLines={1}>
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
    <Pressable
      disabled={!onPress}
      onPress={() => {
        tap();
        onPress?.();
      }}
      className={`rounded-card border-2 bg-tile active:opacity-80 ${on ? 'border-ink' : 'border-tile'} ${className}`}
    >
      {children}
    </Pressable>
  );
}

// The red promo tag from Uber, recoloured to the Sariya accent.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center gap-1 self-start rounded-md bg-accent px-2 py-[3px]">
      <Tag size={12} color="#fff" fill="#fff" />
      <T w="semibold" className="text-[13px] text-white">
        {children}
      </T>
    </View>
  );
}

// A card of rows. Children are Row, KV or anything with px-4.
export function Group({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`overflow-hidden rounded-card border border-line bg-paper ${className}`}>{children}</View>;
}

// Hairline between rows, starting where the text starts.
export function Hairline({ inset = 16 }: { inset?: number }) {
  return <View className="absolute right-0 top-0 h-px bg-line" style={{ left: inset }} />;
}

// ---- buttons ------------------------------------------------------------------

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon: Icon,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  kind?: 'primary' | 'secondary' | 'accent';
  icon?: LucideIcon;
  disabled?: boolean;
}) {
  const bg = kind === 'primary' ? 'bg-ink' : kind === 'accent' ? 'bg-accent' : 'bg-pill';
  const fg = kind === 'secondary' ? '#000' : '#fff';
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-xl ${bg} active:opacity-80 ${disabled ? 'opacity-40' : ''}`}
    >
      {Icon ? <Icon size={20} color={fg} /> : null}
      <T w="semibold" className="text-[17px]" style={{ color: fg }}>
        {label}
      </T>
    </Pressable>
  );
}

// The quiet second action under a primary button.
export function TextBtn({ label, onPress, tone = 'ink', disabled }: { label: string; onPress: () => void; tone?: 'ink' | 'fail'; disabled?: boolean }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      className={`h-12 items-center justify-center active:opacity-60 ${disabled ? 'opacity-40' : ''}`}
    >
      <T w="semibold" className={`text-[16px] ${tone === 'fail' ? 'text-fail' : ''}`}>
        {label}
      </T>
    </Pressable>
  );
}

// ---- results --------------------------------------------------------------------

// Five answers per check, plus "not checked yet" and measure-only. Never safe, PASS, certified or permit.
// Status is always text plus an icon, never colour alone.
export const OUTCOME: Record<Outcome, { label: string; bg: string; fg: string; color: string; icon: LucideIcon }> = {
  within: { label: 'Within limits', bg: 'bg-pass-soft', fg: 'text-pass', color: '#05944F', icon: Check },
  outside: { label: 'Outside limits', bg: 'bg-fail-soft', fg: 'text-fail', color: '#E11900', icon: X },
  rescan: { label: 'Re-scan', bg: 'bg-warn-soft', fg: 'text-warn', color: '#C77700', icon: RotateCw },
  tape: { label: 'Needs a reading', bg: 'bg-warn-soft', fg: 'text-warn', color: '#C77700', icon: Ruler },
  not_seen: { label: 'Not seen', bg: 'bg-pill', fg: 'text-ink-2', color: '#5E5E5E', icon: EyeOff },
  pending: { label: 'To do', bg: 'bg-pill', fg: 'text-ink-2', color: '#5E5E5E', icon: Circle },
  measured: { label: 'Measured', bg: 'bg-pill', fg: 'text-ink', color: '#000000', icon: Minus },
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
  warn: { bg: 'bg-warn-soft', color: '#C77700' },
  fail: { bg: 'bg-fail-soft', color: '#E11900' },
  pass: { bg: 'bg-pass-soft', color: '#05944F' },
  info: { bg: 'bg-tile', color: '#000000' },
};

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
export function Row({ icon: Icon, title, sub, onPress, right, first }: { icon?: LucideIcon; title: string; sub?: string; onPress?: () => void; right?: ReactNode; first?: boolean }) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        tap();
        onPress?.();
      }}
      className="flex-row items-center gap-4 px-4 py-4 active:bg-tile"
    >
      {first ? null : <Hairline inset={Icon ? 80 : 16} />}
      {Icon ? (
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-tile">
          <Icon size={22} color="#000" strokeWidth={1.8} />
        </View>
      ) : null}
      <View className="flex-1">
        <T w="semibold" className="text-[17px]" numberOfLines={1}>
          {title}
        </T>
        {sub ? (
          <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2" numberOfLines={2}>
            {sub}
          </T>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={20} color="#8A8A8A" /> : null)}
    </Pressable>
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
