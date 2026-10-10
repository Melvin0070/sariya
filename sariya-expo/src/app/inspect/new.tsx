import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { KINDS, MemberPick } from '@/components/member-pick';
import { Button, Screen, Title, TopBar } from '@/components/ui';
import { isSoon, type MemberKind } from '@/lib/spec';
import { actions } from '@/lib/store';

// Home picks slab or beam, so this screen is usually just the name.
export default function NewInspection() {
  const p = useLocalSearchParams<{ kind?: MemberKind }>();
  const [kind, setKind] = useState<MemberKind>(p.kind && KINDS.includes(p.kind) && !isSoon(p.kind) ? p.kind : 'slab');
  const [name, setName] = useState('');
  const ready = name.trim().length > 0;
  const go = () => {
    if (!ready) return;
    actions.newInspection(kind, name.trim());
    router.replace('/inspect/spec');
  };

  return (
    <Screen footer={<Button label="Next" disabled={!ready} onPress={go} />}>
      <TopBar />
      <Title>New inspection</Title>
      <MemberPick kind={kind} onKind={setKind} name={name} onName={setName} onSubmit={go} />
    </Screen>
  );
}
