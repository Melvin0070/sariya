import * as Device from 'expo-device';
import { router } from 'expo-router';
import { ChevronRight, KeyRound, Settings2, Smartphone } from 'lucide-react-native';
import { View } from 'react-native';

import { H2, Outline, Row, Screen, T, Title } from '@/components/ui';
import { PROTECTION } from '@/lib/keys';
import { STEPS } from '@/lib/steps';
import { ROLE_LABEL, useStore } from '@/lib/store';

export default function DeviceTab() {
  const role = useStore((s) => s.role);
  const name = useStore((s) => s.name);
  const me = useStore((s) => s.me);
  const trusted = useStore((s) => s.trusted);
  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';

  return (
    <Screen tabs>
      <Title>Device</Title>

      <Outline className="mt-6">
        <Row first icon={Smartphone} title={`${name} · ${role ? ROLE_LABEL[role] : ''}`} sub={`${phone} · Android ${Device.osVersion ?? ''}`} />
        <Row icon={Settings2} title="Role, name and readiness" sub="Camera, voices, fingerprint, key, storage" onPress={() => router.push('/setup')} />
        <Row
          icon={KeyRound}
          title="Enrol phones"
          sub={trusted.length ? `${trusted.length} trusted: ${trusted.map((p) => `${p.name} (${ROLE_LABEL[p.role]})`).join(', ')}` : 'No other phone trusted yet'}
          onPress={() => router.push('/keys')}
          right={!trusted.length ? <View className="h-2.5 w-2.5 rounded-full bg-accent" /> : <ChevronRight size={20} color="#8A8A8A" />}
        />
      </Outline>
      <T className="mt-2 px-1 text-[13px] text-ink-2">
        Key {me?.fp ?? 'missing'} · {PROTECTION}
      </T>

      <H2 className="mt-9">How to check steel</H2>
      <View className="mt-5">
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <View key={s.title} className="flex-row gap-4">
              <View className="items-center">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-ink">
                  <T w="bold" className="text-[16px] text-white">
                    {i + 1}
                  </T>
                </View>
                {!last ? <View className="w-0.5 flex-1 bg-line" /> : null}
              </View>
              <View className={`flex-1 ${last ? '' : 'pb-7'}`}>
                <T w="semibold" className="text-[19px] leading-9">
                  {s.title}
                </T>
                <T className="mt-0.5 text-[16px] leading-[23px] text-ink-2">{s.body}</T>
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-8 rounded-card bg-tile p-5">
        <T className="text-[15px] leading-[22px] text-ink-2">Sariya measures what is visible against the drawing and records it. The engineer signs. It never says a structure is safe.</T>
      </View>
    </Screen>
  );
}
