import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BarChart3, ClipboardCheck, ClipboardList, QrCode, ScanLine, Smartphone, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T, tap } from './ui';
import { useStore, type Role } from '@/lib/store';

type Item = { label: string; icon: LucideIcon };

const HOME: Record<Role, Item> = {
  operator: { label: 'Inspect', icon: ScanLine },
  engineer: { label: 'Review', icon: ClipboardCheck },
  verifier: { label: 'Verify', icon: QrCode },
};

const TABS: Record<Role, string[]> = {
  operator: ['index', 'records', 'numbers', 'device'],
  engineer: ['index', 'records', 'numbers', 'device'],
  verifier: ['index', 'device'],
};

const OTHER: Record<string, Item> = {
  records: { label: 'Records', icon: ClipboardList },
  numbers: { label: 'Numbers', icon: BarChart3 },
  device: { label: 'Device', icon: Smartphone },
};

// Floating pill tab bar, as in the Uber app. Tabs depend on what this phone does.
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const i = useSafeAreaInsets();
  const role = useStore((s) => s.role) ?? 'operator';
  const unenrolled = useStore((s) => s.trusted.length === 0);
  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 items-center" style={{ bottom: Math.max(i.bottom, 12) + 2 }}>
      <View
        className="flex-row gap-1 rounded-full border border-line bg-paper p-1"
        style={{ shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10 }}
      >
        {state.routes.map((r, idx) => {
          if (!TABS[role].includes(r.name)) return null;
          const item = r.name === 'index' ? HOME[role] : OTHER[r.name];
          const on = state.index === idx;
          const Icon = item.icon;
          return (
            <Pressable
              key={r.key}
              onPress={() => {
                tap();
                if (!on) navigation.navigate(r.name);
              }}
              className={`h-[54px] w-[70px] items-center justify-center rounded-full ${on ? 'bg-pill' : ''}`}
            >
              <View>
                <Icon size={20} color={on ? '#000' : '#5E5E5E'} strokeWidth={on ? 2.4 : 1.8} />
                {r.name === 'device' && unenrolled ? <View className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-accent" /> : null}
              </View>
              <T w={on ? 'bold' : 'regular'} className={`mt-0.5 text-[11px] ${on ? '' : 'text-ink-2'}`}>
                {item.label}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
