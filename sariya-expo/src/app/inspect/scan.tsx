import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { CircleHelp, Flashlight, FlashlightOff, Layers, Ruler, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { ArCamera } from '@/components/ar-view';
import { Button, Chip, T, tap } from '@/components/ui';
import { STATUS_COPY, useMockMeasure } from '@/lib/mock-measure';
import { actions, CAMERA_KINDS, useStore, type Check } from '@/lib/store';

function Overlay({ bars, status }: { bars: number; status: string }) {
  const seen = status !== 'searching';
  const xs = Array.from({ length: bars }, (_, i) => 70 + (i * 220) / Math.max(1, bars - 1));
  return (
    <Svg width="100%" height="100%" viewBox="0 0 360 520" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
      {/* card outline */}
      <Rect
        x={120}
        y={300}
        width={120}
        height={90}
        rx={6}
        fill="rgba(255,106,19,0.10)"
        stroke="#FF6A13"
        strokeWidth={3}
        strokeDasharray={seen ? undefined : '10 8'}
        transform="rotate(-6 180 345)"
      />
      {seen
        ? xs.map((x, i) => (
            <Line key={i} x1={x} y1={110} x2={x - 8} y2={440} stroke="#FFFFFF" strokeWidth={2} opacity={0.9} />
          ))
        : null}
      {seen && xs.length > 1 ? (
        <>
          <Line x1={xs[2] ?? xs[0]} y1={160} x2={xs[3] ?? xs[1]} y2={160} stroke="#FF6A13" strokeWidth={3} />
          <Circle cx={xs[2] ?? xs[0]} cy={160} r={5} fill="#FF6A13" />
          <Circle cx={xs[3] ?? xs[1]} cy={160} r={5} fill="#FF6A13" />
        </>
      ) : null}
    </Svg>
  );
}

function LockRing({ progress }: { progress: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <Svg width={96} height={96} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={48} cy={48} r={r} stroke="rgba(255,255,255,0.3)" strokeWidth={5} fill="none" />
      <Circle cx={48} cy={48} r={r} stroke="#3AD07A" strokeWidth={5} fill="none" strokeDasharray={`${c * progress} ${c}`} strokeLinecap="round" />
    </Svg>
  );
}

function RoundBtn({ children, onPress, on }: { children: React.ReactNode; onPress?: () => void; on?: boolean }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress?.();
      }}
      className={`h-12 w-12 items-center justify-center rounded-full ${on ? 'bg-white' : 'bg-black/55'}`}
    >
      {children}
    </Pressable>
  );
}

function fmt(c: Check, v: number, band: number) {
  return c.kind === 'count' ? `${v} bars` : `${v} ± ${band} mm`;
}

