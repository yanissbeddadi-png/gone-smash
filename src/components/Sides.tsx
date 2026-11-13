import { AnimatePresence, motion } from 'framer-motion';
import type { SideKind } from '../data/simple';

/** Petits SVG des accompagnements (viewBox 100×100) */
function Fries({ art }: { art: string }) {
  const stick = art === 'sweet' ? '#E8762B' : '#F6C94A';
  const edge = art === 'sweet' ? '#B9541A' : '#D9A02B';
  const xs = [26, 34, 42, 50, 58, 66, 74];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {xs.map((x, i) => (
        <rect key={x} x={x - 4} y={14 + ((i * 7) % 13)} width="8" height="50" rx="2" fill={stick} stroke={edge} strokeWidth="1.5" transform={`rotate(${(i - 3) * 4} ${x} 60)`} />
      ))}
      {art === 'loaded' && (
        <>
          <path d="M22 40 Q30 32 38 40 Q46 30 54 40 Q62 31 70 40 Q76 34 80 42 L78 50 L22 50 Z" fill="#F39A1C" />
          <rect x="34" y="34" width="7" height="4" rx="1" fill="#9B3B26" />
          <rect x="56" y="36" width="8" height="4" rx="1" fill="#9B3B26" />
        </>
      )}
      <path d="M18 44 L82 44 L74 94 L26 94 Z" fill="#B4493E" />
      <path d="M18 44 L82 44 L80 54 L20 54 Z" fill="#8B3028" />
      <text x="50" y="78" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="15" fill="#FAF8F3">GS</text>
    </svg>
  );
}

const DRINK: Record<string, string> = { cola: '#3A1A10', lemonade: '#F4E27A', icetea: '#C5761F', water: '#BFE3F2' };

function Drink({ art }: { art: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="56" y="2" width="6" height="40" rx="2" fill="#FAF8F3" transform="rotate(12 59 40)" />
      <path d="M24 22 L76 22 L70 96 L30 96 Z" fill="#FAF8F3" />
      <path d="M27 40 L73 40 L70 96 L30 96 Z" fill={DRINK[art] ?? '#3A1A10'} opacity="0.92" />
      <path d="M22 18 H78 V26 H22 Z" fill="#E5DED2" />
      <path d="M33 58 H67 V74 H33 Z" fill="#F4A340" />
      <text x="50" y="71" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="12" fill="#171717">GS</text>
    </svg>
  );
}

function Dessert({ art }: { art: string }) {
  if (art === 'brownie')
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M14 56 L50 40 L86 56 L50 72 Z" fill="#5A2E1B" />
        <path d="M14 56 L50 72 L50 92 L14 76 Z" fill="#3D1E10" />
        <path d="M86 56 L50 72 L50 92 L86 76 Z" fill="#4A2414" />
        <circle cx="44" cy="54" r="2.5" fill="#FAF8F3" /><circle cx="58" cy="57" r="2" fill="#FAF8F3" /><circle cx="50" cy="48" r="2" fill="#FAF8F3" />
      </svg>
    );
  if (art === 'tiramisu')
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M22 34 H78 L72 94 H28 Z" fill="#FAF8F3" opacity="0.5" />
        <path d="M25 46 H75 L74 58 H26 Z" fill="#7A4A2A" />
        <path d="M26 58 H74 L73 72 H27 Z" fill="#F5E9D7" />
        <path d="M27 72 H73 L72 86 H28 Z" fill="#7A4A2A" />
        <path d="M23 36 H77 L75 46 H25 Z" fill="#F5E9D7" />
        <ellipse cx="50" cy="36" rx="27" ry="5" fill="#6B3A1E" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="60" r="34" fill="#C98A45" />
      <circle cx="50" cy="60" r="34" fill="none" stroke="#A86B2E" strokeWidth="3" />
      {[[38, 48], [60, 50], [48, 66], [66, 70], [34, 72], [54, 82]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#3D1E10" />)}
    </svg>
  );
}

export function SideArt({ kind, art }: { kind: SideKind; art: string }) {
  if (kind === 'fries') return <Fries art={art} />;
  if (kind === 'drink') return <Drink art={art} />;
  return <Dessert art={art} />;
}

const PLACE: Record<SideKind, string> = {
  fries: 'left-[3%] bottom-[4%] w-[24cqmin]',
  drink: 'right-[3%] bottom-[4%] w-[24cqmin]',
  dessert: 'right-[19%] bottom-0 w-[16cqmin]',
};

/** Accompagnements posés autour du burger */
export function Sides({ sides, onPick }: { sides: { kind: SideKind; art: string; label: string }[]; onPick: (k: SideKind) => void }) {
  return (
    <AnimatePresence>
      {sides.map((s) => (
        <motion.button
          key={s.kind + s.art}
          type="button"
          onClick={() => onPick(s.kind)}
          aria-label={`Changer : ${s.label}`}
          className={`absolute z-30 aspect-square drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] transition-[filter] hover:brightness-110 ${PLACE[s.kind]}`}
          initial={{ opacity: 0, y: -220, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 40, scale: 0.6, transition: { duration: 0.25 } }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
        >
          <SideArt kind={s.kind} art={s.art} />
        </motion.button>
      ))}
    </AnimatePresence>
  );
}
