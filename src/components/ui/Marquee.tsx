import { Asterisk } from 'lucide-react';

export function Marquee({ items, className = '', reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 text-[clamp(2rem,5vw,4.5rem)]">{t}</span>
          <Asterisk className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" strokeWidth={3} aria-hidden />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <div className="flex animate-marquee" style={reverse ? { animationDirection: 'reverse' } : undefined}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
