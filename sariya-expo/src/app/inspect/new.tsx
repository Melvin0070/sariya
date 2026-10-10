import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, H2, Screen, T, Tile, Title, TopBar } from '@/components/ui';
import { KIND_HINT, KIND_LABEL, type MemberKind } from '@/lib/spec';
import { actions } from '@/lib/store';

const KINDS: MemberKind[] = ['slab', 'beam'];
const EXAMPLE: Record<MemberKind, string> = { slab: 'Slab S1, first floor', beam: 'Beam B2, grid C' };

export default function NewInspection() {
  const p = useLocalSearchParams<{ kind?: MemberKind }>();
  const [kind, setKind] = useState<MemberKind | null>(p.kind && KINDS.includes(p.kind) ? p.kind : null);
  const [name, setName] = useState('');
  const ready = !!kind && name.trim().length > 0;
  const scroll = useRef<ScrollView>(null);
  // Bring the name field above the keyboard once the layout has shrunk.
  const reveal = () => setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 80);

  return (
    <Screen
      scrollRef={scroll}
      footer={
        <Button
          label={!kind ? 'Choose a member' : !name.trim() ? 'Name this inspection' : 'Next: drawing values'}
          disabled={!ready}
          onPress={() => {
            if (!kind) return;
            actions.newInspection(kind, name.trim());
            router.replace('/inspect/spec');
          }}
        />
      }
    >
      <TopBar />
      <Title>New inspection</Title>
      <H2 className="mt-6">What are you checking?</H2>

      <View className="mt-3 gap-3">
        {KINDS.map((k) => (
          <Tile key={k} onPress={() => setKind(k)} className={`h-[132px] flex-row items-center px-5 ${kind === k ? 'border-2 border-ink' : 'border-2 border-tile'}`}>
            <View className="flex-1">
              <T w="semibold" className="text-[22px]">
                {KIND_LABEL[k]}
              </T>
              <T className="mt-1 text-[15px] text-ink-2">{KIND_HINT[k]}</T>
            </View>
            <MemberArt kind={k} size={130} />
          </Tile>
        ))}
      </View>

      {kind ? (
        <>
          <H2 className="mt-8">Name it</H2>
          <T className="mt-1 text-[15px] text-ink-2">The member and zone, as on the drawing. This is how the record is saved.</T>
          <View className="mt-3 h-16 justify-center rounded-xl bg-tile px-4">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={EXAMPLE[kind]}
              placeholderTextColor="#8A8A8A"
              autoFocus
              onFocus={reveal}
              returnKeyType="done"
              className="font-medium text-[19px] text-ink"
            />
          </View>
        </>
      ) : null}
    </Screen>
  );
}
