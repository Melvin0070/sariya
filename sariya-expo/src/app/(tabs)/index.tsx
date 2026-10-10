import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Clock, FileInput, Inbox, MessageSquareWarning, Send, ShieldAlert, ShieldCheck, ShieldX, Wrench, X, type LucideIcon } from 'lucide-react-native';
import { useMemo, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, C, Enter, Group, H2, Hairline, HERO, Illo, Meter, Notice, Num, Press, Row, T, type IlloName } from '@/components/ui';
import { buildInbox, type InboxItem, type InboxState, type SiteGroup } from '@/lib/inbox';
import { pourIn, pourLabel } from '@/lib/pour';
import { evaluate, tally } from '@/lib/rules';
import { isSoon, KIND_HINT, KIND_LABEL, type MemberKind } from '@/lib/spec';
import { openRecord, statusOf } from '@/lib/status';
import { ROLE_LABEL, useStore, when, type Inspection, type Role } from '@/lib/store';

const RECENT = 4;

// Swiggy-style category tile: the illustration does the explaining, the title says the job.
function StartTile({ illo, title, sub, onPress, soon, wide }: { illo: IlloName; title: string; sub: string; onPress?: () => void; soon?: boolean; wide?: boolean }) {
  return (
    <Press
      disabled={soon || !onPress}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${sub}`}
      className={`${wide ? '' : 'flex-1'} overflow-hidden rounded-card bg-tile ${soon ? 'opacity-55' : ''}`}
    >
      <View className={wide ? 'flex-row items-center gap-2 py-3 pl-4 pr-2' : 'px-4 pb-4 pt-2'}>
        {wide ? null : (
          <View className="items-center">
            <Illo name={illo} size={116} />
          </View>
        )}
        {soon ? (
          <View className="absolute right-3 top-3">
            <Badge tone="ink">SOON</Badge>
          </View>
        ) : null}
        <View className={wide ? 'flex-1' : ''}>
          <T w="bold" className="text-[19px] leading-[24px] tracking-[-0.3px]">
            {title}
          </T>
          <T className="mt-0.5 text-[13px] leading-[18px] text-ink-2" numberOfLines={2}>
            {sub}
          </T>
        </View>
        {wide ? <Illo name={illo} size={96} /> : null}
      </View>
    </Press>
  );
}

// The draft you were last on, one tap from where you left it: the "track order" card.
function Continue({ r }: { r: Inspection }) {
  const t = tally(evaluate(r));
  const done = r.spec ? t.total - t.pending - t.tape : 0;
  const total = r.spec ? t.total : 0;
  return (
    <Press onPress={() => openRecord(r)} accessibilityRole="button" accessibilityLabel={`Continue ${r.name}`} className="rounded-card bg-ink px-4 pb-4 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-white/10">
          <Illo name={r.member} size={52} />
        </View>
        <View className="flex-1">
          <T w="semibold" className="text-[12px] uppercase tracking-[0.8px] text-white/60">
            Continue
          </T>
          <T w="bold" className="text-[19px] text-white" numberOfLines={1}>
            {r.name}
            {r.rev > 1 ? ` · rev ${r.rev}` : ''}
          </T>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          <ArrowRight size={20} color="#000" strokeWidth={2.4} />
        </View>
      </View>
      {r.spec ? (
        <>
          <Meter value={total ? done / total : 0} color={C.accent} className="mt-4 bg-white/15" />
          <View className="mt-2 flex-row items-baseline">
            <Num className="text-[15px] text-white">
              {done} of {total}
            </Num>
            <T className="text-[14px] text-white/60"> checked{t.outside ? ` · ${t.outside} outside` : ''}</T>
          </View>
        </>
      ) : (
        <T className="mt-3 text-[14px] text-white/70">Next: enter the drawing values</T>
      )}
    </Press>
  );
}

const GUIDES: { title: string; sub: string; illo: IlloName; bg: string }[] = [
  { title: 'Print card S and the strip', sub: 'At 100%; the card pattern tapes 90 mm', illo: 'card', bg: '#F6EFE7' },
  { title: 'Tape what the camera can’t see', sub: 'Cover, a 200 mm offcut, hooks', illo: 'tape', bg: '#FFF1E6' },
  { title: 'How a scan works', sub: 'Live ~mm, then Lock for the verdict', illo: 'phone', bg: '#EEF0F2' },
];

function List({ title, items, icon }: { title: string; items: Inspection[]; icon: (r: Inspection) => LucideIcon }) {
  if (!items.length) return null;
  return (
    <Enter i={2}>
      <H2 className="mt-8">{title}</H2>
      <Group className="mt-3">
        {items.map((r, i) => (
          <Row key={r.key} first={i === 0} icon={icon(r)} title={`${r.name}${r.rev > 1 ? ` · rev ${r.rev}` : ''}`} sub={statusOf(r)} onPress={() => openRecord(r)} />
        ))}
      </Group>
    </Enter>
  );
}

function Operator() {
  const records = useStore((s) => s.records).filter((r) => r.origin === 'local');
  const requests = records.filter((r) => r.status === 'signed' && r.request && !r.revised);
  const drafts = records.filter((r) => r.status === 'draft');
  const waiting = records.filter((r) => r.status === 'signed' && !r.approval && !r.request && !r.revised);
  // The draft last opened is the one to resume, not merely the newest.
  const draftKey = useStore((s) => s.draftKey);
  const current = drafts.find((r) => r.key === draftKey) ?? drafts[0];
  const otherDrafts = drafts.filter((r) => r !== current);
  const open = [...requests, ...otherDrafts, ...waiting].slice(0, RECENT);
  const iconOf = (r: Inspection) => (r.status === 'draft' ? Clock : r.request ? MessageSquareWarning : Send);
  const start = (k: MemberKind) => router.push({ pathname: '/inspect/new', params: { kind: k } });

  return (
    <>
      {current ? (
        <Enter>
          <Continue r={current} />
        </Enter>
      ) : null}

      <Enter i={1}>
        <H2 className={current ? 'mt-8' : 'mt-1'}>Start a check</H2>
        <View className="mt-3 flex-row gap-3">
          {(['slab', 'beam'] as const).map((k) => (
            <StartTile key={k} illo={k} title={KIND_LABEL[k]} sub={KIND_HINT[k]} soon={isSoon(k)} onPress={() => start(k)} />
          ))}
        </View>
        <View className="mt-3">
          <StartTile wide illo="column" title={KIND_LABEL.column} sub={KIND_HINT.column} soon={isSoon('column')} onPress={() => start('column')} />
        </View>
      </Enter>

      <Enter i={2}>
        <Group className="mt-4">
          <Row first illo="engineer" title="Engineer’s drawing values" sub="Open the signed spec from Office Kit" onPress={() => router.push('/received')} />
          {waiting.length ? <Row icon={FileInput} title="Engineer’s reply" sub="Approval or request, from Office Kit" onPress={() => router.push('/received')} /> : null}
        </Group>
      </Enter>

      <List title="In progress" items={open} icon={iconOf} />

      <Enter i={3}>
        <H2 className="mt-9">Before tonight’s pour</H2>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="gap-3 px-5 pt-3" decelerationRate="fast" snapToInterval={262}>
          {GUIDES.map(({ title, sub, illo, bg }) => (
            <Press key={title} onPress={() => router.push('/guide')} accessibilityRole="button" className="w-[250px]">
              <View className="h-[140px] items-center justify-center overflow-hidden rounded-card" style={{ backgroundColor: bg }}>
                <Illo name={illo} size={128} />
              </View>
              <T w="semibold" className="mt-2.5 text-[16px]">
                {title}
              </T>
              <T className="mt-0.5 text-[14px] text-ink-2">{sub}</T>
            </Press>
          ))}
        </ScrollView>
      </Enter>
    </>
  );
}

type Pill = { label: string; icon: LucideIcon; bg: string; color: string };
const PILL: Record<InboxState, Pill> = {
  review: { label: 'Ready for review', icon: Inbox, bg: 'bg-ink', color: '#fff' },
  unknown: { label: 'Unknown signer', icon: ShieldAlert, bg: 'bg-warn-soft', color: C.warn },
  fixing: { label: 'Fix sent', icon: Wrench, bg: 'bg-warn-soft', color: C.warn },
  awaiting: { label: 'Awaiting scan', icon: Clock, bg: 'bg-pill', color: C.ink2 },
  approved: { label: 'Approved', icon: ShieldCheck, bg: 'bg-pass-soft', color: C.pass },
};

// Outside limits outranks "ready": the red items are the ones to open before the pour.
function pillOf(it: InboxItem): Pill {
  if (it.state === 'review' && it.outside) return { label: `${it.outside} outside`, icon: X, bg: 'bg-fail-soft', color: C.fail };
  if (it.state === 'review' && it.rev > 1) return { ...PILL.review, label: 'Re-scan to review' };
  return PILL[it.state];
}

function InboxRow({ it, first }: { it: InboxItem; first: boolean }) {
  const p = pillOf(it);
  const Icon = p.icon;
  const when = it.pourAt ? `${pourLabel(it.pourAt)} · ${pourIn(it.pourAt)}` : 'No pour time';
  const r = it.record;
  return (
    <Press disabled={!r} onPress={() => r && openRecord(r)} scale={0.985} accessibilityRole={r ? 'button' : undefined} accessibilityLabel={`${it.name}. ${p.label}. ${when}`} className="flex-row items-center gap-3 bg-paper px-4 py-3.5">
      {first ? null : <Hairline />}
      <View className="flex-1">
        <T w="semibold" className="text-[16px] leading-[22px]" numberOfLines={1}>
          {it.name}
          {it.rev > 1 ? ` · rev ${it.rev}` : ''}
        </T>
        <T className="mt-0.5 text-[14px] leading-[19px] text-ink-2" numberOfLines={1}>
          {when}
        </T>
      </View>
      <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${p.bg}`}>
        <Icon size={13} color={p.color} strokeWidth={2.6} />
        <T w="semibold" className="text-[13px]" style={{ color: p.color }}>
          {p.label}
        </T>
      </View>
    </Press>
  );
}

