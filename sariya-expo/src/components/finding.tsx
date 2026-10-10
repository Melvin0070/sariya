import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Chip, Hairline, SourceTag, T, tap } from './ui';
import type { Finding } from '@/lib/rules';
import { checkName } from '@/lib/spec';

const READING_LABEL = { tape: 'Needs tape', scale: 'Needs weigh test', template: 'Needs template' };
// Pending and reading reasons only repeat what the chip says.
const EXPLAIN = new Set(['outside', 'rescan', 'not_seen']);

// One check: answer, value with its band and source, the limit and rule, and the reason when it cannot decide.
export function FindingRow({ f, first, corrected, onPress }: { f: Finding; first?: boolean; corrected?: number; onPress?: () => void }) {
  const label = f.outcome === 'tape' && f.def.reading ? READING_LABEL[f.def.reading] : undefined;
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        tap();
        onPress?.();
      }}
      className="flex-row items-center gap-3 px-4 py-4 active:bg-tile"
    >
      {first ? null : <Hairline />}
      <View className="flex-1">
        <View className="flex-row items-start gap-2">
          <T w="medium" className="flex-1 text-[16px] leading-[22px]">
            {checkName(f.def)}
          </T>
          <Chip outcome={f.outcome} label={label} small />
        </View>
        {f.value ? (
          <View className="mt-1 flex-row items-center gap-2">
            <T className="flex-shrink text-[15px] leading-[21px]">{f.value}</T>
            {f.source ? <SourceTag source={f.source} /> : null}
          </View>
        ) : null}
        {f.limit ? (
          <T className="mt-0.5 text-[13px] leading-[18px] text-ink-3">
            Limit {f.limit}
            {f.rule ? ` · ${f.rule}` : ''}
          </T>
        ) : null}
        {f.reason && EXPLAIN.has(f.outcome) ? (
          <T className="mt-1 text-[14px] leading-[20px] text-ink-2">
            {f.reason}
            {f.action ? `. ${f.action}` : ''}
          </T>
        ) : null}
        {corrected ? <T className="mt-1 text-[13px] text-ink-3">Re-checked after {corrected === 1 ? 'a fix' : `${corrected} fixes`}</T> : null}
      </View>
      {onPress ? <ChevronRight size={18} color="#BDBDBD" /> : null}
    </Pressable>
  );
}
