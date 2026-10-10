import { Redirect, useLocalSearchParams } from 'expo-router';
import { FileCheck, FileText, KeyRound, Lock, MessageSquareWarning, Send, ShieldAlert, ShieldCheck, Square, SquareCheck, type LucideIcon } from 'lucide-react-native';
import { useState, type ComponentProps } from 'react';
import { TextInput, View } from 'react-native';

import { FindingRow } from '@/components/finding';
import { FixLoop } from '@/components/fix-loop';
import { PinPrompt } from '@/components/pin-prompt';
import { DrawingValues, EvidenceList, Footnote, Head, SignoffCard, Tally } from '@/components/record-parts';
import { Button, C, Details, Enter, Group, H2, KV, Notice, Press, Screen, T, TextBtn, Title, TopBar } from '@/components/ui';
import { saveToFolder, shareFile } from '@/lib/files';
import { say } from '@/lib/fix';
import { short } from '@/lib/keys';
import { approvalFile, makeApproval, makeRequest, packName, requestFile, specOrigin } from '@/lib/pack';
import { pourIn, pourLabel } from '@/lib/pour';
import { evaluate, RULEBOOK, tally } from '@/lib/rules';
import { checkName, KIND_LABEL, type CheckId } from '@/lib/spec';
import { actions, getState, useRecord, useStore, when } from '@/lib/store';

type NoticeProps = ComponentProps<typeof Notice>;

// One compact verdict line: an icon and a sentence, coloured only when it reports an outcome.
function Line({ icon: Icon, color = C.ink, children }: { icon: LucideIcon; color?: string; children: string }) {
  return (
    <View className="mt-3 flex-row items-center gap-2.5">
      <Icon size={20} color={color} strokeWidth={2.2} />
      <T w="medium" className="flex-1 text-[15px] leading-[21px]" style={color === C.ink ? undefined : { color }}>
        {children}
      </T>
    </View>
  );
}

