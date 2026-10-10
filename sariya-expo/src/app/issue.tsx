import { router } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useState } from 'react';

import { MemberPick } from '@/components/member-pick';
import { PinPrompt } from '@/components/pin-prompt';
import { Head, SuccessMark } from '@/components/record-parts';
import { SpecForm, toValues, type SpecDraft } from '@/components/spec-form';
import { Button, Enter, Notice, Screen, Sub, TextBtn, Title, TopBar } from '@/components/ui';
import { saveToFolder, shareFile } from '@/lib/files';
import { makeSpec, specFile, specName } from '@/lib/pack';
import { KIND_LABEL, type MemberKind } from '@/lib/spec';
import { actions, getState, useStore } from '@/lib/store';

// The engineer sets the bar: drawing values are signed here and sent to the operator, who scans against them.
// Same member and value screens as the operator's, so neither has to learn a second form.
export default function IssueSpec() {
  const enrolled = useStore((s) => s.trusted.some((p) => p.role === 'operator'));
  const [kind, setKind] = useState<MemberKind>('slab');
  const [name, setName] = useState('');
  const [site, setSite] = useState(() => getState().issued.find((x) => x.payload.s)?.payload.s ?? '');
  const [pourAt, setPourAt] = useState<number | undefined>();
  const [step, setStep] = useState<'member' | 'values' | 'sent'>('member');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  // The PIN is asked before signing; the draft and destination wait here until it is confirmed.
  const [pending, setPending] = useState<{
    d: SpecDraft;
    how: 'share' | 'folder';
  } | null>(null);
  const ready = name.trim().length > 0;

  const send = async (d: SpecDraft, how: 'share' | 'folder') => {
    setBusy(true);
    setErr('');
    try {
      const spec = makeSpec(kind, name.trim(), toValues(kind, d), d.hooks, site, pourAt);
      const text = specFile(spec);
      const sent = how === 'share' ? await shareFile(specName(spec.payload), text, 'Send drawing values with Office Kit') : await saveToFolder(specName(spec.payload), text);
      if (sent) {
        actions.addIssued(spec);
        setStep('sent');
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (step === 'sent') {
    return (
      <Screen
        footer={
          <>
            <Button label="Done" onPress={() => router.back()} />
            <TextBtn
              label="Send another"
              onPress={() => {
                setName('');
                setPourAt(undefined);
                setStep('member');
              }}
            />
          </>
        }
      >
        <TopBar onBack={() => router.back()} />
        <SuccessMark illo="send" />
        <Enter i={1} className="items-center">
          <Title className="mt-6 text-center">Signed and sent</Title>
          <Sub className="text-center">
            {name.trim()} · {KIND_LABEL[kind]}
          </Sub>
          <Sub className="mt-4 text-center">The operator opens it from “Drawing values from the engineer”.</Sub>
        </Enter>
      </Screen>
    );
  }

  if (step === 'values') {
    return (
      <>
        <PinPrompt
          title={`Sign ${name.trim()}`}
          visible={!!pending}
          onCancel={() => setPending(null)}
          onOk={() => {
            if (pending) send(pending.d, pending.how);
            setPending(null);
          }}
        />
        <SpecForm
          member={kind}
          head={
            <TopBar
              name={name.trim()}
              sub={KIND_LABEL[kind]}
              onBack={() => {
                setErr('');
                setStep('member');
              }}
            />
          }
          sub="Signed with your key; the operator scans against them."
          confirmTop={() => (err ? <Notice tone="fail" className="mt-4" title={err} /> : null)}
          confirmFooter={(d, missing) => (
            <>
              <Button
                label={missing ? 'Enter every value first' : 'Sign with PIN and send'}
                icon={missing ? undefined : KeyRound}
                disabled={missing}
                busy={busy}
                onPress={() => setPending({ d, how: 'share' })}
              />
              <TextBtn label="Save to a folder instead" disabled={missing || busy} onPress={() => setPending({ d, how: 'folder' })} />
            </>
          )}
        />
      </>
    );
  }

  return (
    <Screen footer={<Button label="Next" disabled={!ready} onPress={() => ready && setStep('values')} />}>
      <TopBar />
      <Head illo="engineer">
        <Title>Send drawing values</Title>
        <Sub>For the operator to scan against.</Sub>
      </Head>
      {enrolled ? null : (
        <Enter i={1}>
          <Notice tone="warn" className="mt-4" title="Enrol the operator’s phone first">
            It accepts drawing values only from an enrolled engineer key.
          </Notice>
        </Enter>
      )}
      <MemberPick kind={kind} onKind={setKind} name={name} onName={setName} onSubmit={() => ready && setStep('values')} site={site} onSite={setSite} pourAt={pourAt} onPour={setPourAt} />
    </Screen>
  );
}
