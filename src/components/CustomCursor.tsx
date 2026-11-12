import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMedia } from '../hooks/useMedia';

/** Anneau qui suit le pointeur (souris uniquement). Le curseur natif est conservé. */
export function CustomCursor() {
  const fine = useMedia('(pointer: fine) and (min-width: 1024px)');
  const reduce = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [mode, setMode] = useState<'idle' | 'link' | 'label'>('idle');
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || reduce) return;
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    const over = (e: PointerEvent) => {
      const t = e.target as Element;
      const lab = t.closest?.('[data-cursor]');
      if (lab) { setMode('label'); setText(lab.getAttribute('data-cursor') ?? ''); return; }
      setMode(t.closest?.('a,button,label,select,input,textarea') ? 'link' : 'idle');
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;
  const size = mode === 'label' ? 84 : mode === 'link' ? 46 : 18;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: sx, y: sy }}>
      <motion.div
        className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full ${mode === 'label' ? 'bg-orange text-charcoal' : 'border-2 border-orange'}`}
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <AnimatePresence>
          {mode === 'label' && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-[0.7rem] font-bold uppercase tracking-[0.14em]">{text}</motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
