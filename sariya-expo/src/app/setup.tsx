import * as Device from 'expo-device';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, Check, Cpu, Fingerprint, HardDrive, KeyRound, Loader, TriangleAlert, Volume2, X, type LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, TextInput, View } from 'react-native';

import { Button, Group, H2, Hairline, Screen, Sub, T, Tile, Title, TopBar } from '@/components/ui';
import { biometric, BIOMETRIC_COPY, voices, type Biometric, type Voices } from '@/lib/device';
import { PROTECTION } from '@/lib/keys';
import { visionStatus, type VisionStatus } from '../../modules/sariya-vision';
import { actions, persistent, ROLE_LABEL, useStore, type Role } from '@/lib/store';

type RowState = 'ok' | 'warn' | 'bad' | 'wait';
const MARK: Record<RowState, { I: LucideIcon; bg: string; word: string }> = {
  ok: { I: Check, bg: '#05944F', word: 'Ready' },
  warn: { I: TriangleAlert, bg: '#C77700', word: 'Limited' },
  bad: { I: X, bg: '#E11900', word: 'Missing' },
  wait: { I: Loader, bg: '#BDBDBD', word: 'Checking' },
};

function Row({ icon: Icon, label, note, state, action, first }: { icon: LucideIcon; label: string; note: string; state: RowState; action?: { label: string; onPress: () => void }; first?: boolean }) {
  const m = MARK[state];
  return (
    <View className="flex-row items-center gap-4 px-4 py-4">
      {first ? null : <Hairline inset={80} />}
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-tile">
        <Icon size={22} color="#000" strokeWidth={1.8} />
      </View>
      <View className="flex-1">
        <T w="medium" className="text-[17px]">
          {label}
        </T>
        <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2">{note}</T>
        {action ? (
          <Pressable onPress={action.onPress} className="mt-2 self-start rounded-full bg-ink px-4 py-2 active:opacity-70">
            <T w="semibold" className="text-[14px] text-white">
              {action.label}
            </T>
          </Pressable>
        ) : null}
      </View>
      <View accessibilityLabel={m.word} className="h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: m.bg }}>
        <m.I size={14} color="#fff" strokeWidth={3} />
      </View>
    </View>
  );
}

const ROLES: { role: Role; body: string }[] = [
  { role: 'operator', body: 'Scans the steel and signs the capture' },
  { role: 'engineer', body: 'Reviews packs and approves with a fingerprint' },
  { role: 'verifier', body: 'Checks a sign-off QR, offline' },
];

function visionNote(v: VisionStatus | null | 'missing') {
  if (v == null) return 'Loading model v2 and timing one frame';
  if (v === 'missing') return 'This build has no vision module: rebuild the app. Mark by hand still works.';
  if (!v.ok) return `Model did not load: ${v.error ?? 'unknown error'}. Mark by hand still works.`;
  const npu = v.accel === 'NPU' ? '' : ` NPU not used: ${v.npuError ?? 'unavailable'}.`;
  return `Model ${v.model} (${v.modelSha}) on ${v.accel}: ${v.inferMs} ms a frame, loaded in ${v.loadMs} ms.${npu}`;
}

function visionState(v: VisionStatus | null | 'missing'): RowState {
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
  const [bio, setBio] = useState<Biometric | null>(null);
  const [vis, setVis] = useState<VisionStatus | null | 'missing'>(null);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    voices().then(setV);
    biometric().then(setBio);
    visionStatus()
      .then((s) => setVis(s ?? 'missing'))
      .catch((e: Error) => setVis({ ok: false, opencv: false, model: 'v2', modelSha: '', threshold: 0, accel: 'none', loadMs: 0, inferMs: -1, error: e.message }));
  }, []);

  const phone = [Device.brand, Device.modelName].filter(Boolean).join(' ') || 'This phone';
  const ready = !!role && name.trim().length > 0;

  const camState: RowState = !cam ? 'wait' : cam.granted ? 'ok' : 'bad';
  const camAction = cam && !cam.granted ? (cam.canAskAgain ? { label: 'Allow camera', onPress: requestCam } : { label: 'Open settings', onPress: () => Linking.openSettings() }) : undefined;
  const voiceState = (ok?: boolean): RowState => (v == null ? 'wait' : ok ? 'ok' : 'warn');
  const bioState: RowState = bio == null ? 'wait' : bio === 'enrolled' ? 'ok' : bio === 'missing' ? 'bad' : 'warn';

  const save = () => {
    if (!role) return;
    actions.setup(role, name);
    if (first) router.replace({ pathname: '/keys', params: { first: '1' } });
    else router.back();
  };

  return (
    <Screen scrollRef={scroll} footer={<Button label={!role ? 'Choose what this phone does' : !name.trim() ? 'Enter your name' : first ? 'Next: enrol phones' : 'Save'} disabled={!ready} onPress={save} />}>
      {first ? null : <TopBar />}
      <Title className={first ? 'mt-10' : ''}>{first ? 'Set up this phone' : 'This phone'}</Title>
      <Sub>
        {phone} · Android {Device.osVersion ?? ''}
      </Sub>

      <H2 className="mt-8">What does this phone do?</H2>
      <View className="mt-3 gap-2">
        {ROLES.map((r) => (
          <Tile key={r.role} on={role === r.role} onPress={() => setRole(r.role)} className="px-4 py-3.5">
            <T w="semibold" className="text-[18px]">
              {ROLE_LABEL[r.role]}
            </T>
            <T className="mt-0.5 text-[14px] text-ink-2">{r.body}</T>
          </Tile>
        ))}
      </View>

      <H2 className="mt-8">Your name</H2>
      <T className="mt-1 text-[14px] text-ink-2">Shown on everything this phone signs</T>
      <View className="mt-3 h-14 justify-center rounded-xl bg-tile px-4">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={role === 'engineer' ? 'Er. Alwin' : 'Sabari'}
          placeholderTextColor="#8A8A8A"
          onFocus={() => setTimeout(() => scroll.current?.scrollTo({ y: 520, animated: true }), 80)}
          returnKeyType="done"
          className="font-medium text-[18px] text-ink"
        />
      </View>

      <H2 className="mt-8">Readiness</H2>
      <Group className="mt-3">
        <Row first icon={Camera} label="Camera" note={!cam ? 'Checking access' : cam.granted ? 'Allowed' : 'Needed to scan steel and QR codes'} state={camState} action={camAction} />
        <Row icon={Cpu} label="Bar model" note={visionNote(vis)} state={visionState(vis)} />
        <Row icon={Volume2} label="Hindi voice" note={v == null ? 'Checking' : v.hi ? 'Installed, works offline' : 'Not installed: fixes show as subtitles only. Add it in Settings › Text-to-speech.'} state={voiceState(v?.hi)} />
        <Row icon={Volume2} label="Kannada voice" note={v == null ? 'Checking' : v.kn ? 'Installed' : 'Not installed: subtitles only'} state={voiceState(v?.kn)} />
        <Row icon={Fingerprint} label="Fingerprint" note={bio == null ? 'Checking' : `${BIOMETRIC_COPY[bio]}. The engineer needs it to approve.`} state={bioState} />
        <Row icon={KeyRound} label="Signing key" note={me ? `${me.fp} · ${PROTECTION}` : 'Could not create a key: this build lacks secure storage'} state={me ? 'ok' : 'bad'} />
        <Row icon={HardDrive} label="Storage" note={persistent ? 'Records are kept on this phone across restarts' : 'This build cannot save: records are lost on restart'} state={persistent ? 'ok' : 'bad'} />
      </Group>
    </Screen>
  );
}