export default function Scan() {
  const i = useSafeAreaInsets();
  const cur = useStore((s) => s.current);
  const arMode = useStore((s) => s.ar) === 'supported';
  const [tracking, setTracking] = useState(false);
  const [torch, setTorch] = useState(false);
  const [help, setHelp] = useState(false);
  const [locked, setLocked] = useState<Check | null>(null);
  const [tape, setTape] = useState('');

  const camChecks = useMemo(() => cur?.checks.filter((c) => CAMERA_KINDS.includes(c.kind)) ?? [], [cur]);
  const tapeChecks = useMemo(() => cur?.checks.filter((c) => !CAMERA_KINDS.includes(c.kind)) ?? [], [cur]);
  const nextCam = camChecks.find((c) => c.outcome === 'pending');
  const nextTape = tapeChecks.find((c) => c.outcome === 'pending');
  const [activeId, setActiveId] = useState<string | undefined>(nextCam?.id);
  const active = camChecks.find((c) => c.id === activeId) ?? nextCam;
  const tapeMode = !active && !!nextTape && !locked;

  const m = useMockMeasure(active, tracking, !!locked || tapeMode);
  const st = STATUS_COPY[m.status];

  useEffect(() => {
    if (m.status === 'ready') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [m.status]);

  useEffect(() => {
    if (cur && !active && !nextTape && !locked) router.replace('/inspect/summary');
  }, [cur, active, nextTape, locked]);

  if (!cur) return null;

  const lock = () => {
    if (!active) return;
    // Near the limit → the store decides "re-scan"; too early → force a re-scan.
    actions.lock(active.id, m.value, m.band, m.status === 'ready' ? undefined : 'rescan');
    const updated = { ...active, measured: m.value, band: m.band };
    setLocked(updated);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  };

  const lockedNow = locked ? cur.checks.find((c) => c.id === locked.id) : undefined;

  const afterLock = (rescan = false) => {
    if (rescan && lockedNow) actions.reset(lockedNow.id);
    setLocked(null);
    setActiveId(rescan ? lockedNow?.id : undefined);
  };

  const saveTape = (notSeen = false) => {
    if (!nextTape) return;
    const v = Number(tape);
    actions.lock(nextTape.id, notSeen ? 0 : v, notSeen ? 0 : 1, notSeen ? 'not_seen' : tape ? undefined : 'manual');
    setTape('');
  };

  return (
    <View className="flex-1 bg-black">
      <ArCamera ar={arMode} torch={torch} onTrackingChange={setTracking} />
      {!tapeMode ? <Overlay bars={m.bars} status={m.status} /> : <View className="absolute inset-0 bg-black/60" />}

      {/* top: persistent label + small controls */}
      <View className="absolute inset-x-0 flex-row items-start gap-3 px-4" style={{ top: i.top + 10 }}>
        <RoundBtn onPress={() => (actions.saveDraft(), router.back())}>
          <X size={22} color="#fff" />
        </RoundBtn>
        <View className="flex-1 rounded-2xl bg-black/55 px-4 py-2.5">
          <T w="semibold" className="text-[16px] text-white" numberOfLines={1}>
            {cur.name}
          </T>
          <T className="text-[13px] text-white/75" numberOfLines={1}>
            {arMode ? 'ARCore' : 'Card-only mode'}
          </T>
        </View>
        <View className="gap-2">
          {!arMode ? <RoundBtn onPress={() => setTorch(!torch)} on={torch}>{torch ? <Flashlight size={20} color="#000" /> : <FlashlightOff size={20} color="#fff" />}</RoundBtn> : null}
          <RoundBtn onPress={() => setHelp(!help)} on={help}>
            <CircleHelp size={20} color={help ? '#000' : '#fff'} />
          </RoundBtn>
        </View>
      </View>

      {/* check selector */}
      {!tapeMode && !locked ? (
        <View className="absolute inset-x-0 flex-row justify-center gap-2" style={{ top: i.top + 76 }}>
          {camChecks.map((c) => {
            const on = c.id === active?.id;
            const done = c.outcome !== 'pending';
            return (
              <Pressable key={c.id} onPress={() => (tap(), setActiveId(c.id))} className={`h-9 flex-row items-center gap-1.5 rounded-full px-3.5 ${on ? 'bg-white' : 'bg-black/55'}`}>
                <Layers size={14} color={on ? '#000' : '#fff'} />
                <T w="semibold" className={`text-[13px] ${on ? '' : 'text-white'} ${done && !on ? 'line-through opacity-60' : ''}`}>
                  {c.label}
                </T>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {help ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-x-4 rounded-card bg-white p-4" style={{ top: i.top + 126 }}>
          <T w="semibold" className="text-[16px]">
            Lay the card flat on the bars. Hold 40–60 cm away. Keep the whole card in view.
          </T>
        </Animated.View>
      ) : null}

      {/* live readout + lock */}
      {!tapeMode && !locked && active ? (
        <View className="absolute inset-x-0 items-center" style={{ bottom: i.bottom + 28 }}>
          <View className="flex-row items-center gap-2 rounded-full bg-black/60 px-4 py-2">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: st.color }} />
            <T w="semibold" className="text-[16px]" style={{ color: st.color }}>
              {st.label}
            </T>
          </View>
          <View className="mt-3 flex-row items-end">
            <T w="bold" className="text-[64px] leading-[70px] tracking-[-2px] text-white">
              {m.status === 'searching' ? '—' : active.kind === 'count' ? m.value : `~${m.value}`}
            </T>
            <T w="medium" className="mb-3 ml-2 text-[22px] text-white/80">
              {active.kind === 'count' ? 'bars' : 'mm'}
            </T>
          </View>
          <T className="text-[15px] text-white/75">
            {active.label} · drawing {active.drawing} {active.unit}
            {active.kind !== 'count' && m.status !== 'searching' ? ` · ± ${m.band} mm` : ''}
          </T>

          <Pressable onPress={lock} disabled={m.status === 'searching'} className="mt-5 h-24 w-24 items-center justify-center">
            <LockRing progress={m.progress ?? 0} />
            <View className={`h-[74px] w-[74px] items-center justify-center rounded-full ${m.status === 'ready' ? 'bg-white' : 'bg-white/40'}`}>
              <Ruler size={28} color="#000" />
            </View>
          </Pressable>
          <T w="semibold" className="mt-1 text-[15px] text-white">
            Lock measurement
          </T>
        </View>
      ) : null}

      {/* locked result sheet */}
      {lockedNow ? (
        <Animated.View entering={SlideInDown.springify().damping(18)} className="absolute inset-x-0 bottom-0 rounded-t-sheet bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 16 }}>
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-line" />
          <T w="medium" className="text-[15px] text-ink-2">
            {lockedNow.label}
          </T>
          <T w="bold" className="mt-1 text-[36px] tracking-[-1px]">
            {fmt(lockedNow, lockedNow.measured ?? 0, lockedNow.band ?? 0)}
          </T>
          <T className="mt-0.5 text-[17px] text-ink-2">
            Drawing: {lockedNow.drawing} {lockedNow.unit}
            {lockedNow.tol ? ` · limit ± ${lockedNow.tol} mm` : ''}
          </T>
          <View className="mt-3">
            <Chip outcome={lockedNow.outcome} />
          </View>
          {lockedNow.outcome === 'rescan' ? (
            <T className="mt-3 text-[15px] leading-[22px] text-ink-2">The error band touches the limit. Move closer and scan again for a clear answer.</T>
          ) : null}
          <View className="mt-5 gap-2">
            {lockedNow.outcome === 'outside' ? (
              <Button label="Show fix for the mason" kind="accent" onPress={() => (setLocked(null), router.push({ pathname: '/inspect/fix', params: { id: lockedNow.id } }))} />
            ) : null}
            {lockedNow.outcome === 'rescan' ? <Button label="Re-scan this zone" onPress={() => afterLock(true)} /> : <Button label="Next check" kind={lockedNow.outcome === 'outside' ? 'secondary' : 'primary'} onPress={() => afterLock()} />}
          </View>
        </Animated.View>
      ) : null}

      {/* tape readings for what the camera can't see */}
      {tapeMode && nextTape ? (
        <Animated.View entering={FadeInDown} key={nextTape.id} className="absolute inset-x-0 bottom-0 rounded-t-sheet bg-paper px-5 pt-3" style={{ paddingBottom: i.bottom + 16 }}>
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-line" />
          <View className="flex-row items-center gap-2">
            <Ruler size={18} color="#C77700" />
            <T w="semibold" className="text-[14px] uppercase tracking-wider text-warn">
              Tape reading
            </T>
          </View>
          <T w="bold" className="mt-2 text-[28px] tracking-[-0.6px]">
            {nextTape.label}
          </T>
          <T className="mt-1 text-[16px] text-ink-2">The camera can’t see this. Measure with a tape and enter it. Drawing: {nextTape.drawing} mm</T>
          <View className="mt-4 h-[72px] flex-row items-center rounded-xl bg-tile px-5">
            <TextInput
              value={tape}
              onChangeText={(t) => setTape(t.replace(/[^0-9.]/g, '').slice(0, 5))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#8A8A8A"
              autoFocus
              className="flex-1 font-bold text-[36px] text-ink"
            />
            <T w="medium" className="text-[20px] text-ink-2">
              mm
            </T>
          </View>
          <View className="mt-4 flex-row gap-2">
            <View className="flex-1">
              <Button label="Not seen" kind="secondary" onPress={() => saveTape(true)} />
            </View>
            <View className="flex-[2]">
              <Button label={tape ? 'Save reading' : 'Skip · manual later'} onPress={() => saveTape()} />
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
