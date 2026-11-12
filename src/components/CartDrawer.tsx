import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useRef } from 'react';
import { brand } from '../data/brand';
import { useCart } from '../hooks/useCart';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { euro } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { CartLine } from './CartLine';
import { Button, LinkButton } from './ui/Button';

export function CartTotals({ dark = false, extra = [] as { label: string; amount: number }[] }) {
  const { subtotal, serviceFee } = useCart();
  const total = subtotal + serviceFee + extra.reduce((a, e) => a + e.amount, 0);
  const muted = dark ? 'text-offwhite/60' : 'text-charcoal/75';
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className={muted}>Sous-total</dt><dd className="tabular-nums">{euro(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className={muted}>Frais de service (démo)</dt><dd className="tabular-nums">{euro(serviceFee)}</dd></div>
      {extra.map((e) => <div key={e.label} className="flex justify-between"><dt className={muted}>{e.label}</dt><dd className="tabular-nums">{euro(e.amount)}</dd></div>)}
      <div className="flex items-end justify-between pt-2"><dt className="font-bold uppercase tracking-[0.12em]">Total</dt><dd className="display text-4xl tabular-nums">{euro(Math.round(total * 100) / 100)}</dd></div>
    </dl>
  );
}

export function EmptyCart({ onNavigate, dark = true }: { onNavigate: () => void; dark?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-40" aria-hidden>
        <BurgerStack layers={[{ id: 'b', kind: 'bunBottom', bun: 'brioche' }, { id: 't', kind: 'bunTop', bun: 'brioche' }]} seed={1} />
      </div>
      <p className="display mt-8 text-4xl">Ton panier crie famine.</p>
      <p className={`mt-2 max-w-xs ${dark ? 'text-offwhite/60' : 'text-charcoal/75'}`}>Un pain, deux pains… et rien entre les deux. Ça ne peut pas rester comme ça.</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        <LinkButton href="#carte" onClick={onNavigate}>Voir la carte</LinkButton>
        <LinkButton href="#composer" onClick={onNavigate} variant={dark ? 'outline' : 'dark'} className={dark ? 'text-offwhite' : ''}>Composer mon burger</LinkButton>
      </div>
    </div>
  );
}

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { items, isOpen, close, count } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, isOpen, close);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-charcoal text-offwhite shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 id="cart-title" className="display text-3xl">Panier <span className="text-orange">({count})</span></h2>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Fermer le panier">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {items.length === 0 ? (
              <EmptyCart onNavigate={close} />
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>{items.map((i) => <CartLine key={i.id} item={i} dark />)}</AnimatePresence>
                </ul>
                <div className="border-t border-white/10 bg-charcoal-800 px-6 pb-6 pt-4">
                  <CartTotals dark />
                  <p className="mt-2 text-xs text-offwhite/60">Frais à emporter éventuels ({euro(brand.fees.takeaway)}) calculés à l’étape suivante.</p>
                  <Button size="lg" className="mt-4 w-full" onClick={() => { close(); onCheckout(); }}>
                    Commander <ArrowRight className="h-5 w-5" aria-hidden />
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
