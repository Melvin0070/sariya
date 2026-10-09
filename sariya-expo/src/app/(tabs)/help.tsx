import * as Device from 'expo-device';
import { router } from 'expo-router';
import { RotateCw, Smartphone } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { H2, Screen, T, Title, tap } from '@/components/ui';
import { AR_COPY } from '@/lib/ar';
import { STEPS } from '@/lib/steps';
import { useStore } from '@/lib/store';

export default function Help() {
  const ar = useStore((s) => s.ar);
  const ok = ar === 'supported';
  const arc = AR_COPY[ar];

  return (
    <Screen tabs>
      <Title>Help</Title>

      {/* Device */}
      <View className="mt-6 flex-row items-center gap-3 rounded-card border border-line bg-paper p-4">
        <View className={`h-12 w-12 items-center justify-center rounded-full ${ok ? 'bg-pass-soft' : 'bg-warn-soft'}`}>
          <Smartphone size={22} color={ok ? '#05944F' : '#C77700'} strokeWidth={1.8} />
        </View>
        <View className="flex-1">
          <T w="semibold" className="text-[17px]" numberOfLines={1}>
            {[Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone'}
          </T>
          <T className={`mt-0.5 text-[14px] ${ok ? 'text-pass' : 'text-warn'}`} numberOfLines={1}>
            {ok ? 'ARCore supported' : arc.title}
            <T className="text-[14px] text-ink-2"> · Android {Device.osVersion ?? ''}</T>
          </T>
        </View>
        <Pressable
          onPress={() => {
            tap();
            router.push('/device-check');
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-tile active:opacity-70"
          hitSlop={8}
        >
          <RotateCw size={18} color="#000" />
        </Pressable>
      </View>

      {/* Steps */}
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
        <T className="text-[15px] leading-[22px] text-ink-2">Sariya measures against the drawing. It never says a structure is safe.</T>
      </View>
    </Screen>
  );
}
