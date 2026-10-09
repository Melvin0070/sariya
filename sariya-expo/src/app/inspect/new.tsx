import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { Button, H2, Screen, T, Tile, Title, TopBar } from '@/components/ui';
import { actions, KIND_LABEL, SUPPORTED, type MemberKind } from '@/lib/store';

const KINDS: MemberKind[] = ['slab', 'beam', 'column'];
const KIND_HINT: Record<MemberKind, string> = { slab: 'Spacing both ways, count and cover', beam: 'Stirrups at the ends', column: 'Ties at the joints', footing: 'Mesh and starters', other: 'Any cage' };
const EXAMPLE: Record<MemberKind, string> = { slab: 'Slab S1, first floor', beam: 'Beam B2, grid C', column: 'Column C4, ground', footing: 'Footing F2', other: 'Lintel L1' };

export default function NewInspection() {
  const p = useLocalSearchParams<{ kind?: MemberKind }>();
  const [kind, setKind] = useState<MemberKind | null>(p.kind && SUPPORTED.includes(p.kind) ? p.kind : null);
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
            actions.start(kind, name.trim());
            router.push('/inspect/spec');
          }}
        />
      }
    >
      <TopBar />
      <Title>New inspection</Title>
      <H2 className="mt-6">What are you checking?</H2>

      <View className="mt-3 gap-3">
        {KINDS.map((k) => {
          const on = SUPPORTED.includes(k);
          return (
            <Tile key={k} onPress={on ? () => setKind(k) : undefined} className={`h-[132px] flex-row items-center px-5 ${kind === k ? 'border-2 border-ink' : ''} ${on ? '' : 'opacity-40'}`}>
              <View className="flex-1">
                <T w="semibold" className="text-[22px]">
                  {KIND_LABEL[k]}
                </T>
                <T className="mt-1 text-[15px] text-ink-2">{on ? KIND_HINT[k] : 'Coming soon'}</T>
              </View>
              <MemberArt kind={k} size={130} />
            </Tile>
          );
        })}
      </View>

      {kind ? (
        <>
          <H2 className="mt-8">Name it</H2>
          <T className="mt-1 text-[15px] text-ink-2">This is how the record will be saved.</T>
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
