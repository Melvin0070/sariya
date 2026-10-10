import { router, useIsFocused, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Clock, FileInput, FileText, MessageSquareWarning, Plus, QrCode, Send, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Line, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CardArt, MemberArt, PhoneArt, TapeArt } from '@/components/art';
import { Group, H2, Notice, Row, T, tap } from '@/components/ui';
import { isSoon, KIND_HINT, KIND_LABEL, type MemberKind } from '@/lib/spec';
import { openRecord, statusOf } from '@/lib/status';
import { ROLE_LABEL, useStore, when, type Inspection, type Role } from '@/lib/store';

const RECENT = 4;

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

// The "Where to?" bar: one primary action per role.
function Primary({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: Href }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        router.push(href);
      }}
      className="h-16 flex-row items-center gap-4 rounded-full border border-line bg-paper pl-3 pr-6 active:bg-tile"
      style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-ink">
        <Icon size={22} color="#fff" strokeWidth={2.4} />
      </View>
      <T w="semibold" className="flex-1 text-[19px]" numberOfLines={1}>
        {label}
      </T>
      <ChevronRight size={22} color="#8A8A8A" />
    </Pressable>
  );
}

const GUIDES = [
  { title: 'Print card S and the strip', sub: 'At 100%; the card pattern tapes 90 mm', Art: CardArt, bg: '#F6EFE7' },
  { title: 'Tape what the camera can’t see', sub: 'Cover, a 200 mm offcut, hooks', Art: TapeArt, bg: '#FFF3E8' },
  { title: 'How a scan works', sub: 'Live ~mm, then Lock for the verdict', Art: PhoneArt, bg: '#EEF0F2' },
];

