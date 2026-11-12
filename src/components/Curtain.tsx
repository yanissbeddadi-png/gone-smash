import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './ui/Brand';

/** Rideau orange joué à chaque changement de vue (accueil ↔ commande) */
export function Curtain({ view }: { view: string }) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!reduce) setK((n) => n + 1);
  }, [view, reduce]);
  useEffect(() => {
    if (!k) return;
    const t = window.setTimeout(() => setK(0), 900);
    return () => window.clearTimeout(t);
  }, [k]);
  return (
    <AnimatePresence>
      {k > 0 && (
        <motion.div
          key={k}
          className="pointer-events-none fixed inset-0 z-[85] grid place-items-center bg-orange text-charcoal"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)'] }}
          transition={{ duration: 0.85, times: [0, 0.4, 0.6, 1], ease: [0.7, 0, 0.2, 1] }}
          aria-hidden
        >
          <Logo className="text-5xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
