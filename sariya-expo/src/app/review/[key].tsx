import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, Fingerprint, FolderDown, MessageSquareWarning, Send, Square, SquareCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { CoverageMap } from '@/components/coverage';
import { Evidence } from '@/components/evidence';
import { FindingRow } from '@/components/finding';
import { QR } from '@/components/qr';
import { Button, H2, Notice, Outline, Screen, SourceTag, T, Title, TopBar, tap } from '@/components/ui';
import { confirmIdentity } from '@/lib/device';
import { saveToFolder, shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { approvalFile, makeApproval, makeRequest, packName, requestFile, signoffQr } from '@/lib/pack';
import { evaluate, RULEBOOK, tally, tallyLine } from '@/lib/rules';
import { checkName, FIELDS, KIND_LABEL, TARGETS, type CheckId } from '@/lib/spec';
import { actions, getState, useRecord, useStore, when } from '@/lib/store';

// The engineer's desk, mirrored to the laptop: everything that was signed, then a deliberate decision with their own key.
export default function Review() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const r = useRecord(key);
  const role = useStore((s) => s.role);
  const myFp = useStore((s) => s.me?.fp);
  const [reviewed, setReviewed] = useState(false);
  const [asking, setAsking] = useState(false);
  const [pick, setPick] = useState<CheckId[]>([]);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ tone: 'warn' | 'fail' | 'pass'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (!r || !r.capture) return <Redirect href="/" />;

  const fs = evaluate(r);
  const t = tally(fs);
  const locks = r.locks.filter((l) => !l.superseded);
  const decided = !!r.approval || !!r.request;
  const sameKey = r.capture.signer.fp === myFp;
  const blocked = !r.trustedSigner ? 'The capture key is not enrolled on this phone' : sameKey ? 'Captured with this phone’s key: approval needs a second phone' : role !== 'engineer' ? 'This phone is not set up as the engineer' : null;
  const unassessed = t.rescan + t.tape + t.notSeen + t.pending;

  const approve = async () => {
    setMsg(null);
    const ok = await confirmIdentity(`Approve ${r.name} rev ${r.rev}`);
    if (!ok.ok) {
      setMsg({ tone: 'warn', text: ok.why });
      return;
    }
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
    <View className="gap-2">
      <Button label={`Send ${r.approval ? 'approval' : 'request'} back with Office Kit…`} icon={Send} disabled={busy} onPress={() => sendBack('share')} />
      <Button label="Save to a folder" icon={FolderDown} kind="secondary" disabled={busy} onPress={() => sendBack('folder')} />
    </View>
  ) : asking ? (
    <View className="gap-2">
      <Button label="Sign and keep the request" icon={MessageSquareWarning} disabled={!pick.length && !note.trim()} onPress={request} />
      <Button label="Cancel" kind="secondary" onPress={() => setAsking(false)} />
    </View>
  ) : (
    <View className="gap-2">
      <Pressable onPress={() => (tap(), setReviewed(!reviewed))} disabled={!!blocked} className="flex-row items-center gap-3 py-1">
        {reviewed ? <SquareCheck size={26} color="#000" /> : <Square size={26} color={blocked ? '#BDBDBD' : '#000'} />}
        <T w="medium" className={`flex-1 text-[16px] ${blocked ? 'text-ink-3' : ''}`}>
          I reviewed all {fs.length} checks and the locked photos
        </T>
      </Pressable>
      <Button label="Approve with fingerprint" icon={Fingerprint} disabled={!reviewed || !!blocked} onPress={approve} />
      <Button label="Ask for another view" kind="secondary" disabled={!!blocked} onPress={() => setAsking(true)} />
    </View>
  );

  return (
    <Screen footer={footer}>
      <TopBar name={`${r.name} · rev ${r.rev}`} sub={`${KIND_LABEL[r.member]} · received ${when(r.receivedAt ?? r.createdAt)}`} />
      <Title>Review</Title>
      <T className="mt-1 text-[16px] leading-[23px] text-ink-2">{tallyLine(fs)}</T>

      {r.trustedSigner ? (
        <Notice tone="pass" className="mt-4" title={`Signature valid · ${r.capture.signer.name}`}>
          Captured {when(r.capture.at)} with key {r.capture.signer.fp}. Record {short(r.capture.hash)}. Every photo matches its signed hash.
        </Notice>
      ) : (
        <Notice tone="warn" className="mt-4" title="Unknown signer · approval off">
          Signed by “{r.capture.signer.name}” ({r.capture.signer.fp}), a key not enrolled here. Enrol that phone, then open the pack again.
        </Notice>
      )}
      {blocked && r.trustedSigner && !decided ? <Notice tone="warn" className="mt-3" title={blocked} /> : null}
      {msg ? <Notice tone={msg.tone} className="mt-3" title={msg.text} /> : null}

      {r.approval ? (
        <View className="mt-4 items-center rounded-card border border-line p-5">
          <View className="flex-row items-center gap-2">
            <Check size={20} color="#05944F" strokeWidth={3} />
            <T w="bold" className="text-[19px]">
              You approved · {when(r.approval.payload.t)}
            </T>
          </View>
          <View className="mt-4">
            <QR value={signoffQr(r.approval)} size={200} />
          </View>
          <T className="mt-3 text-center text-[14px] text-ink-2">Signed with your key {r.approval.payload.f}. Send the approval back so it attaches to this exact capture on the operator’s phone.</T>
        </View>
      ) : null}
      {r.request ? (
        <Notice tone="warn" className="mt-4" title={`You asked for another view · ${when(r.request.payload.t)}`}>
          {[r.request.payload.checks.map((c) => checkName(fs.find((f) => f.def.id === c)!.def)).join(', '), r.request.payload.note].filter(Boolean).join(' · ')}. Send it back; the operator scans again as a new revision.
        </Notice>
      ) : null}

      {asking ? (
        <View className="mt-4 rounded-card border-2 border-ink p-4">
          <T w="bold" className="text-[19px]">
            Ask for another view
          </T>
          <T className="mt-1 text-[15px] text-ink-2">Pick the checks to scan again. This record is kept as it is.</T>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {fs.map((f) => {
              const on = pick.includes(f.def.id);
              return (
                <Pressable key={f.def.id} onPress={() => (tap(), setPick(on ? pick.filter((x) => x !== f.def.id) : [...pick, f.def.id]))} className={`rounded-full px-3.5 py-2 ${on ? 'bg-ink' : 'bg-tile'}`}>
                  <T w="medium" className={`text-[14px] ${on ? 'text-white' : ''}`}>
                    {checkName(f.def)}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <View className="mt-3 rounded-xl bg-tile px-4 py-3">
            <TextInput value={note} onChangeText={setNote} placeholder="Note for the operator (optional)" placeholderTextColor="#8A8A8A" multiline className="min-h-[48px] font-regular text-[16px] text-ink" />
          </View>
        </View>
      ) : null}

      <H2 className="mt-7">Drawing</H2>
      <Outline className="mt-3">
        {r.spec?.noDrawing ? (
          <T className="px-4 py-3 text-[15px]">No drawing: measure only</T>
        ) : (
          FIELDS[r.member].map((f, i) => (
            <View key={f.id} className={`flex-row px-4 py-3 ${i ? 'border-t border-line' : ''}`}>
              <T className="flex-1 text-[15px] text-ink-2">{f.label}</T>
              <T w="semibold" className="text-[16px]">
                {r.spec?.values[f.id] == null ? 'Not on drawing' : `${r.spec.values[f.id]} ${f.unit}`}
              </T>
            </View>
          ))
        )}
      </Outline>
      <T className="mt-2 text-[13px] text-ink-2">
        Spec rev {r.spec?.rev ?? '—'}
        {r.spec?.preset ? ' · demo prop values' : ''} · rulebook {RULEBOOK}
      </T>

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
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              <T w="medium" className="text-[15px]">
                {TARGETS[r.member].find((x) => x.id === l.target)?.label} · {l.positions.length} bars ± {l.band} mm · {l.frames} frame{l.frames > 1 ? 's' : ''}
              </T>
              <SourceTag source={l.source} />
            </View>
          </View>
        ))
      ) : (
        <T className="mt-2 text-[15px] text-ink-2">No camera locks.</T>
      )}

      <H2 className="mt-7">Checks</H2>
      {unassessed ? (
        <Notice tone="warn" className="mt-3" title={`${unassessed} check${unassessed > 1 ? 's' : ''} unassessed`}>
          They stay unassessed in the record. An approval does not turn them into within limits.
        </Notice>
      ) : null}
      <Outline className="mt-3">
        {fs.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={r.corrected[f.def.id]} />
        ))}
      </Outline>
      <T className="mt-4 text-[13px] leading-[19px] text-ink-3">
        Revision {r.rev}
        {r.parent ? `, replacing ${short(r.parent)}` : ''}. Measurements against the drawing with error bands. Not a safety certificate or pour permit.
      </T>
      {!decided ? (
        <Pressable onPress={() => router.back()} className="mt-4 self-start">
          <T w="medium" className="text-[15px] text-ink-2 underline">
            Decide later
          </T>
        </Pressable>
      ) : null}
    </Screen>
  );
}
