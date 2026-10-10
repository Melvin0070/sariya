import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, FileInput, MessageSquareWarning, RotateCw, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { CoverageMap } from '@/components/coverage';
import { Evidence } from '@/components/evidence';
import { FindingRow } from '@/components/finding';
import { QR } from '@/components/qr';
import { Button, H2, Notice, Outline, Screen, SourceTag, T, Title, TopBar } from '@/components/ui';
import { shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { capturePack, packName, signoffQr } from '@/lib/pack';
import { evaluate, tallyLine } from '@/lib/rules';
import { checksFor, checkName, KIND_LABEL, TARGETS, type TargetId } from '@/lib/spec';
import { statusOf } from '@/lib/status';
import { actions, getState, useRecord, when } from '@/lib/store';

function Step({ done, warn, title, sub, last }: { done: boolean; warn?: boolean; title: string; sub: string; last?: boolean }) {
  const bg = warn ? 'bg-warn' : done ? 'bg-pass' : 'bg-pill';
  return (
    <View className="flex-row gap-4">
      <View className="items-center">
        <View className={`h-8 w-8 items-center justify-center rounded-full ${bg}`}>
          {warn ? <MessageSquareWarning size={16} color="#fff" /> : done ? <Check size={16} color="#fff" strokeWidth={3} /> : <Clock size={16} color="#5E5E5E" />}
        </View>
        {!last ? <View className={`w-0.5 flex-1 ${done ? 'bg-pass' : 'bg-line'}`} style={{ minHeight: 26 }} /> : null}
      </View>
      <View className="flex-1 pb-5">
        <T w="semibold" className="text-[17px]">
          {title}
        </T>
        <T className="mt-0.5 text-[15px] text-ink-2">{sub}</T>
      </View>
    </View>
  );
}

// The operator's view of a signed capture: what happened to it, the sign-off QR, and what to do next.
export default function Record() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const r = useRecord(key);
  const [err, setErr] = useState('');
  if (!r || !r.capture) return <Redirect href="/" />;

  const fs = evaluate(r);
  const locks = r.locks.filter((l) => !l.superseded);
  const req = r.request?.payload;
  const newer = r.revised ? getState().records.find((x) => x.id === r.id && x.rev === r.rev + 1) : undefined;

  const resend = async () => {
    setErr('');
    try {
      if (await shareFile(packName(r, 'capture'), await capturePack(r), 'Send capture pack with Office Kit')) actions.markSent(r.key);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const revise = (checks: string[]) => {
    const defs = checksFor(r.member, r.spec).filter((c) => checks.includes(c.id));
    const targets = [...new Set(defs.map((d) => d.target).filter(Boolean))] as TargetId[];
    if (!actions.newRevision(r.key, defs.map((d) => d.id), targets)) return;
    router.dismissAll();
    router.push('/inspect/summary');
  };

  return (
    <Screen
      footer={
        r.revised ? undefined : (
          <View className="gap-2">
            {req ? <Button label={`Start revision ${r.rev + 1} for the engineer`} icon={RotateCw} onPress={() => revise(req.checks)} /> : null}
            {!r.approval && !req ? <Button label={r.sentAt ? 'Send pack again' : 'Send with Office Kit…'} icon={Send} onPress={resend} /> : null}
            {!r.approval ? <Button label="Open the engineer’s file" icon={FileInput} kind="secondary" onPress={() => router.push('/received')} /> : null}
            {!req ? <Button label={`Scan again as revision ${r.rev + 1}`} kind="secondary" onPress={() => revise([])} /> : null}
          </View>
        )
      }
    >
      <TopBar name={`${r.name} · rev ${r.rev}`} sub={KIND_LABEL[r.member]} />
      <Title>Record</Title>
      <T className="mt-1 text-[16px] text-ink-2">{statusOf(r)}</T>
      <T className="mt-1 text-[15px] leading-[22px] text-ink-2">{tallyLine(fs)}</T>
      {err ? <Notice tone="fail" className="mt-4" title={err} /> : null}
      {newer ? <Notice className="mt-4" title={`Replaced by rev ${newer.rev}`}>This revision stays as history. Its signature and any approval apply only to it.</Notice> : null}

      <H2 className="mt-7">Two keys</H2>
      <View className="mt-4">
        <Step done title={`Captured and signed · ${r.capture.signer.name}`} sub={`${when(r.capture.at)} · key ${r.capture.signer.fp} · record ${short(r.capture.hash)}`} />
        <Step done={!!r.sentAt} title={r.sentAt ? 'Pack sent' : 'Pack not sent yet'} sub={r.sentAt ? `Confirmed sent ${when(r.sentAt)}` : 'Send it with Office Kit file transfer'} />
        <Step
          last
          done={!!r.approval}
          warn={!!req && !r.approval}
          title={r.approval ? `Approved · ${r.approval.payload.e}` : req ? `Another view requested · ${req.e}` : 'Engineer approval'}
          sub={r.approval ? `${when(r.approval.payload.t)} · fingerprint-confirmed on their phone · key ${r.approval.payload.f}` : req ? `${when(req.t)} · ${req.note || 'see the zones below'}` : 'Waiting. Open the approval file here when it comes back.'}
        />
      </View>

      {req && !r.approval ? (
        <Notice tone="warn" title="Scan these again">
          {req.checks.map((c) => checkName(checksFor(r.member, r.spec).find((d) => d.id === c)!)).join(', ') || 'Any zone the engineer named'}. This record stays as it is; the new scan becomes revision {r.rev + 1}.
        </Notice>
      ) : null}

      {r.approval ? (
        <View className="mt-2 items-center rounded-card border border-line p-5">
          <QR value={signoffQr(r.approval)} size={240} />
          <T w="bold" className="mt-4 text-[20px]">
            Sign-off QR
          </T>
          <T className="mt-1 text-center text-[15px] leading-[22px] text-ink-2">The owner or mason scans it to check offline that {r.approval.payload.e} approved this exact record. It is not a safety certificate.</T>
        </View>
      ) : null}

      <H2 className="mt-7">Locked evidence</H2>
      {locks.length ? (
        locks.map((l) => (
          <View key={l.id} className="mt-3">
            <Evidence lock={l} />
            {l.coverage ? (
              <View className="mt-2">
                <CoverageMap c={l.coverage} />
              </View>
            ) : null}
            <View className="mt-2 flex-row items-center gap-2">
              <T w="medium" className="text-[15px]">
                {TARGETS[r.member].find((t) => t.id === l.target)?.label} · {l.positions.length} bars ± {l.band} mm
              </T>
              <SourceTag source={l.source} />
            </View>
          </View>
        ))
      ) : (
        <T className="mt-2 text-[15px] text-ink-2">No camera locks in this revision.</T>
      )}

      <H2 className="mt-7">Checks</H2>
      <Outline className="mt-3">
        {fs.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={r.corrected[f.def.id]} />
        ))}
      </Outline>
      <T className="mt-4 text-[13px] leading-[19px] text-ink-3">Measurements against the drawing with error bands. Not a safety certificate or pour permit.</T>
    </Screen>
  );
}
