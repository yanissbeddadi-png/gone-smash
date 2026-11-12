import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';

export function Toast() {
  const { lastAdded, open, isOpen } = useCart();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!lastAdded) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 3200);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:bottom-6">
      <AnimatePresence>
        {show && !isOpen && lastAdded && (
          <motion.div
            key={lastAdded.at}
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-offwhite py-2 pl-2 pr-2 text-charcoal shadow-2xl ring-1 ring-black/5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange"><Check className="h-5 w-5" aria-hidden /></span>
            <span className="text-sm font-semibold">{lastAdded.name} <span className="font-normal text-charcoal/75">ajouté au panier</span></span>
            <button type="button" onClick={() => { setShow(false); open(); }} className="rounded-full bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-wider text-offwhite hover:bg-brick">Voir</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
