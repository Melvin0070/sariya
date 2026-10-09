import * as Device from 'expo-device';
import { router } from 'expo-router';
import { Camera, Check, Download, Loader, ScanLine, X, type LucideIcon } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { AppState, View } from 'react-native';

import { Button, Outline, Screen, T, Title } from '@/components/ui';
import { AR_COPY, checkDevice, installArCore, type DeviceReport } from '@/lib/ar';
import { actions } from '@/lib/store';

type RowState = 'ok' | 'warn' | 'bad' | 'wait';
const MARK: Record<RowState, { I: LucideIcon; bg: string }> = {
  ok: { I: Check, bg: '#05944F' },
  warn: { I: Download, bg: '#C77700' },
  bad: { I: X, bg: '#E11900' },
  wait: { I: Loader, bg: '#BDBDBD' },
};

function Row({ icon: Icon, label, note, state }: { icon: LucideIcon; label: string; note: string; state: RowState }) {
  const m = MARK[state];
  return (
    <View className="flex-row items-center gap-4 px-4 py-4">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-tile">
        <Icon size={22} color="#000" strokeWidth={1.8} />
      </View>
      <View className="flex-1">
        <T w="semibold" className="text-[17px]">
          {label}
        </T>
        <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
          {note}
        </T>
      </View>
      <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: m.bg }}>
        <m.I size={15} color="#fff" strokeWidth={3} />
      </View>
    </View>
  );
}

export default function DeviceCheck() {
  const [r, setR] = useState<DeviceReport | null>(null);

  const run = useCallback(() => {
    setR(null);
    checkDevice().then(setR);
  }, []);

  useEffect(() => {
    checkDevice().then(setR);
  }, []);

  // Re-check when the user returns from the Play Store.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s === 'active' && r?.ar === 'install' && run());
    return () => sub.remove();
  }, [r, run]);

  const arState: RowState = !r ? 'wait' : r.ar === 'supported' ? 'ok' : r.ar === 'install' ? 'warn' : 'bad';
  const copy = AR_COPY[r?.ar ?? 'unknown'];
  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';

  const go = () => {
    if (r) actions.setAr(r.ar);
    router.replace('/');
  };

  return (
    <Screen
      footer={
        r?.ar === 'install' ? (
          <View className="gap-2">
            <Button label="Install ARCore" icon={Download} onPress={() => installArCore().then(run)} />
            <Button label="Continue without AR" kind="secondary" onPress={go} />
          </View>
        ) : (
          <Button label={r ? 'Continue' : 'Checking…'} disabled={!r} onPress={go} />
        )
      }
    >
      <Title className="mt-8">Your phone</Title>
      <T className="mt-2 text-[17px] text-ink-2">
        {phone} · Android {Device.osVersion ?? ''}
      </T>

      <Outline className="mt-7">
        <Row icon={Camera} label="Camera" note={!r ? 'Asking for access' : r.camera ? 'Ready' : 'Allow camera in Settings'} state={!r ? 'wait' : r.camera ? 'ok' : 'bad'} />
        <View className="ml-20 h-px bg-line" />
        <Row icon={ScanLine} label="ARCore" note={!r ? 'Checking' : r.ar === 'supported' ? 'Ready' : copy.title} state={arState} />
      </Outline>

      {r && r.ar !== 'supported' ? <T className="mt-4 px-1 text-[15px] leading-[22px] text-ink-2">{copy.body}</T> : null}
    </Screen>
  );
}
