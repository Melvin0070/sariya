// Members, drawing fields, scan targets and checks. The drawing comes first: every verdict compares against these values.

export type MemberKind = 'slab' | 'beam';

export type FieldId =
  | 'dia'
  | 'main_count'
  | 'main_spacing'
  | 'dist_count'
  | 'dist_spacing'
  | 'cover'
  | 'stirrup_dia'
  | 'end_spacing'
  | 'end_length'
  | 'mid_spacing';

export type Field = {
  id: FieldId;
  label: string;
  hint: string;
  unit: 'mm' | 'bars';
  min: number;
  max: number;
  allowed?: number[];
};

const BAR_DIA = [6, 8, 10, 12, 16, 20, 25, 32];
const RING_DIA = [6, 8, 10, 12];

export const FIELDS: Record<MemberKind, Field[]> = {
  slab: [
    { id: 'dia', label: 'Bar diameter', hint: 'Main and distribution bars', unit: 'mm', min: 6, max: 32, allowed: BAR_DIA },
    { id: 'main_count', label: 'Main bars in the patch', hint: 'Bars along the short span, inside the patch you scan', unit: 'bars', min: 1, max: 40 },
    { id: 'main_spacing', label: 'Main bar spacing', hint: 'Centre to centre', unit: 'mm', min: 25, max: 400 },
    { id: 'dist_count', label: 'Distribution bars in the patch', hint: 'Bars laid across the main bars', unit: 'bars', min: 1, max: 40 },
    { id: 'dist_spacing', label: 'Distribution bar spacing', hint: 'Centre to centre', unit: 'mm', min: 25, max: 400 },
    { id: 'cover', label: 'Bottom cover', hint: 'You will check it with a tape', unit: 'mm', min: 10, max: 75 },
  ],
  beam: [
    { id: 'stirrup_dia', label: 'Ring diameter', hint: 'Stirrups (rings)', unit: 'mm', min: 6, max: 12, allowed: RING_DIA },
    { id: 'end_spacing', label: 'Ring spacing at the end', hint: 'Inside the end zone, centre to centre', unit: 'mm', min: 25, max: 400 },
    { id: 'end_length', label: 'End-zone length', hint: 'From the column face, where the strip starts at 0', unit: 'mm', min: 100, max: 1500 },
    { id: 'mid_spacing', label: 'Ring spacing mid-span', hint: 'Centre to centre', unit: 'mm', min: 25, max: 400 },
    { id: 'cover', label: 'Clear cover', hint: 'You will check it with a tape', unit: 'mm', min: 10, max: 75 },
  ],
};

// Half-scale stage props (BUILD-PLAN §7). Shown as DEMO PROP and always editable.
export const PRESET: Record<MemberKind, Partial<Record<FieldId, number>>> = {
  slab: { dia: 8, main_count: 5, main_spacing: 50, dist_count: 5, dist_spacing: 50, cover: 20 },
  beam: { stirrup_dia: 8, end_spacing: 50, end_length: 150, mid_spacing: 75, cover: 25 },
};

export function validate(f: Field, v: number): string | null {
  if (!Number.isFinite(v) || v <= 0) return 'Enter a number above zero';
  if (f.allowed && !f.allowed.includes(v)) return `Use a standard size: ${f.allowed.join(', ')} mm`;
  if (v < f.min || v > f.max) return `Must be ${f.min}–${f.max} ${f.unit}`;
  return null;
}

export type Spec = {
  rev: number;
  at: number;
  values: Partial<Record<FieldId, number | null>>;
  hooks135: boolean;
  preset: boolean;
  noDrawing: boolean;
};

export const KIND_LABEL: Record<MemberKind, string> = { slab: 'Slab', beam: 'Beam' };
export const KIND_HINT: Record<MemberKind, string> = { slab: 'Count and spacing both ways, cover', beam: 'Ring spacing by zone, cover' };

// ---- scan targets: one Lock measures one family of bars ---------------------------

export type TargetId = 'main' | 'dist' | 'stirrups';
export type MarkerId = 'card' | 'strip';

export type Target = { id: TargetId; label: string; short: string; axis: 'x' | 'y'; marker: MarkerId };

export const TARGETS: Record<MemberKind, Target[]> = {
  slab: [
    { id: 'main', label: 'Main bars', short: 'Main', axis: 'x', marker: 'card' },
    { id: 'dist', label: 'Distribution bars', short: 'Distribution', axis: 'y', marker: 'card' },
  ],
  beam: [{ id: 'stirrups', label: 'Rings along the strip', short: 'Rings', axis: 'x', marker: 'strip' }],
};

// Printed fiducials. `marker` is the ArUco marker side, used for the too-far gate.
export const MARKERS: Record<MarkerId, { w: number; h: number; marker: number; name: string; corners: string }> = {
  card: { w: 90, h: 90, marker: 11, name: 'card S', corners: 'the 4 corners of the card pattern' },
  strip: { w: 300, h: 30, marker: 20, name: 'strip_300', corners: 'the 4 corners of the strip, 0 end on the left' },
};

// ---- checks ---------------------------------------------------------------------

export type CheckId = 'main_count' | 'main_spacing' | 'dist_count' | 'dist_spacing' | 'end_spacing' | 'mid_spacing' | 'cover' | 'diameter' | 'hook';
export type ReadingKind = 'tape' | 'scale' | 'template';

export type CheckDef = { id: CheckId; label: string; zone?: string; target?: TargetId; reading?: ReadingKind };

export function checksFor(member: MemberKind, spec: Spec | null): CheckDef[] {
  if (member === 'slab') {
    return [
      { id: 'main_count', label: 'Bar count', zone: 'Main bars', target: 'main' },
      { id: 'main_spacing', label: 'Bar spacing', zone: 'Main bars', target: 'main' },
      { id: 'dist_count', label: 'Bar count', zone: 'Distribution bars', target: 'dist' },
      { id: 'dist_spacing', label: 'Bar spacing', zone: 'Distribution bars', target: 'dist' },
      { id: 'cover', label: 'Bottom cover', reading: 'tape' },
      { id: 'diameter', label: 'Bar size', reading: 'scale' },
    ];
  }
  const beam: CheckDef[] = [
    { id: 'end_spacing', label: 'Ring spacing', zone: 'End zone', target: 'stirrups' },
    { id: 'mid_spacing', label: 'Ring spacing', zone: 'Mid-span', target: 'stirrups' },
    { id: 'cover', label: 'Clear cover', reading: 'tape' },
    { id: 'diameter', label: 'Ring size', reading: 'scale' },
  ];
  // Hooks are checked only where the drawing asks for them (Bengaluru is Zone II: IS 13920 is advisory).
  if (spec?.hooks135) beam.push({ id: 'hook', label: 'Hook angle', reading: 'template' });
  return beam;
}

export const checkName = (c: CheckDef) => (c.zone ? `${c.label} · ${c.zone}` : c.label);
