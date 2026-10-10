import { Redirect, router } from 'expo-router';
import { FileText, ScanLine, Trash2 } from 'lucide-react-native';
import { Alert, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { FindingRow } from '@/components/finding';
import { Button, Group, H2, IconBtn, Notice, OUTCOME, Row, Screen, Sub, TextBtn, Title, TopBar } from '@/components/ui';
import { SIMULATED_NOTE } from '@/lib/measure';
import { evaluate, tally, tallyLine, type Finding } from '@/lib/rules';
import { KIND_LABEL, TARGETS } from '@/lib/spec';
import { actions, activeLock, useDraft } from '@/lib/store';

// One segment per check, coloured by its answer.
function Progress({ fs }: { fs: Finding[] }) {
  return (
    <View className="mt-4 flex-row gap-1">
      {fs.map((f) => (
        <View key={f.def.id} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: f.outcome === 'pending' || f.outcome === 'tape' ? '#E2E2E2' : OUTCOME[f.outcome].color }} />
      ))}
    </View>
  );
}

// The verdict sheet: one line per check, five possible answers, and no overall badge.
export default function Summary() {
  const cur = useDraft();
  if (!cur) return <Redirect href="/" />;
  const head = <TopBar name={`${cur.name}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`} sub={KIND_LABEL[cur.member]} />;
  if (!cur.spec) {
    return (
      <Screen footer={<Button label="Enter drawing values" onPress={() => router.replace('/inspect/spec')} />}>
        {head}
        <Title>Drawing values first</Title>
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
  else if (readingsLeft) primary = { label: 'Enter readings', go: () => router.push('/inspect/readings') };
  const signLater = nextTarget || readingsLeft;
  const unassessed = t.pending + t.tape;

  return (
    <Screen
      footer={
        <>
          <Button label={primary.label} icon={nextTarget ? ScanLine : undefined} onPress={primary.go} />
          {signLater && measured ? <TextBtn label={unassessed ? `Sign now · ${unassessed} unassessed` : 'Sign now'} onPress={() => router.push('/inspect/sign')} /> : null}
        </>
      }
    >
      <TopBar name={`${cur.name}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`} sub={KIND_LABEL[cur.member]} right={<IconBtn icon={Trash2} label="Discard draft" onPress={discard} />} />
      <View className="flex-row items-center">
        <Title className="flex-1">Checks</Title>
        <MemberArt kind={cur.member} size={84} />
      </View>
      <Progress fs={fs} />
      <Sub className="mt-3">{tallyLine(fs)}</Sub>

      {cur.notice ? <Notice tone="warn" className="mt-4" title={cur.notice} /> : null}
      {t.outside ? (
        <Notice tone="fail" className="mt-4" title={`${t.outside} outside limits`}>
          Play the fix to the mason, then scan again.
        </Notice>
      ) : null}
      {simulated ? (
        <Notice tone="warn" className="mt-4" title="Some values are simulated">
          {SIMULATED_NOTE}
        </Notice>
      ) : null}

      <H2 className="mt-7">Camera</H2>
      <Group className="mt-3">
        {camera.map((f, i) => (
          <FindingRow key={f.def.id} f={f} first={i === 0} corrected={cur.corrected[f.def.id]} onPress={() => open(f)} />
        ))}
      </Group>

      {byHand.length ? (
        <>
          <H2 className="mt-7">By hand</H2>
          <Group className="mt-3">
            {byHand.map((f, i) => (
              <FindingRow key={f.def.id} f={f} first={i === 0} corrected={cur.corrected[f.def.id]} onPress={() => open(f)} />
            ))}
          </Group>
        </>
      ) : null}

      <Group className="mt-6">
        <Row
          first
          icon={FileText}
          title="Drawing values"
          sub={cur.spec.noDrawing ? 'None: measure only' : `Rev ${cur.spec.rev}${cur.spec.preset ? ' · demo prop' : ''}`}
          onPress={() => router.push('/inspect/spec')}
        />
      </Group>
    </Screen>
  );
}
