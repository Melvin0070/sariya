import { Redirect, router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Button, Chip, Screen, SourceTag, T, Title, TopBar, tap } from '@/components/ui';
import { evaluate, massBand, sizeClass, type Finding } from '@/lib/rules';
import { checksFor, KIND_LABEL, type CheckDef } from '@/lib/spec';
import { actions, getState, useDraft, when, type Reading } from '@/lib/store';

const num = (s: string) => s.replace(/[^0-9.]/g, '').slice(0, 6);

function Field({ value, onChange, unit, placeholder }: { value: string; onChange: (s: string) => void; unit: string; placeholder: string }) {
  return (
    <View className="h-[60px] flex-1 flex-row items-center rounded-xl bg-tile px-4">
      <TextInput value={value} onChangeText={(t) => onChange(num(t))} keyboardType="numeric" placeholder={placeholder} placeholderTextColor="#8A8A8A" className="flex-1 font-bold text-[24px] text-ink" />
      <T w="medium" className="text-[17px] text-ink-2">
        {unit}
      </T>
    </View>
  );
}

const TITLE = { tape: 'Tape reading', scale: 'Weigh test', template: 'Hook template' };
const ASK = {
  tape: 'The camera can’t see under the bars. Measure with a tape and enter it.',
  scale: 'A camera can’t tell 10 from 12 mm at arm’s length. Cut a 200 mm offcut and weigh it on a kitchen scale.',
  template: 'Hold the 135° template card against a ring hook.',
};

// One physical reading. Saving records the value, its source and who entered it; nothing here is a camera measurement.
function ReadingCard({ def, f, drawing, saved }: { def: CheckDef; f: Finding; drawing: number | null; saved?: Reading }) {
  const kind = def.reading!;
  const [editing, setEditing] = useState(!saved);
  const [v, setV] = useState(saved?.value != null ? String(saved.value) : '');
  const [len, setLen] = useState(String(saved?.lengthMm ?? 200));
  const [mass, setMass] = useState(saved?.massG != null ? String(saved.massG) : '');
  const [deg, setDeg] = useState<number | null>(saved?.value ?? null);

  const by = getState().name;
  const save = (notSeen = false) => {
    const base = { kind, by, at: Date.now() };
    if (notSeen) actions.setReading(def.id, { ...base, notSeen: true });
    else if (kind === 'scale') actions.setReading(def.id, { ...base, lengthMm: Number(len), massG: Number(mass) });
    else if (kind === 'template') actions.setReading(def.id, { ...base, value: deg ?? undefined });
    else actions.setReading(def.id, { ...base, value: Number(v) });
    setEditing(false);
  };

  const kgm = Number(mass) > 0 && Number(len) > 0 ? Number(mass) / Number(len) : null;
  const cls = kgm ? sizeClass(kgm) : null;
  const valid = kind === 'scale' ? !!kgm : kind === 'template' ? deg != null : Number(v) > 0;

  return (
    <View className="mt-4 rounded-card border border-line p-4">
      <View className="flex-row items-center gap-2">
        <T w="semibold" className="flex-1 text-[19px]">
          {def.label}
        </T>
        <SourceTag source={kind} />
      </View>
      <T className="mt-0.5 text-[14px] text-ink-2">
        {TITLE[kind]}
        {drawing != null ? ` · drawing ${drawing}${kind === 'template' ? '°' : ' mm'}` : ' · not on drawing'}
      </T>

      {editing ? (
        <>
          <T className="mt-2 text-[15px] leading-[22px] text-ink-2">{ASK[kind]}</T>
          {kind === 'tape' ? (
            <View className="mt-3 flex-row">
              <Field value={v} onChange={setV} unit="mm" placeholder="0" />
            </View>
          ) : null}
          {kind === 'scale' ? (
            <>
              <View className="mt-3 flex-row gap-2">
                <Field value={len} onChange={setLen} unit="mm" placeholder="200" />
                <Field value={mass} onChange={setMass} unit="g" placeholder="0" />
              </View>
              <T className="mt-2 text-[14px] text-ink-2">
                {kgm ? `${kgm.toFixed(3)} kg/m · ${cls ? `${cls} mm size band` : 'outside every IS 1786 size band'}` : 'Length of the offcut, then its mass'}
                {drawing ? ` · ${drawing} mm band ${massBand(drawing)[0].toFixed(3)}–${massBand(drawing)[1].toFixed(3)} kg/m` : ''}
              </T>
              <T className="mt-1 text-[12px] text-ink-3">Size class only. A weigh test says nothing about steel grade or brand.</T>
            </>
          ) : null}
          {kind === 'template' ? (
            <View className="mt-3 flex-row gap-2">
              {[135, 90].map((d) => (
                <Pressable key={d} onPress={() => (tap(), setDeg(d))} className={`h-14 flex-1 items-center justify-center rounded-xl ${deg === d ? 'bg-ink' : 'bg-tile'}`}>
                  <T w="semibold" className={`text-[18px] ${deg === d ? 'text-white' : ''}`}>
                    {d}° hook
                  </T>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View className="mt-3 flex-row gap-2">
            <View className="flex-1">
              <Button label="Not visible" kind="secondary" onPress={() => save(true)} />
            </View>
            <View className="flex-[2]">
              <Button label="Save reading" disabled={!valid} onPress={() => save()} />
            </View>
          </View>
        </>
      ) : (
        <Pressable onPress={() => (tap(), setEditing(true))} className="mt-2 flex-row items-center">
          <View className="flex-1">
            <T className="text-[16px]">{f.value ?? f.reason}</T>
            {saved ? (
              <T className="mt-0.5 text-[13px] text-ink-2">
                Entered by {saved.by} · {when(saved.at)}
              </T>
            ) : null}
            <View className="mt-2">
              <Chip outcome={f.outcome} small />
            </View>
          </View>
          <Pencil size={18} color="#5E5E5E" />
        </Pressable>
      )}
    </View>
  );
}

export default function Readings() {
  const cur = useDraft();
  if (!cur) return <Redirect href="/" />;
  const defs = checksFor(cur.member, cur.spec).filter((c) => c.reading);
  const fs = evaluate(cur);
  const drawingOf = (d: CheckDef) => {
    if (cur.spec?.noDrawing) return null;
    if (d.id === 'hook') return 135;
    if (d.id === 'cover') return cur.spec?.values.cover ?? null;
    return cur.spec?.values[cur.member === 'slab' ? 'dia' : 'stirrup_dia'] ?? null;
  };

  return (
    <Screen footer={<Button label="See all checks" onPress={() => router.back()} />}>
      <TopBar name={cur.name} sub={KIND_LABEL[cur.member]} />
      <Title>Readings by hand</Title>
      <T className="mt-2 text-[17px] text-ink-2">What a camera can’t measure. Each reading is saved with its source.</T>
      {defs.map((d) => (
        <ReadingCard key={d.id} def={d} f={fs.find((f) => f.def.id === d.id)!} drawing={drawingOf(d)} saved={cur.readings[d.id]} />
      ))}
    </Screen>
  );
}
