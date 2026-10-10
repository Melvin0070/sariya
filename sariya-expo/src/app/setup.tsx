import * as Device from 'expo-device';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, Check, Cpu, HardDrive, KeyRound, Loader, LockKeyhole, TriangleAlert, Volume2, X, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView, TextInput, View } from 'react-native';

import { Button, C, Enter, Group, H2, Hairline, Illo, KV, Details, Press, Screen, Skeleton, Sub, T, Tile, Title, TopBar, type IlloName } from '@/components/ui';
import { voices, type Voices } from '@/lib/device';
import { PROTECTION } from '@/lib/keys';
import { hasPin, pinProblem, savePin } from '@/lib/pin';
import { visionStatus, type VisionStatus } from '../../modules/sariya-vision';
import { actions, persistent, ROLE_LABEL, useStore, type Role } from '@/lib/store';

type RowState = 'ok' | 'warn' | 'bad' | 'wait';
const MARK: Record<RowState, { I: LucideIcon; bg: string; fg: string; color: string; word: string }> = {
  ok: { I: Check, bg: 'bg-pass-soft', fg: 'text-pass', color: C.pass, word: 'Ready' },
  warn: { I: TriangleAlert, bg: 'bg-warn-soft', fg: 'text-warn', color: C.warn, word: 'Limited' },
  bad: { I: X, bg: 'bg-fail-soft', fg: 'text-fail', color: C.fail, word: 'Missing' },
  wait: { I: Loader, bg: 'bg-pill', fg: 'text-ink-2', color: C.ink2, word: 'Checking' },
};

