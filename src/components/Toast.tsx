import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';

type T = { id: number; text: string; cart: boolean };

export function Toast({ lifted }: { lifted: boolean }) {
  const { lastAdded, open, isOpen } = useCart();
  const { notice } = useUI();
  const [t, setT] = useState<T | null>(null);

  useEffect(() => { if (lastAdded) setT({ id: lastAdded.at, text: lastAdded.name, cart: true }); }, [lastAdded]);
  useEffect(() => { if (notice) setT({ id: notice.id + 1e12, text: notice.text, cart: false }); }, [notice]);
  useEffect(() => {
    if (!t) return;
    const h = window.setTimeout(() => setT(null), 3200);
    return () => window.clearTimeout(h);
  }, [t]);

  return (
    <div aria-live="polite" className={`pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4 transition-[bottom] ${lifted ? 'bottom-24 lg:bottom-6' : 'bottom-4 sm:bottom-6'}`}>
      <AnimatePresence>
        {t && !(t.cart && isOpen) && (
          <motion.div key={t.id} initial={{ y: 80, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-offwhite py-2 pl-2 pr-2 text-charcoal shadow-2xl ring-1 ring-black/5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange">{t.cart ? <Check className="h-5 w-5" aria-hidden /> : <Info className="h-5 w-5" aria-hidden />}</span>
            <span className="pr-2 text-sm font-semibold">{t.text}{t.cart && <span className="font-normal text-charcoal/70"> ajouté au panier</span>}</span>
            {t.cart && <button type="button" onClick={() => { setT(null); open(); }} className="rounded-full bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-wider text-offwhite hover:bg-brick">Voir</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
