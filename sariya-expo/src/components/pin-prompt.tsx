import * as Haptics from 'expo-haptics';
import { Delete } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Button, C, Num, Press, T, TextBtn } from '@/components/ui';
import { checkPin } from '@/lib/pin';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
const MAX = 6;
const MIN = 4;
const SHAKE = 10;

// Filled for each digit typed; the first four rings are darker because four is the minimum.
const dot = (i: number, n: number) => {
  if (i < n) return 'bg-ink';
  return i < MIN ? 'border-2 border-ink-3' : 'border-2 border-line';
};

// Asked right before this phone's key signs something that others will trust. Cancel means nothing is signed.
// An on-screen keypad rather than the system keyboard: big keys work with gloves and nothing jumps when it opens.
export function PinPrompt({ title, visible, onCancel, onOk }: { title: string; visible: boolean; onCancel: () => void; onOk: () => void }) {
  const [pin, setPin] = useState('');
  const [why, setWhy] = useState('');
  const x = useSharedValue(0);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const close = () => {
    setPin('');
    setWhy('');
    onCancel();
  };
  const submit = () => {
    const r = checkPin(pin);
    setPin('');
    if (r.ok) {
      setWhy('');
      onOk();
    } else {
      setWhy(r.why);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      x.set(withSequence(withTiming(-SHAKE, { duration: 50 }), withTiming(SHAKE, { duration: 70 }), withTiming(-SHAKE / 2, { duration: 60 }), withTiming(0, { duration: 50 })));
    }
  };
  const press = (k: string) => {
    if (k === 'del') setPin((p) => p.slice(0, -1));
    else if (pin.length < MAX) {
      setWhy('');
      setPin((p) => p + k);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-sheet bg-paper px-5 pb-8 pt-6">
          <T w="bold" className="text-[22px] tracking-[-0.4px]" numberOfLines={2}>
            {title}
          </T>
          <T className="mt-1 text-[15px] text-ink-2">Enter your PIN</T>

          <Animated.View style={shake} className="mt-5 h-8 flex-row items-center justify-center gap-4" accessible accessibilityLabel={`${pin.length} of ${MAX} digits entered`}>
            {Array.from({ length: MAX }, (_, i) => (
              <View key={i} className={`h-4 w-4 rounded-full ${dot(i, pin.length)}`} />
            ))}
          </Animated.View>
          <View className={`mx-10 mt-2 h-0.5 rounded-full ${why ? 'bg-fail' : 'bg-transparent'}`} />
          <T className={`mt-2 min-h-[20px] text-center text-[14px] ${why ? 'text-fail' : 'text-ink-3'}`}>{why || `${MIN} to ${MAX} digits`}</T>

          <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
            {KEYS.map((k, i) =>
              k ? (
                <Press key={i} onPress={() => press(k)} scale={0.94} accessibilityRole="button" accessibilityLabel={k === 'del' ? 'Delete digit' : k} className="h-16 w-[32%] items-center justify-center rounded-2xl bg-tile">
                  {k === 'del' ? (
                    <Delete size={26} color={C.ink} strokeWidth={2} />
                  ) : (
                    <Num w="semibold" className="text-[28px]">
                      {k}
                    </Num>
                  )}
                </Press>
              ) : (
                <View key={i} className="h-16 w-[32%]" />
              ),
            )}
          </View>

          <View className="mt-4">
            <Button label="Confirm" disabled={pin.length < MIN} onPress={submit} />
            <TextBtn label="Cancel" onPress={close} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