// A whole-width checkbox row, big enough for a gloved thumb.
function CheckRow({ on, label, disabled, onPress }: { on: boolean; label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityRole="checkbox" accessibilityState={{ checked: on }} className={`mb-2 min-h-14 flex-row items-center gap-3 rounded-2xl px-4 py-3 ${on ? 'bg-ink' : 'bg-tile'}`}>
      {on ? <SquareCheck size={24} color="#fff" /> : <Square size={24} color={disabled ? C.ink4 : C.ink} />}
      <T w="semibold" className={`flex-1 text-[16px] leading-[21px] ${on ? 'text-white' : disabled ? 'text-ink-3' : ''}`}>
        {label}
      </T>
    </Press>
  );
}

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

  // One notice, the most important thing to know before deciding. A plain blocked reason sits in the footer instead.
  const pickNotice = (): (NoticeProps & { origin?: boolean }) | null => {
    if (msg) return { tone: msg.tone, title: msg.text };
    if (!r.trustedSigner) return { tone: 'warn', title: 'Unknown signer · approval off', children: `“${r.capture!.signer.name}” is not enrolled here. Enrol that phone, then open the pack again.` };
    if (origin.kind === 'changed') return { tone: 'fail', title: origin.title, children: origin.sub, origin: true };
    if (r.request) {
      const names = r.request.payload.checks.map((c) => checkName(fs.find((f) => f.def.id === c)!.def)).join(', ');
      return { tone: 'warn', title: `You asked for a fix and re-scan · ${when(r.request.payload.t)}`, children: [names, r.request.payload.note].filter(Boolean).join(' · ') };
    }
    if (decided) return null;
    if (askSpec) return { tone: 'warn', title: origin.title, children: origin.sub, origin: true };
    if (unassessed) return { tone: 'warn', title: `${unassessed} unassessed`, children: 'Approving does not turn them into within limits.' };
    return null;
  };
  const notice = pickNotice();

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

  // Start from what the rules flagged, with the same fix sentence the mason heard; the engineer edits before signing.
  const startFix = () => {
    const flagged = fs.filter((f) => f.outcome === 'outside' || f.outcome === 'rescan');
    setPick(flagged.map((f) => f.def.id));
    const fixes = flagged.flatMap((f) => {
      const s = say(f, r.member, r.name, 'en');
      return s ? [`${checkName(f.def)}: ${s.action}`] : [];
    });
    setNote(fixes.join(' '));
    setAsking(true);
  };

  const request = async () => {
    actions.requestView(r.key, makeRequest(r, pick, note));
    setAsking(false);
  };

  const decide = blocked ? (
    <>
      <View className="mb-3 flex-row items-center gap-2.5">
        <Lock size={18} color={C.ink2} />
        <T w="medium" className="flex-1 text-[15px] leading-[21px] text-ink-2">
          {blocked}
        </T>
      </View>
      <Button label="Approve with PIN" icon={KeyRound} disabled />
      <TextBtn label="Fix and re-scan" disabled onPress={startFix} />
    </>
  ) : (
    <>
      <CheckRow on={reviewed} label={`I reviewed all ${fs.length} checks and the photos`} onPress={() => setReviewed(!reviewed)} />
      {askSpec ? <CheckRow on={specOk} label="The drawing values match my drawing" onPress={() => setSpecOk(!specOk)} /> : null}
      <View className="mt-1">
        <Button
          label="Approve with PIN"
          icon={KeyRound}
          disabled={!reviewed || (askSpec && !specOk)}
          onPress={() => {
            setMsg(null);
            setPinOpen(true);
          }}
        />
      </View>
      <TextBtn label="Fix and re-scan" onPress={startFix} />
    </>
  );

  const footer = decided ? (
    <>
      <Button label={`Send ${r.approval ? 'approval' : 'request'} back`} icon={Send} busy={busy} onPress={() => sendBack('share')} />
      <TextBtn label="Save to a folder instead" disabled={busy} onPress={() => sendBack('folder')} />
    </>
  ) : asking ? (
    <>
      <Button label="Sign and send the fix" icon={MessageSquareWarning} disabled={!pick.length && !note.trim()} onPress={request} />
      <TextBtn label="Cancel" onPress={() => setAsking(false)} />
    </>
  ) : (
    decide
  );

  return (
    <Screen footer={footer}>
      <PinPrompt title={`Approve ${r.name} rev ${r.rev}`} visible={pinOpen} onCancel={() => setPinOpen(false)} onOk={approve} />
      <TopBar name={`Rev ${r.rev}`} sub={[KIND_LABEL[r.member], r.site, r.pourAt ? `${pourLabel(r.pourAt)} · ${pourIn(r.pourAt)}` : `received ${when(r.receivedAt ?? r.createdAt)}`].filter(Boolean).join(' · ')} />
      <Head illo={r.member}>
        <Title>{r.name}</Title>
      </Head>
      <Tally fs={fs} />

      <Enter i={2}>
        {r.trustedSigner ? (
          <Line icon={ShieldCheck} color={C.pass}>{`Signed by ${r.capture.signer.name} · signature valid`}</Line>
        ) : (
          <Line icon={ShieldAlert} color={C.warn}>{`Signed by ${r.capture.signer.name} · key not enrolled`}</Line>
        )}
        {notice?.origin ? null : (
          <Line icon={origin.kind === 'mine' ? FileCheck : FileText} color={origin.kind === 'changed' ? C.fail : C.ink}>
            {origin.title}
          </Line>
        )}
        <Details label="Signature details">
          <Group>
            <KV first k="Captured" v={when(r.capture.at)} />
            <KV k="Capture key" v={r.capture.signer.fp} />
            <KV k="Record" v={short(r.capture.hash)} />
            {r.trustedSigner ? <KV k="Photos" v="Every photo matches its hash" /> : null}
            {origin.sub ? <KV k="Drawing values" v={origin.sub} /> : null}
            {r.approval ? <KV k="Your approval key" v={r.approval.payload.f} /> : null}
          </Group>
        </Details>
      </Enter>

      {notice ? (
        <Enter i={3}>
          <Notice tone={notice.tone} className="mt-4" title={notice.title}>
            {notice.children}
          </Notice>
        </Enter>
      ) : null}

      {r.approval ? <SignoffCard approval={r.approval} title={`You approved · ${when(r.approval.payload.t)}`} sub="Send it back so it attaches to this capture." /> : null}

      {asking ? (
        <Enter className="mt-5 rounded-card bg-tile p-4">
          <T w="bold" className="text-[20px] leading-[26px]">
            Fix and re-scan
          </T>
          <T className="mt-1 text-[15px] text-ink-2">The operator scans these again after the fix, as a new revision.</T>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {fs.map((f) => {
              const on = pick.includes(f.def.id);
              return (
                <Press
                  key={f.def.id}
                  onPress={() => setPick(on ? pick.filter((x) => x !== f.def.id) : [...pick, f.def.id])}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  className={`h-12 justify-center rounded-full px-4 ${on ? 'bg-ink' : 'bg-paper'}`}
                >
                  <T w="semibold" className={`text-[15px] ${on ? 'text-white' : ''}`}>
                    {checkName(f.def)}
                  </T>
                </Press>
              );
            })}
          </View>
          <View className="mt-3 rounded-xl bg-paper px-4 py-3">
            <TextInput value={note} onChangeText={setNote} placeholder="What to fix (optional)" placeholderTextColor={C.ink3} multiline className="min-h-[48px] font-regular text-[16px] text-ink" />
          </View>
        </Enter>
      ) : null}

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
      <Details label="Drawing details">
        <Group>
          <KV first k="Drawing rev" v={`${r.spec?.rev ?? '—'}${r.spec?.preset ? ' (demo prop)' : ''}`} />
          <KV k="Rulebook" v={RULEBOOK} />
          <KV k="Revision" v={`${r.rev}${r.parent ? `, replacing ${short(r.parent)}` : ''}`} />
        </Group>
      </Details>
      <Footnote />
    </Screen>
  );
}
