import { KeyRound } from 'lucide-react-native';
import { useState } from 'react';

import { MemberPick } from '@/components/member-pick';
import { PinPrompt } from '@/components/pin-prompt';
import { SpecForm, toValues, type SpecDraft } from '@/components/spec-form';
import { Button, Notice, Screen, Sub, TextBtn, Title, TopBar } from '@/components/ui';
import { saveToFolder, shareFile } from '@/lib/files';
import { makeSpec, specFile, specName } from '@/lib/pack';
import { KIND_LABEL, type MemberKind } from '@/lib/spec';
import { useStore } from '@/lib/store';

// The engineer sets the bar: drawing values are signed here and sent to the operator, who scans against them.
// Same member and value screens as the operator's, so neither has to learn a second form.
export default function IssueSpec() {
  const enrolled = useStore((s) => s.trusted.some((p) => p.role === 'operator'));
  const [kind, setKind] = useState<MemberKind>('slab');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'member' | 'values'>('member');
  const [msg, setMsg] = useState<{
    tone: 'pass' | 'fail';
    text: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  // The PIN is asked before signing; the draft and destination wait here until it is confirmed.
  const [pending, setPending] = useState<{
    d: SpecDraft;
    how: 'share' | 'folder';
  } | null>(null);
  const ready = name.trim().length > 0;

  const send = async (d: SpecDraft, how: 'share' | 'folder') => {
    setBusy(true);
    setMsg(null);
    try {
      const spec = makeSpec(kind, name.trim(), toValues(kind, d), d.hooks);
      const text = specFile(spec);
      const sent = how === 'share' ? await shareFile(specName(spec.payload), text, 'Send drawing values with Office Kit') : await saveToFolder(specName(spec.payload), text);
      if (sent)
        setMsg({
          tone: 'pass',
          text: 'Signed and sent. The operator opens it from “Drawing values from the engineer”.',
        });
    } catch (e) {
      setMsg({ tone: 'fail', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

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
                setMsg(null);
                setStep('member');
              }}
            />
          }
          sub="Signed with your key. The operator scans against them and cannot change them without your review saying so."
          confirmTop={() => (msg ? <Notice tone={msg.tone} className="mt-4" title={msg.text} /> : null)}
          confirmFooter={(d, missing) => (
            <>
              <Button
                label={missing ? 'Enter every value first' : 'Sign with PIN and send'}
                icon={missing ? undefined : KeyRound}
                disabled={missing || busy}
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
      <Title>Send drawing values</Title>
      <Sub>For the operator to scan against.</Sub>
      {enrolled ? null : (
        <Notice tone="warn" className="mt-4" title="Enrol the operator’s phone first">
          It accepts drawing values only from an enrolled engineer key.
        </Notice>
      )}
      <MemberPick kind={kind} onKind={setKind} name={name} onName={setName} onSubmit={() => ready && setStep('values')} />
    </Screen>
  );
}
