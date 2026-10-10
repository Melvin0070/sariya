import { router } from 'expo-router';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Switch, TextInput, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, Group, Hairline, Notice, Screen, Sub, T, TextBtn, Tile, Title, TopBar } from '@/components/ui';
import { saveToFolder, shareFile } from '@/lib/files';
import { makeSpec, specFile, specName } from '@/lib/pack';
import { FIELDS, isSoon, KIND_LABEL, PRESET, validate, type FieldId, type MemberKind, type SpecValues } from '@/lib/spec';
import { useStore } from '@/lib/store';

const KINDS: MemberKind[] = ['slab', 'beam'];
const EXAMPLE: Record<MemberKind, string> = { slab: 'Slab S1, first floor', beam: 'Beam B2, grid C' };

// The engineer sets the bar: drawing values are signed here and sent to the operator, who scans against them.
export default function IssueSpec() {
  const enrolled = useStore((s) => s.trusted.some((p) => p.role === 'operator'));
  const [kind, setKind] = useState<MemberKind>('slab');
  const [name, setName] = useState('');
  const [vals, setVals] = useState<Partial<Record<FieldId, string>>>({});
  const [hooks, setHooks] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'pass' | 'fail'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const fields = FIELDS[kind];
  // An empty field means "not on the drawing": shown as such, so a gap is a decision, not an accident.
  const errs = fields.map((f) => (vals[f.id] ? validate(f, Number(vals[f.id])) : null));
  const ready = name.trim().length > 0 && errs.every((e) => !e);

  const send = async (how: 'share' | 'folder') => {
    setBusy(true);
    setMsg(null);
    try {
      const values: SpecValues = {};
      for (const f of fields) values[f.id] = vals[f.id] ? Number(vals[f.id]) : null;
      const spec = makeSpec(kind, name.trim(), values, hooks);
      const text = specFile(spec);
      const sent = how === 'share' ? await shareFile(specName(spec.payload), text, 'Send drawing values with Office Kit') : await saveToFolder(specName(spec.payload), text);
      if (sent) setMsg({ tone: 'pass', text: `Signed and sent. The operator opens it from “Drawing values from the engineer”.` });
    } catch (e) {
      setMsg({ tone: 'fail', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <>
          <Button label="Sign and send to the operator" icon={Send} disabled={!ready || busy} onPress={() => send('share')} />
          <TextBtn label="Save to a folder instead" disabled={!ready || busy} onPress={() => send('folder')} />
        </>
      }
    >
      <TopBar />
      <Title>Drawing values</Title>
      <Sub>Signed with your key. The operator scans against them and cannot change them without your review saying so.</Sub>
      {enrolled ? null : (
        <Notice tone="warn" className="mt-4" title="Enrol the operator’s phone first">
          It accepts drawing values only from an enrolled engineer key.
        </Notice>
      )}
      {msg ? <Notice tone={msg.tone} className="mt-4" title={msg.text} /> : null}

      <View className="mt-6 flex-row gap-3">
        {KINDS.map((k) => (
          <Tile
            key={k}
            on={kind === k}
            onPress={
              isSoon(k)
                ? undefined
                : () => {
                    setKind(k);
                    setVals({});
                    setMsg(null);
                  }
            }
            className={`flex-1 items-center pb-3 pt-2 ${isSoon(k) ? 'opacity-50' : ''}`}
          >
            <MemberArt kind={k} size={84} />
            <T w="semibold" className="text-[16px]">
              {KIND_LABEL[k]}
            </T>
            {isSoon(k) ? <T className="text-[13px] text-ink-2">Coming soon</T> : null}
          </Tile>
        ))}
      </View>

      <T w="medium" className="mt-7 text-[15px] text-ink-2">
        Member and zone, as on the drawing
      </T>
      <View className="mt-2 h-14 justify-center rounded-xl bg-tile px-4">
        <TextInput value={name} onChangeText={setName} placeholder={EXAMPLE[kind]} placeholderTextColor="#8A8A8A" className="font-medium text-[18px] text-ink" />
      </View>

      <Group className="mt-6">
        {fields.map((f, i) => (
          <View key={f.id} className="px-4 py-3">
            {i ? <Hairline /> : null}
            <View className="flex-row items-center gap-3">
              <T className="flex-1 text-[16px] text-ink-2">{f.label}</T>
              <TextInput
                value={vals[f.id] ?? ''}
                onChangeText={(t) => setVals((o) => ({ ...o, [f.id]: t.replace(/\D/g, '').slice(0, 4) }))}
                placeholder="Not on drawing"
                placeholderTextColor="#BDBDBD"
                keyboardType="number-pad"
                className="min-w-[120px] text-right font-semibold text-[17px] text-ink"
              />
              <T className="w-10 text-[15px] text-ink-2">{f.unit}</T>
            </View>
            {errs[i] ? <T className="mt-1 text-[13px] text-fail">{errs[i]}</T> : null}
          </View>
        ))}
        {kind === 'beam' ? (
          <View className="flex-row items-center gap-3 px-4 py-3">
            <Hairline />
            <T className="flex-1 text-[16px] text-ink-2">135° hooks asked for</T>
            <Switch value={hooks} onValueChange={setHooks} trackColor={{ true: '#000', false: '#E2E2E2' }} thumbColor="#fff" />
          </View>
        ) : null}
      </Group>
      <TextBtn
        label="Fill with the stage prop values"
        onPress={() => {
          const v: Partial<Record<FieldId, string>> = {};
          for (const f of fields) v[f.id] = String(PRESET[kind][f.id]);
          setVals(v);
          if (!name.trim()) setName(kind === 'slab' ? 'Slab S1, stage prop' : 'Beam B2, stage prop');
        }}
      />
      <TextBtn label="Done" onPress={() => router.back()} />
    </Screen>
  );
}
