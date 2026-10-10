import * as Device from 'expo-device';
import { router } from 'expo-router';
import { BarChart3, BookOpen, ChevronRight, KeyRound, ShieldCheck } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Group, Row, Screen, T, Title, tap } from '@/components/ui';
import { ROLE_LABEL, useStore } from '@/lib/store';

export default function SettingsTab() {
  const role = useStore((s) => s.role);
  const name = useStore((s) => s.name);
  const me = useStore((s) => s.me);
  const trusted = useStore((s) => s.trusted);
  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';

  return (
    <Screen tabs>
      <Title className="mt-2">Settings</Title>

      <Pressable onPress={() => (tap(), router.push('/setup'))} className="-mx-5 mt-5 flex-row items-center gap-4 px-5 py-3 active:bg-tile">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-ink">
          <T w="bold" className="text-[22px] text-white">
            {name.trim().charAt(0).toUpperCase() || '?'}
          </T>
        </View>
        <View className="flex-1">
          <T w="semibold" className="text-[20px]">
            {name}
          </T>
          <T className="mt-0.5 text-[14px] text-ink-2">
            {role ? ROLE_LABEL[role] : ''} · {phone}
          </T>
        </View>
        <ChevronRight size={20} color="#8A8A8A" />
      </Pressable>

      <Group className="mt-4">
        <Row
          first
          icon={KeyRound}
          title="Trusted phones"
          sub={trusted.length ? trusted.map((p) => `${p.name} (${ROLE_LABEL[p.role]})`).join(', ') : 'None yet: enrol the other phones'}
          onPress={() => router.push('/keys')}
          right={!trusted.length ? <View className="h-2.5 w-2.5 rounded-full bg-accent" /> : undefined}
        />
        <Row icon={ShieldCheck} title="Readiness" sub="Camera, model, voices, fingerprint" onPress={() => router.push('/setup')} />
        <Row icon={BarChart3} title="Numbers" sub="Error table and model timings" onPress={() => router.push('/numbers')} />
        <Row icon={BookOpen} title="How to check steel" onPress={() => router.push('/guide')} />
      </Group>

      <T className="mt-8 text-[13px] leading-[19px] text-ink-3">
        Key {me?.fp ?? 'missing'}. Sariya measures what is visible against the drawing and records it. The engineer signs. It never says a structure is safe.
      </T>
    </Screen>
  );
}
