import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Chip, SourceTag, T, tap } from './ui';
import type { Finding } from '@/lib/rules';
import { checkName } from '@/lib/spec';

const READING_LABEL = { tape: 'Needs a tape reading', scale: 'Needs a weigh test', template: 'Needs the hook template' };

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
      className={`flex-row items-center gap-3 px-4 py-4 active:bg-tile ${first ? '' : 'border-t border-line'}`}
    >
      <View className="flex-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <T w="semibold" className="text-[17px]">
            {checkName(f.def)}
          </T>
          {f.source ? <SourceTag source={f.source} /> : null}
        </View>
        {f.value ? <T className="mt-1 text-[15px] leading-[21px]">{f.value}</T> : null}
        {f.limit ? (
          <T className="mt-0.5 text-[13px] leading-[19px] text-ink-2">
            Limit {f.limit}
            {f.rule ? ` · ${f.rule}` : ''}
          </T>
        ) : null}
        {f.reason && f.outcome !== 'within' ? (
          <T className="mt-1 text-[14px] leading-[20px] text-ink-2">
            {f.reason}
            {f.action ? `. ${f.action}` : ''}
          </T>
        ) : null}
        {corrected ? <T className="mt-1 text-[13px] text-ink-2">Re-checked after {corrected === 1 ? 'a fix' : `${corrected} fixes`}{f.def.target ? '; the earlier lock stays in the record' : ''}</T> : null}
        <View className="mt-2">
          <Chip outcome={f.outcome} label={label} small />
        </View>
      </View>
      {onPress ? <ChevronRight size={20} color="#8A8A8A" /> : null}
    </Pressable>
  );
}
