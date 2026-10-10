import '../global.css';

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' }, animation: 'ios_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="setup" options={{ animation: 'fade' }} />
        <Stack.Screen name="inspect/scan" options={{ animation: 'fade', contentStyle: { backgroundColor: '#000' } }} />
        <Stack.Screen name="qr" options={{ animation: 'fade', contentStyle: { backgroundColor: '#000' } }} />
      </Stack>
    </>
  );
}
