import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/tab-bar';
import { useStore } from '@/lib/store';

export default function TabsLayout() {
  const role = useStore((s) => s.role);
  // First launch: choose what this phone does and check it is ready.
  if (!role) return <Redirect href="/setup" />;

  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#fff' } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
