/** Logo typographique + badge rotatif « Made in Lyon » (élément graphique, pas une certification) */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`display inline-flex items-baseline gap-[0.18em] text-[1.6rem] leading-none ${className}`}>
      <span>GONE</span>{' '}
      <svg viewBox="0 0 20 20" className="h-[0.55em] w-[0.55em] translate-y-[-0.05em] text-orange" aria-hidden>
        <path d="M10 0l2.6 6.4L19.5 7l-5.3 4.5L16 19 10 15.3 4 19l1.8-7.5L.5 7l6.9-.6z" fill="currentColor" />
      </svg>{' '}
      <span>SMASH</span>
    </span>
  );
}

export function LyonBadge({ className = '', text = 'MADE IN LYON · SMASH BURGERS · 69 · ' }: { className?: string; text?: string }) {
  return (
    <div className={`relative grid aspect-square place-items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs><path id="lyon-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <circle cx="100" cy="100" r="98" fill="currentColor" />
        <text className="font-display" fontSize="21" letterSpacing="3.2" fill="#171717">
          <textPath href="#lyon-circle">{text}</textPath>
        </text>
      </svg>
      <span className="display relative text-[2.4em] leading-none text-charcoal">69</span>
    </div>
  );
}
