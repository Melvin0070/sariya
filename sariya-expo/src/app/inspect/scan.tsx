import { useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, CircleHelp, Flashlight, FlashlightOff, Hand, Ruler, Undo2, X } from 'lucide-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Image, Keyboard, Linking, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { VisionView, type VisionFrame, type VisionViewRef } from '../../../modules/sariya-vision';

import { Evidence } from '@/components/evidence';
import { Button, Chip, Hairline, Notice, SourceTag, T, TextBtn, tap } from '@/components/ui';
import { keepEvidence } from '@/lib/files';
import type { Pt } from '@/lib/homography';
import { autoLock, barDiaFor, flushTimings, LIVE, LIVE_COPY, manualLock, TAP_ERROR_PX, turnHint, useVisionLive } from '@/lib/measure';
import { evaluate, gapsOf } from '@/lib/rules';
import { checksFor, checkName, MARKERS, TARGETS, type TargetId } from '@/lib/spec';
import { actions, activeLock, getState, useDraft, type Lock } from '@/lib/store';

const LOCK_MS = 1200; // ~15 preview frames

// The model's bars and the detected card, mapped from the upright camera frame onto the screen the way the
// preview fills it (centre crop).
function LiveOverlay({ frame, w, h }: { frame: VisionFrame | null; w: number; h: number }) {
  if (!frame) return null;
  const k = Math.max(w / frame.w, h / frame.h);
  const ox = (w - frame.w * k) / 2;
  const oy = (h - frame.h * k) / 2;
  const X = (x: number) => ox + x * k;
  const Y = (y: number) => oy + y * k;
  const bars = frame.bars;
  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill} pointerEvents="none">
      {frame.pose ? <Polygon points={frame.pose.outline.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="rgba(255,106,19,0.10)" stroke="#FF6A13" strokeWidth={3} /> : null}
      {bars.map((b, i) => (
        <Line key={i} x1={X(b.seg[0])} y1={Y(b.seg[1])} x2={X(b.seg[2])} y2={Y(b.seg[3])} stroke="#FFFFFF" strokeWidth={3} opacity={0.9} />
      ))}
      {frame.weak.map((b, i) => (
        <Line key={`w${i}`} x1={X(b.seg[0])} y1={Y(b.seg[1])} x2={X(b.seg[2])} y2={Y(b.seg[3])} stroke="#FFC043" strokeWidth={3} strokeDasharray="10 8" opacity={0.9} />
      ))}
      {bars.slice(1).map((b, i) => {
        const a = bars[i];
        const x = (a.seg[0] + a.seg[2] + b.seg[0] + b.seg[2]) / 4;
        const y = (a.seg[1] + a.seg[3] + b.seg[1] + b.seg[3]) / 4;
        return (
          <SvgText key={`g${i}`} x={X(x)} y={Y(y)} fontSize={15} fontWeight="700" fill="#FFFFFF" stroke="#000" strokeWidth={0.6} textAnchor="middle">
            ~{Math.round(b.pos - a.pos)}
          </SvgText>
        );
      })}
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

function RoundBtn({ children, onPress, on, label }: { children: ReactNode; onPress?: () => void; on?: boolean; label?: string }) {
  return (
    <View className="items-center">
      <Pressable
        onPress={() => {
          tap();
          onPress?.();
        }}
        className={`h-12 w-12 items-center justify-center rounded-full ${on ? 'bg-white' : 'bg-black/55'}`}
      >
        {children}
      </Pressable>
      {label ? <T className="mt-1 text-[12px] text-white">{label}</T> : null}
    </View>
  );
}

// Resolves after ms, reporting 0..1 progress on the way.
function holdFor(ms: number, onProgress: (p: number) => void) {
  const t0 = Date.now();
  const timer = setInterval(() => onProgress(Math.min(1, (Date.now() - t0) / ms)), 50);
  return new Promise<void>((r) =>
    setTimeout(() => {
      clearInterval(timer);
      onProgress(1);
      r();
    }, ms),
  );
}

type Frozen = { uri: string; w: number; h: number; hash?: string; file?: string; frame?: VisionFrame };

export default function Scan() {
  const i = useSafeAreaInsets();
  const win = useWindowDimensions();
  const cur = useDraft();
  const [perm, requestPerm] = useCameraPermissions();
  const cam = useRef<VisionViewRef>(null);
  const params = useLocalSearchParams<{ target?: TargetId }>();
  const targets = cur ? TARGETS[cur.member] : [];
  const [tid, setTid] = useState<TargetId | undefined>(() => params.target ?? (cur ? (targets.find((t) => !activeLock(cur, t.id)) ?? targets[0])?.id : undefined));
  const target = targets.find((t) => t.id === tid);
  const [phase, setPhase] = useState<'live' | 'locking' | 'locked' | 'manual'>('live');
  const [camError, setCamError] = useState('');
  const [torch, setTorch] = useState(false);
  const [help, setHelp] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);
  const [frozen, setFrozen] = useState<Frozen | null>(null);
  const [corners, setCorners] = useState<Pt[]>([]);
  const [taps, setTaps] = useState<Pt[]>([]);
  const [benchOpen, setBenchOpen] = useState(false);
  const [tape, setTape] = useState('');
  const [benchSaved, setBenchSaved] = useState('');

  const lock = cur && target ? activeLock(cur, target.id) : undefined;
  // A fix or re-scan supersedes the lock; the screen is then live again for that family.
  const view = phase === 'locked' && !lock ? 'live' : phase;
  const { live, onFrame, startCapture, stopCapture, reset } = useVisionLive();

  useEffect(() => {
    if (live.status === 'ready' && view === 'live') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [live.status, view]);

  useEffect(() => reset(), [tid, reset]);
  useEffect(() => flushTimings, []);

  if (!cur || !target) return <Redirect href="/" />;
  const marker = MARKERS[target.marker];
  const barDia = barDiaFor(cur.spec, cur.member);
  const engineLine = live.frame && live.frame.accel !== 'none' ? `${live.frame.accel}${live.frame.inferMs >= 0 ? ` ${live.frame.inferMs} ms` : ''}` : LIVE.title;

  const snap = async (): Promise<Frozen | null> => {
    try {
      const pic = await cam.current?.freeze();
      if (!pic) return null;
      const kept = await keepEvidence(pic.uri);
      return { uri: kept.file, w: pic.w, h: pic.h, frame: pic.frame, ...kept };
    } catch (e) {
      setCamError((e as Error).message);
      return null;
    }
  };
  const evidenceOf = (f: Frozen | null): Lock['image'] => (f?.hash && f.file ? { hash: f.hash, file: f.file, w: f.w, h: f.h } : undefined);

  const doLock = async () => {
    setPhase('locking');
    setLockProgress(0);
    startCapture();
    await holdFor(LOCK_MS, setLockProgress);
    const frames = stopCapture();
    const photo = await snap();
    const l = autoLock(target, frames, photo?.frame ?? null, evidenceOf(photo));
    actions.addLock(l);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setBenchOpen(false);
    setBenchSaved('');
    setPhase('locked');
  };

  const startManual = async () => {
    const photo = await snap();
    if (!photo) {
      setCamError('Could not freeze a frame. Try again.');
      return;
    }
    setFrozen(photo);
    setCorners([]);
    setTaps([]);
    setPhase('manual');
  };

  // Manual-mode geometry: fit the frozen photo inside the screen.
  const scale = frozen ? Math.min(win.width / frozen.w, (win.height - i.top - i.bottom - 340) / frozen.h) : 1;
  const boxW = frozen ? frozen.w * scale : 0;
  const boxH = frozen ? frozen.h * scale : 0;
  const manualPreview = frozen && corners.length === 4 ? manualLock(target, corners, taps, { hash: '', file: frozen.uri, w: frozen.w, h: frozen.h }, TAP_ERROR_PX / scale) : null;

  const lockManual = () => {
    if (!frozen || corners.length < 4 || !taps.length) return;
    const l = manualLock(target, corners, taps, evidenceOf(frozen)!, TAP_ERROR_PX / scale);
    actions.addLock(l);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setFrozen(null);
    setBenchOpen(false);
    setBenchSaved('');
    setPhase('locked');
  };

  const findings = evaluate(cur).filter((f) => f.def.target === target.id);
  const nextTarget = targets.find((t) => t.id !== target.id && !activeLock(cur, t.id));
  const readingsLeft = checksFor(cur.member, cur.spec).some((c) => c.reading && !cur.readings[c.id]);
  const outside = findings.find((f) => f.outcome === 'outside' && f.fix);
  const rescan = findings.some((f) => f.outcome === 'rescan');
  const hot = findings.find((f) => f.hot !== undefined)?.hot;
  const lockGaps = lock ? gapsOf(lock.positions) : [];

  const next = nextTarget
    ? { label: `Next: ${nextTarget.label.toLowerCase()}`, go: () => (setTid(nextTarget.id), setPhase('live')) }
    : readingsLeft
      ? { label: 'Next: readings by hand', go: () => router.replace('/inspect/readings') }
      : { label: 'See all checks', go: () => router.back() };

  const saveBench = () => {
    const t = Number(tape);
    if (!lock || hot === undefined || !Number.isFinite(t) || t <= 0) return;
    const app = Math.round(lockGaps[hot]);
    actions.addBench({ record: `${cur.name} rev ${cur.rev}`, target: target.id, gap: hot + 1, appMm: app, band: lock.band, tapeMm: t, source: lock.source, by: getState().name });
    Keyboard.dismiss();
    setBenchSaved(`Saved: app ${app} ± ${lock.band} vs tape ${t} mm (residual ${app - t >= 0 ? '+' : ''}${app - t})`);
    setTape('');
  };

  return (
    <View className="flex-1 bg-black">
      {perm?.granted && VisionView ? (
        <VisionView
          ref={cam}
          style={StyleSheet.absoluteFill}
          active={view === 'live' || view === 'locking'}
          torch={torch}
          marker={target.marker}
          axis={target.axis}
          barDia={barDia}
          minLenMm={Math.max(60, 8 * barDia)}
          onFrame={(e) => onFrame(e.nativeEvent)}
          onError={(e) => setCamError(e.nativeEvent.message)}
        />
      ) : null}

      {view === 'live' || view === 'locking' ? <LiveOverlay frame={live.frame} w={win.width} h={win.height} /> : null}

      {/* frozen evidence behind the result sheet */}
      {view === 'locked' && lock ? (
        <View className="absolute inset-0 justify-start bg-black" style={{ paddingTop: i.top + 64 }}>
          <Evidence lock={lock} rounded={false} />
        </View>
      ) : null}

      {/* manual marking on a frozen frame */}
      {view === 'manual' && frozen ? (
        <View className="absolute inset-0 items-center justify-center bg-black" style={{ paddingTop: i.top + 190, paddingBottom: i.bottom + 110 }}>
          <Pressable
            style={{ width: boxW, height: boxH }}
            onPress={(e) => {
              const p = { x: e.nativeEvent.locationX / scale, y: e.nativeEvent.locationY / scale };
              tap();
              if (corners.length < 4) setCorners([...corners, p]);
              else setTaps([...taps, p]);
            }}
          >
            <Image source={{ uri: frozen.uri }} style={{ width: boxW, height: boxH }} />
            <Svg viewBox={`0 0 ${frozen.w} ${frozen.h}`} style={StyleSheet.absoluteFill} pointerEvents="none">
              {corners.length === 4 ? <Polygon points={corners.map((c) => `${c.x},${c.y}`).join(' ')} fill="rgba(255,106,19,0.15)" stroke="#FF6A13" strokeWidth={4 / scale} /> : null}
              {corners.map((c, k) => (
                <Circle key={`c${k}`} cx={c.x} cy={c.y} r={9 / scale} fill="#FF6A13" stroke="#fff" strokeWidth={2 / scale} />
              ))}
              {manualPreview?.overlay.segs.slice(4).map((s, k) => (
                <Line key={`s${k}`} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} stroke="#fff" strokeWidth={3 / scale} />
              ))}
              {taps.map((t, k) => (
                <Circle key={`t${k}`} cx={t.x} cy={t.y} r={7 / scale} fill="#fff" stroke="#000" strokeWidth={2 / scale} />
              ))}
              {manualPreview?.overlay.labels.map((l, k) => (
                <SvgText key={`l${k}`} x={l.x} y={l.y - 14 / scale} fontSize={15 / scale} fontWeight="700" fill={l.hot ? '#FF6A13' : '#fff'} textAnchor="middle">
                  {l.text}
                </SvgText>
              ))}
            </Svg>
          </Pressable>
        </View>
      ) : null}

      {/* top: persistent label + controls */}
      <View className="absolute inset-x-0 flex-row items-start gap-3 px-4" style={{ top: i.top + 10 }}>
        <RoundBtn onPress={() => (view === 'manual' ? setPhase('live') : router.back())}>
          <X size={22} color="#fff" />
        </RoundBtn>
        <View className="flex-1 rounded-2xl bg-black/55 px-4 py-2.5">
          <T w="semibold" className="text-[16px] text-white" numberOfLines={1}>
            {cur.name}
            {cur.rev > 1 ? ` · rev ${cur.rev}` : ''}
          </T>
          <T className="text-[13px] text-white/75" numberOfLines={1}>
            {target.label} · {marker.name} · {engineLine}
          </T>
        </View>
        {view === 'live' ? (
          <View className="gap-2">
            <RoundBtn onPress={() => setTorch(!torch)} on={torch}>
              {torch ? <Flashlight size={20} color="#000" /> : <FlashlightOff size={20} color="#fff" />}
            </RoundBtn>
            <RoundBtn onPress={() => setHelp(!help)} on={help}>
              <CircleHelp size={20} color={help ? '#000' : '#fff'} />
            </RoundBtn>
          </View>
        ) : null}
      </View>

      {/* family selector + simulated label */}
      {view === 'live' ? (
        <View className="absolute inset-x-0 items-center gap-2" style={{ top: i.top + 76 }}>
          {targets.length > 1 ? (
            <View className="flex-row gap-2">
              {targets.map((t) => {
                const on = t.id === target.id;
                const done = !!activeLock(cur, t.id);
                return (
                  <Pressable key={t.id} onPress={() => (tap(), setTid(t.id))} className={`h-9 flex-row items-center gap-1.5 rounded-full px-3.5 ${on ? 'bg-white' : 'bg-black/55'}`}>
                    {done ? <Check size={14} color={on ? '#000' : '#fff'} strokeWidth={3} /> : null}
                    <T w="semibold" className={`text-[13px] ${on ? '' : 'text-white'}`}>
                      {t.short}
                    </T>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : null}

      {help && view === 'live' ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-x-4 rounded-card bg-white p-4" style={{ top: i.top + 150 }}>
          <T w="semibold" className="text-[16px] leading-[22px]">
            {target.marker === 'card' ? 'Lay card S flat on the bars, edges along the bars.' : 'Lay strip_300 along the beam, 0 end at the column face.'} Torch on, about 30 cm away. Keep the whole {marker.name} in view.
          </T>
          <T className="mt-2 text-[14px] leading-[20px] text-ink-2">{LIVE.note}</T>
        </Animated.View>
      ) : null}

      {!perm?.granted ? (
        <View className="absolute inset-x-5 top-1/3 rounded-card bg-paper p-5">
          <T w="semibold" className="text-[18px]">
            Camera needed
          </T>
          <T className="mt-1 text-[15px] text-ink-2">Sariya measures the steel against the printed card. Photos stay on this phone until you send a pack.</T>
          <View className="mt-4">{perm && !perm.canAskAgain ? <Button label="Open settings" onPress={() => Linking.openSettings()} /> : <Button label="Allow camera" onPress={requestPerm} />}</View>
        </View>
      ) : null}
      {perm?.granted && !VisionView ? (
        <View className="absolute inset-x-5" style={{ top: i.top + 190 }}>
          <Notice tone="fail" title="Vision module missing">
            This build was made before the on-phone model was added. Rebuild the app (npx expo run:android).
          </Notice>
        </View>
      ) : null}
      {camError ? (
        <View className="absolute inset-x-5" style={{ top: i.top + 190 }}>
          <Notice tone="fail" title="Camera problem">
            {camError}
          </Notice>
        </View>
      ) : null}

      {/* live readout + lock */}
      {(view === 'live' || view === 'locking') && perm?.granted ? (
        <View className="absolute inset-x-0 items-center" style={{ bottom: i.bottom + 24 }}>
          <View className="flex-row items-center gap-2 rounded-full bg-black/60 px-4 py-2">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: view === 'locking' ? '#3AD07A' : LIVE_COPY[live.status].color }} />
            <T w="semibold" className="text-[16px]" style={{ color: view === 'locking' ? '#3AD07A' : LIVE_COPY[live.status].color }}>
              {view === 'locking' ? 'Locking… hold still' : live.status === 'searching' ? `Find ${marker.name}` : live.status === 'partial' ? `Show all of ${marker.name}` : LIVE_COPY[live.status].label}
            </T>
          </View>
          {live.positions.length >= 2 ? (
            <>
              <View className="mt-2 flex-row items-end">
                <T w="bold" className="text-[60px] leading-[66px] tracking-[-2px] text-white">
                  ~{Math.round(gapsOf(live.positions).reduce((a, g) => a + g, 0) / (live.positions.length - 1))}
                </T>
                <T w="medium" className="mb-3 ml-1.5 text-[20px] text-white/80">
                  mm
                </T>
              </View>
              <T className="text-[14px] text-white/75">
                {live.positions.length} bars{live.frame?.weak.length ? ` · ${live.frame.weak.length} partly seen` : ''} · Lock for the verdict
              </T>
            </>
          ) : null}
          {turnHint(live.frame) ? (
            <T w="semibold" className="mt-1 text-[14px] text-[#FFC043]">
              Turn the phone so the bars run up the screen
            </T>
          ) : null}

          <View className="mt-4 w-full flex-row items-center justify-center gap-10">
            <RoundBtn onPress={startManual} label="By hand">
              <Hand size={20} color="#fff" />
            </RoundBtn>
            <View className="items-center">
              <Pressable onPress={doLock} disabled={(live.status !== 'ready' && live.status !== 'steady') || view === 'locking'} className="h-24 w-24 items-center justify-center">
                <LockRing progress={view === 'locking' ? lockProgress : live.progress} />
                <View className={`h-[74px] w-[74px] items-center justify-center rounded-full ${live.status === 'ready' || view === 'locking' ? 'bg-white' : 'bg-white/25'}`}>
                  <Ruler size={28} color={live.status === 'ready' || view === 'locking' ? '#000' : 'rgba(255,255,255,0.7)'} />
                </View>
              </Pressable>
              <T w="semibold" className="text-[15px] text-white">
                Lock
              </T>
            </View>
            <View className="w-12" />
          </View>
        </View>
      ) : null}

      {/* manual marking instructions */}
      {view === 'manual' ? (
        <>
          <View className="absolute inset-x-4 rounded-2xl bg-black/70 px-4 py-3" style={{ top: i.top + 70 }}>
            <View className="flex-row items-center gap-2">
              <SourceTag source="manual" />
              <T className="text-[13px] text-white/75">{corners.length < 4 ? `Step 1 of 2 · corner ${corners.length + 1} of 4` : `Step 2 of 2 · ${taps.length} bars marked`}</T>
            </View>
            <T w="semibold" className="mt-1 text-[16px] leading-[22px] text-white">
              {corners.length < 4 ? `Tap ${marker.corners}: top-left, top-right, bottom-right, bottom-left.` : `Tap each ${target.marker === 'card' ? (target.axis === 'x' ? 'main bar' : 'distribution bar') : 'ring'} once, where it crosses the ${marker.name}.`}
            </T>
          </View>
          <View className="absolute inset-x-0 flex-row items-center gap-3 px-5" style={{ bottom: i.bottom + 20 }}>
            <RoundBtn
              onPress={() => {
                if (taps.length) setTaps(taps.slice(0, -1));
                else setCorners(corners.slice(0, -1));
              }}
              label="Undo"
            >
              <Undo2 size={20} color="#fff" />
            </RoundBtn>
            <View className="flex-1">
              <Button label={corners.length < 4 ? 'Mark the corners first' : taps.length ? `Lock ${taps.length} bar${taps.length > 1 ? 's' : ''}` : 'Tap the bars'} disabled={corners.length < 4 || !taps.length} kind="accent" onPress={lockManual} />
            </View>
          </View>
        </>
      ) : null}

      {/* locked result sheet */}
      {view === 'locked' && lock ? (
        <Animated.View entering={SlideInDown.springify().damping(18)} className="absolute inset-x-0 bottom-0 max-h-[62%] rounded-t-sheet bg-paper" style={{ paddingBottom: i.bottom + 16 }}>
          <ScrollView contentContainerClassName="px-5 pt-3" keyboardShouldPersistTaps="handled">
            <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-line" />
            <View className="flex-row items-center gap-2">
              <T w="medium" className="text-[14px] text-ink-2">
                {target.label}
              </T>
              <SourceTag source={lock.source} />
            </View>
            <T w="bold" className="mt-1 text-[28px] tracking-[-0.8px]">
              {lock.positions.length} bars{lockGaps.length ? ` · widest ${Math.round(Math.max(...lockGaps))} ± ${lock.band} mm` : ''}
            </T>
            <T className="mt-0.5 text-[13px] text-ink-3">
              {lock.frames} frame{lock.frames === 1 ? '' : 's'}{lock.engine ? ` · ${lock.engine}` : ''}{lock.image ? ` · photo ${lock.image.hash.slice(0, 8)}` : ' · no photo'}
            </T>

            <View className="-mx-5 mt-2">
              {findings.map((f, k) => (
                <View key={f.def.id} className="px-5 py-3">
                  {k ? <Hairline /> : null}
                  <View className="flex-row items-start gap-2">
                    <T w="medium" className="flex-1 text-[16px]">
                      {checkName(f.def)}
                    </T>
                    <Chip outcome={f.outcome} small />
                  </View>
                  {f.value ? <T className="mt-0.5 text-[15px]">{f.value}</T> : null}
                  {f.limit ? <T className="text-[13px] text-ink-3">Limit {f.limit}</T> : null}
                  {f.reason && f.outcome !== 'within' ? (
                    <T className="mt-1 text-[14px] text-ink-2">
                      {f.reason}
                      {f.action ? `. ${f.action}` : ''}
                    </T>
                  ) : null}
                </View>
              ))}
            </View>

            {hot !== undefined && lockGaps.length ? (
              benchOpen ? (
                <View className="mt-3 rounded-xl border border-line p-3">
                  <T w="semibold" className="text-[15px]">
                    Tape gap {hot + 1} (highlighted), centre to centre
                  </T>
                  <View className="mt-2 flex-row items-center gap-2">
                    <View className="h-12 flex-1 flex-row items-center rounded-xl bg-tile px-3">
                      <TextInput value={tape} onChangeText={(t) => setTape(t.replace(/[^0-9.]/g, '').slice(0, 5))} keyboardType="numeric" placeholder="tape mm" placeholderTextColor="#8A8A8A" className="flex-1 font-semibold text-[18px] text-ink" />
                    </View>
                    <Pressable onPress={saveBench} className="h-12 justify-center rounded-xl bg-ink px-4 active:opacity-80">
                      <T w="semibold" className="text-[15px] text-white">
                        Save row
                      </T>
                    </Pressable>
                  </View>
                  {benchSaved ? <T className="mt-2 text-[13px] text-ink-2">{benchSaved}</T> : null}
                </View>
              ) : null
            ) : null}

            <View className="mt-4" onTouchStart={() => Keyboard.dismiss()}>
              {outside ? <Button label="Show fix for the mason" kind="accent" onPress={() => router.push({ pathname: '/inspect/fix', params: { check: outside.def.id, from: 'scan' } })} /> : null}
              {rescan && !outside ? <Button label={`Re-scan ${target.short.toLowerCase()}`} onPress={() => actions.rescan(target.id)} /> : null}
              {outside || rescan ? (
                <TextBtn label={next.label} onPress={next.go} />
              ) : (
                <Button label={next.label} onPress={next.go} />
              )}
              {hot !== undefined && lockGaps.length && !benchOpen ? <TextBtn label="Add a tape check" onPress={() => setBenchOpen(true)} /> : null}
            </View>
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
}
