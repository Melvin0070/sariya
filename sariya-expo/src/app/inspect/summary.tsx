import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, Chip, H2, Outline, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { CAMERA_KINDS, tally, useStore, KIND_LABEL } from '@/lib/store';

export default function Summary() {
  const cur = useStore((s) => s.current);
  if (!cur) return null;
  const t = tally(cur.checks);
  const open = t.pending + t.rescan;
  const unfixed = cur.checks.filter((c) => c.outcome === 'outside' && !c.fixed).length;

  return (
    <Screen
      footer={
        <View className="gap-2">
          <Button label="Review and sign" disabled={open > 0} onPress={() => router.push('/inspect/sign')} />
          {open > 0 ? <Button label={`Scan ${open} remaining`} kind="secondary" onPress={() => router.push('/inspect/scan')} /> : null}
        </View>
      }
    >
      <TopBar name={cur.name} sub={KIND_LABEL[cur.kind]} />
      <View className="flex-row items-center">
        <Title className="flex-1">Summary</Title>
        <MemberArt kind={cur.kind} size={90} />
      </View>
      <T className="mt-1 text-[17px] text-ink-2">
        {t.done} within limits · {t.outside} outside · {t.manual} manual · {open} to scan
      </T>
      {unfixed ? (
        <View className="mt-4 rounded-card bg-fail-soft p-4">
          <T w="semibold" className="text-[16px] text-fail">
            {unfixed} zone{unfixed > 1 ? 's' : ''} still outside limits. Fix and re-scan before the pour.
          </T>
        </View>
      ) : null}

      <H2 className="mt-7">Checks</H2>
      <Outline className="mt-3">
        {cur.checks.map((c, idx) => (
          <Pressable
            key={c.id}
            onPress={() => {
              tap();
              if (c.outcome === 'outside' && !c.fixed) router.push({ pathname: '/inspect/fix', params: { id: c.id } });
              else if (c.outcome === 'pending' || c.outcome === 'rescan') router.push('/inspect/scan');
            }}
            className={`flex-row items-center gap-3 px-4 py-4 active:bg-tile ${idx ? 'border-t border-line' : ''}`}
          >
            <View className="flex-1">
              <T w="semibold" className="text-[17px]">
                {c.label}
              </T>
              <T className="mt-0.5 text-[14px] text-ink-2">
                {CAMERA_KINDS.includes(c.kind) ? 'Camera' : 'Tape'}
                {c.measured != null && c.outcome !== 'not_seen' ? ` · ${c.measured}${c.band ? ` ± ${c.band}` : ''} ${c.unit}` : ''}
                {c.fixed ? ' · corrected' : ''}
              </T>
              <View className="mt-2">
                <Chip outcome={c.outcome} small />
              </View>
            </View>
            <ChevronRight size={20} color="#8A8A8A" />
          </Pressable>
        ))}
      </Outline>
    </Screen>
  );
}
