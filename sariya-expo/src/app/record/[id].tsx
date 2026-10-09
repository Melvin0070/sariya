import { router, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, Check, Clock, PenLine } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { MemberArt } from '@/components/art';
import { Button, Chip, H2, Outline, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { ENGINEERS, verifyPin } from '@/lib/engineers';
import { short } from '@/lib/sign';
import { actions, KIND_LABEL, useStore, when } from '@/lib/store';

function Step({ done, title, sub, last }: { done: boolean; title: string; sub: string; last?: boolean }) {
  return (
    <View className="flex-row gap-4">
      <View className="items-center">
        <View className={`h-8 w-8 items-center justify-center rounded-full ${done ? 'bg-pass' : 'bg-pill'}`}>
          {done ? <Check size={16} color="#fff" strokeWidth={3} /> : <Clock size={16} color="#5E5E5E" />}
        </View>
        {!last ? <View className={`w-0.5 flex-1 ${done ? 'bg-pass' : 'bg-line'}`} style={{ minHeight: 26 }} /> : null}
      </View>
      <View className="flex-1 pb-5">
        <T w="semibold" className="text-[17px]">
          {title}
        </T>
        <T className="mt-0.5 text-[15px] text-ink-2">{sub}</T>
      </View>
    </View>
  );
}

export default function Record() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = useStore((s) => s.records.find((x) => x.id === id));
  const [signing, setSigning] = useState(false);
  const [who, setWho] = useState(ENGINEERS[0].id);
  const [pin, setPin] = useState('');
  const [wrong, setWrong] = useState(false);

  if (!r) return null;

  const sigShown = r.hash && r.hash.length > 16 ? short(r.hash) : r.hash;

  return (
    <Screen
      footer={
        r.status === 'sent' && !signing ? (
          <Button label="Engineer sign-off" icon={PenLine} onPress={() => setSigning(true)} />
        ) : r.status === 'signed' ? (
          <Button label="Done" kind="secondary" onPress={() => router.back()} />
        ) : undefined
      }
    >
      <TopBar name={r.name} sub={KIND_LABEL[r.kind]} />
      <View className="flex-row items-center">
        <View className="flex-1">
          <Title>{r.status === 'signed' ? 'Signed record' : 'Record'}</Title>
          <T className="mt-1 text-[17px] text-ink-2">
            {r.id} · {when(r.createdAt)}
          </T>
        </View>
        <MemberArt kind={r.kind} size={96} />
      </View>


      <H2 className="mt-7">Two keys</H2>
      <View className="mt-4">
        <Step done title="Inspector signed on this phone" sub={`SHA-256 ${sigShown ?? '—'}`} />
        <Step done={r.status === 'signed'} last title={r.status === 'signed' ? `Engineer signed · ${r.engineer}` : 'Engineer sign-off'} sub={r.status === 'signed' ? 'Reviewed over Office Kit' : 'Waiting for review'} />
      </View>

      {signing ? (
        <Animated.View entering={FadeInDown} className="rounded-card border-2 border-ink p-5">
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={20} color="#000" />
            <T w="bold" className="text-[19px]">
              Engineer sign-off
            </T>
          </View>
          <T className="mt-1 text-[15px] text-ink-2">A separate, deliberate step. Your key signs exactly what is shown below.</T>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {ENGINEERS.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => {
                  tap();
                  setWho(e.id);
                  setWrong(false);
                }}
                className={`h-11 justify-center rounded-full px-4 ${who === e.id ? 'bg-ink' : 'bg-tile'}`}
              >
                <T w="medium" className={`text-[15px] ${who === e.id ? 'text-white' : ''}`}>
                  {e.name}
                </T>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={pin}
            onChangeText={(v) => {
              setPin(v.replace(/\D/g, '').slice(0, 4));
              setWrong(false);
            }}
            placeholder="4-digit PIN"
            placeholderTextColor="#8A8A8A"
            keyboardType="number-pad"
            secureTextEntry
            className={`mt-3 h-14 rounded-xl bg-tile px-4 font-medium text-[17px] text-ink ${wrong ? 'border-2 border-fail' : ''}`}
          />
          {wrong ? (
            <T w="medium" className="mt-2 text-[14px] text-fail">
              Wrong PIN. Try again.
            </T>
          ) : null}
          <View className="mt-4 flex-row gap-2">
            <View className="flex-1">
              <Button label="Cancel" kind="secondary" onPress={() => setSigning(false)} />
            </View>
            <View className="flex-[2]">
              <Button
                label="Sign record"
                disabled={pin.length < 4}
                onPress={() => {
                  const e = verifyPin(who, pin);
                  if (!e) {
                    setWrong(true);
                    return;
                  }
                  actions.engineerSign(r.id, e.name);
                  setSigning(false);
                  setPin('');
                }}
              />
            </View>
          </View>
        </Animated.View>
      ) : null}

      <H2 className="mt-7">Checks</H2>
      <Outline className="mt-3">
        {r.checks.map((c, idx) => (
          <View key={c.id} className={`flex-row items-center px-4 py-3.5 ${idx ? 'border-t border-line' : ''}`}>
            <View className="flex-1">
              <T w="semibold" className="text-[16px]">
                {c.label}
              </T>
              <T className="text-[14px] text-ink-2">
                {c.measured == null || c.outcome === 'not_seen' ? 'no reading' : `${c.measured}${c.band ? ` ± ${c.band}` : ''} ${c.unit}`} · drawing {c.drawing} {c.unit}
                {c.fixed ? ' · corrected' : ''}
              </T>
            </View>
            <Chip outcome={c.outcome} small />
          </View>
        ))}
      </Outline>
      <T className="mt-4 text-[13px] leading-[19px] text-ink-3">
        Measurements against the drawing with error bands. Not a safety certificate or pour permit.
      </T>
    </Screen>
  );
}
