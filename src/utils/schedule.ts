import { brand } from '../data/brand';

/** Horaires de démonstration évalués à l'heure de Lyon, quel que soit le fuseau du visiteur. */
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export const fmtMin = (m: number) => `${Math.floor(m / 60) % 24}h${String(m % 60).padStart(2, '0')}`;

export function lyonNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const ranges = (day: number) => (brand.schedule[day] ?? []).map((r) => ({ open: toMin(r.open), close: toMin(r.close) }));

export interface OpenStatus { open: boolean; label: string }

export function openStatus(d = new Date()): OpenStatus {
  const { day, minutes } = lyonNow(d);
  const cur = ranges(day).find((r) => minutes >= r.open && minutes < r.close);
  if (cur) return { open: true, label: `Ouvert · ferme à ${fmtMin(cur.close)}` };
  const later = ranges(day).find((r) => r.open > minutes);
  if (later) return { open: false, label: `Fermé · ouvre à ${fmtMin(later.open)}` };
  for (let i = 1; i <= 7; i++) {
    const r = ranges((day + i) % 7)[0];
    if (r) return { open: false, label: `Fermé · ouvre ${i === 1 ? 'demain' : DAYS[(day + i) % 7]} à ${fmtMin(r.open)}` };
  }
  return { open: false, label: 'Fermé' };
}

export interface Slot { value: string; label: string }

/** Créneaux de retrait au pas de 15 min, à partir de maintenant + délai de préparation. */
export function pickupSlots(d = new Date(), max = 16): Slot[] {
  const { day, minutes } = lyonNow(d);
  const earliest = minutes + brand.prepMinutes;
  const slots: Slot[] = [];
  for (let i = 0; i <= 7 && slots.length < max; i++) {
    const dd = (day + i) % 7;
    const prefix = i === 0 ? 'Aujourd’hui' : i === 1 ? 'Demain' : DAYS[dd][0].toUpperCase() + DAYS[dd].slice(1);
    for (const r of ranges(dd)) {
      let t = Math.max(r.open + 15, i === 0 ? Math.ceil(earliest / 15) * 15 : 0);
      for (; t <= r.close - 15 && slots.length < max; t += 15) slots.push({ value: `${i}-${t}`, label: `${prefix} · ${fmtMin(t)}` });
    }
    if (i === 0 && slots.length && ranges(dd).some((r) => minutes >= r.open && minutes < r.close)) {
      slots.unshift({ value: 'asap', label: `Dès que possible (~${brand.prepMinutes} min)` });
    }
  }
  return slots.slice(0, max);
}
