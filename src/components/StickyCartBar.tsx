import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { euro } from '../utils/format';

/** Barre panier collante (mobile/tablette) — visible dès qu'un article est au panier */
export function StickyCartBar({ hidden }: { hidden: boolean }) {
  const { count, total, open, isOpen, toGift, gift } = useCart();
  const show = count > 0 && !isOpen && !hidden;
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <button type="button" onClick={open} className="flex h-16 w-full items-center gap-3 rounded-2xl bg-orange px-4 text-left text-charcoal shadow-[0_-8px_40px_rgba(0,0,0,.45)] active:scale-[0.99]">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-charcoal text-orange">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-offwhite px-1 text-[0.65rem] font-bold text-charcoal">{count}</span>
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-bold uppercase tracking-wider">Voir mon panier</span>
              <span className="block text-xs text-charcoal/75">{gift ? `${gift} offert (démo)` : `Plus que ${euro(toGift)} pour un cadeau (démo)`}</span>
            </span>
            <span className="display text-2xl tabular-nums">{euro(total)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
