import { ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

import { C, Chip, Enter, Group, H2, Hairline, Num, OUTCOME, T } from './ui';
import { brief, fixDelta, type Delta } from '@/lib/rules';
import { checkName } from '@/lib/spec';
import { useStore, type Inspection } from '@/lib/store';

const said = (f: Delta['was']) => brief(f) ?? OUTCOME[f.outcome].label;

function DeltaRow({ d, first }: { d: Delta; first: boolean }) {
  const closed = d.now.outcome === 'within';
  const still = d.now.outcome === 'outside';
  let label: string | undefined;
  if (closed) label = 'Closed';
  else if (still) label = 'Still outside';
  return (
    <View className="bg-paper px-4 py-3.5">
      {first ? null : <Hairline />}
      <View className="flex-row items-start gap-2">
        <T w="semibold" className="flex-1 text-[16px] leading-[22px]">
          {checkName(d.def)}
        </T>
        <Chip outcome={d.now.outcome} small label={label} />
      </View>
      <View className="mt-1.5 flex-row flex-wrap items-center gap-x-2">
        <Num className="text-[15px] leading-[21px] text-ink-3 line-through">{said(d.was)}</Num>
        <ArrowRight size={14} color={C.ink3} />
        <Num w="semibold" className="text-[15px] leading-[21px]">
          {said(d.now)}
        </Num>
      </View>
    </View>
  );
}

// The fix loop on a re-scan: what the parent revision showed, what this one shows, and whether each item closed.
export function FixLoop({ r }: { r: Inspection }) {
  const parent = useStore((s) => (r.parent ? s.records.find((x) => x.capture?.hash === r.parent) : undefined));
  if (!parent) return null;
  const ds = fixDelta(parent, r);
  if (!ds.length) return null;
  const closed = ds.filter((d) => d.now.outcome === 'within').length;
  const note = parent.request?.payload.note;
  return (
    <Enter i={2}>
      <H2 className="mt-8">{`Fix loop · rev ${parent.rev} → ${r.rev}`}</H2>
      <T className="mt-1 text-[15px] leading-[21px] text-ink-2">
        {`${closed} of ${ds.length} closed`}
        {note ? ` · asked: ${note}` : ''}
      </T>
      <Group className="mt-3">
        {ds.map((d, i) => (
          <DeltaRow key={d.def.id} d={d} first={i === 0} />
        ))}
      </Group>
    </Enter>
  );
}
