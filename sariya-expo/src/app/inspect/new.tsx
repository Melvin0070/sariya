import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, Screen, T, Tile, Title, TopBar } from '@/components/ui';
import { isSoon, KIND_LABEL, type MemberKind } from '@/lib/spec';
import { actions } from '@/lib/store';

const KINDS: MemberKind[] = ['slab', 'beam'];
const EXAMPLE: Record<MemberKind, string> = { slab: 'Slab S1, first floor', beam: 'Beam B2, grid C' };

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

      <View className="mt-6 flex-row gap-3">
        {KINDS.map((k) => (
          <Tile key={k} on={kind === k} onPress={isSoon(k) ? undefined : () => setKind(k)} className={`flex-1 items-center pb-3 pt-2 ${isSoon(k) ? 'opacity-50' : ''}`}>
            <MemberArt kind={k} size={84} />
            <T w="semibold" className="text-[16px]">
              {KIND_LABEL[k]}
            </T>
            {isSoon(k) ? <T className="text-[13px] text-ink-2">Coming soon</T> : null}
          </Tile>
        ))}
      </View>

      <T w="medium" className="mt-7 text-[15px] text-ink-2">
        Member and zone, as on the drawing
      </T>
      <View className="mt-2 h-14 justify-center rounded-xl bg-tile px-4">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={EXAMPLE[kind]}
          placeholderTextColor="#8A8A8A"
          autoFocus
          returnKeyType="next"
          onSubmitEditing={go}
          className="font-medium text-[18px] text-ink"
        />
      </View>
    </Screen>
  );
}
