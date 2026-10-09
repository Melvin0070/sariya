import { router } from 'expo-router';
import { Plus, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Clipboard } from '@/components/art';
import { Button, Chip, H2, Outline, Screen, T, Title, TopBar } from '@/components/ui';
import { digest, short } from '@/lib/sign';
import { actions, tally, useStore, when, KIND_LABEL } from '@/lib/store';

export default function Sign() {
  const cur = useStore((s) => s.current);
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    if (cur) digest(cur).then(setHash);
  }, [cur]);

  if (!cur) return null;
  const t = tally(cur.checks);
  const corrected = cur.checks.filter((c) => c.fixed).length;

  const send = () => {
    if (!hash) return;
    const id = actions.send(hash);
    router.dismissAll();
    if (id) router.push({ pathname: '/record/[id]', params: { id } });
  };

  return (
    <Screen
      footer={
        <View className="gap-2">
          <Button label="Send to engineer" icon={Send} disabled={!hash} onPress={send} />
          <Button
            label="Start another zone"
            icon={Plus}
            kind="secondary"
            onPress={() => {
              if (hash) actions.send(hash);
              router.dismissAll();
              router.push({ pathname: '/inspect/new', params: { kind: cur.kind } });
            }}
          />
        </View>
      }
    >
      <TopBar name={cur.name} sub={KIND_LABEL[cur.kind]} />
      <View className="flex-row items-center">
        <Title className="flex-1">Review record</Title>
        <Clipboard size={90} />
      </View>
      <T w="medium" className="mt-2 text-[18px]">
        {t.done} checks within limits · {corrected} correction{corrected === 1 ? '' : 's'} · {t.manual} manual reading{t.manual === 1 ? '' : 's'}
      </T>

      <Outline className="mt-6">
        <View className="bg-tile px-4 py-3">
          <T w="semibold" className="text-[14px] uppercase tracking-wider text-ink-2">
            Record {cur.id} · {when(cur.createdAt)}
          </T>
        </View>
        {cur.checks.map((c) => (
          <View key={c.id} className="flex-row items-center border-t border-line px-4 py-3.5">
            <View className="flex-1">
              <T w="semibold" className="text-[16px]">
                {c.label}
              </T>
              <T className="text-[14px] text-ink-2">
                {c.outcome === 'not_seen' || c.measured == null ? 'no reading' : `${c.measured}${c.band ? ` ± ${c.band}` : ''} ${c.unit}`} · drawing {c.drawing} {c.unit}
              </T>
            </View>
            <Chip outcome={c.outcome} small />
          </View>
        ))}
        <View className="border-t border-line px-4 py-3.5">
          <T className="text-[13px] text-ink-2">Inspector signature (SHA-256)</T>
          <T w="semibold" className="mt-0.5 text-[15px]">
            {hash ? short(hash) : 'Signing…'}
          </T>
        </View>
      </Outline>

      <H2 className="mt-7">What happens next</H2>
      <T className="mt-2 text-[16px] leading-[24px] text-ink-2">
        The engineer reviews this record and signs with their own key. Sariya reports measurements against the drawing. It does not certify the structure as safe.
      </T>
    </Screen>
  );
}
