import { Redirect, router } from 'expo-router';
import { Check, Trash2 } from 'lucide-react-native';
import { Alert, View } from 'react-native';

import { FindingRow } from '@/components/finding';
import { FixLoop } from '@/components/fix-loop';
import { ActionBar, Button, C, Chip, Enter, Group, H2, IconBtn, Illo, Meter, Notice, Num, Press, Row, Screen, Sub, T, TextBtn, Title, TopBar } from '@/components/ui';
import { SIMULATED_NOTE } from '@/lib/measure';
import { evaluate, tally, type Finding, type Outcome } from '@/lib/rules';
import { KIND_LABEL, TARGETS } from '@/lib/spec';
import { actions, activeLock, useDraft } from '@/lib/store';

type Step = { key: string; label: string; done: boolean };

// Order-tracking style: done steps ticked, exactly one step marked as next.
function Timeline({ steps }: { steps: Step[] }) {
  const active = steps.findIndex((s) => !s.done);
  return (
    <View className="mt-6 rounded-card bg-tile px-4 py-2">
      {steps.map((s, i) => {
        const now = i === active;
        const last = i === steps.length - 1;
        let state = 'later';
        if (s.done) state = 'done';
        else if (now) state = 'next';
        return (
          <View key={s.key} className="h-11 flex-row items-center gap-3" accessible accessibilityLabel={`${s.label}: ${state}`}>
            <View className="w-6 self-stretch items-center justify-center">
              {i > 0 ? <View className="absolute top-0 w-0.5" style={{ bottom: '50%', backgroundColor: steps[i - 1].done ? C.ink : C.ink4 }} /> : null}
              {last ? null : <View className="absolute bottom-0 w-0.5" style={{ top: '50%', backgroundColor: s.done ? C.ink : C.ink4 }} />}
              {s.done ? (
                <View className="h-6 w-6 items-center justify-center rounded-full bg-ink">
                  <Check size={14} color="#fff" strokeWidth={3} />
                </View>
              ) : (
                <View className="h-6 w-6 items-center justify-center rounded-full border-2 bg-tile" style={{ borderColor: now ? C.ink : C.ink4 }}>
                  {now ? <View className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
                </View>
              )}
            </View>
            <T w={now ? 'bold' : 'medium'} className={`flex-1 text-[15px] ${s.done || now ? '' : 'text-ink-3'}`} numberOfLines={1}>
              {s.label}
            </T>
            {now ? (
              <T w="bold" className="text-[13px] uppercase tracking-[0.6px]">
                Next
              </T>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// Counts worth a glance, as outcome chips; "within" is the big number and "to do" is the meter.
const CHIPS: { o: Outcome; k: 'within' | 'outside' | 'rescan' | 'tape' | 'notSeen'; word: string }[] = [
  { o: 'within', k: 'within', word: 'within' },
  { o: 'outside', k: 'outside', word: 'outside' },
  { o: 'rescan', k: 'rescan', word: 're-scan' },
  { o: 'tape', k: 'tape', word: 'need a reading' },
  { o: 'not_seen', k: 'notSeen', word: 'not seen' },
];

// The verdict sheet: one line per check, five possible answers, and no overall badge.
export default function Summary() {
  const cur = useDraft();
  if (!cur) return <Redirect href="/" />;
  const context = `${cur.name}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`;
  if (!cur.spec) {
    return (
      <Screen footer={<Button label="Enter drawing values" onPress={() => router.replace('/inspect/spec')} />}>
        <TopBar name={context} sub={KIND_LABEL[cur.member]} />
        <Illo name="records" size={140} style={{ alignSelf: 'center', marginTop: 8 }} />
        <Title className="mt-4">Drawing values first</Title>
        <Sub>Enter the drawing, or choose measure-only, before scanning.</Sub>
      </Screen>
    );
  }

  const fs = evaluate(cur);
  const t = tally(fs);
  const nextTarget = TARGETS[cur.member].find((x) => !activeLock(cur, x.id));
  const readingsLeft = fs.some((f) => f.outcome === 'tape' && !cur.readings[f.def.id]);
  const measured = cur.locks.some((l) => !l.superseded) || Object.keys(cur.readings).length > 0;
  const simulated = cur.locks.some((l) => !l.superseded && l.source === 'simulated');
  const camera = fs.filter((f) => f.def.target);
  const byHand = fs.filter((f) => !f.def.target);
  const unassessed = t.pending + t.tape;
  const checked = t.total - unassessed;
  const noDrawing = !!cur.spec.noDrawing;

  const open = (f: Finding) => {
    if (f.outcome === 'outside' && f.fix) router.push({ pathname: '/inspect/fix', params: { check: f.def.id } });
    else if (f.def.target) router.push({ pathname: '/inspect/scan', params: { target: f.def.target } });
    else router.push('/inspect/readings');
  };

  const discard = () =>
    Alert.alert('Discard this draft?', 'Its scans and readings are deleted from this phone.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          actions.discard(cur.key);
          router.back();
        },
      },
    ]);

  // Short labels so the step still fits beside the tally in the bar.
  let primary = { label: 'Review and sign', go: () => router.push('/inspect/sign') };
  if (nextTarget) {
    const what = nextTarget.label.length <= 10 ? nextTarget.label : nextTarget.short;
    primary = { label: `Scan ${what.toLowerCase()}`, go: () => router.push({ pathname: '/inspect/scan', params: { target: nextTarget.id } }) };
  } else if (readingsLeft) primary = { label: 'Enter readings', go: () => router.push('/inspect/readings') };
  const signLater = nextTarget || readingsLeft;

  const steps: Step[] = [
    { key: 'drawing', label: noDrawing ? 'Drawing · measure only' : `Drawing · rev ${cur.spec.rev}`, done: true },
    ...TARGETS[cur.member].map((x) => ({ key: x.id, label: x.label, done: !!activeLock(cur, x.id) })),
    { key: 'readings', label: 'Readings by hand', done: !readingsLeft },
    { key: 'sign', label: 'Review and sign', done: false },
  ];

  let notice = null;
  const firstOutside = fs.find((f) => f.outcome === 'outside' && f.fix);
  if (t.outside) {
    // The most urgent thing on the sheet, so it is also the shortcut to the fix.
    notice = (
      <Press disabled={!firstOutside} onPress={() => firstOutside && open(firstOutside)} accessibilityRole="button" className="mt-5">
        <Notice tone="fail" title={`${t.outside} outside limits${firstOutside ? ' · show the fix →' : ''}`}>
          Play the fix to the mason, then scan again.
        </Notice>
      </Press>
    );
  } else if (cur.notice) notice = <Notice tone="warn" className="mt-5" title={cur.notice} />;
  else if (simulated) {
    notice = (
      <Notice tone="warn" className="mt-5" title="Some values are simulated">
        {SIMULATED_NOTE}
      </Notice>
    );
  }

  const chips = CHIPS.filter((c) => t[c.k] > 0);

  return (
    <Screen
      footer={
        <>
          <ActionBar title={unassessed ? `${unassessed} to go` : 'All checked'} label={primary.label} onPress={primary.go} />
          {signLater && measured ? <TextBtn label={unassessed ? `Sign now · ${unassessed} unassessed` : 'Sign now'} onPress={() => router.push('/inspect/sign')} /> : null}
        </>
      }
    >
      <TopBar name={context} sub={KIND_LABEL[cur.member]} right={<IconBtn icon={Trash2} label="Discard draft" onPress={discard} />} />

      <View className="flex-row items-center">
        <View className="flex-1">
          <Title>Checks</Title>
          <View className="mt-2 flex-row items-baseline">
            <Num className="text-[56px] leading-[62px] tracking-[-2px]">{checked}</Num>
            <Num w="medium" className="ml-1.5 text-[20px] text-ink-3">
              of {t.total}
            </Num>
          </View>
          <T w="medium" className="text-[15px] text-ink-2">
            {noDrawing ? 'checked · measure only' : 'checked'}
          </T>
        </View>
        <Illo name={cur.member} size={120} />
      </View>
      <Meter className="mt-4" value={t.total ? checked / t.total : 0} />
      {chips.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c.o} outcome={c.o} small label={`${t[c.k]} ${c.word}`} />
          ))}
        </View>
      ) : null}

      {notice}

      <FixLoop r={cur} />

      <Timeline steps={steps} />

      <H2 className="mt-8">Camera</H2>
      <Group className="mt-3">
        {camera.map((f, i) => (
          <Enter key={f.def.id} i={i}>
            <FindingRow f={f} first={i === 0} corrected={cur.corrected[f.def.id]} onPress={() => open(f)} />
          </Enter>
        ))}
      </Group>

      {byHand.length ? (
        <>
          <H2 className="mt-8">By hand</H2>
          <Group className="mt-3">
            {byHand.map((f, i) => (
              <Enter key={f.def.id} i={camera.length + i}>
                <FindingRow f={f} first={i === 0} corrected={cur.corrected[f.def.id]} onPress={() => open(f)} />
              </Enter>
            ))}
          </Group>
        </>
      ) : null}

      <Group className="mt-6">
        <Row
          first
          illo="records"
          title="Drawing values"
          sub={noDrawing ? 'None: measure only' : `Rev ${cur.spec.rev}${cur.spec.preset ? ' · demo prop' : ''}`}
          onPress={() => router.push('/inspect/spec')}
        />
      </Group>
    </Screen>
  );
}
