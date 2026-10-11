import { router, useLocalSearchParams } from 'expo-router';
import { Check, FileInput, TriangleAlert, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { ReduceMotion, ZoomIn } from 'react-native-reanimated';

import { Button, C, Details, EASE, Enter, Illo, Screen, SHADOW, Sub, T, TextBtn, Title, TopBar, success } from '@/components/ui';
import { pickText, readText } from '@/lib/files';
import { receive, type Received } from '@/lib/pack';
import { getState, useStore, type Role } from '@/lib/store';
import { openRecord } from '@/lib/status';

async function load(role: Role, uri?: string): Promise<{ file: string; res: Received } | null> {
  try {
    const f = uri ? await readText(uri) : await pickText();
    if (!f) return null;
    return { file: f.name, res: await receive(f.text, role) };
  } catch (e) {
    return { file: '', res: { ok: false, title: 'Could not open the file', sub: (e as Error).message } };
  }
}

// Opens one file, picked here or opened with Sariya from another app, then shows exactly what the checks found before anything else.
export default function ReceivedFile() {
  const role = useStore((s) => s.role) ?? 'operator';
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [res, setRes] = useState<Received | null>(null);
  const [file, setFile] = useState('');
  const [busy, setBusy] = useState(true);

  const pick = useCallback(
    (from?: string) =>
      load(role, from).then((out) => {
        setBusy(false);
        if (!out) {
          if (router.canGoBack()) router.back();
          return;
        }
        if (out.res.ok) success();
        setFile(out.file);
        setRes(out.res);
      }),
    [role],
  );

  useEffect(() => {
    pick(uri);
  }, [pick, uri]);

  const open = () => {
    const r = getState().records.find((x) => x.key === res?.key);
    if (!r) return;
    router.back();
    openRecord(r);
  };

  const again = () => {
    setBusy(true);
    setRes(null);
    pick();
  };

  const mark = res?.ok ? { bg: 'bg-pass', icon: Check } : res?.viewOnly ? { bg: 'bg-warn', icon: TriangleAlert } : { bg: 'bg-fail', icon: X };
  const Mark = mark.icon;

  return (
    <Screen
      footer={
        res ? (
          res.key ? (
            <>
              <Button label={role === 'engineer' ? (res.viewOnly ? 'View (approval off)' : 'Review') : 'Open record'} onPress={open} />
              <TextBtn label="Choose another file" onPress={again} />
            </>
          ) : (
            <Button label="Choose another file" icon={FileInput} onPress={again} />
          )
        ) : undefined
      }
    >
      <TopBar />
      {busy ? (
        <Enter className="mt-6 items-center">
          <Illo name="records" size={180} />
          <Title className="mt-4 text-center">{role === 'engineer' ? 'Received pack' : 'Received file'}</Title>
          <View className="mt-4 flex-row items-center gap-2">
            <ActivityIndicator color={C.ink} />
            <T className="text-[16px] text-ink-2">Choose the file in the picker…</T>
          </View>
        </Enter>
      ) : null}
      {res ? (
        <Enter className="mt-6 items-center">
          <View className="h-[180px] w-[180px]">
            <Illo name={res.ok ? 'verify' : 'empty'} size={180} />
            <Animated.View entering={ZoomIn.duration(220).easing(EASE).reduceMotion(ReduceMotion.System)} className={`absolute bottom-0 right-0 h-16 w-16 items-center justify-center rounded-full border-4 border-paper ${mark.bg}`} style={SHADOW.float}>
              <Mark size={30} color="#fff" strokeWidth={3} />
            </Animated.View>
          </View>
          <Title className="mt-6 text-center">{res.title}</Title>
          <Sub className="text-center">{res.sub}</Sub>
        </Enter>
      ) : null}
      {res && file ? (
        <Details label="File">
          <T className="text-[14px] text-ink-2">{file}</T>
        </Details>
      ) : null}
    </Screen>
  );
}
