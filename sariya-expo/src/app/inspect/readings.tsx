import { Redirect, router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, C, Chip, Enter, Illo, Num, Press, Screen, SourceTag, Sub, T, Title, TopBar } from '@/components/ui';
import { evaluate, massBand, sizeClass, type Finding } from '@/lib/rules';
import { checksFor, KIND_LABEL, type CheckDef } from '@/lib/spec';
import { actions, getState, useDraft, when, type Reading } from '@/lib/store';

const num = (s: string) => s.replace(/[^0-9.]/g, '').slice(0, 6);

// Big tabular entry with the unit small and grey, readable at arm's length.
function Field({ value, onChange, unit, placeholder, label }: { value: string; onChange: (s: string) => void; unit: string; placeholder: string; label: string }) {
  return (
    <View className="flex-1">
      <T w="medium" className="mb-1.5 text-[13px] text-ink-2">
        {label}
      </T>
      <View className="h-16 flex-row items-center rounded-2xl border-2 border-ink bg-paper px-4">
        <TextInput
          value={value}
          onChangeText={(t) => onChange(num(t))}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={C.ink4}
          accessibilityLabel={`${label} in ${unit}`}
          className="flex-1 font-bold text-[30px] text-ink"
          style={{ fontVariant: ['tabular-nums'] }}
        />
        <T w="medium" className="text-[18px] text-ink-3">
          {unit}
        </T>
      </View>
    </View>
  );
}

const TITLE = { tape: 'Tape reading', scale: 'Weigh test', template: 'Hook template' };
const ASK = {
  tape: 'Tape from the formwork to the nearest bar.',
  scale: 'Weigh a 200 mm offcut on a kitchen scale.',
  template: 'Hold the 135° template against a ring hook.',
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
  let valid = Number(v) > 0;
  if (kind === 'scale') valid = !!kgm;
  else if (kind === 'template') valid = deg != null;
  const unit = kind === 'template' ? '°' : ' mm';

  return (
    <View className={`mt-4 rounded-card p-4 ${editing ? 'border-2 border-ink bg-paper' : 'bg-tile'}`}>
      <View className="flex-row items-center gap-2">
        <T w="bold" className="flex-1 text-[18px] leading-[24px]">
          {def.label}
        </T>
        {editing ? <SourceTag source={kind} /> : <Chip outcome={f.outcome} small />}
      </View>
      <T className="mt-0.5 text-[14px] text-ink-2">
        {TITLE[kind]}
        {drawing != null ? ` · drawing ${drawing}${unit}` : ' · not on drawing'}
      </T>

      {editing ? (
        <>
          <T className="mt-3 text-[15px] leading-[21px]">{ASK[kind]}</T>
          {kind === 'tape' ? (
            <View className="mt-3 flex-row">
              <Field label="Cover" value={v} onChange={setV} unit="mm" placeholder="0" />
            </View>
          ) : null}
          {kind === 'scale' ? (
            <>
              <View className="mt-3 flex-row gap-2">
                <Field label="Length" value={len} onChange={setLen} unit="mm" placeholder="200" />
                <Field label="Mass" value={mass} onChange={setMass} unit="g" placeholder="0" />
              </View>
              <Num w="medium" className="mt-3 text-[14px] leading-[20px] text-ink-2">
                {kgm ? `${kgm.toFixed(3)} kg/m · ${cls ? `${cls} mm size band` : 'outside every IS 1786 size band'}` : 'Length of the offcut, then its mass'}
                {drawing ? ` · ${drawing} mm band ${massBand(drawing)[0].toFixed(3)}–${massBand(drawing)[1].toFixed(3)} kg/m` : ''}
              </Num>
              <T className="mt-1 text-[13px] text-ink-3">Size class only. A weigh test says nothing about steel grade or brand.</T>
            </>
          ) : null}
          {kind === 'template' ? (
            <View className="mt-3 flex-row gap-2">
              {[135, 90].map((d) => {
                const on = deg === d;
                return (
                  <Press
                    key={d}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={`${d} degree hook`}
                    onPress={() => setDeg(d)}
                    className={`h-16 flex-1 items-center justify-center rounded-2xl ${on ? 'bg-ink' : 'bg-tile'}`}
                  >
                    <View className="flex-row items-baseline">
                      <Num className={`text-[26px] ${on ? 'text-white' : ''}`}>{d}°</Num>
                      <T w="medium" className={`ml-1.5 text-[15px] ${on ? 'text-white/70' : 'text-ink-3'}`}>
                        hook
                      </T>
                    </View>
                  </Press>
                );
              })}
            </View>
          ) : null}
          <View className="mt-4 flex-row gap-2">
            <View className="flex-1">
              <Button label="Not visible" kind="secondary" onPress={() => save(true)} />
            </View>
            <View className="flex-1">
              <Button label="Save" disabled={!valid} onPress={() => save()} />
            </View>
          </View>
        </>
      ) : (
        <Press accessibilityRole="button" accessibilityLabel={`Edit ${def.label}`} onPress={() => setEditing(true)} scale={0.98} className="mt-3 min-h-[48px] flex-row items-center gap-3">
          <View className="flex-1">
            {f.value ? (
              <Num className={kind === 'scale' ? 'text-[17px] leading-[24px]' : 'text-[24px] leading-[30px]'}>{f.value}</Num>
            ) : (
              <T w="medium" className="text-[16px]">
                {f.reason}
              </T>
            )}
            {saved ? (
              <T className="mt-0.5 text-[13px] text-ink-3">
                {saved.by} · {when(saved.at)}
              </T>
            ) : null}
          </View>
          <View className="h-11 flex-row items-center gap-1.5 rounded-full bg-paper px-4">
            <Pencil size={15} color={C.ink} />
            <T w="semibold" className="text-[14px]">
              Edit
            </T>
          </View>
        </Press>
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
    <Screen footer={<Button label="Done" onPress={() => router.back()} />}>
      <TopBar name={cur.name} sub={KIND_LABEL[cur.member]} />
      <View className="flex-row items-center">
        <View className="flex-1">
          <Title>Readings by hand</Title>
          <Sub>What the camera can’t see.</Sub>
        </View>
        <Illo name="tape" size={88} />
      </View>
      <View className="mt-1">
        {defs.map((d, i) => (
          <Enter key={d.id} i={i}>
            <ReadingCard def={d} f={fs.find((f) => f.def.id === d.id)!} drawing={drawingOf(d)} saved={cur.readings[d.id]} />
          </Enter>
        ))}
      </View>
    </Screen>
  );
}
