import { router } from 'expo-router';

import { evaluate, tally } from './rules';
import { actions, when, type Inspection } from './store';

export function statusOf(r: Inspection) {
  if (r.status === 'draft') {
    const t = tally(evaluate(r));
    return r.spec ? `Draft · ${t.total - t.pending - t.tape} of ${t.total} checked` : 'Draft · drawing values not entered';
  }
  if (r.origin === 'received') {
    if (r.approval) return `You approved · ${when(r.approval.payload.t)}`;
    if (r.request) return 'You asked for another view';
    return r.trustedSigner ? 'Waiting for your review' : 'Unknown signer · view only';
  }
  if (r.revised) return 'Replaced by a newer revision';
  if (r.approval) return `Approved by ${r.approval.payload.e} · ${when(r.approval.payload.t)}`;
  if (r.request) return 'Engineer asked for another view';
  if (r.sentAt) return 'Sent · waiting for approval';
  return 'Signed · not sent yet';
}

export function openRecord(r: Inspection) {
  if (r.status === 'draft') {
    actions.openDraft(r.key);
    router.push(r.spec ? '/inspect/summary' : '/inspect/spec');
  } else if (r.origin === 'received') {
    router.push({ pathname: '/review/[key]', params: { key: r.key } });
  } else {
    router.push({ pathname: '/record/[key]', params: { key: r.key } });
  }
}
