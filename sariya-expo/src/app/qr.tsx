import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Fingerprint, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Notice, T, tap } from '@/components/ui';
import { confirmIdentity } from '@/lib/device';
import { parseKeyQr, verifyQr } from '@/lib/pack';
import { actions, getState, ROLE_LABEL, type Peer } from '@/lib/store';

type Result = { kind: 'peer'; peer: Peer } | { kind: 'verify'; ok: boolean; title: string; sub: string } | { kind: 'error'; title: string; sub: string };

// One scanner for both jobs: enrolling another phone's key, and checking a sign-off offline.
export default function QrScan() {
  const i = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode: 'enrol' | 'verify' }>();
  const [perm, request] = useCameraPermissions();
  const [result, setResult] = useState<Result | null>(null);
  const [why, setWhy] = useState('');
  const busy = useRef(false);

  const onScan = (data: string) => {
    if (busy.current || result) return;
    busy.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (mode === 'enrol') {
      const peer = parseKeyQr(data);
      if (!peer) setResult({ kind: 'error', title: 'Not a Sariya key', sub: 'On the other phone open Settings › Trusted phones and scan its key QR.' });
      else if (peer.fp === getState().me?.fp) setResult({ kind: 'error', title: 'This is your own key', sub: 'Scan the other phone’s key.' });
      else setResult({ kind: 'peer', peer });
    } else {
      const v = verifyQr(data);
      actions.addVerification({ at: Date.now(), ...v });
      setResult({ kind: 'verify', ...v });
    }
  };

  const again = () => {
    setResult(null);
    setWhy('');
    busy.current = false;
  };

  const trust = async (peer: Peer) => {
    const ok = await confirmIdentity(`Trust ${peer.name} (${ROLE_LABEL[peer.role]})`);
    if (!ok.ok) {
      setWhy(ok.why.replace('Nothing was signed.', 'Nothing was trusted.'));
      return;
    }
    actions.trust(peer);
    router.back();
  };

  return (
    <View className="flex-1 bg-black">
      {perm?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={result ? undefined : (e) => onScan(e.data)} />
      ) : null}

      <View className="absolute inset-x-0 flex-row items-center gap-3 px-4" style={{ top: i.top + 10 }}>
        <Pressable
          onPress={() => {
            tap();
            router.back();
          }}
          className="h-12 w-12 items-center justify-center rounded-full bg-black/55"
        >
          <X size={22} color="#fff" />
        </Pressable>
        <View className="flex-1 rounded-2xl bg-black/55 px-4 py-2.5">
          <T w="semibold" className="text-[16px] text-white">
            {mode === 'enrol' ? 'Scan the other phone’s key' : 'Scan the sign-off QR'}
          </T>
          <T className="text-[13px] text-white/75">{mode === 'enrol' ? 'Settings › Trusted phones, on that phone' : 'Checked offline against enrolled keys'}</T>
        </View>
      </View>

      {perm?.granted ? (
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <View className="h-64 w-64 rounded-3xl border-4 border-white/90" />
        </View>
      ) : (
        <View className="absolute inset-x-5 top-1/3 rounded-card bg-paper p-5">
          <T w="semibold" className="text-[18px]">
            Camera needed
          </T>
          <T className="mt-1 text-[15px] text-ink-2">Sariya reads QR codes with the camera. Nothing leaves the phone.</T>
          <View className="mt-4">
            {perm && !perm.canAskAgain ? <Button label="Open settings" onPress={() => Linking.openSettings()} /> : <Button label="Allow camera" onPress={request} />}
          </View>
        </View>
      )}

      {result ? (
        <Animated.View entering={SlideInDown.springify().damping(18)} className="absolute inset-x-0 bottom-0 rounded-t-sheet bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 16 }}>
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-line" />
          {result.kind === 'peer' ? (
            <>
              <T w="medium" className="text-[15px] text-ink-2">
                Enrol this phone?
              </T>
              <T w="bold" className="mt-1 text-[28px] tracking-[-0.6px]">
                {result.peer.name} · {ROLE_LABEL[result.peer.role]}
              </T>
              <T w="medium" className="mt-1 text-[17px] tracking-wider">
                {result.peer.fp}
              </T>
              <T className="mt-2 text-[15px] leading-[22px] text-ink-2">Check that the same fingerprint shows on that phone. Its signatures will be trusted on this phone.</T>
              {why ? <Notice tone="warn" className="mt-3" title={why} /> : null}
              <View className="mt-5 gap-2">
                <Button label="Trust with fingerprint" icon={Fingerprint} onPress={() => trust(result.peer)} />
                <Button label="Scan again" kind="secondary" onPress={again} />
              </View>
            </>
          ) : (
            <>
              <View className="flex-row items-center gap-3">
                <View className={`h-12 w-12 items-center justify-center rounded-full ${result.kind === 'verify' && result.ok ? 'bg-pass' : 'bg-fail'}`}>
                  {result.kind === 'verify' && result.ok ? <Check size={26} color="#fff" strokeWidth={3} /> : <X size={26} color="#fff" strokeWidth={3} />}
                </View>
                <T w="bold" className="flex-1 text-[24px] tracking-[-0.5px]">
                  {result.title}
                </T>
              </View>
              <T className="mt-3 text-[16px] leading-[23px] text-ink-2">{result.sub}</T>
              {result.kind === 'verify' && result.ok ? (
                <T className="mt-2 text-[13px] leading-[19px] text-ink-3">Proves this engineer approved this exact record. It is not a safety certificate or pour permit.</T>
              ) : null}
              <View className="mt-5 gap-2">
                <Button label="Scan another" onPress={again} />
                <Button label="Done" kind="secondary" onPress={() => router.back()} />
              </View>
            </>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}