// The next decision across every site, one tap away.
function InboxHero({ groups }: { groups: SiteGroup[] }) {
  const items = groups.flatMap((g) => g.items);
  const needs = items.filter((it) => it.state === 'review' || it.state === 'unknown');
  const next = needs.sort((a, b) => (a.pourAt ?? Number.POSITIVE_INFINITY) - (b.pourAt ?? Number.POSITIVE_INFINITY))[0];
  const sites = groups.length;
  const title = needs.length ? `${needs.length} to review before the pour` : 'Nothing waiting on you';
  return (
    <Press disabled={!next?.record} onPress={() => next?.record && openRecord(next.record)} accessibilityRole="button" className="rounded-card bg-ink px-4 pb-4 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <T w="semibold" className="text-[12px] uppercase tracking-[0.8px] text-white/60">
            {`Pour inbox · ${sites} site${sites === 1 ? '' : 's'}`}
          </T>
          <T w="bold" className="text-[19px] text-white" numberOfLines={1}>
            {title}
          </T>
        </View>
        {next ? (
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <ArrowRight size={20} color="#000" strokeWidth={2.4} />
          </View>
        ) : null}
      </View>
      {next ? (
        <T className="mt-3 text-[14px] text-white/75" numberOfLines={1}>
          {`Next: ${next.site} · ${next.name}${next.pourAt ? ` · ${pourIn(next.pourAt)}` : ''}`}
        </T>
      ) : null}
    </Press>
  );
}

