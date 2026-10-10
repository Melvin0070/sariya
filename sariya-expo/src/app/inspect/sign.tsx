import { Redirect, router } from 'expo-router';
import { Check, KeyRound, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Clipboard } from '@/components/art';
import { PinPrompt } from '@/components/pin-prompt';
import { Button, Group, KV, Notice, Screen, SourceTag, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
import { confirmSent, saveToFolder, shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { SIMULATED_NOTE } from '@/lib/measure';
import { capturePack, me, packName, signCapture } from '@/lib/pack';
import { evaluate, RULEBOOK, tally, tallyLine } from '@/lib/rules';
import { KIND_LABEL, TARGETS } from '@/lib/spec';
import { actions, getState, useRecord, useStore, when } from '@/lib/store';

// The operator signs the capture with this phone's key, then hands the pack to Office Kit.
export default function Sign() {
  const draftKey = useStore((s) => s.draftKey);
  const [key] = useState(draftKey ?? undefined);
  const r = useRecord(key);
  const noEngineer = useStore((s) => !s.trusted.some((p) => p.role === 'engineer'));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  if (!r) return <Redirect href="/" />;

  const fs = evaluate(r);
  const t = tally(fs);
  const locks = r.locks.filter((l) => !l.superseded);
  const signer = me();
  const simulated = locks.some((l) => l.source === 'simulated');
  const signed = r.status === 'signed' && r.capture;
  const unassessed = t.pending + t.tape;

  const sign = () => {
    setPinOpen(false);
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

  const finish = () => {
    router.dismissAll();
    router.push({ pathname: '/record/[key]', params: { key: r.key } });
  };

  if (signed) {
    return (
      <Screen
        footer={
          <>
            <Button label={r.sentAt ? 'Send again' : 'Send with Office Kit'} icon={Send} disabled={busy} onPress={() => send('share')} />
            <TextBtn label="Save to a folder instead" disabled={busy} onPress={() => send('folder')} />
          </>
        }
      >
        <TopBar onBack={finish} right={<TextBtn label="Done" onPress={finish} />} />
        <View className="mt-6 h-16 w-16 items-center justify-center rounded-full bg-pass">
          <Check size={34} color="#fff" strokeWidth={3} />
        </View>
        <Title className="mt-5">Signed</Title>
        <Sub>
          {r.name} · rev {r.rev} · {when(r.capture!.at)}
        </Sub>
        <T className="mt-1 text-[14px] text-ink-3">Record {short(r.capture!.hash)}</T>
        {r.sentAt ? (
          <Notice tone="pass" className="mt-6" title={`Sent ${when(r.sentAt)}`} />
        ) : (
          <Sub className="mt-6">Send the pack to the engineer. It is checked on their phone before anything shows.</Sub>
        )}
        {noEngineer ? (
          <Notice tone="warn" className="mt-4" title="No engineer enrolled">
            Enrol their phone in Settings before their approval comes back.
          </Notice>
        ) : null}
        {err ? <Notice tone="fail" className="mt-4" title={err} /> : null}
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label="Sign with PIN" icon={KeyRound} disabled={!signer} onPress={() => setPinOpen(true)} />}>
      <PinPrompt title={`Sign ${r.name} rev ${r.rev}`} visible={pinOpen} onCancel={() => setPinOpen(false)} onOk={sign} />
      <TopBar name={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={KIND_LABEL[r.member]} />
      <View className="flex-row items-center">
        <Title className="flex-1">Sign the capture</Title>
        <Clipboard size={84} />
      </View>
      <Sub>{tallyLine(fs)}</Sub>

      {unassessed ? (
        <Notice tone="warn" className="mt-4" title={`${unassessed} unassessed`}>
          Recorded as not checked, never as within limits.
        </Notice>
      ) : null}
      {simulated ? (
        <Notice tone="warn" className="mt-4" title="Contains simulated values">
          {SIMULATED_NOTE}
        </Notice>
      ) : null}
      {err ? <Notice tone="fail" className="mt-4" title={err} /> : null}

      <Group className="mt-4">
        <KV first k="Drawing" v={r.spec?.noDrawing ? 'None: measure only' : `Rev ${r.spec?.rev}${r.spec?.preset ? ' · demo prop' : ''}`} />
        {TARGETS[r.member].map((tg) => {
          const l = locks.find((x) => x.target === tg.id);
          return <KV key={tg.id} k={tg.label} v={l ? `${l.positions.length} bars ± ${l.band} mm${l.image ? ' · photo' : ''}` : 'Not scanned'} />;
        })}
        <KV k="Readings by hand" v={`${Object.keys(r.readings).length} entered`} />
        <KV k="Rulebook" v={RULEBOOK} />
        <KV k="Signer" v={signer ? `${signer.name} · ${signer.fp.slice(0, 9)}` : 'No key on this phone'} />
      </Group>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {[...new Set(locks.map((l) => l.source))].map((s) => (
          <SourceTag key={s} source={s} />
        ))}
      </View>
      <T className="mt-5 text-[13px] leading-[19px] text-ink-3">
        Signing freezes this revision; any later change becomes a new one. Measurements against the drawing with error bands, not a safety certificate or pour permit.
      </T>
    </Screen>
  );
}
