import { useEffect, useState } from 'react';
import { openStatus } from '../utils/schedule';

/** Statut d'ouverture (horaires de démo, heure de Lyon), rafraîchi chaque minute */
export function OpenBadge({ className = '', light = false }: { className?: string; light?: boolean }) {
  const [s, setS] = useState(openStatus);
  useEffect(() => {
    const h = window.setInterval(() => setS(openStatus()), 60_000);
    return () => window.clearInterval(h);
  }, []);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${light ? 'bg-charcoal/5 text-charcoal' : 'bg-white/10 text-offwhite'} ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden>
        {s.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7bd34a] opacity-60" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.open ? 'bg-[#7bd34a]' : 'bg-brick-400'}`} />
      </span>
      {s.label}
    </span>
  );
}
