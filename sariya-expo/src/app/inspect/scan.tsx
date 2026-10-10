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
import { Button, Chip, Details, Group, Hairline, Illo, KV, Notice, Num, Overline, Press, SHADOW, SourceTag, T, TextBtn, tap } from '@/components/ui';
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

const SHUTTER = 108;
const RING_R = 49;

function LockRing({ progress }: { progress: number }) {
  const c = 2 * Math.PI * RING_R;
  const m = SHUTTER / 2;
  return (
    <Svg width={SHUTTER} height={SHUTTER} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={m} cy={m} r={RING_R} stroke="rgba(255,255,255,0.3)" strokeWidth={5} fill="none" />
      <Circle cx={m} cy={m} r={RING_R} stroke="#3AD07A" strokeWidth={5} fill="none" strokeDasharray={`${c * progress} ${c}`} strokeLinecap="round" />
    </Svg>
  );
}

// Legible over any scene: bright sky, dark formwork, wet steel.
const OVER_CAMERA = { textShadowColor: 'rgba(0,0,0,0.55)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 1 } };

// Round glass control, camera-app style. `on` lifts it to white (torch on, help open).
function GlassBtn({ children, onPress, on, label, caption, size = 48, disabled }: { children: ReactNode; onPress?: () => void; on?: boolean; label: string; caption?: string; size?: number; disabled?: boolean }) {
  return (
    <View className="items-center">
      <Press
        onPress={onPress}
        disabled={disabled}
        scale={0.9}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={on === undefined ? undefined : { selected: on }}
        className={`items-center justify-center rounded-full ${on ? 'bg-white' : 'bg-black/50'} ${disabled ? 'opacity-40' : ''}`}
        style={{ width: size, height: size }}
      >
        {children}
      </Press>
      {caption ? (
        <T w="semibold" className="mt-1.5 text-[13px] text-white" style={OVER_CAMERA}>
          {caption}
        </T>
      ) : null}
    </View>
  );
}

// Big number with a small grey unit, for the result sheet.
function Stat({ value, unit, caption }: { value: string | number; unit: string; caption: string }) {
  return (
    <View>
      <View className="flex-row items-end">
        <Num className="text-[44px] leading-[48px] tracking-[-1.5px]">{value}</Num>
        <T w="medium" className="mb-1.5 ml-1 text-[17px] text-ink-2">
          {unit}
        </T>
      </View>
      <T className="text-[13px] text-ink-2">{caption}</T>
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

  // Presentation only: same lock gate as before, the shutter just shows it plainly.
  const locking = view === 'locking';
  const canLock = live.status === 'ready' || live.status === 'steady';
  const lit = canLock || locking;
  const statusColor = locking ? '#3AD07A' : LIVE_COPY[live.status].color;
  let statusText = LIVE_COPY[live.status].label;
  if (locking) statusText = 'Locking… hold still';
  else if (live.status === 'searching') statusText = `Find ${marker.name}`;
  else if (live.status === 'partial') statusText = `Show all of ${marker.name}`;
  const liveMm = live.positions.length >= 2 ? Math.round(gapsOf(live.positions).reduce((a, g) => a + g, 0) / (live.positions.length - 1)) : null;
  const weakCount = live.frame?.weak.length ?? 0;

  const marking = corners.length < 4;
  const barWord = target.marker === 'card' ? (target.axis === 'x' ? 'main bar' : 'distribution bar') : 'ring';
  let manualLabel = 'Tap the bars';
  if (marking) manualLabel = 'Mark the corners first';
  else if (taps.length) manualLabel = `Lock ${taps.length} bar${taps.length > 1 ? 's' : ''}`;

  const widest = lockGaps.length ? Math.round(Math.max(...lockGaps)) : null;
  const showTape = hot !== undefined && lockGaps.length > 0;
  const goFix = () => outside && router.push({ pathname: '/inspect/fix', params: { check: outside.def.id, from: 'scan' } });

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

      {/* top: close, the record, torch and help */}
      <View className="absolute inset-x-0 flex-row items-center gap-2 px-4" style={{ top: i.top + 10 }}>
        <GlassBtn label={view === 'manual' ? 'Stop marking' : 'Close scanner'} onPress={() => (view === 'manual' ? setPhase('live') : router.back())}>
          <X size={22} color="#fff" strokeWidth={2.4} />
        </GlassBtn>
        <View className="h-12 flex-1 justify-center rounded-full bg-black/50 px-4">
          <T w="semibold" className="text-[15px] leading-[19px] text-white" numberOfLines={1}>
            {cur.name}
            {cur.rev > 1 ? ` · rev ${cur.rev}` : ''}
          </T>
          <T className="text-[12px] leading-[16px] text-white/70" numberOfLines={1}>
            {target.label} · {marker.name}
          </T>
        </View>
        {view === 'live' ? (
          <>
            <GlassBtn label={torch ? 'Torch off' : 'Torch on'} on={torch} onPress={() => setTorch(!torch)}>
              {torch ? <Flashlight size={20} color="#000" /> : <FlashlightOff size={20} color="#fff" />}
            </GlassBtn>
            <GlassBtn label="How to scan" on={help} onPress={() => setHelp(!help)}>
              <CircleHelp size={20} color={help ? '#000' : '#fff'} />
            </GlassBtn>
          </>
        ) : null}
      </View>

      {/* target switch: one glass segmented control */}
      {view === 'live' && targets.length > 1 ? (
        <View className="absolute inset-x-0 items-center" style={{ top: i.top + 70 }}>
          <View className="flex-row rounded-full bg-black/50 p-1">
            {targets.map((t) => {
              const on = t.id === target.id;
              const done = !!activeLock(cur, t.id);
              return (
                <Press
                  key={t.id}
                  onPress={on ? undefined : () => setTid(t.id)}
                  scale={0.95}
                  accessibilityRole="tab"
                  accessibilityLabel={`${t.label}${done ? ', locked' : ''}`}
                  accessibilityState={{ selected: on }}
                  className={`h-11 min-w-[96px] flex-row items-center justify-center gap-1.5 rounded-full px-4 ${on ? 'bg-white' : ''}`}
                >
                  {done ? <Check size={15} color={on ? '#000' : '#fff'} strokeWidth={3} /> : null}
                  <T w={on ? 'bold' : 'semibold'} className={`text-[15px] ${on ? '' : 'text-white'}`}>
                    {t.short}
                  </T>
                </Press>
              );
            })}
          </View>
        </View>
      ) : null}

      {help && view === 'live' ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="absolute inset-x-4 rounded-card bg-paper p-4" style={[{ top: i.top + 132 }, SHADOW.float]}>
          <T w="semibold" className="text-[16px] leading-[22px]">
            {target.marker === 'card' ? 'Lay card S flat on the bars, edges along the bars.' : 'Lay strip_300 along the beam, 0 end at the column face.'} Torch on, about 30 cm away. Keep the whole {marker.name} in view.
          </T>
          <T className="mt-2 text-[14px] leading-[20px] text-ink-2">{LIVE.note}</T>
        </Animated.View>
      ) : null}

      {!perm?.granted ? (
        <View className="absolute inset-x-5 top-1/4 items-center rounded-sheet bg-paper px-5 pb-5 pt-4" style={SHADOW.float}>
          <Illo name="phone" size={120} />
          <T w="bold" className="mt-2 text-center text-[22px] leading-[28px] tracking-[-0.4px]">
            Allow the camera
          </T>
          <T className="mt-1 text-center text-[15px] leading-[21px] text-ink-2">Sariya measures the steel against the printed card. Photos stay on this phone until you send a pack.</T>
          <View className="mt-5 self-stretch">{perm && !perm.canAskAgain ? <Button label="Open settings" onPress={() => Linking.openSettings()} /> : <Button label="Allow camera" onPress={requestPerm} />}</View>
        </View>
      ) : null}
      {perm?.granted && !VisionView ? (
        <View className="absolute inset-x-5" style={{ top: i.top + 190 }}>
          <Notice tone="fail" title="Vision module missing">
            This build was made before the on-phone model was added. Rebuild the app (npx expo run:android).
          </Notice>
        </View>
      ) : null}
      {camError && VisionView ? (
        <View className="absolute inset-x-5" style={{ top: i.top + 190 }}>
          <Notice tone="fail" title="Camera problem">
            {camError}
          </Notice>
        </View>
      ) : null}

      {/* live readout + shutter */}
      {(view === 'live' || locking) && perm?.granted ? (
        <View className="absolute inset-x-0 items-center" style={{ bottom: i.bottom + 20 }}>
          <View className="h-10 flex-row items-center gap-2 rounded-full bg-black/50 px-4">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <T w="semibold" className="text-[16px]" style={{ color: statusColor }}>
              {statusText}
            </T>
          </View>
          {liveMm !== null ? (
            <>
              <View className="mt-1 flex-row items-end">
                <Num className="text-[76px] leading-[84px] tracking-[-2.5px] text-white" style={OVER_CAMERA}>
                  ~{liveMm}
                </Num>
                <T w="semibold" className="mb-3.5 ml-1.5 text-[22px] text-white/70" style={OVER_CAMERA}>
                  mm
                </T>
              </View>
              <T w="medium" className="-mt-1 text-[14px] text-white/80" style={OVER_CAMERA}>
                {live.positions.length} bars{weakCount ? ` · ${weakCount} partly seen` : ''}
              </T>
            </>
          ) : null}
          {turnHint(live.frame) ? (
            <T w="semibold" className="mt-1 text-[14px] text-[#FFC043]" style={OVER_CAMERA}>
              Turn the phone so the bars run up the screen
            </T>
          ) : null}

          <View className="mt-4 w-full flex-row items-center justify-center">
            <View className="w-24 items-center">
              <GlassBtn label="Mark by hand" caption="By hand" size={56} onPress={startManual}>
                <Hand size={22} color="#fff" />
              </GlassBtn>
            </View>
            <View className="mx-4 items-center">
              <Press
                onPress={doLock}
                disabled={!canLock || locking}
                feel="impact"
                scale={0.93}
                accessibilityRole="button"
                accessibilityLabel="Lock the measurement"
                className="items-center justify-center"
                style={{ width: SHUTTER, height: SHUTTER }}
              >
                <LockRing progress={locking ? lockProgress : live.progress} />
                <View className={`h-[84px] w-[84px] items-center justify-center rounded-full ${lit ? 'bg-white' : 'border-2 border-white/35 bg-white/15'}`}>
                  <Ruler size={32} color={lit ? '#000' : 'rgba(255,255,255,0.55)'} strokeWidth={2.2} />
                </View>
              </Press>
              <T w="bold" className={`mt-0.5 text-[15px] ${lit ? 'text-white' : 'text-white/55'}`} style={OVER_CAMERA}>
                {locking ? 'Locking' : 'Lock'}
              </T>
            </View>
            <View className="w-24" />
          </View>
        </View>
      ) : null}

      {/* manual marking instructions */}
      {view === 'manual' ? (
        <>
          <View className="absolute inset-x-4 rounded-2xl bg-black/50 px-4 py-3" style={{ top: i.top + 70 }}>
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-white px-2.5 py-0.5">
                <Num className="text-[13px]">{marking ? 1 : 2}/2</Num>
              </View>
              <SourceTag source="manual" />
              <Num w="medium" className="text-[13px] text-white/70">
                {marking ? `Corner ${corners.length + 1} of 4` : `${taps.length} marked`}
              </Num>
            </View>
            <T w="bold" className="mt-1.5 text-[18px] leading-[24px] text-white">
              {marking ? `Tap the 4 corners of the ${marker.name}` : `Tap each ${barWord} once`}
            </T>
            <T className="text-[13px] leading-[18px] text-white/70">
              {marking ? `${target.marker === 'strip' ? '0 end on the left. ' : ''}Top-left first, then clockwise.` : `Where it crosses the ${marker.name}.`}
            </T>
          </View>
          <View className="absolute inset-x-0 flex-row items-center gap-3 px-5" style={{ bottom: i.bottom + 20 }}>
            <Press
              onPress={() => {
                if (taps.length) setTaps(taps.slice(0, -1));
                else setCorners(corners.slice(0, -1));
              }}
              disabled={!corners.length}
              scale={0.94}
              accessibilityRole="button"
              accessibilityLabel="Undo last tap"
              className={`h-14 flex-row items-center gap-2 rounded-2xl bg-black/50 px-5 ${corners.length ? '' : 'opacity-40'}`}
            >
              <Undo2 size={22} color="#fff" strokeWidth={2.2} />
              <T w="semibold" className="text-[17px] text-white">
                Undo
              </T>
            </Press>
            <View className="flex-1">
              <Button label={manualLabel} disabled={marking || !taps.length} kind="accent" onPress={lockManual} />
            </View>
          </View>
        </>
      ) : null}

      {/* locked result sheet: the actions stay pinned under the scrolling findings */}
      {view === 'locked' && lock ? (
        <Animated.View entering={SlideInDown.springify().damping(18)} className="absolute inset-x-0 bottom-0 max-h-[64%] rounded-t-sheet bg-paper" style={[{ paddingBottom: i.bottom + 8 }, SHADOW.float]}>
          <ScrollView style={{ flexShrink: 1 }} contentContainerClassName="px-5 pb-2 pt-3" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-line" />
            <View className="flex-row items-center gap-2">
              <Overline>{target.label}</Overline>
              <SourceTag source={lock.source} />
            </View>
            <View className="mt-2 flex-row items-end gap-8">
              <Stat value={lock.positions.length} unit="bars" caption="Counted" />
              {widest !== null ? <Stat value={widest} unit={`± ${lock.band} mm`} caption="Widest gap" /> : null}
            </View>

            {findings.length ? (
              <Group className="mt-4">
                {findings.map((f, k) => (
                  <View key={f.def.id} className="px-4 py-3.5">
                    {k ? <Hairline /> : null}
                    <View className="flex-row items-center gap-3">
                      <T w="semibold" className="flex-1 text-[16px] leading-[22px]" numberOfLines={2}>
                        {checkName(f.def)}
                      </T>
                      <Chip outcome={f.outcome} small />
                    </View>
                    {f.value || f.limit ? (
                      <View className="mt-1 flex-row flex-wrap items-baseline gap-x-2">
                        {f.value ? (
                          <Num w="semibold" className="text-[15px]">
                            {f.value}
                          </Num>
                        ) : null}
                        {f.limit ? <T className="text-[13px] text-ink-3">Limit {f.limit}</T> : null}
                      </View>
                    ) : null}
                    {f.reason && f.outcome !== 'within' ? (
                      <T className="mt-1 text-[14px] leading-[20px] text-ink-2">
                        {f.reason}
                        {f.action ? `. ${f.action}` : ''}
                      </T>
                    ) : null}
                  </View>
                ))}
              </Group>
            ) : null}

            {hot !== undefined && showTape && benchOpen ? (
              <View className="mt-3 rounded-card bg-tile p-3">
                <T w="semibold" className="text-[15px]">
                  Tape gap {hot + 1} (highlighted), centre to centre
                </T>
                <View className="mt-2 flex-row items-center gap-2">
                  <View className="h-12 flex-1 flex-row items-center rounded-xl bg-paper px-3">
                    <TextInput value={tape} onChangeText={(t) => setTape(t.replace(/[^0-9.]/g, '').slice(0, 5))} keyboardType="numeric" placeholder="tape mm" placeholderTextColor="#8A8A8A" className="flex-1 font-semibold text-[18px] text-ink" />
                  </View>
                  <Press onPress={saveBench} accessibilityRole="button" className="h-12 justify-center rounded-xl bg-ink px-4">
                    <T w="semibold" className="text-[15px] text-white">
                      Save row
                    </T>
                  </Press>
                </View>
                {benchSaved ? <T className="mt-2 text-[13px] text-ink-2">{benchSaved}</T> : null}
              </View>
            ) : null}

            <Details>
              <Group>
                <KV first k="Frames" v={String(lock.frames)} />
                {lock.engine ? <KV k="Engine" v={lock.engine} /> : null}
                <KV k="Photo" v={lock.image ? lock.image.hash.slice(0, 12) : 'None'} />
              </Group>
            </Details>
          </ScrollView>

          <View className="border-t border-line px-5 pt-3" onTouchStart={() => Keyboard.dismiss()}>
            {outside ? <Button label="Show fix for the mason" kind="accent" onPress={goFix} /> : null}
            {rescan && !outside ? <Button label={`Re-scan ${target.short.toLowerCase()}`} onPress={() => actions.rescan(target.id)} /> : null}
            {outside || rescan ? null : <Button label={next.label} onPress={next.go} />}
            <View className="flex-row items-center justify-center gap-6">
              {outside || rescan ? <TextBtn label={next.label} onPress={next.go} /> : null}
              {showTape && !benchOpen ? <TextBtn label="Add a tape check" onPress={() => setBenchOpen(true)} /> : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
