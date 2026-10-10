import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Clipboard, MemberArt } from '@/components/art';
import { Button, Group, H2, Hairline, Screen, Sub, T, Title, tap } from '@/components/ui';
import { evaluate, tallyLine } from '@/lib/rules';
import { openRecord, statusOf } from '@/lib/status';
import { useStore, when, type Inspection } from '@/lib/store';

function Section({ title, items }: { title: string; items: Inspection[] }) {
  if (!items.length) return null;
  return (
    <>
      <H2 className="mt-8">{title}</H2>
      <Group className="mt-3">
        {items.map((r, idx) => (
          <Pressable key={r.key} onPress={() => (tap(), openRecord(r))} className="flex-row items-center gap-4 px-4 py-4 active:bg-tile">
            {idx ? <Hairline inset={88} /> : null}
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-tile">
              <MemberArt kind={r.member} size={48} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-baseline gap-2">
                <T w="medium" className="flex-shrink text-[17px]" numberOfLines={1}>
                  {r.name}
                </T>
                <T className="text-[13px] text-ink-3">
                  rev {r.rev} · {when(r.createdAt)}
                </T>
              </View>
              <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
                {statusOf(r)}
              </T>
              {r.spec && r.status !== 'draft' ? (
                <T className="mt-0.5 text-[13px] text-ink-3" numberOfLines={1}>
                  {tallyLine(evaluate(r))}
                </T>
              ) : null}
            </View>
          </Pressable>
        ))}
      </Group>
    </>
  );
}

// Every record on this phone, newest first. Signed revisions are never edited; replaced ones stay as history.
export default function Records() {
  const records = useStore((s) => s.records);
  const role = useStore((s) => s.role);
  const drafts = records.filter((r) => r.status === 'draft');
  const mine = records.filter((r) => r.status === 'signed' && r.origin === 'local');
  const received = records.filter((r) => r.origin === 'received');

  return (
    <Screen tabs>
      <Title className="mt-2">Records</Title>
      {records.length === 0 ? (
        <View className="mt-12 items-center">
          <Clipboard size={140} />
          <T w="semibold" className="text-[20px]">
            No records yet
          </T>
          <Sub className="text-center">{role === 'engineer' ? 'Packs you open appear here.' : 'Inspections you start appear here.'}</Sub>
          <View className="mt-6 w-full">
            <Button label={role === 'engineer' ? 'Open a received pack' : 'Start an inspection'} onPress={() => router.push(role === 'engineer' ? '/received' : '/')} />
          </View>
        </View>
      ) : null}
      <Section title="Drafts" items={drafts} />
      <Section title="Signed here" items={mine} />
      <Section title="Received" items={received} />
    </Screen>
  );
}