function Mark({ state }: { state: RowState }) {
  const m = MARK[state];
  return (
    <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${m.bg}`}>
      <m.I size={13} color={m.color} strokeWidth={3} />
      <T w="semibold" className={`text-[13px] ${m.fg}`}>
        {m.word}
      </T>
    </View>
  );
}

function Check1({ icon: Icon, label, note, state, action, first }: { icon: LucideIcon; label: string; note: string; state: RowState; action?: { label: string; onPress: () => void }; first?: boolean }) {
  return (
    <View className="flex-row items-center gap-4 px-4 py-3.5">
      {first ? null : <Hairline inset={80} />}
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-tile">
        <Icon size={22} color="#000" strokeWidth={1.8} />
      </View>
      <View className="flex-1">
        <T w="semibold" className="text-[16px] leading-[22px]">
          {label}
        </T>
        {state === 'wait' ? (
          <Skeleton className="mt-1.5 h-3.5 w-28" />
        ) : (
          <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2" numberOfLines={2}>
            {note}
          </T>
        )}
        {action ? (
          <Press onPress={action.onPress} accessibilityRole="button" className="mt-2 h-10 justify-center self-start rounded-full bg-ink px-4">
            <T w="semibold" className="text-[14px] text-white">
              {action.label}
            </T>
          </Press>
        ) : null}
      </View>
      <Mark state={state} />
    </View>
  );
}

const ROLES: { role: Role; illo: IlloName; body: string }[] = [
  { role: 'operator', illo: 'operator', body: 'Scans the steel, signs the capture' },
  { role: 'engineer', illo: 'engineer', body: 'Reviews packs, approves with a PIN' },
  { role: 'verifier', illo: 'verify', body: 'Checks a sign-off QR, offline' },
];

type Vis = VisionStatus | null | 'missing';

// The row says where the model runs and how fast; the why (sha, load time, NPU error) sits in Details.
function visionNote(v: Vis) {
  if (v == null) return 'Checking';
  if (v === 'missing') return 'Not in this build · mark by hand works';
  if (!v.ok) return 'Did not load · mark by hand works';
  return `On ${v.accel} · ${v.inferMs} ms`;
}

function visionState(v: Vis): RowState {
  if (v == null) return 'wait';
  if (v === 'missing' || !v.ok) return 'bad';
  return v.accel === 'NPU' ? 'ok' : 'warn';
}

export default function Setup() {
  const savedRole = useStore((x) => x.role);
  const savedName = useStore((x) => x.name);
  const me = useStore((x) => x.me);
  const first = !savedRole;
  const [role, setRole] = useState<Role | null>(savedRole);
  const [name, setName] = useState(savedName);
  const [cam, requestCam] = useCameraPermissions();
  const [v, setV] = useState<Voices | null>(null);
  const [pinSet] = useState(hasPin);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [vis, setVis] = useState<Vis>(null);
  const scroll = useRef<ScrollView>(null);
  const nameY = useRef(520);

  useEffect(() => {
    voices().then(setV);
    visionStatus()
      .then((s) => setVis(s ?? 'missing'))
      .catch((e: Error) => setVis({ ok: false, opencv: false, model: 'v2', modelSha: '', threshold: 0, accel: 'none', loadMs: 0, inferMs: -1, error: e.message }));
  }, []);

  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';
  const pinErr = pinSet ? null : (pinProblem(pin) ?? (pin === pin2 ? null : 'The two PINs differ'));
  const ready = !!role && name.trim().length > 0 && !pinErr;

  const camState: RowState = !cam ? 'wait' : cam.granted ? 'ok' : 'bad';
  const camAction = cam && !cam.granted ? (cam.canAskAgain ? { label: 'Allow camera', onPress: requestCam } : { label: 'Open settings', onPress: () => Linking.openSettings() }) : undefined;
  const voiceState = (ok?: boolean): RowState => (v == null ? 'wait' : ok ? 'ok' : 'warn');

  const save = () => {
    if (!role) return;
    if (!pinSet) savePin(pin);
    actions.setup(role, name);
    if (first) router.replace({ pathname: '/keys', params: { first: '1' } });
    else router.back();
  };

  const visObj = vis && vis !== 'missing' ? vis : null;

  return (
    <Screen scrollRef={scroll} footer={<Button label={!role ? 'Choose what this phone does' : !name.trim() ? 'Enter your name' : pinErr ? 'Set your PIN' : first ? 'Next: enrol phones' : 'Save'} disabled={!ready} onPress={save} />}>
      {first ? null : <TopBar />}
      <Title className={first ? 'mt-10' : ''}>{first ? 'Set up this phone' : 'This phone'}</Title>
      <Sub>
        {phone} · Android {Device.osVersion ?? ''}
      </Sub>

      <H2 className="mt-8">What does this phone do?</H2>
      <View className="mt-3 gap-2.5">
        {ROLES.map((r, i) => (
          <Enter key={r.role} i={i}>
            <Tile on={role === r.role} onPress={() => setRole(r.role)} className="flex-row items-center gap-4 py-2 pl-2 pr-4">
              <Illo name={r.illo} size={80} />
              <View className="flex-1">
                <T w="bold" className="text-[19px] leading-[24px]">
                  {ROLE_LABEL[r.role]}
                </T>
                <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2">{r.body}</T>
              </View>
              <View className={`h-6 w-6 items-center justify-center rounded-full border-2 ${role === r.role ? 'border-ink bg-ink' : 'border-ink-3'}`}>
                {role === r.role ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
              </View>
            </Tile>
          </Enter>
        ))}
      </View>

      <View onLayout={(e) => (nameY.current = e.nativeEvent.layout.y)}>
        <H2 className="mt-8">Your name</H2>
        <T className="mt-1 text-[14px] text-ink-2">Shown on everything this phone signs</T>
      </View>
      <View className="mt-3 h-14 justify-center rounded-xl bg-tile px-4">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={role === 'engineer' ? 'Er. Alwin' : 'Sabari'}
          placeholderTextColor="#8A8A8A"
          onFocus={() => setTimeout(() => scroll.current?.scrollTo({ y: nameY.current, animated: true }), 80)}
          returnKeyType="done"
          className="font-medium text-[18px] text-ink"
        />
      </View>

      {pinSet ? null : (
        <>
          <H2 className="mt-8">Your PIN</H2>
          <T className="mt-1 text-[14px] text-ink-2">Asked before approving or trusting a phone</T>
          {[
            { v: pin, set: setPin, ph: 'PIN, 4 to 6 digits' },
            { v: pin2, set: setPin2, ph: 'Same PIN again' },
          ].map((f) => (
            <View key={f.ph} className="mt-3 h-14 justify-center rounded-xl bg-tile px-4">
              <TextInput
                value={f.v}
                onChangeText={(t) => f.set(t.replace(/\D/g, '').slice(0, 6))}
                placeholder={f.ph}
                placeholderTextColor="#8A8A8A"
                secureTextEntry
                keyboardType="number-pad"
                className="font-medium text-[18px] text-ink"
              />
            </View>
          ))}
          {pin && pinErr ? <T className="mt-2 text-[14px] text-fail">{pinErr}</T> : null}
        </>
      )}

      <H2 className="mt-8">Readiness</H2>
      <Group className="mt-3">
        <Check1 first icon={Camera} label="Camera" note={cam?.granted ? 'Allowed' : 'Needed to scan steel and QR codes'} state={camState} action={camAction} />
        <Check1 icon={Cpu} label="Bar model" note={visionNote(vis)} state={visionState(vis)} />
        <Check1 icon={Volume2} label="Hindi voice" note={v?.hi ? 'Works offline' : 'Subtitles only · add in Settings › Text-to-speech'} state={voiceState(v?.hi)} />
        <Check1 icon={Volume2} label="Kannada voice" note={v?.kn ? 'Works offline' : 'Subtitles only'} state={voiceState(v?.kn)} />
        <Check1 icon={LockKeyhole} label="PIN" note={pinSet ? 'Set' : 'Choose one above'} state={pinSet ? 'ok' : 'warn'} />
        <Check1 icon={KeyRound} label="Signing key" note={me ? 'Kept in Android Keystore' : 'Not created · no secure storage'} state={me ? 'ok' : 'bad'} />
        <Check1 icon={HardDrive} label="Storage" note={persistent ? 'Kept across restarts' : 'Lost on restart · this build cannot save'} state={persistent ? 'ok' : 'bad'} />
      </Group>

      <Details>
        <Group>
          <KV first k="Model" v={visObj ? `${visObj.model} · ${visObj.modelSha || 'no sha'}` : vis === 'missing' ? 'No vision module in this build' : 'Checking'} />
          {visObj?.ok ? (
            <>
              <KV k="Runs on" v={`${visObj.accel} · ${visObj.inferMs} ms a frame`} />
              <KV k="Loaded in" v={`${visObj.loadMs} ms`} />
            </>
          ) : null}
          {visObj && !visObj.ok ? <KV k="Load error" v={visObj.error ?? 'unknown error'} /> : null}
          {visObj?.ok && visObj.accel !== 'NPU' ? <KV k="NPU not used" v={visObj.npuError ?? 'unavailable'} /> : null}
          <KV k="Key" v={me ? `${me.fp}\n${PROTECTION}` : 'missing'} />
        </Group>
      </Details>
    </Screen>
  );
}
