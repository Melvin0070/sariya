import { Redirect, router } from 'expo-router';
import { ChevronRight, Delete, FileText, Grid3x3, Ruler, ScanLine } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { Badge, Button, Group, Hairline, Notice, Row, Screen, Sub, T, TextBtn, Title, TopBar, tap } from '@/components/ui';
import { FIELDS, KIND_LABEL, PRESET, validate, type FieldId } from '@/lib/spec';
import { actions, useDraft, when } from '@/lib/store';

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
        <Sub>Every scan is checked against these.</Sub>
        <Group className="mt-5">
          <Row
            first
            icon={FileText}
            title="Enter from the drawing"
            sub="One value at a time"
            onPress={() => {
              setPhase('field');
              setStep(0);
            }}
          />
          <Row
            icon={Grid3x3}
            title="Stage prop values"
            sub={cur.member === 'slab' ? '8 mm bars, 5 each way at 50 c/c' : '8 mm rings, 50 end zone, 75 mid'}
            right={<Badge>DEMO</Badge>}
            onPress={() => {
              const v: Vals = {};
              for (const f of fields) v[f.id] = String(PRESET[cur.member][f.id]);
              setVals(v);
              setPreset(true);
              setNoDrawing(false);
              setPhase('confirm');
            }}
          />
          <Row
            icon={Ruler}
            title="No drawing"
            sub="Measure only: values and bands, no verdict"
            onPress={() => {
              setVals({});
              setNoDrawing(true);
              setPreset(false);
              setPhase('confirm');
            }}
          />
        </Group>
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
        <T w="medium" className="mt-5 text-[14px] text-ink-2">
          {step + 1} of {fields.length}
        </T>
        <Title className="mt-1">{f.label}</Title>
        <Sub>{f.hint}</Sub>

        <View className="mt-5 flex-row items-end justify-center py-4">
          <T w="bold" className={`text-[64px] leading-[70px] tracking-[-2px] ${v ? '' : 'text-ink-3'}`}>
            {v || '—'}
          </T>
          <T w="medium" className="mb-3 ml-2 text-[22px] text-ink-2">
            {f.unit}
          </T>
        </View>
        <T w="medium" className={`text-center text-[14px] ${err ? 'text-fail' : 'text-ink-3'}`}>
          {err ?? (f.allowed ? 'Pick a standard size' : `${f.min}–${f.max} ${f.unit}`)}
        </T>

        {f.allowed ? (
          <View className="mt-5 flex-row flex-wrap gap-2">
            {f.allowed.map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  tap();
                  setV(String(d));
                }}
                className={`h-14 w-[23%] items-center justify-center rounded-xl ${v === String(d) ? 'bg-ink' : 'bg-tile'} active:opacity-70`}
              >
                <T w="semibold" className={`text-[24px] ${v === String(d) ? 'text-white' : ''}`}>
                  {d}
                </T>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="mt-5 flex-row flex-wrap justify-between gap-y-2">
            {KEYS.map((k, i) =>
              k === '' ? (
                <View key={i} className="h-14 w-[32%]" />
              ) : (
                <Pressable
                  key={i}
                  onPress={() => {
                    tap();
                    setV(k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 4));
                  }}
                  className="h-14 w-[32%] items-center justify-center rounded-xl bg-tile active:bg-pill"
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
    actions.setSpec({ rev, values, hooks135: cur.member === 'beam' && hooks, preset, noDrawing, issued: same ? existing?.issued : undefined });
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
    <Screen footer={<Button label={missing ? 'Enter every value first' : existing ? (same ? 'Done' : `Save as rev ${rev}`) : 'Start scan'} icon={existing ? undefined : ScanLine} disabled={missing} onPress={confirm} />}>
      {head}
      <View className="flex-row items-center gap-3">
        <Title className="flex-1">{noDrawing ? 'Measure only' : 'Check the values'}</Title>
        {preset ? <Badge>DEMO</Badge> : null}
      </View>
      <Sub>{noDrawing ? 'Values with their bands, no verdict.' : 'Tap a value to change it.'}</Sub>

      {existing?.issued ? (
        same ? (
          <Notice tone="pass" className="mt-4" title={`From ${existing.issued.payload.e}’s drawing · signed ${when(existing.issued.payload.t)}`}>
            Changing a value marks the drawing values as typed on site, and the engineer sees that in review.
          </Notice>
        ) : (
          <Notice tone="warn" className="mt-4" title="No longer the engineer’s values">
            Saving keeps your values, marked as typed on site. The engineer is asked to check them against the drawing.
          </Notice>
        )
      ) : null}

      {existing && rev > existing.rev && cur.locks.some((l) => !l.superseded) ? (
        <Notice tone="warn" className="mt-4" title={`Saving makes drawing rev ${rev}`}>
          Scans so far stay as history; scan again against the new values.
        </Notice>
      ) : null}

      <Group className="mt-4">
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
              className="flex-row items-center gap-3 px-4 py-4 active:bg-tile"
            >
              {i ? <Hairline /> : null}
              <T className="flex-1 text-[16px] text-ink-2">{f.label}</T>
              <T w="semibold" className={`text-[17px] ${raw == null || noDrawing ? 'text-ink-3' : ''}`}>
                {shown}
              </T>
              <ChevronRight size={18} color="#BDBDBD" />
            </Pressable>
          );
        })}
        {cur.member === 'beam' && !noDrawing ? (
          <View className="flex-row items-center gap-3 px-4 py-3">
            <Hairline />
            <View className="flex-1">
              <T className="text-[16px] text-ink-2">135° hooks asked for</T>
              {hooks ? null : <T className="text-[13px] text-ink-3">Zone II: advisory only</T>}
            </View>
            <Switch value={hooks} onValueChange={setHooks} trackColor={{ true: '#000', false: '#E2E2E2' }} thumbColor="#fff" />
          </View>
        ) : null}
      </Group>
      {existing == null ? <TextBtn label="Start over" onPress={() => setPhase('choose')} /> : null}
    </Screen>
  );
}
