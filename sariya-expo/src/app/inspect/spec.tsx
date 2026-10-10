import { Redirect, router } from 'expo-router';
import { ScanLine } from 'lucide-react-native';

import { SpecForm, toValues, type SpecDraft } from '@/components/spec-form';
import { Button, Notice, TopBar } from '@/components/ui';
import { FIELDS, KIND_LABEL } from '@/lib/spec';
import { actions, useDraft, when } from '@/lib/store';

// The drawing comes first. Nothing is committed until Confirm, and a missing value never borrows a default.
export default function Spec() {
  const cur = useDraft();
  if (!cur) return <Redirect href="/" />;
  const existing = cur.spec;
  const fields = FIELDS[cur.member];
  let init: SpecDraft | undefined;
  if (existing) {
    const vals: SpecDraft['vals'] = {};
    for (const f of fields) vals[f.id] = existing.noDrawing || existing.values[f.id] == null ? null : String(existing.values[f.id]);
    init = { vals, preset: existing.preset, noDrawing: existing.noDrawing, hooks: existing.hooks135 };
  }

  const isSame = (d: SpecDraft) =>
    !!existing && !!init && fields.every((f) => (init.vals[f.id] ?? null) === (d.vals[f.id] ?? null)) && existing.hooks135 === d.hooks && existing.noDrawing === d.noDrawing;
  const revOf = (d: SpecDraft) => (existing ? existing.rev + (isSame(d) ? 0 : 1) : 1);

  const confirm = (d: SpecDraft) => {
    const same = isSame(d);
    actions.setSpec({ rev: revOf(d), values: toValues(cur.member, d), hooks135: d.hooks, preset: d.preset, noDrawing: d.noDrawing, issued: same ? existing?.issued : undefined });
    if (existing) {
      router.back();
      return;
    }
    // The checks sheet sits under the scanner, so closing the camera lands on it.
    router.replace('/inspect/summary');
    router.push('/inspect/scan');
  };

  return (
    <SpecForm
      member={cur.member}
      head={<TopBar name={cur.name} sub={`${KIND_LABEL[cur.member]}${cur.rev > 1 ? ` · rev ${cur.rev}` : ''}`} />}
      sub="Every scan is checked against these."
      init={init}
      allowNoDrawing
      confirmTop={(d) => {
        const same = isSame(d);
        return (
          <>
            {existing?.issued ? (
              same ? (
                <Notice tone="pass" className="mt-4" title={`From ${existing.issued.payload.e}’s drawing · signed ${when(existing.issued.payload.t)}`}>
                  Changing a value marks the drawing values as typed on site, and the engineer sees that in review.
                </Notice>
              ) : (
                <Notice tone="warn" className="mt-4" title="No longer the engineer’s values">
                  Saving keeps your values, marked as typed on site. The engineer is asked to check them against the drawing.
                </Notice>
              )
            ) : null}
            {existing && revOf(d) > existing.rev && cur.locks.some((l) => !l.superseded) ? (
              <Notice tone="warn" className="mt-4" title={`Saving makes drawing rev ${revOf(d)}`}>
                Scans so far stay as history; scan again against the new values.
              </Notice>
            ) : null}
          </>
        );
      }}
      confirmFooter={(d, missing) => {
        const same = isSame(d);
        let label = 'Start scan';
        if (missing) label = 'Enter every value first';
        else if (existing) label = same ? 'Done' : `Save as rev ${revOf(d)}`;
        return <Button label={label} icon={existing ? undefined : ScanLine} disabled={missing} onPress={() => confirm(d)} />;
      }}
    />
  );
}
