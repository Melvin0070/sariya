import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, KeyRound, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PinPrompt } from '@/components/pin-prompt';
import { Button, EASE, IconBtn, Illo, Sub, T, TextBtn, success } from '@/components/ui';
import { parseKeyQr, verifyQr } from '@/lib/pack';
import { actions, getState, ROLE_LABEL, type Peer } from '@/lib/store';

type Result = { kind: 'peer'; peer: Peer } | { kind: 'verify'; ok: boolean; title: string; sub: string } | { kind: 'error'; title: string; sub: string };

const FRAME = 264;

// Four corner brackets instead of a full box: the code reads as the subject, not the frame.
function Viewfinder() {
  const arm = 'absolute h-12 w-12 border-white';
  return (
    <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
      <View style={{ width: FRAME, height: FRAME }}>
        <View className={`${arm} left-0 top-0 rounded-tl-3xl border-l-4 border-t-4`} />
        <View className={`${arm} right-0 top-0 rounded-tr-3xl border-r-4 border-t-4`} />
        <View className={`${arm} bottom-0 left-0 rounded-bl-3xl border-b-4 border-l-4`} />
        <View className={`${arm} bottom-0 right-0 rounded-br-3xl border-b-4 border-r-4`} />
      </View>
    </View>
  );
}

// One scanner for both jobs: enrolling another phone's key, and checking a sign-off offline.
export default function QrScan() {
  const i = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode: 'enrol' | 'verify' }>();
  const [perm, request] = useCameraPermissions();
  const [result, setResult] = useState<Result | null>(null);
  const [pinFor, setPinFor] = useState<Peer | null>(null);
  const busy = useRef(false);

  const onScan = (data: string) => {
    if (busy.current || result) return;
    busy.current = true;
    success();
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
    busy.current = false;
  };

  const trust = (peer: Peer) => {
    setPinFor(null);
    actions.trust(peer);
    router.back();
  };

  const good = result?.kind === 'verify' && result.ok;

  return (
    <View className="flex-1 bg-black">
      <PinPrompt title={pinFor ? `Trust ${pinFor.name} (${ROLE_LABEL[pinFor.role]})` : ''} visible={!!pinFor} onCancel={() => setPinFor(null)} onOk={() => pinFor && trust(pinFor)} />
      {perm?.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={result ? undefined : (e) => onScan(e.data)} />
      ) : null}

      <View className="absolute inset-x-0 flex-row items-center gap-3 px-4" style={{ top: i.top + 10 }}>
        <IconBtn icon={X} label="Close" tone="glass" onPress={() => router.back()} />
        <View className="flex-1 rounded-2xl bg-black/55 px-4 py-2.5">
          <T w="semibold" className="text-[16px] text-white" numberOfLines={1}>
            {mode === 'enrol' ? 'Scan the other phone’s key' : 'Scan the sign-off QR'}
          </T>
          <T className="text-[13px] text-white/75" numberOfLines={1}>
            {mode === 'enrol' ? 'Settings › Trusted phones, on that phone' : 'Checked offline against enrolled keys'}
          </T>
        </View>
      </View>

      {perm?.granted ? (
        result ? null : <Viewfinder />
      ) : (
        <View className="absolute inset-x-5 top-1/4 items-center rounded-card bg-paper px-5 pb-5 pt-4">
          <Illo name="phone" size={112} />
          <T w="bold" className="mt-2 text-[20px] leading-[26px]">
            Camera needed
          </T>
          <Sub className="text-center">Reads QR codes. Nothing leaves the phone.</Sub>
          <View className="mt-5 self-stretch">
            {perm && !perm.canAskAgain ? <Button label="Open settings" onPress={() => Linking.openSettings()} /> : <Button label="Allow camera" onPress={request} />}
          </View>
        </View>
      )}

      {result ? (
        <Animated.View entering={SlideInDown.duration(280).easing(EASE).reduceMotion(ReduceMotion.System)} className="absolute inset-x-0 bottom-0 rounded-t-sheet bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 10 }}>
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-line" />
          {result.kind === 'peer' ? (
            <>
              <T w="medium" className="text-[15px] text-ink-2">
                Enrol this phone?
              </T>
              <T w="bold" className="mt-1 text-[28px] leading-[34px] tracking-[-0.6px]">
                {result.peer.name} · {ROLE_LABEL[result.peer.role]}
              </T>
              <T w="semibold" className="mt-1 text-[18px] tracking-wider" style={{ fontVariant: ['tabular-nums'] }}>
                {result.peer.fp}
              </T>
              <T className="mt-2 text-[15px] leading-[21px] text-ink-2">Check the same code shows on that phone.</T>
              <View className="mt-5">
                <Button label="Trust with PIN" icon={KeyRound} onPress={() => setPinFor(result.peer)} />
                <TextBtn label="Scan again" onPress={again} />
              </View>
            </>
          ) : (
            <>
              <View className="flex-row items-center gap-3">
                <View className={`h-12 w-12 items-center justify-center rounded-full ${good ? 'bg-pass' : 'bg-fail'}`}>
                  {good ? <Check size={26} color="#fff" strokeWidth={3} /> : <X size={26} color="#fff" strokeWidth={3} />}
                </View>
                <T w="bold" className="flex-1 text-[24px] leading-[30px] tracking-[-0.5px]">
                  {result.title}
                </T>
              </View>
              <T className="mt-3 text-[16px] leading-[23px] text-ink-2">{result.sub}</T>
              {good ? <T className="mt-2 text-[13px] leading-[18px] text-ink-3">Proves this engineer approved this exact record. Not a safety certificate or pour permit.</T> : null}
              <View className="mt-5">
                <Button label="Scan another" onPress={again} />
                <TextBtn label="Done" onPress={() => router.back()} />
              </View>
            </>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}
