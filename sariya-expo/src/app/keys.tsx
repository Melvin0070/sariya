import { router, useLocalSearchParams } from 'expo-router';
import { QrCode, Trash2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { QR } from '@/components/qr';
import { Button, H2, Notice, Outline, Row, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { PROTECTION } from '@/lib/keys';
import { keyQr, me } from '@/lib/pack';
import { actions, ROLE_LABEL, useStore, type Role } from '@/lib/store';

// Which peers each role must trust before the loop can close.
const NEEDS: Record<Role, { role: Role; why: string }[]> = {
  operator: [{ role: 'engineer', why: 'to attach the engineer’s approval and review requests' }],
  engineer: [{ role: 'operator', why: 'to approve the operator’s capture packs' }],
  verifier: [{ role: 'engineer', why: 'to check sign-off QR codes' }],
};

export default function Keys() {
  const role = useStore((s) => s.role);
  const name = useStore((s) => s.name);
  const trusted = useStore((s) => s.trusted);
  const fresh = useLocalSearchParams<{ first?: string }>().first === '1';
  const self = me();
  if (!role) return null;
  const missing = NEEDS[role].filter((n) => !trusted.some((t) => t.role === n.role));

  return (
    <Screen
      footer={
        <View className="gap-2">
          <Button label="Scan another phone’s key" icon={QrCode} onPress={() => router.push({ pathname: '/qr', params: { mode: 'enrol' } })} />
          {fresh ? <Button label={missing.length ? 'Skip for now' : 'Done'} kind="secondary" onPress={() => router.replace('/')} /> : null}
        </View>
      }
    >
      {fresh ? null : <TopBar />}
      <Title className={fresh ? 'mt-8' : ''}>Enrol phones</Title>
      <T className="mt-2 text-[17px] leading-[24px] text-ink-2">Each phone shows its key QR and scans the others. A key that arrives inside a pack is never trusted on its own.</T>

      <View className="mt-6 items-center rounded-card border border-line p-5">
        {self ? <QR value={keyQr(self)} size={220} /> : <T className="text-ink-2">No signing key on this phone.</T>}
        <T w="bold" className="mt-4 text-[20px]">
          {name} · {ROLE_LABEL[role]}
        </T>
        <T w="medium" className="mt-1 text-[16px] tracking-wider">
          {self?.fp}
        </T>
        <T className="mt-1 text-center text-[13px] text-ink-2">{PROTECTION}</T>
      </View>

      {missing.map((m) => (
        <Notice key={m.role} tone="warn" className="mt-4" title={`No ${ROLE_LABEL[m.role].toLowerCase()} enrolled yet`}>
          Scan the {ROLE_LABEL[m.role].toLowerCase()} phone’s key {m.why}.
        </Notice>
      ))}

      <H2 className="mt-8">Trusted phones</H2>
      {trusted.length ? (
        <Outline className="mt-3">
          {trusted.map((p, i) => (
            <Row
              key={p.fp}
              first={i === 0}
              title={`${p.name} · ${ROLE_LABEL[p.role]}`}
              sub={p.fp}
              right={
                <Pressable
                  onPress={() => {
                    tap();
                    actions.untrust(p.fp);
                  }}
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full bg-tile active:opacity-70"
                >
                  <Trash2 size={18} color="#000" />
                </Pressable>
              }
            />
          ))}
        </Outline>
      ) : (
        <T className="mt-2 text-[15px] text-ink-2">None yet.</T>
      )}
    </Screen>
  );
}
