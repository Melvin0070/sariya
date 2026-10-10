import { Redirect, router } from 'expo-router';
import { FolderDown, KeyRound, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Clipboard } from '@/components/art';
import { Button, H2, Notice, Outline, Screen, SourceTag, T, Title, TopBar } from '@/components/ui';
import { confirmSent, saveToFolder, shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { SIMULATED_NOTE } from '@/lib/measure';
import { capturePack, me, packName, signCapture } from '@/lib/pack';
import { evaluate, RULEBOOK, tally, tallyLine } from '@/lib/rules';
import { KIND_LABEL, TARGETS } from '@/lib/spec';
import { actions, getState, useRecord, useStore, when } from '@/lib/store';

function Line({ k, v, first }: { k: string; v: string; first?: boolean }) {
  return (
    <View className={`flex-row gap-3 px-4 py-3 ${first ? '' : 'border-t border-line'}`}>
      <T className="w-[38%] text-[14px] text-ink-2">{k}</T>
      <T w="medium" className="flex-1 text-[15px]">
        {v}
      </T>
    </View>
  );
}

// The operator signs the capture with this phone's key, then hands the pack to Office Kit.
export default function Sign() {
  const draftKey = useStore((s) => s.draftKey);
  const [key] = useState(draftKey ?? undefined);
  const r = useRecord(key);
  const noEngineer = useStore((s) => !s.trusted.some((p) => p.role === 'engineer'));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (!r) return <Redirect href="/" />;

  const fs = evaluate(r);
  const t = tally(fs);
  const locks = r.locks.filter((l) => !l.superseded);
  const signer = me();
  const simulated = locks.some((l) => l.source === 'simulated');
  const signed = r.status === 'signed' && r.capture;

  const sign = () => {
    try {
      actions.signDraft(signCapture(r));
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const send = async (how: 'share' | 'folder') => {
    setBusy(true);
    setErr('');
    try {
      const fresh = getState().records.find((x) => x.key === r.key)!;
      const text = await capturePack(fresh);
      const name = packName(fresh, 'capture');
      if (how === 'share') {
        if (await shareFile(name, text, 'Send capture pack with Office Kit')) actions.markSent(r.key);
      } else if ((await saveToFolder(name, text)) && (await confirmSent())) actions.markSent(r.key);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        signed ? (
          <View className="gap-2">
            <Button label="Send with Office Kit…" icon={Send} disabled={busy} onPress={() => send('share')} />
            <Button label="Save pack to a folder" icon={FolderDown} kind="secondary" disabled={busy} onPress={() => send('folder')} />
            <Button label="Done" kind="secondary" onPress={() => {
                router.dismissAll();
                router.push({ pathname: '/record/[key]', params: { key: r.key } });
              }}
            />
          </View>
        ) : (
          <Button label="Sign capture with this phone’s key" icon={KeyRound} disabled={!signer} onPress={sign} />
        )
      }
    >
      <TopBar name={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={KIND_LABEL[r.member]} />
      <View className="flex-row items-center">
        <Title className="flex-1">{signed ? 'Signed. Now send it' : 'Sign the capture'}</Title>
        <Clipboard size={90} />
      </View>
      <T className="mt-1 text-[16px] leading-[23px] text-ink-2">{tallyLine(fs)}</T>

      {signed ? (
        <Notice tone="pass" className="mt-4" title={`Signed ${when(r.capture!.at)} · ${short(r.capture!.hash)}`}>
          {r.sentAt ? `Confirmed sent ${when(r.sentAt)}. ` : ''}Send the pack with Office Kit file transfer. On the engineer’s phone it opens from the file picker and is checked before anything shows.
        </Notice>
      ) : (
        <>
          {t.pending + t.tape > 0 ? (
            <Notice tone="warn" className="mt-4" title={`${t.pending + t.tape} check${t.pending + t.tape > 1 ? 's are' : ' is'} unassessed`}>
              They are recorded as not seen or needing a reading, never as within limits.
            </Notice>
          ) : null}
          {simulated ? (
            <Notice tone="warn" className="mt-4" title="Contains simulated values">
              Their source is signed as SIMULATED, so the engineer sees it. {SIMULATED_NOTE}
            </Notice>
          ) : null}
        </>
      )}
      {noEngineer ? (
        <Notice tone="warn" className="mt-4" title="No engineer enrolled on this phone">
          You can send the pack, but the approval can only attach after you enrol the engineer’s phone (Device › Enrol phones).
        </Notice>
      ) : null}
      {err ? <Notice tone="fail" className="mt-4" title={err} /> : null}

      <H2 className="mt-7">What you sign</H2>
      <Outline className="mt-3">
        <Line first k="Record" v={`${r.id} · rev ${r.rev}${r.parent ? ` (replaces ${short(r.parent)})` : ''}`} />
        <Line k="Drawing" v={r.spec?.noDrawing ? 'None: measure only' : `Spec rev ${r.spec?.rev}${r.spec?.preset ? ' · demo prop values' : ''}`} />
        {TARGETS[r.member].map((tg) => {
          const l = locks.find((x) => x.target === tg.id);
          return <Line key={tg.id} k={tg.label} v={l ? `${l.positions.length} bars ± ${l.band} mm · ${l.source} · ${l.image ? `photo ${l.image.hash.slice(0, 8)}…` : 'no photo'}` : 'Not scanned'} />;
        })}
        <Line k="Readings by hand" v={`${Object.keys(r.readings).length} entered`} />
        <Line k="Rulebook" v={`${RULEBOOK} · proposed tolerances`} />
        <Line k="Signer" v={signer ? `${signer.name} · ${signer.fp}` : 'No key on this phone'} />
        {signed ? <Line k="Record hash" v={r.capture!.hash.slice(0, 32) + '…'} /> : null}
      </Outline>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {[...new Set(locks.map((l) => l.source))].map((s) => (
          <SourceTag key={s} source={s} />
        ))}
      </View>
      <T className="mt-4 text-[13px] leading-[19px] text-ink-3">Signing freezes this revision. Any later change, scan or reading makes a new revision; this one is never edited.</T>
    </Screen>
  );
}