function Engineer() {
  const records = useStore((s) => s.records);
  const issued = useStore((s) => s.issued);
  const noOperator = useStore((s) => !s.trusted.some((p) => p.role === 'operator'));
  const groups = useMemo(() => buildInbox(records, issued), [records, issued]);
  return (
    <>
      {noOperator ? (
        <Enter>
          <Press onPress={() => router.push('/keys')} accessibilityRole="button" className="mb-4">
            <Notice tone="warn" title="Enrol the operator’s phone">
              Until then, packs open read-only.
            </Notice>
          </Press>
        </Enter>
      ) : null}
      {groups.length ? (
        <Enter>
          <InboxHero groups={groups} />
        </Enter>
      ) : null}
      <Enter i={1}>
        <View className={`flex-row gap-3 ${groups.length ? 'mt-4' : ''}`}>
          <StartTile illo="approve" title="Review a pack" sub="Open a capture from Office Kit" onPress={() => router.push('/received')} />
          <StartTile illo="engineer" title="Send values" sub="Sign your drawing for the operator" onPress={() => router.push('/issue')} />
        </View>
      </Enter>
      {groups.map((g, gi) => (
        <Enter key={g.site} i={2 + gi}>
          <H2 className="mt-8" right={g.pourAt ? <T className="text-[14px] text-ink-2">{pourIn(g.pourAt)}</T> : undefined}>
            {g.site}
          </H2>
          <Group className="mt-3">
            {g.items.map((it, i) => (
              <InboxRow key={it.id} it={it} first={i === 0} />
            ))}
          </Group>
        </Enter>
      ))}
    </>
  );
}

