import { View } from 'react-native';

import { Screen, T, Title, TopBar } from '@/components/ui';
import { STEPS } from '@/lib/steps';

export default function Guide() {
  return (
    <Screen>
      <TopBar />
      <Title>How to check steel</Title>
      <View className="mt-6">
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <View key={s.title} className="flex-row gap-4">
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-ink">
                  <T w="bold" className="text-[14px] text-white">
                    {i + 1}
                  </T>
                </View>
                {last ? null : <View className="w-px flex-1 bg-line" />}
              </View>
              <View className={`flex-1 ${last ? '' : 'pb-6'}`}>
                <T w="semibold" className="text-[17px] leading-8">
                  {s.title}
                </T>
                <T className="mt-0.5 text-[15px] leading-[22px] text-ink-2">{s.body}</T>
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
