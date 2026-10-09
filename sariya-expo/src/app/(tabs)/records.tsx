import { router } from 'expo-router';
import { ArrowRight, ChevronRight, Eye, RotateCw, SlidersHorizontal } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Clipboard, MemberArt } from '@/components/art';
import { Chip, H2, Outline, Pill, Screen, T, Title, tap } from '@/components/ui';
import { KIND_LABEL, tally, useStore, when, type Inspection } from '@/lib/store';

function worst(r: Inspection) {
  const t = tally(r.checks);
  if (t.outside && r.checks.some((c) => c.outcome === 'outside' && !c.fixed)) return 'outside' as const;
  if (t.rescan) return 'rescan' as const;
  if (t.manual) return 'manual' as const;
  if (t.pending) return 'pending' as const;
  return 'within' as const;
}

function summaryLine(r: Inspection) {
  const t = tally(r.checks);
  const bits = [`${t.done} within limits`];
  if (t.outside) bits.push(`${t.outside} correction${t.outside > 1 ? 's' : ''}`);
  if (t.manual) bits.push(`${t.manual} manual`);
  return bits.join(' · ');
}

const open = (id: string) => {
  tap();
  router.push({ pathname: '/record/[id]', params: { id } });
};

export default function Records() {
  const records = useStore((s) => s.records);
  const waiting = records.filter((r) => r.status !== 'signed');
  const signed = records.filter((r) => r.status === 'signed');
  const [hero, ...rest] = signed;

  return (
    <Screen tabs>
      <Title>Records</Title>

      <H2 className="mt-7">Waiting for sign-off</H2>
      {waiting.length === 0 ? (
        <Pressable onPress={() => router.push('/inspect/new')} className="mt-3 flex-row items-center rounded-card border border-line p-5 active:bg-tile">
          <View className="flex-1">
            <T w="bold" className="text-[22px] tracking-[-0.4px]">
              Nothing waiting
            </T>
            <View className="mt-1 flex-row items-center gap-1">
              <T className="text-[17px] text-ink-2">Start an inspection</T>
              <ArrowRight size={18} color="#5E5E5E" />
            </View>
          </View>
          <Clipboard size={90} />
        </Pressable>
      ) : (
        <Outline className="mt-3">
          {waiting.map((r, idx) => (
            <Pressable key={r.id} onPress={() => open(r.id)} className={`flex-row items-start gap-3 px-4 py-4 active:bg-tile ${idx ? 'border-t border-line' : ''}`}>
              <View className="h-[76px] w-[76px] items-center justify-center rounded-xl bg-tile">
                <MemberArt kind={r.kind} size={70} />
              </View>
              <View className="flex-1">
                <T w="semibold" className="text-[16px]" numberOfLines={1}>
                  {r.name}
                </T>
                <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
                  {r.status === 'draft' ? 'Draft' : 'Sent'} · {when(r.createdAt)}
                </T>
                <View className="mt-2">
                  <Chip outcome={worst(r)} small />
                </View>
              </View>
              <ChevronRight size={20} color="#8A8A8A" style={{ marginTop: 6 }} />
            </Pressable>
          ))}
        </Outline>
      )}

      <H2
        className="mt-9"
        right={
          <Pressable onPress={tap} className="h-12 w-12 items-center justify-center rounded-full bg-pill">
            <SlidersHorizontal size={20} color="#000" />
          </Pressable>
        }
      >
        Signed
      </H2>

      {hero ? (
        <View className="mt-3 rounded-card border border-line p-4">
          <Pressable onPress={() => open(hero.id)} className="h-[150px] items-center justify-center rounded-xl bg-tile">
            <MemberArt kind={hero.kind} size={170} />
            <View className="absolute left-3 top-3">
              <Chip outcome={worst(hero)} small />
            </View>
          </Pressable>
          <T w="semibold" className="mt-3 text-[19px]" numberOfLines={1}>
            {hero.name}
          </T>
          <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
            {when(hero.createdAt)} · {KIND_LABEL[hero.kind]} · {hero.engineer}
          </T>
          <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
            {summaryLine(hero)}
          </T>
          <View className="mt-3 flex-row gap-2">
            <Pill icon={Eye} label="Review" onPress={() => open(hero.id)} />
          </View>
        </View>
      ) : null}

      {rest.map((r) => {
        return (
          <Pressable key={r.id} onPress={() => open(r.id)} className="mt-5 flex-row items-center gap-3 active:opacity-70">
            <View className="h-16 w-16 items-center justify-center rounded-xl bg-tile">
              <MemberArt kind={r.kind} size={58} />
            </View>
            <View className="flex-1">
              <T w="semibold" className="text-[16px]" numberOfLines={1}>
                {r.name}
              </T>
              <T className="mt-0.5 text-[14px] text-ink-2" numberOfLines={1}>
                {when(r.createdAt)} · {summaryLine(r)}
              </T>
            </View>
            <Pressable
              onPress={() => {
                tap();
                router.push({ pathname: '/inspect/new', params: { kind: r.kind } });
              }}
              className="h-11 w-11 items-center justify-center rounded-full bg-tile active:opacity-70"
              hitSlop={6}
            >
              <RotateCw size={18} color="#000" />
            </Pressable>
          </Pressable>
        );
      })}
    </Screen>
  );
}
