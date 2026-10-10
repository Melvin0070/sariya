import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Clipboard, MemberArt } from '@/components/art';
import { H2, Outline, Screen, T, Title, tap } from '@/components/ui';
import { evaluate, tallyLine } from '@/lib/rules';
import { KIND_LABEL } from '@/lib/spec';
import { openRecord, statusOf } from '@/lib/status';
import { useStore, when, type Inspection } from '@/lib/store';

function Group({ title, items }: { title: string; items: Inspection[] }) {
  if (!items.length) return null;
  return (
    <>
      <H2 className="mt-8">{title}</H2>
      <Outline className="mt-3">
        {items.map((r, idx) => (
          <Pressable key={r.key} onPress={() => (tap(), openRecord(r))} className={`flex-row items-start gap-3 px-4 py-4 active:bg-tile ${idx ? 'border-t border-line' : ''}`}>
            <View className="h-[64px] w-[64px] items-center justify-center rounded-xl bg-tile">
              <MemberArt kind={r.member} size={58} />
            </View>
            <View className="flex-1">
              <T w="semibold" className="text-[16px]" numberOfLines={1}>
                {r.name} · rev {r.rev}
              </T>
              <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
                {KIND_LABEL[r.member]} · {when(r.createdAt)}
              </T>
              <T w="medium" className="mt-1 text-[14px]" numberOfLines={1}>
                {statusOf(r)}
              </T>
              {r.spec ? (
                <T className="mt-0.5 text-[13px] text-ink-2" numberOfLines={2}>
                  {tallyLine(evaluate(r))}
                </T>
              ) : null}
            </View>
          </Pressable>
        ))}
      </Outline>
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
      <Title>Records</Title>
      {records.length === 0 ? (
        <Pressable onPress={() => router.push(role === 'engineer' ? '/received' : '/inspect/new')} className="mt-6 flex-row items-center rounded-card border border-line p-5 active:bg-tile">
          <View className="flex-1">
            <T w="bold" className="text-[22px] tracking-[-0.4px]">
              Nothing yet
            </T>
            <View className="mt-1 flex-row items-center gap-1">
              <T className="text-[17px] text-ink-2">{role === 'engineer' ? 'Open a received pack' : 'Start an inspection'}</T>
              <ArrowRight size={18} color="#5E5E5E" />
            </View>
          </View>
          <Clipboard size={90} />
        </Pressable>
      ) : null}
      <Group title="Drafts" items={drafts} />
      <Group title="Signed on this phone" items={mine} />
      <Group title="Received for review" items={received} />
    </Screen>
  );
}
