import { Redirect, router } from 'expo-router';
import { Delete, FileText, Pencil, Ruler, ScanLine } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Badge, Button, Notice, Outline, Screen, T, Tile, Title, TopBar, tap } from '@/components/ui';
import { FIELDS, KIND_LABEL, PRESET, validate, type FieldId } from '@/lib/spec';
import { actions, useDraft } from '@/lib/store';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

type Vals = Partial<Record<FieldId, string | null>>; // null = not on the drawing

// The drawing comes first. Nothing is committed until Confirm, and a missing value never borrows a default.
export default function Spec() {
  const cur = useDraft();
  const existing = cur?.spec;
  const fields = cur ? FIELDS[cur.member] : [];
  const init: Vals = {};
  if (existing) for (const f of fields) init[f.id] = existing.noDrawing ? null : existing.values[f.id] == null ? null : String(existing.values[f.id]);

  const [phase, setPhase] = useState<'choose' | 'field' | 'confirm'>(existing ? 'confirm' : 'choose');
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState<Vals>(init);
  const [preset, setPreset] = useState(existing?.preset ?? false);
  const [noDrawing, setNoDrawing] = useState(existing?.noDrawing ?? false);
  const [hooks, setHooks] = useState(existing?.hooks135 ?? false);
  const [returnTo, setReturnTo] = useState<'confirm' | null>(null);

  if (!cur) return <Redirect href="/" />;
  const head = <TopBar name={cur.name} sub={`${KIND_LABEL[cur.member]}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`} />;

  if (phase === 'choose') {
    return (
      <Screen>
        {head}
        <Title>Drawing values</Title>
        <T className="mt-2 text-[17px] text-ink-2">Sariya checks whatever the drawing says.</T>
        <View className="mt-6 gap-3">
          <Tile
            onPress={() => {
              setPhase('field');
              setStep(0);
            }}
            className="flex-row items-center gap-4 px-5 py-5"
          >
            <FileText size={28} color="#000" strokeWidth={1.8} />
            <View className="flex-1">
              <T w="semibold" className="text-[20px]">
                Enter from the drawing
              </T>
              <T className="mt-1 text-[15px] text-ink-2">Type each value, one at a time</T>
            </View>
          </Tile>
          <Tile
            badge="DEMO PROP"
            onPress={() => {
              const v: Vals = {};
              for (const f of fields) v[f.id] = String(PRESET[cur.member][f.id]);
              setVals(v);
              setPreset(true);
              setNoDrawing(false);
              setPhase('confirm');
            }}
            className="flex-row items-center gap-4 px-5 py-5"
          >
            <MemberArt kind={cur.member} size={44} />
            <View className="flex-1">
              <T w="semibold" className="text-[20px]">
                Half-scale stage prop
              </T>
              <T className="mt-1 text-[15px] text-ink-2">{cur.member === 'slab' ? '8 mm bars, 5 each way at 50 c/c' : '8 mm rings, 50 over the first 150, 75 mid'}. Editable.</T>
            </View>
          </Tile>
          <Tile
            onPress={() => {
              setVals({});
              setNoDrawing(true);
              setPreset(false);
              setPhase('confirm');
            }}
            className="flex-row items-center gap-4 px-5 py-5"
          >
            <Ruler size={28} color="#000" strokeWidth={1.8} />
            <View className="flex-1">
              <T w="semibold" className="text-[20px]">
                No drawing: measure only
              </T>
              <T className="mt-1 text-[15px] text-ink-2">Values and bands, no within or outside</T>
            </View>
          </Tile>
        </View>
      </Screen>
    );
  }

  if (phase === 'field') {
    const f = fields[step];
    const raw = vals[f.id];
    const v = raw ?? '';
    const err = v ? validate(f, Number(v)) : null;
    const setV = (s: string) => setVals((o) => ({ ...o, [f.id]: s }));
    const next = (value: string | null) => {
      setVals((o) => ({ ...o, [f.id]: value }));
      setPreset(false);
      if (returnTo || step + 1 >= fields.length) {
        setReturnTo(null);
        setPhase('confirm');
      } else setStep(step + 1);
    };
    return (
      <Screen
        footer={
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Not on drawing" kind="secondary" onPress={() => next(null)} />
            </View>
            <View className="flex-1">
              <Button label="Next" disabled={!v || !!err} onPress={() => next(v)} />
            </View>
          </View>
        }
      >
        {head}
        <View className="flex-row gap-1.5">
          {fields.map((x, i) => (
            <View key={x.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-ink' : 'bg-line'}`} />
          ))}
        </View>
        <T w="medium" className="mt-5 text-[15px] text-ink-2">
          Value {step + 1} of {fields.length} · from the drawing
        </T>
        <Title className="mt-1">{f.label}</Title>
        <T className="mt-1 text-[17px] text-ink-2">{f.hint}</T>

        <View className="mt-6 flex-row items-end justify-center rounded-card bg-tile py-6">
          <T w="bold" className={`text-[64px] leading-[70px] tracking-[-2px] ${v ? '' : 'text-ink-3'}`}>
            {v || '—'}
          </T>
          <T w="medium" className="mb-3 ml-2 text-[22px] text-ink-2">
            {f.unit}
          </T>
        </View>
        <T w="medium" className={`mt-2 text-center text-[15px] ${err ? 'text-fail' : 'text-ink-2'}`}>
          {err ?? (f.allowed ? 'Pick a standard size' : `${f.min}–${f.max} ${f.unit}`)}
        </T>

        {f.allowed ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {f.allowed.map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  tap();
                  setV(String(d));
                }}
                className={`h-16 w-[23%] items-center justify-center rounded-xl ${v === String(d) ? 'bg-ink' : 'bg-tile'} active:opacity-70`}
              >
                <T w="semibold" className={`text-[24px] ${v === String(d) ? 'text-white' : ''}`}>
                  {d}
                </T>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
            {KEYS.map((k, i) =>
              k === '' ? (
                <View key={i} className="h-16 w-[32%]" />
              ) : (
                <Pressable
                  key={i}
                  onPress={() => {
                    tap();
                    setV(k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 4));
                  }}
                  className="h-16 w-[32%] items-center justify-center rounded-xl bg-tile active:bg-pill"
                >
                  {k === 'del' ? (
                    <Delete size={26} color="#000" />
                  ) : (
                    <T w="semibold" className="text-[28px]">
                      {k}
                    </T>
                  )}
                </Pressable>
              ),
            )}
          </View>
        )}
      </Screen>
    );
  }

  const same = !!existing && fields.every((f) => (init[f.id] ?? null) === (vals[f.id] ?? null)) && existing.hooks135 === hooks && existing.noDrawing === noDrawing;
  const rev = existing ? existing.rev + (same ? 0 : 1) : 1;
  const confirm = () => {
    const values: Partial<Record<FieldId, number | null>> = {};
    for (const f of fields) values[f.id] = noDrawing || vals[f.id] == null ? null : Number(vals[f.id]);
    actions.setSpec({ rev, values, hooks135: cur.member === 'beam' && hooks, preset, noDrawing });
    if (existing) {
      router.back();
      return;
    }
    // The checks sheet sits under the scanner, so closing the camera lands on it.
    router.replace('/inspect/summary');
    router.push('/inspect/scan');
  };
  const missing = !noDrawing && fields.some((f) => vals[f.id] === undefined);

  return (
    <Screen footer={<Button label={missing ? 'Enter every value first' : existing ? `Confirm · spec rev ${rev}` : 'Confirm and start scan'} icon={existing ? undefined : ScanLine} disabled={missing} onPress={confirm} />}>
      {head}
      <View className="flex-row items-center gap-3">
        <Title className="flex-1">Check the drawing</Title>
        {preset ? <Badge>DEMO PROP</Badge> : null}
      </View>
      <T className="mt-2 text-[17px] text-ink-2">{noDrawing ? 'Measure-only mode: values with their bands, no verdict against a drawing.' : 'Every scan is compared with these values. Tap one to change it.'}</T>

      {existing && rev > existing.rev && cur.locks.some((l) => !l.superseded) ? (
        <Notice tone="warn" className="mt-4" title="Changing the drawing clears fresh scans">
          Locked values so far stay in the record as history. You will scan again against rev {rev}.
        </Notice>
      ) : null}

      <Outline className="mt-6">
        {fields.map((f, i) => {
          const raw = vals[f.id];
          const shown = noDrawing || raw === null ? 'Not on drawing' : raw === undefined ? 'Not entered' : `${raw} ${f.unit}`;
          return (
            <Pressable
              key={f.id}
              onPress={() => {
                tap();
                setNoDrawing(false);
                setStep(i);
                setReturnTo('confirm');
                setPhase('field');
              }}
              className={`flex-row items-center px-4 py-4 active:bg-tile ${i ? 'border-t border-line' : ''}`}
            >
              <View className="flex-1">
                <T className="text-[15px] text-ink-2">{f.label}</T>
                <T w="semibold" className={`mt-0.5 text-[20px] ${raw == null || noDrawing ? 'text-ink-3' : ''}`}>
                  {shown}
                </T>
              </View>
              <Pencil size={18} color="#5E5E5E" />
            </Pressable>
          );
        })}
        {cur.member === 'beam' && !noDrawing ? (
          <View className="flex-row items-center border-t border-line px-4 py-4">
            <View className="flex-1">
              <T className="text-[15px] text-ink-2">135° hooks</T>
              <T w="semibold" className="mt-0.5 text-[17px]">
                {hooks ? 'Drawing asks for them' : 'Not asked for (Zone II: advisory)'}
              </T>
            </View>
            <Switch value={hooks} onValueChange={setHooks} trackColor={{ true: '#000', false: '#E2E2E2' }} thumbColor="#fff" />
          </View>
        ) : null}
      </Outline>
      {existing == null ? (
        <Pressable
          onPress={() => {
            tap();
            setPhase('choose');
          }}
          className="mt-4 self-start"
        >
          <T w="medium" className="text-[15px] text-ink-2 underline">
            Start over
          </T>
        </Pressable>
      ) : null}
    </Screen>
  );
}
