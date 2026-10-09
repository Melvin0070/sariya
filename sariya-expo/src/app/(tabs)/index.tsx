import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Clock, Plus } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Line, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CardArt, MemberArt, PhoneArt, TapeArt } from '@/components/art';
import { Badge, H2, Outline, T, tap } from '@/components/ui';
import { actions, KIND_LABEL, SUPPORTED, tally, useStore, when, type MemberKind } from '@/lib/store';

function Hero({ height }: { height: number }) {
  // Steel mesh photo stand-in: rust bars over a dusk gradient.
  const lines = [];
  for (let i = -4; i < 30; i++) {
    lines.push(<Line key={`a${i}`} x1={i * 26} y1={0} x2={i * 26 - 60} y2={height} stroke="#B8642A" strokeWidth={3} opacity={0.55} />);
  }
  for (let j = 0; j < 12; j++) {
    lines.push(<Line key={`b${j}`} x1={0} y1={j * 26} x2={800} y2={j * 26 + 40} stroke="#8E4B1E" strokeWidth={3} opacity={0.45} />);
  }
  return (
    <Svg width="100%" height={height} style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3B2A20" />
          <Stop offset="1" stopColor="#7A4A2A" />
        </LinearGradient>
        <LinearGradient id="s" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <Stop offset="1" stopColor="#000" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height={height} fill="url(#g)" />
      {lines}
      <Rect width="100%" height={height} fill="url(#s)" />
    </Svg>
  );
}

const KINDS: MemberKind[] = ['slab', 'beam', 'column'];

const GUIDES = [
  { title: 'Print the scan card', sub: 'A4, 100% scale, no fit-to-page', Art: CardArt, bg: '#F6EFE7' },
  { title: 'Tape what the camera can’t see', sub: 'Cover, diameter, lap length', Art: TapeArt, bg: '#FFF3E8' },
  { title: 'How a scan works', sub: '30 seconds per zone', Art: PhoneArt, bg: '#EEF0F2' },
];

export default function Home() {
  const i = useSafeAreaInsets();
  const records = useStore((s) => s.records);
  const current = useStore((s) => s.current);
  const openByKind = (k: MemberKind) => records.filter((r) => r.kind === k && r.checks.some((c) => c.outcome === 'outside' && !c.fixed)).length;
  const recent = [...(current && current.checks.length ? [current] : []), ...records.filter((r) => r.status !== 'signed' && r.id !== current?.id)].slice(0, 2);
  // Equal gap above and below the app name; the hero runs on under the sheet's rounded corners.
  const GAP = 18;
  const TITLE = 36;
  const heroH = i.top + GAP + TITLE + GAP + 28;
  const focused = useIsFocused();

  const startKind = (k: MemberKind) => {
    tap();
    router.push({ pathname: '/inspect/new', params: { kind: k } });
  };

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <StatusBar style={focused ? 'light' : 'dark'} />
      <Hero height={heroH} />
      <View style={{ paddingTop: i.top + GAP, paddingBottom: GAP }} className="px-5">
        <T w="bold" className="text-[30px] leading-[36px] tracking-[-0.8px] text-white">
          Sariya
        </T>
      </View>

      <View className="rounded-t-sheet bg-paper pt-4">
        {/* Primary action: the "Where to?" bar */}
        <View className="px-5 pt-1">
          <Pressable
            onPress={() => {
              tap();
              router.push('/inspect/new');
            }}
            className="h-16 flex-row items-center gap-4 rounded-full border border-line bg-paper pl-3 pr-6 active:bg-tile"
            style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-ink">
              <Plus size={22} color="#fff" strokeWidth={2.6} />
            </View>
            <T w="semibold" className="flex-1 text-[19px]" numberOfLines={1}>
              New inspection
            </T>
            <ChevronRight size={22} color="#8A8A8A" />
          </Pressable>

          {/* Continue draft, like Uber's recent places */}
          {recent.length ? (
            <Outline className="mt-5">
              {recent.map((r, idx) => {
                const t = tally(r.checks);
                const left = t.pending + t.outside + t.rescan + t.manual;
                return (
                  <View key={r.id}>
                    {idx ? <View className="ml-[84px] h-px bg-line" /> : null}
                    <Pressable
                      onPress={() => {
                        tap();
                        actions.resume(r.id);
                        router.push(r.status === 'draft' ? '/inspect/summary' : { pathname: '/record/[id]', params: { id: r.id } });
                      }}
                      className="flex-row items-center gap-4 px-4 py-4 active:bg-tile"
                    >
                      <View className="h-14 w-14 items-center justify-center rounded-xl bg-tile">
                        <Clock size={24} color="#000" />
                      </View>
                      <View className="flex-1">
                        <T w="semibold" className="text-[17px]" numberOfLines={1}>
                          {r.status === 'draft' ? 'Continue · ' : ''}
                          {r.name}
                        </T>
                        <T className="mt-0.5 text-[15px] text-ink-2" numberOfLines={1}>
                          {r.status === 'sent' ? 'Waiting for engineer sign-off' : `${left} of ${t.total} checks left`} · {when(r.createdAt)}
                        </T>
                      </View>
                      <ChevronRight size={20} color="#8A8A8A" />
                    </Pressable>
                  </View>
                );
              })}
            </Outline>
          ) : null}
        </View>

        {/* "For you" → member tiles */}
        <H2 className="mt-8 px-5">Check a member</H2>
        <View className="mt-3 flex-row gap-6 px-5">
          {KINDS.map((k) => {
            const open = openByKind(k);
            const on = SUPPORTED.includes(k);
            return (
              <Pressable key={k} disabled={!on} onPress={() => startKind(k)} className={`items-center active:opacity-70 ${on ? '' : 'opacity-40'}`}>
                <View className="pt-3">
                  <View className="h-[84px] w-[84px] items-center justify-center rounded-card bg-tile">
                    <MemberArt kind={k} size={68} />
                  </View>
                  {open ? (
                    <View className="absolute left-0 right-0 top-0 items-center">
                      <Badge tone="fail">{`${open} open`}</Badge>
                    </View>
                  ) : null}
                </View>
                <T w="medium" className="mt-2.5 text-[16px]">
                  {KIND_LABEL[k]}
                </T>
                {!on ? <T className="text-[12px] text-ink-2">Coming soon</T> : null}
              </Pressable>
            );
          })}
        </View>

        {/* Guide cards, like Uber's "Do more by the hour" row */}
        <H2 className="mt-9 px-5">Before tonight’s pour</H2>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 px-5 pt-3">
          {GUIDES.map(({ title, sub, Art, bg }) => (
            <Pressable key={title} onPress={() => router.push('/help')} className="w-[270px] active:opacity-80">
              <View className="h-[160px] items-center justify-center overflow-hidden rounded-card" style={{ backgroundColor: bg }}>
                <Art size={190} />
              </View>
              <T w="semibold" className="mt-3 text-[17px]">
                {title}
              </T>
              <T className="mt-0.5 text-[15px] text-ink-2">{sub}</T>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
