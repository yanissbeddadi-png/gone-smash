import { Minus, Plus } from 'lucide-react';

export function QtyStepper({ value, onChange, label, min = 1, dark = false }: { value: number; onChange: (n: number) => void; label: string; min?: number; dark?: boolean }) {
  const b = `grid h-10 w-10 place-items-center rounded-full transition active:scale-90 disabled:opacity-30 ${dark ? 'bg-white/10 hover:bg-white/20' : 'bg-charcoal/5 hover:bg-charcoal/10'}`;
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={`Quantité : ${label}`}>
      <button type="button" className={b} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Retirer un ${label}`}>
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="w-8 text-center font-bold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={b} onClick={() => onChange(value + 1)} disabled={value >= 20} aria-label={`Ajouter un ${label}`}>
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
