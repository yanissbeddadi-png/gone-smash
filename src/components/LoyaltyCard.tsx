import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useLoyalty } from '../hooks/useLoyalty';
import { rewardItem } from '../utils/cartItems';

/** Carte à tampons (démo) — `compact` pour le tiroir, grande version pour la confirmation */
export function LoyaltyCard({ compact = false, highlight = 0 }: { compact?: boolean; highlight?: number }) {
  const { stamps, goal, canRedeem } = useLoyalty();
  const { items, add } = useCart();
  const shown = Math.min(stamps, goal);
  const hasReward = items.some((i) => i.kind === 'reward');
  return (
    <div className={`rounded-2xl ${compact ? 'bg-white/[0.04] p-4' : 'bg-white/5 p-6'} ring-1 ring-white/10`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange">Carte fidélité <span className="font-normal normal-case tracking-normal text-offwhite/60">(démo)</span></p>
        <p className="text-xs text-offwhite/70">{shown}/{goal} tampons</p>
      </div>
      <ol className="mt-3 grid grid-cols-10 gap-1.5" aria-label={`${shown} tampons sur ${goal}`}>
        {Array.from({ length: goal }, (_, i) => {
          const on = i < shown;
          const fresh = on && i >= shown - highlight;
          return (
            <motion.li key={i} initial={fresh ? { scale: 0, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ delay: fresh ? 0.3 + (i - (shown - highlight)) * 0.12 : 0, type: 'spring', stiffness: 300, damping: 14 }}
              className={`grid aspect-square place-items-center rounded-full text-[0.6rem] font-black ${on ? 'bg-orange text-charcoal' : 'border border-dashed border-white/20 text-white/20'}`} aria-hidden>
              {on ? 'GS' : i + 1}
            </motion.li>
          );
        })}
      </ol>
      {canRedeem && !hasReward ? (
        <button type="button" onClick={() => add(rewardItem(getProduct('le-gone')!))} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-orange text-xs font-bold uppercase tracking-wider text-charcoal hover:bg-offwhite">
          <Gift className="h-4 w-4" aria-hidden /> Utiliser ma récompense : Le Gone offert
        </button>
      ) : (
        !compact && <p className="mt-3 text-sm text-offwhite/70">1 tampon par burger. Au {goal}<sup>e</sup>, Le Gone est offert.</p>
      )}
    </div>
  );
}
