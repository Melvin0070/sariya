import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Button, C, Enter, Group, H2, Hairline, Illo, Press, Screen, Sub, T, Title } from '@/components/ui';
import { evaluate, tallyLine } from '@/lib/rules';
import { openRecord, statusOf } from '@/lib/status';
import { useStore, when, type Inspection } from '@/lib/store';

function RecordRow({ r, first }: { r: Inspection; first: boolean }) {
  return (
    <Press onPress={() => openRecord(r)} scale={0.985} accessibilityRole="button" className="flex-row items-center gap-4 bg-paper px-4 py-3.5">
      {first ? null : <Hairline inset={88} />}
      <View className="h-14 w-14 items-center justify-center rounded-xl bg-tile">
        <Illo name={r.member} size={52} />
      </View>
      <View className="flex-1">
        <T w="semibold" className="text-[16px] leading-[22px]" numberOfLines={1}>
          {r.name}
        </T>
        <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2" numberOfLines={1}>
          {statusOf(r)}
        </T>
        {r.spec && r.status !== 'draft' ? (
          <T className="mt-0.5 text-[13px] leading-[18px] text-ink-3" numberOfLines={1}>
            {tallyLine(evaluate(r))}
          </T>
        ) : null}
        <T className="mt-0.5 text-[13px] leading-[18px] text-ink-3" numberOfLines={1}>
          rev {r.rev} · {when(r.createdAt)}
        </T>
      </View>
      <ChevronRight size={20} color={C.ink4} />
    </Press>
  );
}

function Section({ title, items, start }: { title: string; items: Inspection[]; start: number }) {
  if (!items.length) return null;
  return (
    <>
      <H2 className="mt-8">{title}</H2>
      <Group className="mt-3">
        {items.map((r, idx) => (
          <Enter key={r.key} i={start + idx}>
            <RecordRow r={r} first={idx === 0} />
          </Enter>
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
  const engineer = role === 'engineer';

  return (
    <Screen tabs>
      <Title className="mt-2">Records</Title>
      {records.length === 0 ? (
        <Enter>
          <View className="mt-10 items-center">
            <Illo name="records" size={180} />
            <T w="bold" className="mt-2 text-[20px] leading-[26px]">
              No records yet
            </T>
            <Sub className="text-center">{engineer ? 'Packs you open appear here.' : 'Inspections you start appear here.'}</Sub>
            <View className="mt-6 w-full">
              <Button label={engineer ? 'Open a received pack' : 'Start an inspection'} onPress={() => router.push(engineer ? '/received' : '/')} />
            </View>
          </View>
        </Enter>
      ) : null}
      <Section title="Drafts" items={drafts} start={0} />
      <Section title="Signed here" items={mine} start={drafts.length} />
      <Section title="Received" items={received} start={drafts.length + mine.length} />
    </Screen>
  );
}
