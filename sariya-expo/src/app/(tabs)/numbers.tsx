import { Download } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Button, H2, Notice, Outline, Screen, SourceTag, T, Title } from '@/components/ui';
import { shareCsv } from '@/lib/files';
import { timingStats } from '@/lib/measure';
import { useStore, when, type BenchRow, type LockSource } from '@/lib/store';

function Stat({ k, v, first }: { k: string; v: string; first?: boolean }) {
  return (
    <View className={`flex-row items-center px-4 py-3.5 ${first ? '' : 'border-t border-line'}`}>
      <T className="flex-1 text-[15px] text-ink-2">{k}</T>
      <T w="semibold" className="text-[17px]">
        {v}
      </T>
    </View>
  );
}

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

  const measured = bench.filter((r) => r.source !== 'simulated');
  const simulatedRows = bench.length - measured.length;
  const groups = (['auto', 'manual'] as LockSource[]).map((s) => ({ s, rows: measured.filter((r) => r.source === s) }));

  return (
    <Screen tabs>
      <Title>Numbers</Title>
      <T className="mt-2 text-[16px] leading-[23px] text-ink-2">Computed from what is stored on this phone. Bench, half-scale props.</T>

      <H2 className="mt-7">Scans</H2>
      <Outline className="mt-3">
        <Stat first k="Locks · automatic" v={String(bySource('auto'))} />
        <Stat k="Locks · marked by hand" v={String(bySource('manual'))} />
        <Stat k="Locks · simulated" v={String(bySource('simulated'))} />
        <Stat k="Abstained (re-scan at lock)" v={locks.length ? `${abstained} of ${locks.length}` : 'no data'} />
        <Stat k="Captures signed here" v={String(signed)} />
        <Stat k="Approvals returned to here" v={String(approvalsBack)} />
        <Stat k="Approvals signed here" v={String(approvedHere)} />
      </Outline>

      <H2 className="mt-8">Error table</H2>
      <T className="mt-1 text-[14px] leading-[20px] text-ink-2">Locked gap against a tape, centre to centre. Add rows from the Lock sheet.</T>
      {groups.map(({ s, rows }) => {
        const m = rows.length ? summary(rows) : null;
        return (
          <View key={s} className="mt-3">
            <View className="mb-2 flex-row items-center gap-2">
              <SourceTag source={s} />
              <T className="text-[14px] text-ink-2">{m ? `${m.n} tape check${m.n > 1 ? 's' : ''}` : 'no data'}</T>
            </View>
            {m ? (
              <Outline>
                <Stat first k="Median |app − tape|" v={`${m.median} mm`} />
                <Stat k="95th percentile |app − tape|" v={`${m.p95} mm${m.n < 20 ? ` (only ${m.n} rows)` : ''}`} />
                <Stat k="Tape inside the band" v={`${m.inBand} of ${m.n}`} />
              </Outline>
            ) : null}
          </View>
        );
      })}
      {simulatedRows ? <Notice tone="warn" className="mt-3" title={`${simulatedRows} simulated row${simulatedRows > 1 ? 's' : ''} excluded from accuracy`} /> : null}

      {bench.length ? (
        <Outline className="mt-4">
          {bench.slice(0, 20).map((r, i) => (
            <View key={r.id} className={`px-4 py-3 ${i ? 'border-t border-line' : ''}`}>
              <View className="flex-row items-center gap-2">
                <T w="semibold" className="flex-1 text-[15px]" numberOfLines={1}>
                  {r.record} · {r.target} gap {r.gap}
                </T>
                <SourceTag source={r.source} />
              </View>
              <T className="mt-0.5 text-[14px] text-ink-2">
                app {r.appMm} ± {r.band} · tape {r.tapeMm} · residual {r.appMm - r.tapeMm >= 0 ? '+' : ''}
                {r.appMm - r.tapeMm} mm · {Math.abs(r.appMm - r.tapeMm) <= r.band ? 'inside band' : 'outside band'} · {when(r.at)}
              </T>
            </View>
          ))}
        </Outline>
      ) : null}
      {bench.length ? (
        <View className="mt-3">
          <Button
            label="Export CSV"
            icon={Download}
            kind="secondary"
            onPress={() => shareCsv(`sariya-error-table-${Date.now()}.csv`, csv(bench)).catch((e: Error) => setErr(e.message))}
          />
        </View>
      ) : null}
      {err ? <Notice tone="fail" className="mt-3" title={err} /> : null}

      <H2 className="mt-8">Timings</H2>
      <T className="mt-1 text-[14px] leading-[20px] text-ink-2">Model inference per live frame, measured on this phone across scans. Excludes camera, card and bar geometry.</T>
      <Outline className="mt-3">
        {timings.map((t, i) => (
          <Stat key={t.accel} first={i === 0} k={`${t.accel} p50 / p95`} v={t.n ? `${t.p50} / ${t.p95} ms · ${t.n} frames` : 'no data'} />
        ))}
      </Outline>
    </Screen>
  );
}
