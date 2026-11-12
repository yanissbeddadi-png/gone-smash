import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { combos, desserts, drinks, getCombo } from '../data/combos';
import { useUI } from '../hooks/useUI';
import { productItem } from '../utils/cartItems';
import { getProduct, products } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useProductModal } from '../hooks/useProductModal';
import { euro, round2 } from '../utils/format';
import { ProductVisual } from './burger/ProductVisual';
import { Button } from './ui/Button';
import { QtyStepper } from './ui/QtyStepper';

export function ProductModal() {
  const { state, closeProduct } = useProductModal();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, !!state, closeProduct);

  return (
    <AnimatePresence>
      {state && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" onClick={closeProduct} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-title"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-offwhite text-charcoal sm:rounded-3xl"
          >
            <Body key={state.productId} initialProduct={state.productId} initialCombo={state.comboId} showPicker={!!state.fromCombo} onDone={closeProduct} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Body({ initialProduct, initialCombo, showPicker, onDone }: { initialProduct: string; initialCombo?: string; showPicker: boolean; onDone: () => void }) {
  const { add } = useCart();
  const [pid, setPid] = useState(initialProduct);
  const [comboId, setComboId] = useState<string>(initialCombo ?? 'none');
  const [drink, setDrink] = useState(drinks[0]);
  const [dessert, setDessert] = useState(desserts[0]);
  const [qty, setQty] = useState(1);
  const ui = useUI();
  const visualRef = useRef<HTMLDivElement>(null);
  const p = getProduct(pid)!;
  const combo = getCombo(comboId);
  const unit = round2(p.price + (combo?.supplement ?? 0));
  const needsDessert = combo?.includes.includes('Dessert');

  useEffect(() => setQty(1), [pid]);

  const onAdd = () => {
    add(productItem(p, combo?.id, drink, dessert), qty);
    ui.flyToCart(visualRef.current, p.layers);
    ui.play('pop');
    onDone();
  };

  const radio = (active: boolean) => `flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 transition ${active ? 'border-charcoal bg-charcoal text-offwhite' : 'border-charcoal/10 hover:border-charcoal/40'}`;

  return (
    <div className="grid md:grid-cols-2">
      <button type="button" onClick={onDone} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-charcoal text-offwhite hover:bg-brick" aria-label="Fermer">
        <X className="h-5 w-5" aria-hidden />
      </button>
      <div className="relative flex items-center justify-center overflow-hidden bg-orange px-10 pb-6 pt-14 md:rounded-l-3xl md:py-14">
        <span aria-hidden className="display absolute -left-2 top-2 text-[5rem] leading-none text-charcoal/10 md:text-[7rem]">{euro(p.price).replace(/\s?€/, '')}€</span>
        <motion.div ref={visualRef} key={p.id} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-[min(60vw,300px)] md:w-[80%]">
          <ProductVisual product={p} eager />
        </motion.div>
      </div>
      <div className="p-6 sm:p-8">
        {showPicker && (
          <fieldset className="mb-6">
            <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/75">Choisis ton burger</legend>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {products.map((x) => (
                <button key={x.id} type="button" onClick={() => setPid(x.id)} aria-pressed={x.id === pid} className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${x.id === pid ? 'border-charcoal bg-charcoal text-offwhite' : 'border-charcoal/15 hover:border-charcoal/40'}`}>
                  {x.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brick">{p.tagline}</p>
        <h2 id="pm-title" className="display mt-1 text-5xl sm:text-6xl">{p.name}</h2>
        <p className="mt-3 text-charcoal/75">{p.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Ingrédients">
          {p.ingredients.map((i) => <li key={i} className="rounded-full bg-cream px-3 py-1 text-sm">{i}</li>)}
        </ul>

        <fieldset className="mt-6">
          <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/75">Formule</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ id: 'none', name: 'Burger seul', supplement: 0, short: 'Juste le burger' }, ...combos].map((c) => (
              <label key={c.id} className={radio(comboId === c.id)}>
                <input type="radio" name="combo" value={c.id} checked={comboId === c.id} onChange={() => setComboId(c.id)} className="sr-only" />
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="block text-xs opacity-70">{c.short}</span>
                </span>
                <span className="text-sm font-bold">{c.supplement ? `+${euro(c.supplement)}` : '—'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {combo && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Boisson
              <select value={drink} onChange={(e) => setDrink(e.target.value)} className="mt-1 h-12 w-full rounded-xl border-2 border-charcoal/15 bg-white px-3 font-normal">
                {drinks.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            {needsDessert && (
              <label className="block text-sm font-semibold">
                Dessert
                <select value={dessert} onChange={(e) => setDessert(e.target.value)} className="mt-1 h-12 w-full rounded-xl border-2 border-charcoal/15 bg-white px-3 font-normal">
                  {desserts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
            )}
          </div>
        )}

        <p className="mt-4 text-xs text-charcoal/70">Allergènes : informations à compléter par l’établissement. Carte de démonstration.</p>

        <div className="sticky bottom-0 -mx-6 mt-6 flex items-center gap-3 border-t border-charcoal/10 bg-offwhite px-6 py-4 sm:-mx-8 sm:px-8">
          <QtyStepper value={qty} onChange={setQty} label={p.name} />
          <Button onClick={onAdd} size="lg" variant="dark" className="flex-1 !px-4">
            Ajouter · {euro(round2(unit * qty))}
          </Button>
        </div>
      </div>
    </div>
  );
}
