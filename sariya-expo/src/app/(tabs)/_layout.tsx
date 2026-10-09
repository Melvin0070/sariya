import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { FloatingTabBar } from '@/components/tab-bar';
import { useStore } from '@/lib/store';

export default function TabsLayout() {
  const checked = useStore((s) => s.deviceChecked);
  // First launch always passes through the ARCore device check.
  if (!checked) return <Redirect href="/device-check" />;

  return (
    <Tabs tabBar={(p) => <FloatingTabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#fff' } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="help" />
    </Tabs>
  );
}
