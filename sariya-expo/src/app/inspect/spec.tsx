import { router } from 'expo-router';
import { Delete, Pencil, ScanLine } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, Outline, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { actions, CAMERA_KINDS, fieldId, SPEC_FIELDS, useStore, KIND_LABEL } from '@/lib/store';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function Spec() {
  const cur = useStore((s) => s.current);
  const fields = cur ? SPEC_FIELDS[cur.kind] : [];
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState<Record<string, string>>({});

  const confirm = step >= fields.length;
  const f = fields[Math.min(step, fields.length - 1)];
  const v = f ? (vals[fieldId(f)] ?? '') : '';
  const setV = (s: string) => f && setVals((o) => ({ ...o, [fieldId(f)]: s }));

  if (!cur || !f) return null;

  if (confirm) {
    return (
      <Screen
        footer={
          <Button
            label="Start scan"
            icon={ScanLine}
            onPress={() => {
              const out: Record<string, number | null> = {};
              fields.forEach((x) => (out[fieldId(x)] = vals[fieldId(x)] ? Number(vals[fieldId(x)]) : null));
              actions.setSpec(out);
              router.replace('/inspect/scan');
            }}
          />
        }
      >
        <TopBar name={cur.name} sub={KIND_LABEL[cur.kind]} />
        <Title>Check the drawing</Title>
        <T className="mt-2 text-[17px] text-ink-2">Sariya compares every scan against these values.</T>

        <Outline className="mt-6">
          <View className="flex-row items-center gap-4 bg-tile p-4">
            <MemberArt kind={cur.kind} size={64} />
            <View className="flex-1">
              <T w="semibold" className="text-[18px]">
                {cur.name}
              </T>
              <T className="text-[15px] text-ink-2">{KIND_LABEL[cur.kind]}</T>
            </View>
          </View>
          {fields.map((x, i) => (
            <Pressable key={fieldId(x)} onPress={() => setStep(i)} className="flex-row items-center border-t border-line px-4 py-4 active:bg-tile">
              <View className="flex-1">
                <T className="text-[15px] text-ink-2">{x.label}</T>
                <T w="semibold" className="mt-0.5 text-[20px]">
                  {vals[fieldId(x)] || x.fallback} {x.unit}
                  {!vals[fieldId(x)] ? <T className="text-[14px] text-ink-3">  default</T> : null}
                </T>
              </View>
              <View className={`mr-3 rounded-full px-2.5 py-1 ${CAMERA_KINDS.includes(x.key) ? 'bg-accent-soft' : 'bg-pill'}`}>
                <T w="semibold" className={`text-[12px] ${CAMERA_KINDS.includes(x.key) ? 'text-accent' : 'text-ink-2'}`}>
                  {CAMERA_KINDS.includes(x.key) ? 'CAMERA' : 'TAPE'}
                </T>
              </View>
              <Pencil size={18} color="#5E5E5E" />
            </Pressable>
          ))}
        </Outline>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button label={v ? 'Next' : 'Use drawing default'} kind={v ? 'primary' : 'secondary'} onPress={() => setStep(step + 1)} />
          </View>
        </View>
      }
    >
      <TopBar name={cur.name} sub={KIND_LABEL[cur.kind]} />

      {/* progress */}
      <View className="flex-row gap-1.5">
        {fields.map((x, i) => (
          <View key={fieldId(x)} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-ink' : 'bg-line'}`} />
        ))}
      </View>
      <T w="medium" className="mt-5 text-[15px] text-ink-2">
        Value {step + 1} of {fields.length} · from the drawing
      </T>
      <Title className="mt-1">{f.label}</Title>
      <T className="mt-1 text-[17px] text-ink-2">{f.hint}</T>

      <View className="mt-6 flex-row items-end justify-center rounded-card bg-tile py-6">
        <T w="bold" className={`text-[64px] leading-[70px] tracking-[-2px] ${v ? '' : 'text-ink-3'}`}>
          {v || f.fallback}
        </T>
        <T w="medium" className="mb-3 ml-2 text-[22px] text-ink-2">
          {f.unit}
        </T>
      </View>

      <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
        {KEYS.map((k, i) =>
          k === '' ? (
            <View key={i} className="h-16 w-[32%]" />
          ) : (
            <Pressable
              key={i}
              onPress={() => {
                tap();
                setV(k === 'del' ? v.slice(0, -1) : (v + k).slice(0, 4));
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
    </Screen>
  );
}
