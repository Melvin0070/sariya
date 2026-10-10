import { router, useIsFocused, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Clock, FileInput, MessageSquareWarning, Plus, QrCode, Send, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Line, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CardArt, MemberArt, PhoneArt, TapeArt } from '@/components/art';
import { H2, Notice, Outline, Row, T, tap } from '@/components/ui';
import { KIND_HINT, KIND_LABEL, type MemberKind } from '@/lib/spec';
import { openRecord, statusOf } from '@/lib/status';
import { ROLE_LABEL, useStore, when, type Inspection, type Role } from '@/lib/store';

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

function List({ title, items, icon }: { title: string; items: Inspection[]; icon: LucideIcon }) {
  if (!items.length) return null;
  return (
    <>
      <H2 className="mt-8">{title}</H2>
      <Outline className="mt-3">
        {items.map((r, i) => (
          <Row key={r.key} first={i === 0} icon={icon} title={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={`${statusOf(r)} · ${when(r.createdAt)}`} onPress={() => openRecord(r)} />
        ))}
      </Outline>
    </>
  );
}

const GUIDES = [
  { title: 'Print card S and the strip', sub: '100% scale; the card pattern must tape 90 mm', Art: CardArt, bg: '#F6EFE7' },
  { title: 'Tape what the camera can’t see', sub: 'Cover, a 200 mm offcut on a scale, hooks', Art: TapeArt, bg: '#FFF3E8' },
  { title: 'How a scan works', sub: 'Live ~mm, then Lock for the verdict', Art: PhoneArt, bg: '#EEF0F2' },
];

function Operator() {
  const records = useStore((s) => s.records).filter((r) => r.origin === 'local');
  const drafts = records.filter((r) => r.status === 'draft');
  const requests = records.filter((r) => r.status === 'signed' && r.request && !r.revised);
  const waiting = records.filter((r) => r.status === 'signed' && !r.approval && !r.request && !r.revised);
  const start = (k: MemberKind) => {
    tap();
    router.push({ pathname: '/inspect/new', params: { kind: k } });
  };

  return (
    <>
      <Primary icon={Plus} label="New inspection" href="/inspect/new" />
      <Outline className="mt-4">
        <Row first icon={FileInput} title="Open the engineer’s file" sub="Approval or review request, received through Office Kit" onPress={() => router.push('/received')} />
      </Outline>
      <List title="Engineer asked for another view" items={requests} icon={MessageSquareWarning} />
      <List title="Continue" items={drafts} icon={Clock} />
      <List title="Waiting for approval" items={waiting} icon={Send} />

      <H2 className="mt-8">Check a member</H2>
      <View className="mt-3 flex-row gap-6">
        {(['slab', 'beam'] as MemberKind[]).map((k) => (
          <Pressable key={k} onPress={() => start(k)} className="items-center active:opacity-70">
            <View className="h-[84px] w-[84px] items-center justify-center rounded-card bg-tile">
              <MemberArt kind={k} size={68} />
            </View>
            <T w="medium" className="mt-2.5 text-[16px]">
              {KIND_LABEL[k]}
            </T>
            <T className="w-[110px] text-center text-[12px] text-ink-2">{KIND_HINT[k]}</T>
          </Pressable>
        ))}
      </View>

      <H2 className="mt-9">Before tonight’s pour</H2>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="gap-3 px-5 pt-3">
        {GUIDES.map(({ title, sub, Art, bg }) => (
          <Pressable key={title} onPress={() => router.push('/device')} className="w-[270px] active:opacity-80">
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
    </>
  );
}

function Engineer() {
  const received = useStore((s) => s.records).filter((r) => r.origin === 'received');
  const noOperator = useStore((s) => !s.trusted.some((p) => p.role === 'operator'));
  const todo = received.filter((r) => !r.approval && !r.request);
  const done = received.filter((r) => r.approval || r.request);
  return (
    <>
      <Primary icon={FileInput} label="Open a received pack" href="/received" />
      {noOperator ? (
        <Pressable onPress={() => router.push('/keys')}>
          <Notice tone="warn" className="mt-4" title="Enrol the operator’s phone">
            Packs from an unknown key open read-only, with approval switched off.
          </Notice>
        </Pressable>
      ) : null}
      <List title="Waiting for your review" items={todo} icon={Clock} />
      <List title="Decided" items={done} icon={ShieldCheck} />
      <H2 className="mt-8">How a review reaches you</H2>
      <View className="mt-3 gap-2 rounded-card bg-tile p-5">
        {[
          'The operator signs the capture and sends the pack with Office Kit file transfer.',
          'Move it from the laptop to this phone with Office Kit, then open it here from the file picker.',
          'Review on this phone, mirrored to the laptop. Approve with your fingerprint, or ask for another view.',
          'Send the approval file back the same way. The laptop never holds a key.',
        ].map((t, i) => (
          <View key={t} className="flex-row gap-3">
            <T w="bold" className="w-5 text-[15px]">
              {i + 1}
            </T>
            <T className="flex-1 text-[15px] leading-[22px] text-ink-2">{t}</T>
          </View>
        ))}
      </View>
    </>
  );
}

function Verifier() {
  const checks = useStore((s) => s.verifications);
  const noEngineer = useStore((s) => !s.trusted.some((p) => p.role === 'engineer'));
  return (
    <>
      <Primary icon={QrCode} label="Scan a sign-off QR" href={{ pathname: '/qr', params: { mode: 'verify' } }} />
      {noEngineer ? (
        <Pressable onPress={() => router.push('/keys')}>
          <Notice tone="warn" className="mt-4" title="Enrol the engineer’s phone">
            A sign-off can only be checked against an engineer key enrolled here.
          </Notice>
        </Pressable>
      ) : null}
      {checks.length ? (
        <>
          <H2 className="mt-8">Recent checks</H2>
          <Outline className="mt-3">
            {checks.map((c, i) => (
              <Row key={c.at} first={i === 0} icon={c.ok ? ShieldCheck : ShieldX} title={c.title} sub={`${c.sub} · checked ${when(c.at)}`} />
            ))}
          </Outline>
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
  // Equal gap above and below the app name; the hero runs on under the sheet's rounded corners.
  const GAP = 18;
  const heroH = i.top + GAP + 36 + GAP + 28;
  const focused = useIsFocused();
  const Body = BODY[role];

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <StatusBar style={focused ? 'light' : 'dark'} />
      <Hero height={heroH} />
      <View style={{ paddingTop: i.top + GAP, paddingBottom: GAP }} className="flex-row items-end justify-between px-5">
        <T w="bold" className="text-[30px] leading-[36px] tracking-[-0.8px] text-white">
          Sariya
        </T>
        <T w="medium" className="mb-1 text-[14px] text-white/80">
          {ROLE_LABEL[role]} · {name}
        </T>
      </View>
      <View className="rounded-t-sheet bg-paper px-5 pt-5">
        <Body />
      </View>
    </ScrollView>
  );
}
