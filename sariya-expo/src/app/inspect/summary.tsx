import { Redirect, router } from 'expo-router';
import { FileText, ScanLine } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { FindingRow } from '@/components/finding';
import { Badge, Button, H2, Notice, Outline, Row, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { SIMULATED_NOTE } from '@/lib/measure';
import { evaluate, tally, tallyLine, type Finding } from '@/lib/rules';
import { KIND_LABEL, TARGETS } from '@/lib/spec';
import { actions, activeLock, useDraft } from '@/lib/store';

// The verdict sheet: one line per check, five possible answers, and no overall badge.
export default function Summary() {
  const cur = useDraft();
  if (!cur) return <Redirect href="/" />;
  if (!cur.spec) {
    return (
      <Screen footer={<Button label="Enter drawing values" onPress={() => router.replace('/inspect/spec')} />}>
        <TopBar name={cur.name} sub={KIND_LABEL[cur.member]} />
        <Title>Drawing values first</Title>
        <T className="mt-2 text-[17px] text-ink-2">Sariya needs the drawing, or an explicit measure-only choice, before it scans.</T>
      </Screen>
    );
  }

  const fs = evaluate(cur);
  const t = tally(fs);
  const nextTarget = TARGETS[cur.member].find((x) => !activeLock(cur, x.id));
  const readingsLeft = fs.some((f) => f.outcome === 'tape' && !cur.readings[f.def.id]);
  const measured = cur.locks.some((l) => !l.superseded) || Object.keys(cur.readings).length > 0;
  const simulated = cur.locks.some((l) => !l.superseded && l.source === 'simulated');

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

  let primary = { label: 'Review and sign', go: () => router.push('/inspect/sign') };
  if (nextTarget) primary = { label: `Scan ${nextTarget.label.toLowerCase()}`, go: () => router.push({ pathname: '/inspect/scan', params: { target: nextTarget.id } }) };
  else if (readingsLeft) primary = { label: 'Readings by hand', go: () => router.push('/inspect/readings') };
  const unassessed = t.pending + t.tape;

  return (
    <Screen
      footer={
        <View className="gap-2">
          <Button label={primary.label} icon={nextTarget ? ScanLine : undefined} onPress={primary.go} />
          {primary.label !== 'Review and sign' ? <Button label={unassessed ? `Sign now · ${unassessed} unassessed` : 'Review and sign'} kind="secondary" disabled={!measured} onPress={() => router.push('/inspect/sign')} /> : null}
        </View>
      }
    >
      <TopBar name={`${cur.name}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`} sub={KIND_LABEL[cur.member]} />
      <View className="flex-row items-center">
        <Title className="flex-1">Checks</Title>
        <MemberArt kind={cur.member} size={90} />
      </View>
      <T className="mt-1 text-[16px] leading-[23px] text-ink-2">{tallyLine(fs)}</T>

      {cur.notice ? <Notice tone="warn" className="mt-4" title={cur.notice} /> : null}
      {t.outside ? (
        <Notice tone="fail" className="mt-4" title={`${t.outside} check${t.outside > 1 ? 's' : ''} outside limits`}>
          Play the fix to the mason, then scan that zone again before the pour.
        </Notice>
      ) : null}
      {simulated ? (
        <Notice tone="warn" className="mt-4" title="Some values are simulated">
          {SIMULATED_NOTE}
        </Notice>
      ) : null}

      <Outline className="mt-5">
        <Row
          first
          icon={FileText}
          title={cur.spec.noDrawing ? 'Measure only' : `Drawing · rev ${cur.spec.rev}`}
          sub={cur.spec.noDrawing ? 'No drawing: values, no verdict' : 'Tap to view or change'}
          right={cur.spec.preset ? <Badge>DEMO PROP</Badge> : undefined}
          onPress={() => router.push('/inspect/spec')}
        />
      </Outline>

      <H2 className="mt-7">One line per check</H2>
      <Outline className="mt-3">
        {fs.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={cur.corrected[f.def.id]} onPress={() => open(f)} />
        ))}
      </Outline>
      <T className="mt-4 text-[13px] leading-[19px] text-ink-3">Measurements against the drawing with error bands. Not a safety certificate or pour permit. Rulebook tolerances are proposed values for an engineer to confirm.</T>

      <Pressable onPress={() => (tap(), discard())} className="mt-6 self-start">
        <T w="medium" className="text-[15px] text-fail underline">
          Discard draft
        </T>
      </Pressable>
    </Screen>
  );
}
