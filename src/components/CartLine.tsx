import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart, type CartItem } from '../hooks/useCart';
import { euro, round2 } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { QtyStepper } from './ui/QtyStepper';

export function CartLine({ item, dark = false }: { item: CartItem; dark?: boolean }) {
  const { setQty, remove } = useCart();
  return (
    <motion.li layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }} transition={{ duration: 0.25 }}
      className={`flex gap-4 overflow-hidden border-b py-4 ${dark ? 'border-white/10' : 'border-charcoal/10'}`}>
      <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl p-2 ${item.kind === 'custom' ? 'bg-brick' : 'bg-orange'}`} aria-hidden>
        <div className="w-full"><BurgerStack layers={item.layers} shadow={false} seed={2} /></div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold leading-tight">{item.name}</p>
            {item.kind === 'custom' && <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-orange">Composé par toi</p>}
          </div>
          <p className="shrink-0 font-bold tabular-nums">{euro(round2(item.unitPrice * item.qty))}</p>
        </div>
        <details className={`mt-1 text-xs ${dark ? 'text-offwhite/60' : 'text-charcoal/75'}`}>
          <summary className="cursor-pointer select-none hover:underline">{item.details.slice(0, 2).join(', ')}{item.details.length > 2 ? `… (+${item.details.length - 2})` : ''}</summary>
          <ul className="mt-1 list-inside list-disc">{item.details.map((d) => <li key={d}>{d}</li>)}</ul>
        </details>
        <div className="mt-2 flex items-center justify-between">
          <QtyStepper value={item.qty} onChange={(n) => setQty(item.id, n)} label={item.name} dark={dark} />
          <button type="button" onClick={() => remove(item.id)} className={`grid h-10 w-10 place-items-center rounded-full transition hover:text-brick ${dark ? 'hover:bg-white/10' : 'hover:bg-charcoal/5'}`} aria-label={`Supprimer ${item.name} du panier`}>
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </motion.li>
  );
}
