import * as Device from 'expo-device';
import { router } from 'expo-router';
import { BarChart3, BookOpen, ChevronRight, KeyRound, ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { C, Enter, Group, Overline, Press, Row, Screen, SHADOW, T, Title } from '@/components/ui';
import { ROLE_LABEL, useStore } from '@/lib/store';

export default function SettingsTab() {
  const role = useStore((s) => s.role);
  const name = useStore((s) => s.name);
  const trusted = useStore((s) => s.trusted);
  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';

  return (
    <Screen tabs>
      <Title className="mt-2">Settings</Title>

      <Enter>
        <Press onPress={() => router.push('/setup')} accessibilityRole="button" accessibilityLabel={`${name}, ${role ? ROLE_LABEL[role] : ''}. Edit this phone`} className="mt-5 flex-row items-center gap-4 rounded-card bg-paper px-4 py-4" style={SHADOW.card}>
          <View className="h-16 w-16 items-center justify-center rounded-full bg-ink">
            <T w="bold" className="text-[26px] text-white">
              {name.trim().charAt(0).toUpperCase() || '?'}
            </T>
          </View>
          <View className="flex-1">
            <T w="bold" className="text-[20px] leading-[26px]" numberOfLines={1}>
              {name}
            </T>
            <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
              {role ? ROLE_LABEL[role] : ''} · {phone}
            </T>
          </View>
          <ChevronRight size={20} color={C.ink4} />
        </Press>
      </Enter>

      <Overline className="mb-2 mt-8">Trust</Overline>
      <Enter i={1}>
        <Group>
          <Row
            first
            icon={KeyRound}
            title="Trusted phones"
            sub={trusted.length ? trusted.map((p) => `${p.name} (${ROLE_LABEL[p.role]})`).join(', ') : 'None yet: enrol the other phones'}
            onPress={() => router.push('/keys')}
            right={!trusted.length ? <View className="h-2.5 w-2.5 rounded-full bg-accent" /> : undefined}
          />
          <Row icon={ShieldCheck} title="Readiness" sub="Camera, model, voices, PIN" onPress={() => router.push('/setup')} />
        </Group>
      </Enter>

      <Overline className="mb-2 mt-6">Reference</Overline>
      <Enter i={2}>
        <Group>
          <Row first icon={BarChart3} title="Numbers" sub="Error table and model timings" onPress={() => router.push('/numbers')} />
          <Row icon={BookOpen} title="How to check steel" onPress={() => router.push('/guide')} />
        </Group>
      </Enter>

      <T className="mt-8 text-[13px] leading-[18px] text-ink-3">Sariya records what it measures; the engineer signs. It never says a structure is safe.</T>
    </Screen>
  );
}