function List({ title, items, icon, action }: { title: string; items: Inspection[]; icon: (r: Inspection) => LucideIcon; action?: ReactNode }) {
  if (!items.length && !action) return null;
  return (
    <>
      <H2 className="mt-8">{title}</H2>
      <Group className="mt-3">
        {items.map((r, i) => (
          <Row key={r.key} first={i === 0} icon={icon(r)} title={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={statusOf(r)} onPress={() => openRecord(r)} />
        ))}
        {action}
      </Group>
    </>
  );
}

function Operator() {
  const records = useStore((s) => s.records).filter((r) => r.origin === 'local');
  const requests = records.filter((r) => r.status === 'signed' && r.request && !r.revised);
  const drafts = records.filter((r) => r.status === 'draft');
  const waiting = records.filter((r) => r.status === 'signed' && !r.approval && !r.request && !r.revised);
  const open = [...requests, ...drafts, ...waiting].slice(0, RECENT);
  const start = (k: MemberKind) => {
    tap();
    router.push({ pathname: '/inspect/new', params: { kind: k } });
  };
  const iconOf = (r: Inspection) => (r.status === 'draft' ? Clock : r.request ? MessageSquareWarning : Send);

  return (
    <>
      <Primary icon={Plus} label="New inspection" href="/inspect/new" />
      <H2 className="mt-8">Check a member</H2>
      <View className="mt-3 flex-row gap-3">
        {(['slab', 'beam'] as MemberKind[]).map((k) => (
          <Pressable key={k} disabled={isSoon(k)} onPress={() => start(k)} className={`flex-1 rounded-card bg-tile px-4 pb-4 pt-3 active:opacity-80 ${isSoon(k) ? 'opacity-50' : ''}`}>
            <View className="items-center">
              <MemberArt kind={k} size={110} />
            </View>
            <T w="bold" className="mt-1 text-[19px]">
              {KIND_LABEL[k]}
            </T>
            <T className="mt-0.5 text-[13px] leading-[18px] text-ink-2">{isSoon(k) ? 'Coming soon' : KIND_HINT[k]}</T>
          </Pressable>
        ))}
      </View>

      <Group className="mt-4">
        <Row first icon={FileText} title="Drawing values from the engineer" sub="Open the signed spec sent through Office Kit" onPress={() => router.push('/received')} />
      </Group>

      <List
        title="In progress"
        items={open}
        icon={iconOf}
        action={
          waiting.length ? <Row first={!open.length} icon={FileInput} title="Open the engineer’s reply" sub="Approval or request, from Office Kit" onPress={() => router.push('/received')} /> : null
        }
      />

      <H2 className="mt-9">Before tonight’s pour</H2>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="gap-3 px-5 pt-3">
        {GUIDES.map(({ title, sub, Art, bg }) => (
          <Pressable key={title} onPress={() => router.push('/guide')} className="w-[260px] active:opacity-80">
            <View className="h-[150px] items-center justify-center overflow-hidden rounded-card" style={{ backgroundColor: bg }}>
              <Art size={180} />
            </View>
            <T w="semibold" className="mt-3 text-[17px]">
              {title}
            </T>
            <T className="mt-0.5 text-[14px] text-ink-2">{sub}</T>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

function Engineer() {
  const received = useStore((s) => s.records).filter((r) => r.origin === 'received');
  const noOperator = useStore((s) => !s.trusted.some((p) => p.role === 'operator'));
  const todo = received.filter((r) => !r.approval && !r.request);
  const done = received.filter((r) => r.approval || r.request).slice(0, RECENT);
  return (
    <>
      <Primary icon={FileInput} label="Open a received pack" href="/received" />
      <Group className="mt-4">
        <Row first icon={FileText} title="Send drawing values" sub="Sign the spec from your drawing for the operator" onPress={() => router.push('/issue')} />
      </Group>
      {noOperator ? (
        <Pressable onPress={() => router.push('/keys')} className="mt-4">
          <Notice tone="warn" title="Enrol the operator’s phone">
            Until then, packs open read-only.
          </Notice>
        </Pressable>
      ) : null}
      <List title="To review" items={todo} icon={() => Clock} />
      <List title="Decided" items={done} icon={() => ShieldCheck} />
    </>
  );
}

function Verifier() {
  const checks = useStore((s) => s.verifications).slice(0, RECENT * 2);
  const noEngineer = useStore((s) => !s.trusted.some((p) => p.role === 'engineer'));
  return (
    <>
      <Primary icon={QrCode} label="Scan a sign-off QR" href={{ pathname: '/qr', params: { mode: 'verify' } }} />
      {noEngineer ? (
        <Pressable onPress={() => router.push('/keys')} className="mt-4">
          <Notice tone="warn" title="Enrol the engineer’s phone">
            A sign-off is checked against an enrolled engineer key.
          </Notice>
        </Pressable>
      ) : null}
      {checks.length ? (
        <>
          <H2 className="mt-8">Recent checks</H2>
          <Group className="mt-3">
            {checks.map((c, i) => (
              <Row key={c.at} first={i === 0} icon={c.ok ? ShieldCheck : ShieldX} title={c.title} sub={`${c.sub} · ${when(c.at)}`} />
            ))}
          </Group>
        </>
      ) : null}
    </>
  );
}

const BODY: Record<Role, () => ReactNode> = { operator: Operator, engineer: Engineer, verifier: Verifier };

export default function Home() {
  const i = useSafeAreaInsets();
  const role = useStore((s) => s.role) ?? 'operator';
  const name = useStore((s) => s.name);
  const focused = useIsFocused();
  // Equal gap above and below the app name; the hero runs on under the sheet's rounded corners.
  const GAP = 18;
  const heroH = i.top + GAP + 36 + GAP + 28;
  const Body = BODY[role];

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <StatusBar style={focused ? 'light' : 'dark'} />
      <Hero height={heroH} />
      <View style={{ paddingTop: i.top + GAP, paddingBottom: GAP }} className="flex-row items-center justify-between px-5">
        <T w="bold" className="text-[30px] leading-[36px] tracking-[-0.8px] text-white">
          Sariya
        </T>
        <Pressable onPress={() => (tap(), router.push('/settings'))} className="h-9 flex-row items-center gap-2 rounded-full bg-white/15 pl-1 pr-3 active:opacity-70">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-white">
            <T w="bold" className="text-[13px]">
              {name.trim().charAt(0).toUpperCase() || '?'}
            </T>
          </View>
          <T w="medium" className="text-[14px] text-white">
            {ROLE_LABEL[role]}
          </T>
        </Pressable>
      </View>
      <View className="rounded-t-sheet bg-paper px-5 pt-5">
        <Body />
      </View>
    </ScrollView>
  );
}
