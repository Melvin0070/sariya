import { Check } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { ReduceMotion, ZoomIn } from 'react-native-reanimated';

import { CoverageMap } from '@/components/coverage';
import { Evidence } from '@/components/evidence';
import { QR } from '@/components/qr';
import { Chip, Details, Enter, Group, Illo, KV, Meter, Num, SHADOW, SourceTag, T, success, type IlloName } from '@/components/ui';
import { signoffQr } from '@/lib/pack';
import { tally, type Finding, type Outcome } from '@/lib/rules';
import { FIELDS, TARGETS } from '@/lib/spec';
import type { Inspection } from '@/lib/store';

// Shared by the operator's record, the sign screen and the engineer's review, so every phone shows the same record the same way.

const REST: { o: Outcome; n: (t: ReturnType<typeof tally>) => number; word: string }[] = [
  { o: 'outside', n: (t) => t.outside, word: 'outside limits' },
  { o: 'rescan', n: (t) => t.rescan, word: 're-scan' },
  { o: 'tape', n: (t) => t.tape, word: 'need a reading' },
  { o: 'not_seen', n: (t) => t.notSeen, word: 'not seen' },
  { o: 'measured', n: (t) => t.measured, word: 'measured, no drawing' },
  { o: 'pending', n: (t) => t.pending, word: 'not checked yet' },
];

// Title on the left, the member's illustration on the right: the identity of the record at a glance.
export function Head({ illo, children }: { illo: IlloName; children: ReactNode }) {
  return (
    <Enter className="flex-row items-center gap-3">
      <View className="flex-1">{children}</View>
      <Illo name={illo} size={96} />
    </Enter>
  );
}

// The big "N of M within limits" number, a bar, and one chip per other outcome that occurs.
export function Tally({ fs, i = 1 }: { fs: Finding[]; i?: number }) {
  const t = tally(fs);
  const rest = REST.filter((x) => x.n(t) > 0);
  return (
    <Enter i={i} className="mt-5 rounded-card bg-tile px-4 pb-4 pt-3">
      <View className="flex-row items-end">
        <Num className="text-[48px] leading-[54px] tracking-[-1px]">{t.within}</Num>
        <Num className="mb-[7px] ml-1 text-[20px] text-ink-3">/{t.total}</Num>
        <T w="medium" className="mb-[9px] ml-2 text-[15px] text-ink-2">
          within limits
        </T>
      </View>
      <Meter value={t.total ? t.within / t.total : 0} className="mt-2" />
      {rest.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {rest.map((x) => (
            <Chip key={x.o} outcome={x.o} small label={`${x.n(t)} ${x.word}`} />
          ))}
        </View>
      ) : null}
    </Enter>
  );
}

// The success moment: illustration with a green check that springs in, plus a success haptic.
export function SuccessMark({ illo = 'send' }: { illo?: IlloName }) {
  useEffect(() => {
    success();
  }, []);
  return (
    <View className="mt-4 h-[180px] w-[180px] self-center">
      <Illo name={illo} size={180} />
      <Animated.View entering={ZoomIn.springify().damping(12).stiffness(220).reduceMotion(ReduceMotion.System)} className="absolute bottom-0 right-0 h-16 w-16 items-center justify-center rounded-full border-4 border-paper bg-pass" style={SHADOW.float}>
        <Check size={32} color="#fff" strokeWidth={3.2} />
      </Animated.View>
    </View>
  );
}

// One frozen frame per camera lock; what the camera covered and the frame count are folded away for whoever audits.
export function EvidenceList({ r }: { r: Inspection }) {
  const locks = r.locks.filter((l) => !l.superseded);
  if (!locks.length) return <T className="mt-2 text-[15px] text-ink-2">No camera locks in this revision.</T>;
  return (
    <>
      {locks.map((l, i) => (
        <Enter key={l.id} i={i} className="mt-3">
          <Evidence lock={l} />
          <View className="mt-3 flex-row items-center gap-2">
            <T w="semibold" className="flex-shrink text-[16px]" numberOfLines={1}>
              {TARGETS[r.member].find((x) => x.id === l.target)?.label}
            </T>
            <SourceTag source={l.source} />
          </View>
          <T className="mt-0.5 text-[15px] text-ink-2">
            <Num w="semibold" className="text-[15px]">
              {l.positions.length}
            </Num>{' '}
            bars · ±{' '}
            <Num w="semibold" className="text-[15px]">
              {l.band}
            </Num>{' '}
            mm
          </T>
          {l.coverage ? (
            <Details label="What the camera covered">
              <CoverageMap c={l.coverage} />
              <T className="mt-2 text-[13px] text-ink-3">
                {l.frames} frame{l.frames > 1 ? 's' : ''} in this lock
              </T>
            </Details>
          ) : null}
        </Enter>
      ))}
    </>
  );
}

export function DrawingValues({ r }: { r: Inspection }) {
  return (
    <Enter>
      <Group className="mt-3">
        {r.spec?.noDrawing ? (
          <KV first k="Drawing" v="None: measure only" />
        ) : (
          FIELDS[r.member].map((f, i) => <KV key={f.id} first={i === 0} k={f.label} v={r.spec?.values[f.id] == null ? 'Not on drawing' : `${r.spec.values[f.id]} ${f.unit}`} />)
        )}
      </Group>
    </Enter>
  );
}

export function SignoffCard({ approval, title, sub }: { approval: NonNullable<Inspection['approval']>; title: string; sub: string }) {
  return (
    <Enter className="mt-5 items-center rounded-card bg-tile p-5">
      <View className="rounded-xl bg-paper p-2" style={SHADOW.card}>
        <QR value={signoffQr(approval)} size={220} />
      </View>
      <T w="bold" className="mt-4 text-[18px]">
        {title}
      </T>
      <T className="mt-1 text-center text-[14px] leading-[20px] text-ink-2">{sub}</T>
    </Enter>
  );
}

// The one trust footnote per record or sign screen.
export function Footnote() {
  return <T className="mt-6 text-[13px] text-ink-3">Measurements with error bands, not a safety certificate.</T>;
}
