import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check as CheckIcon, Play, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { Button, Chip, Enter, H2, Illo, Notice, Num, Press, Screen, Segmented, T, TextBtn, Title, TopBar } from '@/components/ui';
import { speak, stopSpeaking, voices, type Voices } from '@/lib/device';
import { LANG_LABEL, say, spoken } from '@/lib/fix';
import { evaluate } from '@/lib/rules';
import { actions, useDraft, useStore, type Lang } from '@/lib/store';

// Locked bar positions (red) against the drawing's spacing from the same first bar (green), on one mm scale.
function Diagram({ positions, spec }: { positions: number[]; spec: number }) {
  const a = positions[0];
  const span = Math.max(positions[positions.length - 1] - a, spec);
  const want: number[] = [];
  for (let p = a; p <= a + span + 0.5; p += spec) want.push(p);
  const x = (p: number) => 20 + ((p - a) * 280) / span;
  return (
    <Svg width="100%" height={150} viewBox="0 0 320 150">
      <Rect x={10} y={8} width={300} height={62} rx={8} fill="#FDECEA" />
      <Rect x={10} y={80} width={300} height={62} rx={8} fill="#E6F4EC" />
      {positions.map((p, i) => (
        <Line key={`n${i}`} x1={x(p)} y1={16} x2={x(p)} y2={62} stroke="#E11900" strokeWidth={4} strokeLinecap="round" />
      ))}
      {want.map((p, i) => (
        <Line key={`w${i}`} x1={x(p)} y1={88} x2={x(p)} y2={134} stroke="#05944F" strokeWidth={4} strokeLinecap="round" />
      ))}
    </Svg>
  );
}

export default function Fix() {
  const { check, from } = useLocalSearchParams<{ check: string; from?: string }>();
  const cur = useDraft();
  const defLang = useStore((s) => s.lang);
  const [lang, setLang] = useState<Lang>(defLang);
  const [v, setV] = useState<Voices | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const autoplayed = useRef(false);

  const f = cur ? evaluate(cur).find((x) => x.def.id === check) : undefined;
  const s = f && cur ? say(f, cur.member, cur.name, lang) : null;
  const en = f && cur ? say(f, cur.member, cur.name, 'en') : null;
  const hasVoice = !!v?.[lang];

  const play = () => {
    if (!s || !hasVoice) return;
    stopSpeaking();
    setSpeaking(speak(spoken(s), lang, () => setSpeaking(false)));
  };

  useEffect(() => {
    voices().then(setV);
    return () => {
      stopSpeaking();
    };
  }, []);

  // Speak once when the screen opens, so the mason hears it without anyone hunting for a button.
  useEffect(() => {
    if (!autoplayed.current && v && s && v[lang]) {
      autoplayed.current = true;
      setSpeaking(speak(spoken(s), lang, () => setSpeaking(false)));
    }
  }, [v, s, lang]);

  if (!cur) return <Redirect href="/" />;
  // Marking it fixed clears the finding while this screen is still leaving; render nothing for that frame.
  if (!f || !s || !en) return null;
  const lock = f.lock;
  const fixKind = f.fix?.kind;
  const showDiagram = !!lock && lock.positions.length > 1 && (fixKind === 'add_in_gap' || fixKind === 'move_bar' || fixKind === 'respace' || fixKind === 'add_rings_zone');
  const spec = f.fix && 'spec' in f.fix ? f.fix.spec : 0;

  const done = () => {
    stopSpeaking();
    actions.corrected(f.def.id, f.def.target);
    // Back on the scanner the family is live again; from the checks sheet, open the right place to re-check.
    router.back();
    if (from === 'scan') return;
    if (f.def.target) router.push({ pathname: '/inspect/scan', params: { target: f.def.target } });
    else router.push('/inspect/readings');
  };

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else play();
  };

  return (
    <Screen
      footer={
        <>
          <Button label="Fixed · check again" icon={CheckIcon} onPress={done} />
          <TextBtn label="Not fixed yet" onPress={() => (stopSpeaking(), router.back())} />
        </>
      }
    >
      <TopBar name={cur.name} sub={f.def.zone ?? f.def.label} />
      <View className="flex-row items-center gap-3">
        <Title className="flex-1">Fix for the mason</Title>
        <Chip outcome="outside" small />
      </View>

      <View className="mt-5">
        <Segmented
          items={(['hi', 'kn', 'en'] as Lang[]).map((l) => ({ key: l, label: LANG_LABEL[l] }))}
          value={lang}
          onChange={(l) => {
            stopSpeaking();
            setSpeaking(false);
            setLang(l);
            actions.setLang(l);
          }}
        />
      </View>

      {/* subtitles are the primary channel; audio is for the mason */}
      <Enter key={lang}>
        <View className="mt-4 rounded-card bg-ink p-5">
          <T w="medium" className="text-[15px] text-white/60">
            {s.head}
          </T>
          {s.body.map((line) => (
            <T key={line} w="semibold" className="mt-2 text-[24px] leading-[34px] text-white">
              {line}
            </T>
          ))}
          <View className="mt-5 rounded-xl bg-accent px-4 py-4">
            <T w="bold" className="text-[26px] leading-[34px] text-white">
              {s.action}
            </T>
          </View>
        </View>
      </Enter>
      {lang !== 'en' ? <T className="mt-3 text-[15px] leading-[22px] text-ink-2">{[...en.body, en.action].join(' ')}</T> : null}

      {v && !hasVoice ? (
        <Notice tone="warn" className="mt-4" title={`${LANG_LABEL[lang]} voice not installed: audio unavailable`}>
          Show the subtitles to the mason. Add the voice in Settings › Text-to-speech to hear it offline.
        </Notice>
      ) : (
        <View className="mt-4 flex-row items-center gap-3 rounded-card bg-tile py-2 pl-2 pr-3">
          <Illo name="speak" size={72} />
          <View className="flex-1">
            <T w="bold" className="text-[17px]">
              {speaking ? 'Speaking…' : 'Play to the mason'}
            </T>
            <T className="text-[14px] text-ink-2">{LANG_LABEL[lang]}</T>
          </View>
          <Press
            feel="impact"
            scale={0.92}
            disabled={!v}
            accessibilityRole="button"
            accessibilityLabel={speaking ? 'Stop' : 'Play again'}
            onPress={toggle}
            className={`h-[72px] w-[72px] items-center justify-center rounded-full bg-ink ${v ? '' : 'opacity-35'}`}
          >
            {speaking ? <Square size={26} color="#fff" fill="#fff" /> : <Play size={30} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />}
          </Press>
        </View>
      )}

      {showDiagram && lock ? (
        <>
          <H2 className="mt-8">Now vs drawing</H2>
          <View className="mt-3 rounded-card bg-tile p-3">
            <Diagram positions={lock.positions} spec={spec} />
            <View className="flex-row justify-between px-2">
              <T w="medium" className="text-[14px] text-fail">
                Locked now
              </T>
              <T w="medium" className="text-[14px] text-pass">
                Drawing {spec} mm c/c
              </T>
            </View>
          </View>
        </>
      ) : null}
      <Num w="regular" className="mt-4 text-[13px] leading-[19px] text-ink-3">
        From the record: {f.value}
      </Num>
    </Screen>
  );
}
