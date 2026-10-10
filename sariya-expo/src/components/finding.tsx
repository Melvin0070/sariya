import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { C, Chip, Hairline, Num, Press, SourceTag, T } from './ui';
import type { Finding } from '@/lib/rules';
import { checkName } from '@/lib/spec';

const READING_LABEL = { tape: 'Needs tape', scale: 'Needs weigh test', template: 'Needs template' };
// Pending and reading reasons only repeat what the chip says.
const EXPLAIN = new Set(['outside', 'rescan', 'not_seen']);

// One check: answer, value with its band and source, the limit and rule, and the reason when it cannot decide.
export function FindingRow({ f, first, corrected, onPress }: { f: Finding; first?: boolean; corrected?: number; onPress?: () => void }) {
  const label = f.outcome === 'tape' && f.def.reading ? READING_LABEL[f.def.reading] : undefined;
  const explain = f.reason && EXPLAIN.has(f.outcome);
  return (
    <Press disabled={!onPress} onPress={onPress} scale={0.985} accessibilityRole={onPress ? 'button' : undefined} className="min-h-[64px] flex-row items-center gap-3 bg-paper px-4 py-3.5">
      {first ? null : <Hairline />}
      <View className="flex-1">
        <View className="flex-row items-start gap-2">
          <T w="semibold" className="flex-1 text-[16px] leading-[22px]">
            {checkName(f.def)}
          </T>
          <Chip outcome={f.outcome} label={label} small />
        </View>
        {f.value ? (
          <View className="mt-1.5 flex-row items-center gap-2">
            <Num w="semibold" className="flex-shrink text-[15px] leading-[21px]">
              {f.value}
            </Num>
            {f.source ? <SourceTag source={f.source} /> : null}
          </View>
        ) : null}
        {explain ? (
          <T className="mt-1 text-[14px] leading-[20px] text-ink-2">
            {f.reason}
            {f.action ? `. ${f.action}` : ''}
          </T>
        ) : null}
        {f.limit ? (
          <Num w="regular" className="mt-1 text-[13px] leading-[18px] text-ink-3">
            Limit {f.limit}
            {f.rule ? ` · ${f.rule}` : ''}
          </Num>
        ) : null}
        {corrected ? <T className="mt-1 text-[13px] text-ink-3">Re-checked after {corrected === 1 ? 'a fix' : `${corrected} fixes`}</T> : null}
      </View>
      {onPress ? <ChevronRight size={18} color={C.ink4} /> : null}
    </Press>
  );
}
