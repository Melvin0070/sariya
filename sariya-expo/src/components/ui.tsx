import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ArrowLeft, Tag, type LucideIcon } from 'lucide-react-native';
import type { ReactNode, RefObject } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View, type TextProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Outcome } from '@/lib/store';

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
    <T w="bold" className={`text-[40px] leading-[46px] tracking-[-1.2px] ${className}`}>
      {children}
    </T>
  );
}

export function H2({ children, right, className = '' }: { children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <T w="bold" className="text-[24px] tracking-[-0.5px]">
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
        contentContainerStyle={{ paddingTop: i.top + 20, paddingBottom: tabs ? 110 : footer ? 24 : 40 }}
        contentContainerClassName="px-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <View className="border-t border-line bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 12 }}>
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

// Back arrow plus the persistent inspection name.
export function TopBar({ name, sub, right }: { name?: string; sub?: string; right?: ReactNode }) {
  return (
    <View className="mb-5 flex-row items-center gap-3">
      <Pressable
        onPress={() => {
          tap();
          router.back();
        }}
        className="h-12 w-12 items-center justify-center rounded-full bg-pill active:opacity-70"
        hitSlop={8}
      >
        <ArrowLeft size={22} color="#000" />
      </Pressable>
      <View className="flex-1">
        {name ? (
          <T w="semibold" className="text-[16px]" numberOfLines={1}>
            {name}
          </T>
        ) : null}
        {sub ? (
          <T className="text-[13px] text-ink-2" numberOfLines={1}>
            {sub}
          </T>
        ) : null}
      </View>
      {right}
    </View>
  );
}

// ---- surfaces -----------------------------------------------------------------

export function Tile({
  children,
  onPress,
  className = '',
  badge,
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  badge?: string;
}) {
  const body = (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        tap();
        onPress?.();
      }}
      className={`rounded-card bg-tile active:opacity-80 ${className}`}
    >
      {children}
    </Pressable>
  );
  if (!badge) return body;
  return (
    <View className="pt-3">
      {body}
      <View className="absolute left-0 right-0 top-0 items-center" pointerEvents="none">
        <Badge>{badge}</Badge>
      </View>
    </View>
  );
}

// The red promo tag from Uber, recoloured to the Sariya accent.
export function Badge({ children, tone = 'accent' }: { children: ReactNode; tone?: 'accent' | 'fail' }) {
  return (
    <View className={`flex-row items-center gap-1 rounded-md px-2 py-[3px] ${tone === 'fail' ? 'bg-fail' : 'bg-accent'}`}>
      <Tag size={13} color="#fff" fill="#fff" />
      <T w="semibold" className="text-[14px] text-white">
        {children}
      </T>
    </View>
  );
}

export function Outline({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`overflow-hidden rounded-card border border-line bg-paper ${className}`}>{children}</View>;
}

// ---- buttons ------------------------------------------------------------------

export function Pill({ icon: Icon, label, onPress, dark = false }: { icon?: LucideIcon; label: string; onPress?: () => void; dark?: boolean }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress?.();
      }}
      className={`h-12 flex-row items-center gap-2 self-start rounded-full px-5 active:opacity-70 ${dark ? 'bg-ink' : 'bg-pill'}`}
    >
      {Icon ? <Icon size={20} color={dark ? '#fff' : '#000'} /> : null}
      <T w="medium" className={`text-[16px] ${dark ? 'text-white' : ''}`}>
        {label}
      </T>
    </Pressable>
  );
}

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

// ---- results --------------------------------------------------------------------

export const OUTCOME: Record<Outcome, { label: string; bg: string; fg: string; dot: string }> = {
  within: { label: 'Within limits', bg: 'bg-pass-soft', fg: 'text-pass', dot: '#05944F' },
  outside: { label: 'Outside limits', bg: 'bg-fail-soft', fg: 'text-fail', dot: '#E11900' },
  rescan: { label: 'Re-scan required', bg: 'bg-warn-soft', fg: 'text-warn', dot: '#C77700' },
  not_seen: { label: 'Not seen', bg: 'bg-warn-soft', fg: 'text-warn', dot: '#C77700' },
  manual: { label: 'Manual reading needed', bg: 'bg-warn-soft', fg: 'text-warn', dot: '#C77700' },
  pending: { label: 'Pending', bg: 'bg-pill', fg: 'text-ink-2', dot: '#8A8A8A' },
};

export function Chip({ outcome, small }: { outcome: Outcome; small?: boolean }) {
  const o = OUTCOME[outcome];
  return (
    <View className={`flex-row items-center gap-1.5 self-start rounded-full ${o.bg} ${small ? 'px-2.5 py-1' : 'px-3 py-1.5'}`}>
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: o.dot }} />
      <T w="semibold" className={`${small ? 'text-[12px]' : 'text-[14px]'} ${o.fg}`}>
        {o.label}
      </T>
    </View>
  );
}

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View className="h-px bg-line" style={{ marginLeft: inset }} />;
}
