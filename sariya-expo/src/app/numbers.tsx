import { useFocusEffect } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { Chip, Enter, Group, H2, Hairline, Notice, Num, Screen, SourceTag, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
import { shareCsv } from '@/lib/files';
import { timingStats } from '@/lib/measure';
import { useStore, when, type BenchRow, type LockSource } from '@/lib/store';

const pct = (sorted: number[], p: number) => sorted[Math.max(0, Math.ceil(p * sorted.length) - 1)];

function summary(rows: BenchRow[]) {
  const res = rows.map((r) => Math.abs(r.appMm - r.tapeMm)).sort((a, b) => a - b);
  const inBand = rows.filter((r) => Math.abs(r.appMm - r.tapeMm) <= r.band).length;
  return { n: rows.length, median: pct(res, 0.5), p95: pct(res, 0.95), inBand };
}

function csv(rows: BenchRow[]) {
  const head = 'id,at,record,family,gap,app_mm,band_mm,tape_mm,residual_mm,within_band,source,operator';
  const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [r.id, new Date(r.at).toISOString(), q(r.record), r.target, r.gap, r.appMm, r.band, r.tapeMm, r.appMm - r.tapeMm, Math.abs(r.appMm - r.tapeMm) <= r.band, r.source, q(r.by)].join(','));
  return [head, ...lines].join('\n');
}

// Table row: label (and an optional grey note) on the left, a tabular figure with a smaller grey unit on the right.
function Stat({ k, v, unit, note, first }: { k: string; v: string | number | null; unit?: string; note?: string; first?: boolean }) {
  return (
    <View className="min-h-[52px] flex-row items-center gap-4 px-4 py-3">
      {first ? null : <Hairline />}
      <View className="flex-1">
        <T className="text-[15px] text-ink-2">{k}</T>
        {note ? <T className="mt-0.5 text-[13px] text-ink-3">{note}</T> : null}
      </View>
      {v == null ? (
        <T className="text-[15px] text-ink-3">no data</T>
      ) : (
        <View className="flex-row items-baseline gap-1">
          <Num className="text-[17px]">{v}</Num>
          {unit ? <T className="text-[13px] text-ink-3">{unit}</T> : null}
        </View>
      )}
    </View>
  );
}

function Fig({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="min-w-[72px]">
      <T className="text-[12px] text-ink-3">{label}</T>
      {children}
    </View>
  );
}

