import { useEffect, type ReactNode } from 'react';
import { Keyboard, PanResponder, View, useWindowDimensions } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { SHADOW, TextBtn } from '@/components/ui';

const EASE = Easing.out(Easing.cubic);

export function ScanResultSheet({ onRescan, children }: { onRescan: () => void; children: (rescan: () => void) => ReactNode }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(height);
  const dragStart = useSharedValue(0);
  const closing = useSharedValue(false);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  useEffect(() => {
    offset.set(withTiming(0, { duration: 280, easing: EASE }));
    return () => cancelAnimation(offset);
  }, [offset]);

  const rescan = () => {
    if (closing.get()) return;
    closing.set(true);
    Keyboard.dismiss();
    offset.set(
      withTiming(height, { duration: 220, easing: EASE }, (finished) => {
        if (finished) scheduleOnRN(onRescan);
      }),
    );
  };
  const settle = () => {
    offset.set(withTiming(0, { duration: 180, easing: EASE }));
  };
  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) => !closing.get() && dy > 6 && dy > Math.abs(dx),
    onPanResponderGrant: () => {
      cancelAnimation(offset);
      dragStart.set(offset.get());
      Keyboard.dismiss();
    },
    onPanResponderMove: (_, { dy }) => {
      offset.set(Math.max(0, dragStart.get() + dy));
    },
    onPanResponderRelease: (_, { dy, vy }) => {
      if (dy > 80 || (dy > 20 && vy > 0.65)) rescan();
      else settle();
    },
    onPanResponderTerminate: settle,
  });

  return (
    <Animated.View className="absolute inset-x-0 bottom-0 max-h-[64%] rounded-t-sheet bg-paper" style={[{ paddingBottom: insets.bottom + 8 }, SHADOW.float, style]}>
      {/* Keep the drag target outside the findings so scrolling never steals the handle. */}
      <View {...pan.panHandlers} className="items-center px-5 pt-3">
        <View className="h-1.5 w-10 rounded-full bg-line" />
        <TextBtn label="Re-scan" onPress={rescan} />
      </View>
      {children(rescan)}
    </Animated.View>
  );
}
