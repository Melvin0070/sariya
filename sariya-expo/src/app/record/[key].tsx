import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, Clock, FileInput, MessageSquareWarning, RotateCw, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { FindingRow } from '@/components/finding';
import { FixLoop } from '@/components/fix-loop';
import { DrawingValues, EvidenceList, Footnote, Head, SignoffCard, Tally } from '@/components/record-parts';
import { Button, C, Details, Enter, Group, H2, KV, Notice, Row, Screen, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
import { shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { capturePack, packName } from '@/lib/pack';
import { evaluate } from '@/lib/rules';
import { checksFor, checkName, KIND_LABEL, type TargetId } from '@/lib/spec';
import { statusOf } from '@/lib/status';
import { actions, getState, useRecord, when } from '@/lib/store';

type StepState = 'done' | 'warn' | 'todo';
const DOT: Record<StepState, string> = { done: 'bg-pass', warn: 'bg-warn', todo: 'bg-pill' };

function Step({ state, title, sub, last, i }: { state: StepState; title: string; sub: string; last?: boolean; i: number }) {
  return (
    <Enter i={i} className="flex-row gap-4">
      <View className="items-center">
        <View className={`h-8 w-8 items-center justify-center rounded-full ${DOT[state]}`}>
          {state === 'warn' ? <MessageSquareWarning size={16} color="#fff" /> : null}
          {state === 'done' ? <Check size={16} color="#fff" strokeWidth={3} /> : null}
          {state === 'todo' ? <Clock size={16} color={C.ink2} /> : null}
        </View>
        {!last ? <View className={`w-0.5 flex-1 ${state === 'done' ? 'bg-pass' : 'bg-line'}`} style={{ minHeight: 22 }} /> : null}
      </View>
      <View className="flex-1 pb-5">
        <T w="semibold" className="text-[16px] leading-[22px]">
          {title}
        </T>
        <T className="mt-0.5 text-[14px] leading-[20px] text-ink-2">{sub}</T>
      </View>
    </Enter>
  );
}

// The operator's view of a signed capture: what happened to it, the sign-off QR, and what to do next.
export default function Record() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const r = useRecord(key);
  const [err, setErr] = useState('');
  if (!r || !r.capture) return <Redirect href="/" />;

  const fs = evaluate(r);
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

  // One notice: a failed send first, then a newer revision, then the engineer's request.
  const pending = req && !r.approval;
  const notice = err ? (
    <Notice tone="fail" className="mt-4" title={err} />
  ) : newer ? (
    <Notice className="mt-4" title={`Replaced by rev ${newer.rev}`}>
      This revision stays as history. Its signature and any approval apply only to it.
    </Notice>
  ) : pending ? (
    <Notice tone="warn" className="mt-4" title={req.note || 'Fix, then scan these again'}>
      {req.checks.map((c) => checkName(checksFor(r.member, r.spec).find((d) => d.id === c)!)).join(', ') || 'Any zone the engineer named'}
    </Notice>
  ) : null;

  const footer =
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
    );

  return (
    <Screen footer={footer}>
      <TopBar name={`Rev ${r.rev}`} sub={KIND_LABEL[r.member]} />
      <Head illo={r.approval ? 'approve' : r.member}>
        <Title>{r.name}</Title>
        <Sub>{statusOf(r)}</Sub>
      </Head>
      {notice ? <Enter i={1}>{notice}</Enter> : null}

      {r.approval ? <SignoffCard approval={r.approval} title="Sign-off QR" sub={`Proves offline that ${r.approval.payload.e} approved this exact record.`} /> : null}

      <View className="mt-7">
        <Step i={2} state="done" title={`Captured and signed · ${r.capture.signer.name}`} sub={when(r.capture.at)} />
        <Step i={3} state={r.sentAt ? 'done' : 'todo'} title={r.sentAt ? 'Pack sent' : 'Pack not sent yet'} sub={r.sentAt ? `Confirmed sent ${when(r.sentAt)}` : 'Send it with Office Kit file transfer'} />
        <Step
          i={4}
          last
          state={r.approval ? 'done' : pending ? 'warn' : 'todo'}
          title={r.approval ? `Approved · ${r.approval.payload.e}` : req ? `Fix requested · ${req.e}` : 'Engineer approval'}
          sub={r.approval ? `${when(r.approval.payload.t)} · PIN on their phone` : req ? `${when(req.t)} · ${req.note || 'see the note above'}` : 'Waiting for their reply'}
        />
      </View>

      <Tally fs={fs} i={5} />

      <FixLoop r={r} />

      <H2 className="mt-8">Checks</H2>
      <Group className="mt-3">
        {fs.map((f, i) => (
          <Enter key={f.def.id} i={i}>
            <FindingRow f={f} first={i === 0} corrected={r.corrected[f.def.id]} />
          </Enter>
        ))}
      </Group>

      <H2 className="mt-8">Evidence</H2>
      <EvidenceList r={r} />

      <H2 className="mt-8">Drawing</H2>
      <DrawingValues r={r} />

      {!r.revised && !req ? (
        <Group className="mt-6">
          <Row first icon={RotateCw} title={`Scan again as rev ${r.rev + 1}`} sub="This revision stays as history" onPress={() => revise([])} />
        </Group>
      ) : null}

      <Details label="Record details">
        <Group>
          <KV first k="Record" v={short(r.capture.hash)} />
          <KV k="Capture key" v={r.capture.signer.fp} />
          {r.approval ? <KV k="Engineer key" v={r.approval.payload.f} /> : null}
        </Group>
      </Details>
      <Footnote />
    </Screen>
  );
}
