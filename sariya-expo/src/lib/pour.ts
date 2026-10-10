// Planned pour times: a few one-tap presets instead of a date picker, since a slab is cast at a handful of usual hours.

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export type PourPreset = { key: string; label: string; at: number };

function at(dayOffset: number, hour: number, now: number) {
  const d = new Date(now);
  d.setHours(hour, 0, 0, 0);
  return d.getTime() + dayOffset * DAY;
}

// Only presets still ahead of now, so "Today 6 pm" disappears once it has passed.
export function pourPresets(now = Date.now()): PourPreset[] {
  const all: PourPreset[] = [
    { key: 't18', label: 'Today 6 pm', at: at(0, 18, now) },
    { key: 'n07', label: 'Tomorrow 7 am', at: at(1, 7, now) },
    { key: 'n14', label: 'Tomorrow 2 pm', at: at(1, 14, now) },
    { key: 'd07', label: 'Day after 7 am', at: at(2, 7, now) },
  ];
  return all.filter((p) => p.at > now);
}

function dayWord(t: number, now: number) {
  const days = Math.round((at(0, 0, t) - at(0, 0, now)) / DAY);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  const d = new Date(t);
  return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
}

const clock = (t: number) => new Date(t).toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(':00', '');

export function pourLabel(t: number, now = Date.now()) {
  return `Pour ${dayWord(t, now)} ${clock(t)}`;
}

export function pourIn(t: number, now = Date.now()) {
  const h = (t - now) / HOUR;
  if (h < 0) return 'pour time passed';
  if (h < 1) return `in ${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `in ${Math.round(h)} h`;
  return `in ${Math.round(h / 24)} days`;
}
