import { ArrowRight, ChevronRight, Delete } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Switch, View } from 'react-native';

import { Badge, Button, C, Enter, Group, Hairline, Illo, Meter, Num, Overline, Press, Row, Screen, Sub, T, TextBtn, Title } from '@/components/ui';
import { FIELDS, PRESET, validate, type FieldId, type MemberKind } from '@/lib/spec';

const ADVANCE_MS = 180;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export type Vals = Partial<Record<FieldId, string | null>>; // null = not on the drawing
export type SpecDraft = {
  vals: Vals;
  preset: boolean;
  noDrawing: boolean;
  hooks: boolean;
};

// Shared by the operator (values for their own scan) and the engineer (values they sign and send), so both enter a drawing the same way.
export function SpecForm({
  member,
  head,
  sub,
  init,
  allowNoDrawing = false,
  confirmTop,
  confirmFooter,
}: {
  member: MemberKind;
  head: ReactNode;
  sub: string;
  init?: SpecDraft; // opens on the list, with no way back to the start
  allowNoDrawing?: boolean;
  confirmTop?: (d: SpecDraft) => ReactNode;
  confirmFooter: (d: SpecDraft, missing: boolean) => ReactNode;
}) {
  const fields = FIELDS[member];
  const [phase, setPhase] = useState<'choose' | 'field' | 'confirm'>(init ? 'confirm' : 'choose');
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState<Vals>(init?.vals ?? {});
  const [preset, setPreset] = useState(init?.preset ?? false);
  const [noDrawing, setNoDrawing] = useState(init?.noDrawing ?? false);
  const [hooks, setHooks] = useState(init?.hooks ?? false);
  const [returnTo, setReturnTo] = useState<'confirm' | null>(null);

  if (phase === 'choose') {
    return (
      <Screen>
        {head}
        <Title>Drawing values</Title>
        <Sub>{sub}</Sub>

        <Enter i={0}>
          <Press
            feel="impact"
            accessibilityRole="button"
            accessibilityLabel="Enter from the drawing"
            onPress={() => {
              setPhase('field');
              setStep(0);
            }}
            className="mt-6 flex-row items-center overflow-hidden rounded-card bg-ink py-4 pl-5 pr-3"
          >
            <View className="flex-1">
              <T w="bold" className="text-[22px] leading-[28px] text-white">
                Enter from the drawing
              </T>
              <T className="mt-1 text-[15px] text-white/70">One value at a time</T>
              <View className="mt-4 h-10 w-10 items-center justify-center rounded-full bg-paper">
                <ArrowRight size={20} color={C.ink} strokeWidth={2.4} />
              </View>
            </View>
            <Illo name="records" size={112} />
          </Press>
        </Enter>

        <Enter i={1}>
          <Overline className="mt-7">Or</Overline>
          <Group className="mt-2">
            <Row
              first
              illo={member}
              title="Stage prop values"
              sub={member === 'slab' ? '8 mm bars, 5 each way at 50 c/c' : '8 mm rings, 50 end zone, 75 mid'}
              right={<Badge>DEMO</Badge>}
              onPress={() => {
                const v: Vals = {};
                for (const f of fields) v[f.id] = String(PRESET[member][f.id]);
                setVals(v);
                setPreset(true);
                setNoDrawing(false);
                setPhase('confirm');
              }}
            />
            {allowNoDrawing ? (
              <Row
                illo="tape"
                title="No drawing"
                sub="Measure only: values and bands, no verdict"
                onPress={() => {
                  setVals({});
                  setNoDrawing(true);
                  setPreset(false);
                  setPhase('confirm');
                }}
              />
            ) : null}
          </Group>
        </Enter>
      </Screen>
    );
  }

  if (phase === 'field') {
    const f = fields[step];
    const v = vals[f.id] ?? '';
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
          <>
            <Button label="Next" disabled={!v || !!err} onPress={() => next(v)} />
            <TextBtn label="Not on drawing" onPress={() => next(null)} />
          </>
        }
      >
        {head}
        <Meter value={(step + 1) / fields.length} />
        <Num w="semibold" className="mt-4 text-[14px] text-ink-2">
          {step + 1} of {fields.length}
        </Num>
        <Title className="mt-1">{f.label}</Title>
        <Sub>{f.hint}</Sub>

        <View className="mt-4 flex-row items-baseline justify-center py-3" accessible accessibilityLabel={`${v || 'empty'} ${f.unit}`}>
          <Num className="text-[80px] leading-[88px] tracking-[-3px]" style={v ? undefined : { color: C.ink4 }}>
            {v || '—'}
          </Num>
          <T w="medium" className="ml-2 text-[24px] text-ink-3">
            {f.unit}
          </T>
        </View>
        <T w="medium" className={`text-center text-[14px] ${err ? 'text-fail' : 'text-ink-3'}`}>
          {err ?? (f.allowed ? 'Pick a standard size' : `${f.min}–${f.max} ${f.unit}`)}
        </T>

        {f.allowed ? (
          <View className="mt-5 flex-row flex-wrap justify-between gap-y-2">
            {f.allowed.map((d) => {
              const on = v === String(d);
              return (
                <Press
                  key={d}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${d} mm`}
                  onPress={() => {
                    // A standard size is a complete answer: show it picked, then move on without a second tap.
                    setV(String(d));
                    setTimeout(() => next(String(d)), ADVANCE_MS);
                  }}
                  className={`h-16 w-[23.5%] items-center justify-center rounded-2xl ${on ? 'bg-ink' : 'bg-tile'}`}
                >
                  <Num className={`text-[26px] ${on ? 'text-white' : ''}`}>{d}</Num>
                </Press>
              );
            })}
          </View>
        ) : (
          <View className="mt-5 flex-row flex-wrap justify-between gap-y-2">
            {KEYS.map((k, i) =>
              k === '' ? (
                <View key={i} className="h-16 w-[32%]" />
              ) : (
                <Press
                  key={i}
                  scale={0.94}
                  accessibilityRole="button"
                  accessibilityLabel={k === 'del' ? 'Delete' : k}
                  onPress={() => setV(k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 4))}
                  className="h-16 w-[32%] items-center justify-center rounded-2xl bg-tile"
                >
                  {k === 'del' ? <Delete size={28} color={C.ink} strokeWidth={2} /> : <Num w="semibold" className="text-[30px]">{k}</Num>}
                </Press>
              ),
            )}
          </View>
        )}
      </Screen>
    );
  }

  const draft: SpecDraft = {
    vals,
    preset,
    noDrawing,
    hooks: member === 'beam' && hooks,
  };
  const missing = !noDrawing && fields.some((f) => vals[f.id] === undefined);

  return (
    <Screen footer={confirmFooter(draft, missing)}>
      {head}
      <View className="flex-row items-center gap-3">
        <Title className="flex-1">{noDrawing ? 'Measure only' : 'Check the values'}</Title>
        {preset ? <Badge>DEMO</Badge> : null}
      </View>
      <Sub>{noDrawing ? 'Values with their bands, no verdict.' : 'Tap a value to change it.'}</Sub>

      {confirmTop?.(draft)}

      <Group className="mt-5">
        {fields.map((f, i) => {
          const raw = vals[f.id];
          const blank = noDrawing || raw == null;
          let empty = 'Not entered';
          if (noDrawing || raw === null) empty = 'Not on drawing';
          return (
            <Enter key={f.id} i={i}>
              <Press
                scale={0.985}
                accessibilityRole="button"
                accessibilityLabel={`${f.label}: ${blank ? empty : `${raw} ${f.unit}`}`}
                onPress={() => {
                  setNoDrawing(false);
                  setStep(i);
                  setReturnTo('confirm');
                  setPhase('field');
                }}
                className="min-h-[60px] flex-row items-center gap-3 bg-paper px-4 py-3"
              >
                {i ? <Hairline /> : null}
                <T w="medium" className="flex-1 text-[16px] leading-[22px]">
                  {f.label}
                </T>
                {blank ? (
                  <T w="medium" className="text-[15px] text-ink-3">
                    {empty}
                  </T>
                ) : (
                  <View className="flex-row items-baseline">
                    <Num className="text-[20px]">{raw}</Num>
                    <T w="medium" className="ml-1 text-[14px] text-ink-3">
                      {f.unit}
                    </T>
                  </View>
                )}
                <ChevronRight size={18} color={C.ink4} />
              </Press>
            </Enter>
          );
        })}
        {member === 'beam' && !noDrawing ? (
          <View className="min-h-[60px] flex-row items-center gap-3 px-4 py-3">
            <Hairline />
            <View className="flex-1">
              <T w="medium" className="text-[16px]">
                135° hooks asked for
              </T>
              {hooks ? null : <T className="text-[13px] text-ink-3">Zone II: advisory only</T>}
            </View>
            <Switch value={hooks} onValueChange={setHooks} trackColor={{ true: C.ink, false: C.line }} thumbColor="#fff" accessibilityLabel="135° hooks asked for" />
          </View>
        ) : null}
      </Group>
    </Screen>
  );
}

// Typed strings to stored numbers; anything not entered or marked "not on drawing" is null, never a default.
export function toValues(member: MemberKind, d: SpecDraft): Partial<Record<FieldId, number | null>> {
  const values: Partial<Record<FieldId, number | null>> = {};
  for (const f of FIELDS[member]) values[f.id] = d.noDrawing || d.vals[f.id] == null ? null : Number(d.vals[f.id]);
  return values;
}