function Verifier() {
  const checks = useStore((s) => s.verifications).slice(0, RECENT * 2);
  const noEngineer = useStore((s) => !s.trusted.some((p) => p.role === 'engineer'));
  return (
    <>
      {noEngineer ? (
        <Enter>
          <Press onPress={() => router.push('/keys')} accessibilityRole="button" className="mb-4">
            <Notice tone="warn" title="Enrol the engineer’s phone">
              A sign-off is checked against an enrolled engineer key.
            </Notice>
          </Press>
        </Enter>
      ) : null}
      <Enter i={1}>
        <StartTile wide illo="verify" title="Scan a sign-off QR" sub="Checked offline against the engineer’s key" onPress={() => router.push({ pathname: '/qr', params: { mode: 'verify' } } as Href)} />
      </Enter>
      {checks.length ? (
        <Enter i={2}>
          <H2 className="mt-8">Recent checks</H2>
          <Group className="mt-3">
            {checks.map((c, i) => (
              <Row key={c.at} first={i === 0} icon={c.ok ? ShieldCheck : ShieldX} title={c.title} sub={`${c.sub} · ${when(c.at)}`} />
            ))}
          </Group>
        </Enter>
      ) : null}
    </>
  );
}

const BODY: Record<Role, () => ReactNode> = { operator: Operator, engineer: Engineer, verifier: Verifier };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const i = useSafeAreaInsets();
  const role = useStore((s) => s.role) ?? 'operator';
  const name = useStore((s) => s.name);
  const focused = useIsFocused();
  const heroH = i.top + 132;
  const Body = BODY[role];
  const first = name.trim().split(/\s+/)[0];

  return (
    <ScrollView className="flex-1 bg-paper" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <StatusBar style={focused ? 'light' : 'dark'} />
      <View style={{ height: heroH, position: 'absolute', left: 0, right: 0 }}>
        <Image source={HERO} style={{ flex: 1 }} contentFit="cover" cachePolicy="memory" transition={0} accessible={false} />
        <LinearGradient colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.15)']} style={{ position: 'absolute', inset: 0 }} />
      </View>
      <View style={{ paddingTop: i.top + 14, height: heroH - 24 }} className="flex-row items-start justify-between px-5">
        <View>
          <T w="medium" className="text-[14px] text-white/80">
            {greeting()}
            {first ? `, ${first}` : ''}
          </T>
          <T w="bold" className="mt-0.5 text-[32px] leading-[38px] tracking-[-1px] text-white">
            Sariya
          </T>
        </View>
        <Press onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel="Settings" className="mt-1 h-10 flex-row items-center gap-2 rounded-full bg-black/35 pl-1 pr-3.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <T w="bold" className="text-[14px]">
              {name.trim().charAt(0).toUpperCase() || '?'}
            </T>
          </View>
          <T w="semibold" className="text-[14px] text-white">
            {ROLE_LABEL[role]}
          </T>
        </Press>
      </View>
      <View className="rounded-t-sheet bg-paper px-5 pt-6">
        <Body />
      </View>
    </ScrollView>
  );
}
