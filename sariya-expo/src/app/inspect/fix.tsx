import { router, useLocalSearchParams } from 'expo-router';
import { Check as CheckIcon, Eye } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { Button, Chip, H2, Screen, T, Title, TopBar, tap } from '@/components/ui';
import { fixCount, fixLines, LANG_LABEL } from '@/lib/fix';
import { actions, useStore, type Lang, KIND_LABEL } from '@/lib/store';

// Before / after strip so the mason sees where the extra stirrups go.
function Diagram({ now, want }: { now: number; want: number }) {
  const zone = 600;
  const draw = (gap: number, y: number, color: string) => {
    const n = Math.floor(zone / gap) + 1;
    return Array.from({ length: n }, (_, i) => <Line key={`${y}${i}`} x1={20 + (i * gap * 280) / zone} y1={y} x2={20 + (i * gap * 280) / zone} y2={y + 46} stroke={color} strokeWidth={4} strokeLinecap="round" />);
  };
  return (
    <Svg width="100%" height={150} viewBox="0 0 320 150">
      <Rect x={10} y={8} width={300} height={62} rx={8} fill="#FDECEA" />
      <Rect x={10} y={80} width={300} height={62} rx={8} fill="#E6F4EC" />
      {draw(now, 16, '#E11900')}
      {draw(want, 88, '#05944F')}
    </Svg>
  );
}

export default function Fix() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cur = useStore((s) => s.current);
  const defLang = useStore((s) => s.lang);
  const [lang, setLang] = useState<Lang>(defLang === 'en' ? 'hi' : defLang);
  const [showCheck, setShowCheck] = useState(false);
  const c = cur?.checks.find((x) => x.id === id);
  if (!cur || !c) return null;

  const lines = fixLines(c, cur.name, lang);
  const en = fixLines(c, cur.name, 'en');
  const n = fixCount(c);

  return (
    <Screen
      footer={
        <Button
          label="Done after correction · re-scan"
          icon={CheckIcon}
          onPress={() => {
            actions.markFixed(c.id);
            router.back();
          }}
        />
      }
    >
      <TopBar name={cur.name} sub={KIND_LABEL[cur.kind]} />
      <Chip outcome="outside" />
      <Title className="mt-3">Fix this zone</Title>

      {/* language switch */}
      <View className="mt-5 flex-row rounded-full bg-pill p-1">
        {(['hi', 'kn', 'en'] as Lang[]).map((l) => (
          <Pressable key={l} onPress={() => (tap(), setLang(l))} className={`h-11 flex-1 items-center justify-center rounded-full ${lang === l ? 'bg-paper' : ''}`}>
            <T w={lang === l ? 'bold' : 'medium'} className={`text-[16px] ${lang === l ? '' : 'text-ink-2'}`}>
              {LANG_LABEL[l]}
            </T>
          </Pressable>
        ))}
      </View>

      {/* the instruction, large enough to show the mason */}
      <View className="mt-4 rounded-card bg-ink p-6">
        <T w="medium" className="text-[15px] text-white/60">
          {lines[0]}
        </T>
        <T w="semibold" className="mt-3 text-[22px] leading-[32px] text-white">
          {lines[1]}
        </T>
        <T w="semibold" className="mt-1 text-[22px] leading-[32px] text-white">
          {lines[2]}
        </T>
        <View className="mt-5 rounded-xl bg-accent px-4 py-4">
          <T w="bold" className="text-[24px] leading-[32px] text-white">
            {lines[3]}
          </T>
        </View>
      </View>
      {lang !== 'en' ? <T className="mt-3 text-[15px] leading-[22px] text-ink-2">{en.slice(1).join(' ')}</T> : null}

      <H2 className="mt-7">Now vs drawing</H2>
      <View className="mt-3 rounded-card bg-tile p-3">
        <Diagram now={Math.round(c.measured ?? 180)} want={c.drawing ?? 100} />
        <View className="flex-row justify-between px-2">
          <T w="medium" className="text-[14px] text-fail">
            Now ~{Math.round(c.measured ?? 0)} mm
          </T>
          <T w="medium" className="text-[14px] text-pass">
            Drawing {c.drawing} mm · +{n}
          </T>
        </View>
      </View>

      <Pressable onPress={() => (tap(), setShowCheck(!showCheck))} className="mt-4 h-14 flex-row items-center gap-3 rounded-xl border border-line px-4 active:bg-tile">
        <Eye size={20} color="#000" />
        <T w="semibold" className="flex-1 text-[17px]">
          Show what to check
        </T>
        <T className="text-[15px] text-ink-2">{showCheck ? 'Hide' : 'Show'}</T>
      </Pressable>
      {showCheck ? (
        <View className="mt-2 gap-2 rounded-card bg-tile p-4">
          {['Spacing measured centre to centre', 'First stirrup within 50 mm of the column face', 'Hooks bent to 135°, not 90°', 'Ties tied at every crossing'].map((t) => (
            <View key={t} className="flex-row items-center gap-3">
              <View className="h-2 w-2 rounded-full bg-ink" />
              <T className="text-[16px]">{t}</T>
            </View>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
