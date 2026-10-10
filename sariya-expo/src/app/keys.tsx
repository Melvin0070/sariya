import { router, useLocalSearchParams } from 'expo-router';
import { QrCode, Trash2 } from 'lucide-react-native';
import { View } from 'react-native';

import { QR } from '@/components/qr';
import { Button, Details, Enter, Group, H2, Notice, Press, Row, Screen, Sub, T, TextBtn, Title, TopBar, type IlloName } from '@/components/ui';
import { PROTECTION } from '@/lib/keys';
import { keyQr, me } from '@/lib/pack';
import { actions, ROLE_LABEL, useStore, type Role } from '@/lib/store';

// Which peers each role must trust before the loop can close.
const NEEDS: Record<Role, { role: Role; why: string }[]> = {
  operator: [{ role: 'engineer', why: 'to attach the engineer’s approval and review requests' }],
  engineer: [{ role: 'operator', why: 'to approve the operator’s capture packs' }],
  verifier: [{ role: 'engineer', why: 'to check sign-off QR codes' }],
};

const ROLE_ILLO: Record<Role, IlloName> = { operator: 'operator', engineer: 'engineer', verifier: 'verify' };

export default function Keys() {
  const role = useStore((s) => s.role);
  const name = useStore((s) => s.name);
  const trusted = useStore((s) => s.trusted);
  const fresh = useLocalSearchParams<{ first?: string }>().first === '1';
  const self = me();
  if (!role) return null;
  const missing = NEEDS[role].filter((n) => !trusted.some((t) => t.role === n.role));
  const next = missing[0];

  return (
    <Screen
      footer={
        <>
          <Button label="Scan another phone’s key" icon={QrCode} onPress={() => router.push({ pathname: '/qr', params: { mode: 'enrol' } })} />
          {fresh ? <TextBtn label={missing.length ? 'Skip for now' : 'Done'} onPress={() => router.replace('/')} /> : null}
        </>
      }
    >
      {fresh ? null : <TopBar />}
      <Title className={fresh ? 'mt-10' : ''}>Trusted phones</Title>
      <Sub>Each phone scans the others’ key QR.</Sub>

      <Enter>
        <View className="mt-6 items-center rounded-card bg-tile px-5 pb-5 pt-6">
          <View className="rounded-2xl bg-paper p-3">{self ? <QR value={keyQr(self)} size={248} /> : <T className="p-6 text-ink-2">No signing key on this phone.</T>}</View>
          <T w="bold" className="mt-4 text-[20px] leading-[26px]">
            {name} · {ROLE_LABEL[role]}
          </T>
          {self ? (
            <T w="semibold" className="mt-1 text-[16px] tracking-wider text-ink-2" style={{ fontVariant: ['tabular-nums'] }}>
              {self.fp}
            </T>
          ) : null}
        </View>
      </Enter>

      {next ? (
        <Notice tone="warn" className="mt-4" title={`Scan the ${ROLE_LABEL[next.role].toLowerCase()}’s phone`}>
          Needed {next.why}.
        </Notice>
      ) : null}

      <H2 className="mt-8">Trusted here</H2>
      {trusted.length ? (
        <Group className="mt-3">
          {trusted.map((p, i) => (
            <Enter key={p.fp} i={i}>
              <Row
                first={i === 0}
                illo={ROLE_ILLO[p.role]}
                title={`${p.name} · ${ROLE_LABEL[p.role]}`}
                sub={p.fp}
                right={
                  <Press accessibilityLabel={`Remove ${p.name}`} accessibilityRole="button" onPress={() => actions.untrust(p.fp)} hitSlop={4} scale={0.9} className="h-12 w-12 items-center justify-center rounded-full bg-tile">
                    <Trash2 size={18} color="#000" />
                  </Press>
                }
              />
            </Enter>
          ))}
        </Group>
      ) : (
        <T className="mt-2 text-[15px] text-ink-2">None yet.</T>
      )}

      <Details>
        <T className="text-[14px] leading-[20px] text-ink-2">{PROTECTION}. A key inside a pack is never trusted on its own.</T>
      </Details>
    </Screen>
  );
}
