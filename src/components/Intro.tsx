import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BurgerStack } from './burger/BurgerStack';
import { Logo } from './ui/Brand';

const KEY = 'gonesmash.intro.v1';
const layers = [
  { id: 'b', kind: 'bunBottom' as const, bun: 'brioche' as const },
  { id: 's', kind: 'steak' as const },
  { id: 'c', kind: 'cheddar' as const },
  { id: 't', kind: 'bunTop' as const, bun: 'brioche' as const },
];

function shouldPlay() {
  try {
    if (sessionStorage.getItem(KEY)) return false;
    if (window.location.hash.length > 1 || window.location.search) return false; // lien profond : on va droit au but
    // desktop uniquement : sur mobile, on privilégie l'affichage immédiat
    return window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Intro de marque (~1 s), une fois par session */
export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(shouldPlay);
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    const t = window.setTimeout(() => setShow(false), 1150);
    return () => window.clearTimeout(t);
  }, [show]);
  return (
    <AnimatePresence>
      {show && !reduce && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-charcoal"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-28"><BurgerStack layers={layers} mode="stagger" seed={2} /></div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Logo className="text-4xl text-offwhite" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
