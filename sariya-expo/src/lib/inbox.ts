import { evaluate, tally } from './rules';
import type { SpecPayload } from './spec';
import type { Inspection, Signed } from './store';

// The engineer's pour inbox: one row per member (its latest revision), grouped by site, soonest pour first.

export type InboxState = 'review' | 'unknown' | 'fixing' | 'awaiting' | 'approved';

export type InboxItem = {
  id: string;
  name: string;
  site: string;
  pourAt?: number;
  state: InboxState;
  rev: number;
  outside: number;
  record?: Inspection; // absent while the drawing values are out and no scan has come back
};

export type SiteGroup = { site: string; pourAt?: number; items: InboxItem[]; needs: number };

export const NO_SITE = 'No site given';

const ORDER: InboxState[] = ['review', 'unknown', 'fixing', 'awaiting', 'approved'];
const NEEDS_YOU = new Set<InboxState>(['review', 'unknown']);
const byPour = (a?: number, b?: number) => (a ?? Number.POSITIVE_INFINITY) - (b ?? Number.POSITIVE_INFINITY);

function stateOf(r: Inspection): InboxState {
  if (r.approval) return 'approved';
  if (r.request) return 'fixing';
  if (!r.trustedSigner) return 'unknown';
  return 'review';
}

export function buildInbox(records: Inspection[], issued: Signed<SpecPayload>[]): SiteGroup[] {
  const latest = new Map<string, Inspection>();
  for (const r of records) {
    if (r.origin !== 'received') continue;
    const had = latest.get(r.id);
    if (!had || r.rev > had.rev) latest.set(r.id, r);
  }

  const items: InboxItem[] = [];
  const answered = new Set<string>();
  for (const r of latest.values()) {
    const sig = r.spec?.issued?.sig;
    if (sig) answered.add(sig);
    items.push({ id: r.id, name: r.name, site: r.site || NO_SITE, pourAt: r.pourAt, state: stateOf(r), rev: r.rev, outside: tally(evaluate(r)).outside, record: r });
  }
  for (const x of issued) {
    if (answered.has(x.sig)) continue;
    items.push({ id: x.sig, name: x.payload.n, site: x.payload.s || NO_SITE, pourAt: x.payload.p, state: 'awaiting', rev: 0, outside: 0 });
  }

  const groups = new Map<string, InboxItem[]>();
  for (const it of items) groups.set(it.site, [...(groups.get(it.site) ?? []), it]);

  const out: SiteGroup[] = [];
  for (const [site, list] of groups) {
    list.sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state) || byPour(a.pourAt, b.pourAt));
    const open = list.filter((it) => it.state !== 'approved');
    const pourAt = open.map((it) => it.pourAt).filter((t): t is number => t !== undefined).sort((a, b) => a - b)[0];
    out.push({ site, pourAt, items: list, needs: list.filter((it) => NEEDS_YOU.has(it.state)).length });
  }
  // Sites that need a decision first, then the next pour; fully approved sites sink to the bottom.
  const done = (g: SiteGroup) => g.items.every((it) => it.state === 'approved');
  return out.sort((a, b) => Number(done(a)) - Number(done(b)) || Number(b.needs > 0) - Number(a.needs > 0) || byPour(a.pourAt, b.pourAt));
}
