import { View } from 'react-native';

import { CoverageMap } from '@/components/coverage';
import { Evidence } from '@/components/evidence';
import { QR } from '@/components/qr';
import { Group, KV, SourceTag, T } from '@/components/ui';
import { signoffQr } from '@/lib/pack';
import { FIELDS, TARGETS } from '@/lib/spec';
import type { Inspection } from '@/lib/store';

// Shared by the operator's record and the engineer's review, so both phones show the same evidence the same way.

export function EvidenceList({ r }: { r: Inspection }) {
  const locks = r.locks.filter((l) => !l.superseded);
  if (!locks.length) return <T className="mt-2 text-[15px] text-ink-2">No camera locks in this revision.</T>;
  return (
    <>
      {locks.map((l) => (
        <View key={l.id} className="mt-3">
          <Evidence lock={l} />
          {l.coverage ? (
            <View className="mt-2">
              <CoverageMap c={l.coverage} />
            </View>
          ) : null}
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <T w="medium" className="text-[14px]">
              {TARGETS[r.member].find((x) => x.id === l.target)?.label} · {l.positions.length} bars ± {l.band} mm · {l.frames} frame
              {l.frames > 1 ? 's' : ''}
            </T>
            <SourceTag source={l.source} />
          </View>
        </View>
      ))}
    </>
  );
}

export function DrawingValues({ r }: { r: Inspection }) {
  return (
    <Group className="mt-3">
      {r.spec?.noDrawing ? (
        <KV first k="Drawing" v="None: measure only" />
      ) : (
        FIELDS[r.member].map((f, i) => <KV key={f.id} first={i === 0} k={f.label} v={r.spec?.values[f.id] == null ? 'Not on drawing' : `${r.spec.values[f.id]} ${f.unit}`} />)
      )}
    </Group>
  );
}

export function SignoffCard({ approval, title, sub }: { approval: NonNullable<Inspection['approval']>; title: string; sub: string }) {
  return (
    <View className="mt-4 items-center rounded-card bg-tile p-5">
      <View className="rounded-xl bg-paper p-2">
        <QR value={signoffQr(approval)} size={220} />
      </View>
      <T w="bold" className="mt-4 text-[18px]">
        {title}
      </T>
      <T className="mt-1 text-center text-[14px] leading-[20px] text-ink-2">{sub}</T>
    </View>
  );
}
