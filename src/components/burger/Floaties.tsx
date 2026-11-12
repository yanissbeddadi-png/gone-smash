/** Petits éléments flottants (ingrédients isolés) pour le hero et les sections */
export function PickleSlice({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="#4E6420" />
      <circle cx="50" cy="50" r="40" fill="#8DA24A" />
      <circle cx="50" cy="50" r="24" fill="#A9BC63" />
      {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={50 + Math.cos((a * Math.PI) / 180) * 15} cy={50 + Math.sin((a * Math.PI) / 180) * 15} rx="4" ry="2.6" fill="#E3E8AE" transform={`rotate(${a} ${50 + Math.cos((a * Math.PI) / 180) * 15} ${50 + Math.sin((a * Math.PI) / 180) * 15})`} />)}
    </svg>
  );
}
export function CheeseSquare({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M8,10 L92,6 L94,70 C90,86 84,86 82,72 L80,92 C76,100 70,100 68,90 L40,94 C36,100 30,98 30,90 L6,88 Z" fill="#F39A1C" />
      <path d="M14,14 L86,11" stroke="#FFC75A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
export function OnionRing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <ellipse cx="50" cy="50" rx="42" ry="40" fill="none" stroke="#C88A3A" strokeWidth="14" />
      <ellipse cx="50" cy="50" rx="42" ry="40" fill="none" stroke="#E9B86A" strokeWidth="6" strokeDasharray="7 5" />
    </svg>
  );
}
export function TomatoSlice({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="#B92F22" />
      <circle cx="50" cy="50" r="40" fill="#E2503A" />
      {[30, 150, 270].map((a) => {
        const x = 50 + Math.cos((a * Math.PI) / 180) * 20, y = 50 + Math.sin((a * Math.PI) / 180) * 20;
        return <g key={a}><ellipse cx={x} cy={y} rx="13" ry="9" fill="#F27A5E" transform={`rotate(${a} ${x} ${y})`} /><circle cx={x} cy={y} r="2.5" fill="#F7C35C" /></g>;
      })}
      <circle cx="50" cy="50" r="6" fill="#F4A08A" />
    </svg>
  );
}
export function Sesame({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className} aria-hidden>
      <ellipse cx="10" cy="6" rx="9" ry="5" fill="#FBEBC8" stroke="#D9B179" />
    </svg>
  );
}

export function Fries({ className = '', large = false }: { className?: string; large?: boolean }) {
  const sticks = large ? [18, 28, 36, 44, 52, 60, 68, 78] : [24, 34, 44, 54, 64, 74];
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden>
      {sticks.map((x, i) => <rect key={x} x={x - 4} y={10 + (i % 3) * 9} width="9" height="70" rx="2.5" fill={i % 2 ? '#F2C25A' : '#E9AE3E'} transform={`rotate(${(i - sticks.length / 2) * 3} ${x} 80)`} />)}
      <path d="M12,56 L88,56 L78,126 L22,126 Z" fill="#8B3028" />
      <path d="M12,56 L88,56 L86,68 L14,68 Z" fill="#6E241E" />
      <text x="50" y="104" textAnchor="middle" fontFamily="Anton" fontSize="17" fill="#F5E9D7">GS</text>
    </svg>
  );
}
export function Cup({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 130" className={className} aria-hidden>
      <rect x="44" y="0" width="6" height="34" rx="3" fill="#F4A340" transform="rotate(12 47 34)" />
      <path d="M8,26 L72,26 L64,126 L16,126 Z" fill="#F5E9D7" />
      <rect x="4" y="20" width="72" height="12" rx="5" fill="#FAF8F3" />
      <path d="M12,62 L68,62 L66,88 L14,88 Z" fill="#171717" />
      <text x="40" y="81" textAnchor="middle" fontFamily="Anton" fontSize="14" fill="#F4A340">SMASH</text>
    </svg>
  );
}
export function Cookie({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="44" fill="#C98A4B" />
      <circle cx="50" cy="50" r="38" fill="#D99B5A" />
      {[[34, 36], [60, 30], [46, 58], [68, 60], [30, 64], [56, 76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 5 : 4} fill={i % 3 ? '#E05A7A' : '#4A2416'} />)}
    </svg>
  );
}
