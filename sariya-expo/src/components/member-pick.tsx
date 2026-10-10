import { TextInput, View } from 'react-native';

import { MemberArt } from '@/components/art';
import { T, Tile } from '@/components/ui';
import { isSoon, KIND_LABEL, type MemberKind } from '@/lib/spec';

export const KINDS: MemberKind[] = ['slab', 'beam'];
const EXAMPLE: Record<MemberKind, string> = {
  slab: 'Slab S1, first floor',
  beam: 'Beam B2, grid C',
};

export function MemberPick({ kind, onKind, name, onName, onSubmit }: { kind: MemberKind; onKind: (k: MemberKind) => void; name: string; onName: (s: string) => void; onSubmit: () => void }) {
  return (
    <>
      <View className="mt-6 flex-row gap-3">
        {KINDS.map((k) => (
          <Tile key={k} on={kind === k} onPress={isSoon(k) ? undefined : () => onKind(k)} className={`flex-1 items-center pb-3 pt-2 ${isSoon(k) ? 'opacity-50' : ''}`}>
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
          onChangeText={onName}
          placeholder={EXAMPLE[kind]}
          placeholderTextColor="#8A8A8A"
          autoFocus
          returnKeyType="next"
          onSubmitEditing={onSubmit}
          className="font-medium text-[18px] text-ink"
        />
      </View>
    </>
  );
}
