import { View } from 'react-native';

import { Enter, Illo, Screen, Sub, T, Title, TopBar, type IlloName } from '@/components/ui';
import { STEPS } from '@/lib/steps';

// Picture per step, matched on the title so a reordered STEPS list keeps the right art.
const ART: [RegExp, IlloName][] = [
  [/print/i, 'card'],
  [/drawing/i, 'slab'],
  [/place/i, 'card'],
  [/fix/i, 'speak'],
  [/scan/i, 'phone'],
  [/by hand|reading/i, 'tape'],
  [/sign|send/i, 'send'],
];
const artFor = (title: string) => ART.find(([re]) => re.test(title))?.[1];

export default function Guide() {
  return (
    <Screen>
      <TopBar />
      <Title>How to check steel</Title>
      <Sub>{STEPS.length} steps, the evening before the pour.</Sub>
      <View className="mt-6">
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          const art = artFor(s.title);
          return (
            <Enter key={s.title} i={i}>
              <View className="flex-row gap-4">
                <View className="items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-ink">
                    <T w="bold" className="text-[15px] text-white" style={{ fontVariant: ['tabular-nums'] }}>
                      {i + 1}
                    </T>
                  </View>
                  {last ? null : <View className="my-1 w-0.5 flex-1 rounded-full bg-line" />}
                </View>
                <View className={`flex-1 flex-row gap-3 ${last ? '' : 'pb-7'}`}>
                  <View className="flex-1">
                    <T w="bold" className="text-[17px] leading-9">
                      {s.title}
                    </T>
                    <T className="text-[15px] leading-[22px] text-ink-2">{s.body}</T>
                  </View>
                  {art ? (
                    <View className="h-16 w-16 items-center justify-center rounded-xl bg-tile">
                      <Illo name={art} size={60} />
                    </View>
                  ) : null}
                </View>
              </View>
            </Enter>
          );
        })}
      </View>
    </Screen>
  );
}
