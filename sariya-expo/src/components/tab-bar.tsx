import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ClipboardCheck, ClipboardList, QrCode, ScanLine, Settings, type LucideIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SHADOW, SMOOTH, T, tap } from './ui';
import { useStore, type Role } from '@/lib/store';

type Item = { label: string; icon: LucideIcon };

const HOME: Record<Role, Item> = {
  operator: { label: 'Inspect', icon: ScanLine },
  engineer: { label: 'Review', icon: ClipboardCheck },
  verifier: { label: 'Verify', icon: QrCode },
};

const OTHER: Record<string, Item> = {
  records: { label: 'Records', icon: ClipboardList },
  settings: { label: 'Settings', icon: Settings },
};

// A verifier only checks QR codes; it keeps no records.
const HIDDEN: Record<Role, string[]> = { operator: [], engineer: [], verifier: ['records'] };

const TAB_W = 84;
const GAP = 4;

// Floating pill tab bar, as in the Uber app.
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const i = useSafeAreaInsets();
  const role = useStore((s) => s.role) ?? 'operator';
  const unenrolled = useStore((s) => s.trusted.length === 0);
  const visible = state.routes.filter((r) => !HIDDEN[role].includes(r.name) && (r.name === 'index' || OTHER[r.name]));
  const at = Math.max(0, visible.findIndex((r) => r.key === state.routes[state.index].key));
  // The grey pill slides under the tabs instead of jumping between them.
  const x = useSharedValue(at * (TAB_W + GAP));
  useEffect(() => {
    x.value = withTiming(at * (TAB_W + GAP), SMOOTH);
  }, [at, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 items-center" style={{ bottom: Math.max(i.bottom, 12) + 2 }}>
      <View
        className="flex-row gap-1 rounded-full border border-line bg-paper p-1"
        style={SHADOW.float}
      >
        <Animated.View className="absolute left-1 top-1 h-[54px] rounded-full bg-ink" style={[{ width: TAB_W }, pill]} />
        {visible.map((r) => {
          const item = r.name === 'index' ? HOME[role] : OTHER[r.name];
          const on = r.key === state.routes[state.index].key;
          const Icon = item.icon;
          return (
            <Pressable
              key={r.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => {
                tap();
                if (!on) navigation.navigate(r.name);
              }}
              className="h-[54px] items-center justify-center rounded-full"
              style={{ width: TAB_W }}
            >
              <View>
                <Icon size={21} color={on ? '#fff' : '#5E5E5E'} strokeWidth={on ? 2.4 : 1.9} />
                {r.name === 'settings' && unenrolled ? <View className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-accent" /> : null}
              </View>
              <T w={on ? 'bold' : 'medium'} className={`mt-0.5 text-[12px] ${on ? 'text-white' : 'text-ink-2'}`}>
                {item.label}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
