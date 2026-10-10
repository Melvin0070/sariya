import { router } from 'expo-router';
import { Check, FileInput, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button, Screen, T, Title, TopBar } from '@/components/ui';
import { pickText } from '@/lib/files';
import { receive, type Received } from '@/lib/pack';
import { getState, useStore, type Role } from '@/lib/store';
import { openRecord } from '@/lib/status';

async function load(role: Role): Promise<{ file: string; res: Received } | null> {
  try {
    const f = await pickText();
    if (!f) return null;
    return { file: f.name, res: await receive(f.text, role) };
  } catch (e) {
    return { file: '', res: { ok: false, title: 'Could not open the file', sub: (e as Error).message } };
  }
}

// Opens one file the user picks from the system picker, then shows exactly what the checks found before anything else.
export default function ReceivedFile() {
  const role = useStore((s) => s.role) ?? 'operator';
  const [res, setRes] = useState<Received | null>(null);
  const [file, setFile] = useState('');
  const [busy, setBusy] = useState(true);

  const pick = useCallback(
    () =>
      load(role).then((out) => {
        setBusy(false);
        if (!out) {
          if (router.canGoBack()) router.back();
          return;
        }
        setFile(out.file);
        setRes(out.res);
      }),
    [role],
  );

  useEffect(() => {
    pick();
  }, [pick]);

  const open = () => {
    const r = getState().records.find((x) => x.key === res?.key);
    if (!r) return;
    router.back();
    openRecord(r);
  };

  return (
    <Screen
      footer={
        res ? (
          <View className="gap-2">
            {res.key ? <Button label={role === 'engineer' ? (res.viewOnly ? 'View (approval off)' : 'Review') : 'Open record'} onPress={open} /> : null}
            <Button
              label="Choose another file"
              icon={FileInput}
              kind="secondary"
              onPress={() => {
                setBusy(true);
                setRes(null);
                pick();
              }}
            />
          </View>
        ) : undefined
      }
    >
      <TopBar />
      <Title>{role === 'engineer' ? 'Received pack' : 'Received file'}</Title>
      {busy ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color="#000" />
          <T className="mt-3 text-[16px] text-ink-2">Choose the file in the picker…</T>
        </View>
      ) : null}
      {res ? (
        <View className="mt-6 rounded-card border border-line p-5">
          <View className="flex-row items-center gap-3">
            <View className={`h-12 w-12 items-center justify-center rounded-full ${res.ok ? 'bg-pass' : res.viewOnly ? 'bg-warn' : 'bg-fail'}`}>
              {res.ok ? <Check size={26} color="#fff" strokeWidth={3} /> : <X size={26} color="#fff" strokeWidth={3} />}
            </View>
            <T w="bold" className="flex-1 text-[24px] tracking-[-0.5px]">
              {res.title}
            </T>
          </View>
          <T className="mt-3 text-[16px] leading-[23px] text-ink-2">{res.sub}</T>
          {file ? <T className="mt-3 text-[13px] text-ink-3">{file}</T> : null}
        </View>
      ) : null}
    </Screen>
  );
}