// Every number is computed from samples stored on this phone. Missing data reads "no data", never zero error.
export default function Numbers() {
  const records = useStore((s) => s.records);
  const bench = useStore((s) => s.bench);
  const [err, setErr] = useState('');
  const stored = useStore((s) => s.timings);
  const [timings, setTimings] = useState(() => timingStats(stored));
  useFocusEffect(useCallback(() => setTimings(timingStats(stored)), [stored]));

  const locks = records.filter((r) => r.origin === 'local').flatMap((r) => r.locks);
  const bySource = (s: LockSource) => locks.filter((l) => l.source === s).length;
  const abstained = locks.filter((l) => l.gate).length;
  const signed = records.filter((r) => r.origin === 'local' && r.status === 'signed').length;
  const approvedHere = records.filter((r) => r.origin === 'received' && r.approval).length;
  const approvalsBack = records.filter((r) => r.origin === 'local' && r.approval).length;
  const simulatedLocks = bySource('simulated');

  const measured = bench.filter((r) => r.source !== 'simulated');
  const simulatedRows = bench.length - measured.length;
  const groups = (['auto', 'manual'] as LockSource[]).map((s) => ({ s, rows: measured.filter((r) => r.source === s) }));

  return (
    <Screen>
      <TopBar />
      <Title>Numbers</Title>
      <Sub>From what is stored on this phone. Bench, half-scale props.</Sub>

      <H2 className="mt-8">Model speed</H2>
      <T className="mt-1 text-[14px] text-ink-2">Per live frame, p50 / p95</T>
      <Enter>
        <Group className="mt-3">
          {timings.map((t, i) => (
            <Stat key={t.accel} first={i === 0} k={t.accel} note={t.n ? `${t.n} frames` : undefined} v={t.n ? `${t.p50} / ${t.p95}` : null} unit="ms" />
          ))}
        </Group>
      </Enter>

      <H2 className="mt-8">Error table</H2>
      <T className="mt-1 text-[14px] text-ink-2">Locked gap against a tape, centre to centre</T>
      {groups.map(({ s, rows }, gi) => {
        const m = rows.length ? summary(rows) : null;
        return (
          <Enter key={s} i={gi + 1} className="mt-4">
            <View className="flex-row items-center gap-2">
              <SourceTag source={s} />
              <T className="text-[14px] text-ink-2">{m ? `${m.n} tape check${m.n > 1 ? 's' : ''}` : 'no data'}</T>
            </View>
            {m ? (
              <Group className="mt-3">
                <Stat first k="Median |app − tape|" v={m.median} unit="mm" />
                <Stat k="95th percentile" note={m.n < 20 ? `${m.n} rows` : undefined} v={m.p95} unit="mm" />
                <Stat k="Tape inside the band" v={m.inBand} unit={`of ${m.n}`} />
              </Group>
            ) : null}
          </Enter>
        );
      })}
      {simulatedRows ? (
        <View className="mt-3 flex-row items-center gap-2">
          <SourceTag source="simulated" />
          <T className="text-[14px] text-ink-2">
            {simulatedRows} row{simulatedRows > 1 ? 's' : ''} excluded
          </T>
        </View>
      ) : null}

      {bench.length ? (
        <Group className="mt-4">
          {bench.slice(0, 20).map((r, i) => {
            const d = r.appMm - r.tapeMm;
            const inside = Math.abs(d) <= r.band;
            return (
              <Enter key={r.id} i={i}>
                <View className="px-4 py-3">
                  {i ? <Hairline /> : null}
                  <View className="flex-row items-center gap-2">
                    <T w="semibold" className="flex-1 text-[15px]" numberOfLines={1}>
                      {r.record} · {r.target} gap {r.gap}
                    </T>
                    <SourceTag source={r.source} />
                  </View>
                  <View className="mt-2 flex-row items-end gap-3">
                    <Fig label="App">
                      <Num className="text-[15px]">
                        {r.appMm} <T className="text-[13px] text-ink-3">± {r.band}</T>
                      </Num>
                    </Fig>
                    <Fig label="Tape">
                      <Num className="text-[15px]">{r.tapeMm}</Num>
                    </Fig>
                    <Fig label="Diff, mm">
                      <Num className="text-[15px]">
                        {d >= 0 ? '+' : ''}
                        {d}
                      </Num>
                    </Fig>
                    <View className="flex-1 items-end">
                      <Chip small outcome={inside ? 'within' : 'outside'} label={inside ? 'Inside band' : 'Outside band'} />
                    </View>
                  </View>
                  <T className="mt-1.5 text-[12px] text-ink-3">{when(r.at)}</T>
                </View>
              </Enter>
            );
          })}
        </Group>
      ) : null}
      {bench.length ? (
        <TextBtn label="Export CSV" onPress={() => shareCsv(`sariya-error-table-${Date.now()}.csv`, csv(bench)).catch((e: Error) => setErr(e.message))} />
      ) : null}
      {err ? <Notice tone="fail" className="mt-3" title={err} /> : null}

      <H2 className="mt-8">Scans</H2>
      <Group className="mt-3">
        <Stat first k="Locks · automatic" v={bySource('auto')} />
        <Stat k="Locks · by hand" v={bySource('manual')} />
        {simulatedLocks ? <Stat k="Locks · simulated" v={simulatedLocks} /> : null}
        <Stat k="Abstained (re-scan)" v={locks.length ? abstained : null} unit={`of ${locks.length}`} />
        <Stat k="Captures signed" v={signed} />
        <Stat k="Approvals received" v={approvalsBack} />
        <Stat k="Approvals given" v={approvedHere} />
      </Group>
    </Screen>
  );
}
