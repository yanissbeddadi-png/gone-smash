import { ArrowUpRight, Plus } from 'lucide-react';
import { combos } from '../data/combos';
import { extras } from '../data/extras';
import { getProduct } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import { extraItem, productItem } from '../utils/cartItems';
import { euro } from '../utils/format';
import { Cookie, Cup, Fries } from './burger/Floaties';

const icon = (id: string) => (id === 'boisson' ? <Cup className="h-10" /> : id === 'cookie' ? <Cookie className="h-8" /> : <Fries className="h-10" large={id === 'grandes-frites'} />);

/** Suggestions dans le panier : passage en menu + accompagnements en un tap */
export function Upsell() {
  const { items, add, replace } = useCart();
  const ui = useUI();
  const solo = items.find((i) => i.kind === 'product' && !i.comboId && i.productId);
  const soloProduct = solo?.productId ? getProduct(solo.productId) : undefined;
  const classic = combos[0];
  const have = new Set(items.filter((i) => i.kind === 'extra').map((i) => i.extraId));
  const suggestions = extras.filter((e) => !have.has(e.id)).slice(0, 3);
  if (!soloProduct && !suggestions.length) return null;

  return (
    <section aria-label="Suggestions" className="py-4">
      {solo && soloProduct && (
        <button type="button" onClick={() => { replace(solo.id, productItem(soloProduct, classic.id)); ui.notify(`${soloProduct.name} passé en ${classic.name}`); ui.play('pop'); }}
          className="group flex w-full items-center gap-3 rounded-2xl bg-orange p-3 text-left text-charcoal transition hover:bg-[#ffb85c]">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-charcoal/10"><Fries className="h-10" /></span>
          <span className="flex-1 text-sm leading-tight"><strong>Passe {soloProduct.name} en menu</strong><br /><span className="text-charcoal/75">Frites maison + boisson</span></span>
          <span className="display shrink-0 text-xl">+{euro(classic.supplement)}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 transition group-hover:rotate-45" aria-hidden />
        </button>
      )}
      {suggestions.length > 0 && (
        <>
          <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-[0.14em] text-offwhite/60">Avec ça ?</p>
          <ul className="grid grid-cols-3 gap-2">
            {suggestions.map((e) => (
              <li key={e.id}>
                <button type="button" onClick={() => { add(extraItem(e)); ui.play('pop'); }} className="flex h-full w-full flex-col items-center gap-1 rounded-2xl bg-white/[0.05] p-2 pb-3 text-center ring-1 ring-white/10 transition hover:bg-white/10" aria-label={`Ajouter ${e.name}, ${euro(e.price)}`}>
                  <span className="grid h-12 place-items-center" aria-hidden>{icon(e.id)}</span>
                  <span className="text-[0.7rem] leading-tight text-offwhite/80">{e.name}</span>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-orange"><Plus className="h-3 w-3" aria-hidden />{euro(e.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
