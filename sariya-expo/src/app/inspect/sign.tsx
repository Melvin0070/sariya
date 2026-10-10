import { Redirect, router } from 'expo-router';
import { KeyRound, Send } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { PinPrompt } from '@/components/pin-prompt';
import { Footnote, Head, SuccessMark, Tally } from '@/components/record-parts';
import { Button, Details, Enter, Group, KV, Notice, Screen, SourceTag, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
import { confirmSent, saveToFolder, shareFile } from '@/lib/files';
import { short } from '@/lib/keys';
import { SIMULATED_NOTE } from '@/lib/measure';
import { capturePack, me, packName, signCapture } from '@/lib/pack';
import { evaluate, RULEBOOK, tally } from '@/lib/rules';
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
            <Button label={r.sentAt ? 'Send again' : 'Send with Office Kit'} icon={Send} busy={busy} onPress={() => send('share')} />
            <TextBtn label="Save to a folder instead" disabled={busy} onPress={() => send('folder')} />
          </>
        }
      >
        <TopBar onBack={finish} right={<TextBtn label="Done" onPress={finish} />} />
        <SuccessMark illo="send" />
        <Enter i={1} className="items-center">
          <Title className="mt-6 text-center">Signed</Title>
          <Sub className="text-center">
            {r.name} · rev {r.rev}
          </Sub>
          <T w="medium" className="mt-4 text-center text-[16px]">
            {r.sentAt ? `Sent ${when(r.sentAt)}` : 'Now send the pack to the engineer.'}
          </T>
        </Enter>
        {err ? <Notice tone="fail" className="mt-6" title={err} /> : null}
        {!err && noEngineer ? (
          <Notice tone="warn" className="mt-6" title="No engineer enrolled">
            Enrol their phone in Settings before their approval comes back.
          </Notice>
        ) : null}
        <Details label="Record details">
          <Group>
            <KV first k="Record" v={short(r.capture!.hash)} />
            <KV k="Signed" v={when(r.capture!.at)} />
            <KV k="Key" v={r.capture!.signer.fp} />
          </Group>
        </Details>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          {err ? <T className="mb-2 text-center text-[14px] text-fail">{err}</T> : null}
          <Button label="Sign with PIN" icon={KeyRound} disabled={!signer} onPress={() => setPinOpen(true)} />
        </>
      }
    >
      <PinPrompt
        title={`Sign ${r.name} rev ${r.rev}`}
        visible={pinOpen}
        onCancel={() => setPinOpen(false)}
        onOk={() => {
          setErr('');
          sign();
        }}
      />
      <TopBar name={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={KIND_LABEL[r.member]} />
      <Head illo={r.member}>
        <Title>Sign the capture</Title>
        <Sub>Signing freezes this revision.</Sub>
      </Head>
      <Tally fs={fs} />

      {unassessed || simulated ? (
        <Enter i={2}>
          {unassessed ? (
            <Notice tone="warn" className="mt-4" title={`${unassessed} unassessed`}>
              Recorded as not checked, never as within limits.
            </Notice>
          ) : (
            <Notice tone="warn" className="mt-4" title="Contains simulated values">
              {SIMULATED_NOTE}
            </Notice>
          )}
        </Enter>
      ) : null}

      <Enter i={3}>
        <Group className="mt-4">
          <KV first k="Drawing" v={r.spec?.noDrawing ? 'None: measure only' : `Rev ${r.spec?.rev}${r.spec?.preset ? ' · demo prop' : ''}`} />
          {TARGETS[r.member].map((tg) => {
            const l = locks.find((x) => x.target === tg.id);
            return <KV key={tg.id} k={tg.label} v={l ? `${l.positions.length} bars ± ${l.band} mm${l.image ? ' · photo' : ''}` : 'Not scanned'} />;
          })}
          <KV k="Readings by hand" v={`${Object.keys(r.readings).length} entered`} />
          <KV k="Signer" v={signer ? signer.name : 'No key on this phone'} />
        </Group>
        {locks.length ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {[...new Set(locks.map((l) => l.source))].map((s) => (
              <SourceTag key={s} source={s} />
            ))}
          </View>
        ) : null}
      </Enter>

      <Details>
        <Group>
          <KV first k="Rulebook" v={RULEBOOK} />
          <KV k="Signer key" v={signer ? signer.fp : '—'} />
        </Group>
      </Details>
      <Footnote />
    </Screen>
  );
}
