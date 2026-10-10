import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, FileInput, MessageSquareWarning, RotateCw, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { CoverageMap } from '@/components/coverage';
import { Evidence } from '@/components/evidence';
import { FindingRow } from '@/components/finding';
import { QR } from '@/components/qr';
import { Button, Group, H2, Notice, Screen, SourceTag, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
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
        <T w="semibold" className="text-[16px]">
          {title}
        </T>
        <T className="mt-0.5 text-[14px] leading-[20px] text-ink-2">{sub}</T>
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
        r.revised || r.approval ? undefined : req ? (
          <Button label={`Scan again as rev ${r.rev + 1}`} icon={RotateCw} onPress={() => revise(req.checks)} />
        ) : r.sentAt ? (
          <>
            <Button label="Open the engineer’s reply" icon={FileInput} onPress={() => router.push('/received')} />
            <TextBtn label="Send again" onPress={resend} />
          </>
        ) : (
          <>
            <Button label="Send with Office Kit" icon={Send} onPress={resend} />
            <TextBtn label="Open the engineer’s reply" onPress={() => router.push('/received')} />
          </>
        )
      }
    >
      <TopBar name={`Rev ${r.rev}`} sub={KIND_LABEL[r.member]} />
      <Title>{r.name}</Title>
      <Sub>{statusOf(r)}</Sub>
      <T className="mt-1 text-[14px] text-ink-3">{tallyLine(fs)}</T>
      {err ? <Notice tone="fail" className="mt-4" title={err} /> : null}
      {newer ? <Notice className="mt-4" title={`Replaced by rev ${newer.rev}`}>This revision stays as history. Its signature and any approval apply only to it.</Notice> : null}

      <View className="mt-7">
        <Step done title={`Captured and signed · ${r.capture.signer.name}`} sub={`${when(r.capture.at)} · key ${r.capture.signer.fp} · record ${short(r.capture.hash)}`} />
        <Step done={!!r.sentAt} title={r.sentAt ? 'Pack sent' : 'Pack not sent yet'} sub={r.sentAt ? `Confirmed sent ${when(r.sentAt)}` : 'Send it with Office Kit file transfer'} />
        <Step
          last
          done={!!r.approval}
          warn={!!req && !r.approval}
          title={r.approval ? `Approved · ${r.approval.payload.e}` : req ? `Another view requested · ${req.e}` : 'Engineer approval'}
          sub={r.approval ? `${when(r.approval.payload.t)} · fingerprint on their phone · key ${r.approval.payload.f}` : req ? `${when(req.t)} · ${req.note || 'see below'}` : 'Waiting for their reply'}
        />
      </View>

      {req && !r.approval ? (
        <Notice tone="warn" title="Scan these again">
          {req.checks.map((c) => checkName(checksFor(r.member, r.spec).find((d) => d.id === c)!)).join(', ') || 'Any zone the engineer named'}
        </Notice>
      ) : null}

      {r.approval ? (
        <View className="mt-2 items-center rounded-card bg-tile p-5">
          <View className="rounded-xl bg-paper p-2">
            <QR value={signoffQr(r.approval)} size={220} />
          </View>
          <T w="bold" className="mt-4 text-[18px]">
            Sign-off QR
          </T>
          <T className="mt-1 text-center text-[14px] leading-[20px] text-ink-2">Proves offline that {r.approval.payload.e} approved this exact record. Not a safety certificate.</T>
        </View>
      ) : null}

      <H2 className="mt-8">Evidence</H2>
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
              <T w="medium" className="text-[14px]">
                {TARGETS[r.member].find((t) => t.id === l.target)?.label} · {l.positions.length} bars ± {l.band} mm
              </T>
              <SourceTag source={l.source} />
            </View>
          </View>
        ))
      ) : (
        <T className="mt-2 text-[15px] text-ink-2">No camera locks in this revision.</T>
      )}

      <H2 className="mt-8">Checks</H2>
      <Group className="mt-3">
        {fs.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={r.corrected[f.def.id]} />
        ))}
      </Group>
      {!r.revised && !req ? <TextBtn label={`Scan again as rev ${r.rev + 1}`} onPress={() => revise([])} /> : null}
    </Screen>
  );
}
