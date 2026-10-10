import { Redirect, useLocalSearchParams } from 'expo-router';
import { KeyRound, MessageSquareWarning, Send, Square, SquareCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { FindingRow } from '@/components/finding';
import { PinPrompt } from '@/components/pin-prompt';
import { DrawingValues, EvidenceList, SignoffCard } from '@/components/record-parts';
import { Button, Group, H2, Notice, Screen, Sub, T, TextBtn, Title, TopBar, tap } from '@/components/ui';
import { saveToFolder, shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { approvalFile, makeApproval, makeRequest, packName, requestFile, specOrigin } from '@/lib/pack';
import { evaluate, RULEBOOK, tally, tallyLine } from '@/lib/rules';
import { checkName, KIND_LABEL, type CheckId } from '@/lib/spec';
import { actions, getState, useRecord, useStore, when } from '@/lib/store';

// The engineer's desk, mirrored to the laptop: everything that was signed, then a deliberate decision with their own key.
export default function Review() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const r = useRecord(key);
  const role = useStore((s) => s.role);
  const myFp = useStore((s) => s.me?.fp);
  const [reviewed, setReviewed] = useState(false);
  const [specOk, setSpecOk] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pick, setPick] = useState<CheckId[]>([]);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ tone: 'warn' | 'fail' | 'pass'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  if (!r || !r.capture) return <Redirect href="/" />;

  const fs = evaluate(r);
  const t = tally(fs);
  const decided = !!r.approval || !!r.request;
  const sameKey = r.capture.signer.fp === myFp;
  const origin = specOrigin(r.spec, r.member, myFp);
  // Values the operator typed (or another engineer issued) were set by someone other than the approver: confirm them explicitly.
  const askSpec = origin.kind === 'typed' || origin.kind === 'other';
  const blocked = origin.kind === 'changed' ? 'Drawing values were changed after they were issued' : !r.trustedSigner ? 'The capture key is not enrolled on this phone' : sameKey ? 'Captured with this phone’s key: approval needs a second phone' : role !== 'engineer' ? 'This phone is not set up as the engineer' : null;
  const unassessed = t.rescan + t.tape + t.notSeen + t.pending;

  const approve = () => {
    setPinOpen(false);
    // Replay guard: the same capture hash is never approved twice.
    if (getState().processed[r.capture!.hash]) {
      setMsg({ tone: 'fail', text: 'Already processed. Nothing was signed.' });
      return;
    }
    actions.approve(r.key, makeApproval(r));
  };

  const sendBack = async (how: 'share' | 'folder') => {
    setBusy(true);
    try {
      const fresh = getState().records.find((x) => x.key === r.key)!;
      const text = fresh.approval ? approvalFile(fresh.approval) : requestFile(fresh.request!);
      const name = packName(fresh, fresh.approval ? 'approval' : 'request');
      if (how === 'share') await shareFile(name, text, 'Send back with Office Kit');
      else await saveToFolder(name, text);
    } catch (e) {
      setMsg({ tone: 'fail', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const request = async () => {
    actions.requestView(r.key, makeRequest(r, pick, note));
    setAsking(false);
  };

  const footer = decided ? (
    <>
      <Button label={`Send ${r.approval ? 'approval' : 'request'} back`} icon={Send} disabled={busy} onPress={() => sendBack('share')} />
      <TextBtn label="Save to a folder instead" disabled={busy} onPress={() => sendBack('folder')} />
    </>
  ) : asking ? (
    <>
      <Button label="Sign the request" icon={MessageSquareWarning} disabled={!pick.length && !note.trim()} onPress={request} />
      <TextBtn label="Cancel" onPress={() => setAsking(false)} />
    </>
  ) : (
    <>
      <Pressable onPress={() => (tap(), setReviewed(!reviewed))} disabled={!!blocked} className="mb-3 flex-row items-center gap-3">
        {reviewed ? <SquareCheck size={24} color="#000" /> : <Square size={24} color={blocked ? '#BDBDBD' : '#000'} />}
        <T w="medium" className={`flex-1 text-[15px] ${blocked ? 'text-ink-3' : ''}`}>
          I reviewed all {fs.length} checks and the photos
        </T>
      </Pressable>
      {askSpec ? (
        <Pressable onPress={() => (tap(), setSpecOk(!specOk))} disabled={!!blocked} className="mb-3 flex-row items-center gap-3">
          {specOk ? <SquareCheck size={24} color="#000" /> : <Square size={24} color={blocked ? '#BDBDBD' : '#000'} />}
          <T w="medium" className={`flex-1 text-[15px] ${blocked ? 'text-ink-3' : ''}`}>
            The drawing values match my drawing
          </T>
        </Pressable>
      ) : null}
      <Button
        label="Approve with PIN"
        icon={KeyRound}
        disabled={!reviewed || (askSpec && !specOk) || !!blocked}
        onPress={() => {
          setMsg(null);
          setPinOpen(true);
        }}
      />
      <TextBtn label="Ask for another view" disabled={!!blocked} onPress={() => setAsking(true)} />
    </>
  );

  return (
    <Screen footer={footer}>
      <PinPrompt title={`Approve ${r.name} rev ${r.rev}`} visible={pinOpen} onCancel={() => setPinOpen(false)} onOk={approve} />
      <TopBar name={`Rev ${r.rev}`} sub={`${KIND_LABEL[r.member]} · received ${when(r.receivedAt ?? r.createdAt)}`} />
      <Title>{r.name}</Title>
      <Sub>{tallyLine(fs)}</Sub>

      {r.trustedSigner ? (
        <Notice tone="pass" className="mt-4" title={`Signed by ${r.capture.signer.name} · signature valid`}>
          {when(r.capture.at)} · key {r.capture.signer.fp} · record {short(r.capture.hash)}. Every photo matches its hash.
        </Notice>
      ) : (
        <Notice tone="warn" className="mt-4" title="Unknown signer · approval off">
          “{r.capture.signer.name}” ({r.capture.signer.fp}) is not enrolled here. Enrol that phone, then open the pack again.
        </Notice>
      )}
      {origin.kind === 'none' ? null : (
        <Notice tone={origin.kind === 'mine' ? 'pass' : origin.kind === 'changed' ? 'fail' : 'warn'} className="mt-3" title={origin.title}>
          {origin.sub}
        </Notice>
      )}
      {blocked && r.trustedSigner && !decided && origin.kind !== 'changed' ? <Notice tone="warn" className="mt-3" title={blocked} /> : null}
      {msg ? <Notice tone={msg.tone} className="mt-3" title={msg.text} /> : null}

      {r.approval ? (
        <SignoffCard approval={r.approval} title={`You approved · ${when(r.approval.payload.t)}`} sub={`Key ${r.approval.payload.f}. Send it back so it attaches to this capture.`} />
      ) : null}
      {r.request ? (
        <Notice tone="warn" className="mt-4" title={`You asked for another view · ${when(r.request.payload.t)}`}>
          {[r.request.payload.checks.map((c) => checkName(fs.find((f) => f.def.id === c)!.def)).join(', '), r.request.payload.note].filter(Boolean).join(' · ')}
        </Notice>
      ) : null}

      {asking ? (
        <View className="mt-4 rounded-card bg-tile p-4">
          <T w="bold" className="text-[18px]">
            Ask for another view
          </T>
          <T className="mt-1 text-[14px] text-ink-2">Pick the checks to scan again.</T>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {fs.map((f) => {
              const on = pick.includes(f.def.id);
              return (
                <Pressable key={f.def.id} onPress={() => (tap(), setPick(on ? pick.filter((x) => x !== f.def.id) : [...pick, f.def.id]))} className={`rounded-full px-3.5 py-2 ${on ? 'bg-ink' : 'bg-paper'}`}>
                  <T w="medium" className={`text-[14px] ${on ? 'text-white' : ''}`}>
                    {checkName(f.def)}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <View className="mt-3 rounded-xl bg-paper px-4 py-3">
            <TextInput value={note} onChangeText={setNote} placeholder="Note for the operator (optional)" placeholderTextColor="#8A8A8A" multiline className="min-h-[48px] font-regular text-[16px] text-ink" />
          </View>
        </View>
      ) : null}

      <H2 className="mt-8">Checks</H2>
      {unassessed ? (
        <Notice tone="warn" className="mt-3" title={`${unassessed} unassessed`}>
          Approving does not turn them into within limits.
        </Notice>
      ) : null}
      <Group className="mt-3">
        {fs.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={r.corrected[f.def.id]} />
        ))}
      </Group>

      <H2 className="mt-8">Evidence</H2>
      <EvidenceList r={r} />

      <H2 className="mt-8">Drawing</H2>
      <DrawingValues r={r} />
      <T className="mt-3 text-[13px] leading-[19px] text-ink-3">
        Drawing rev {r.spec?.rev ?? '—'}
        {r.spec?.preset ? ' (demo prop)' : ''} · rulebook {RULEBOOK} · revision {r.rev}
        {r.parent ? `, replacing ${short(r.parent)}` : ''}. Measurements with error bands, not a safety certificate or pour permit.
      </T>
    </Screen>
  );
}
