import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Product } from '../data/types';
import { useCart } from '../hooks/useCart';
import { useProductModal } from '../hooks/useProductModal';
import { useUI } from '../hooks/useUI';
import { productItem } from '../utils/cartItems';
import { euro } from '../utils/format';
import { ProductVisual } from './burger/ProductVisual';

const theme = {
  orange: { card: 'bg-orange text-charcoal', disc: 'bg-[#f7b664]', btn: 'bg-charcoal text-offwhite hover:bg-brick', sub: 'text-charcoal/70', tag: 'bg-charcoal text-orange' },
  brick: { card: 'bg-brick text-offwhite', disc: 'bg-[#9c3a31]', btn: 'bg-orange text-charcoal hover:bg-offwhite', sub: 'text-offwhite/75', tag: 'bg-orange text-charcoal' },
  cream: { card: 'bg-cream text-charcoal', disc: 'bg-[#efdcc0]', btn: 'bg-charcoal text-offwhite hover:bg-brick', sub: 'text-charcoal/70', tag: 'bg-brick text-offwhite' },
};

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  const { openProduct } = useProductModal();
  const [added, setAdded] = useState(false);
  const ui = useUI();
  const visualRef = useRef<HTMLSpanElement>(null);
  const t = theme[product.accent];

  const onAdd = () => {
    add(productItem(product));
    ui.flyToCart(visualRef.current, product.layers);
    ui.play('pop');
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6 ${t.card}`}
      aria-labelledby={`p-${product.id}`}
    >
      <div className="flex items-start justify-between">
        <span className="display text-2xl opacity-60">{String(index + 1).padStart(2, '0')}</span>
        {product.tag && <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${t.tag}`}>{product.tag}</span>}
      </div>

      <button type="button" onClick={() => openProduct(product.id)} className="relative mx-auto my-4 block w-[82%] rounded-2xl" aria-label={`Voir les détails du ${product.name}`}>
        <span aria-hidden className={`absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500 group-hover:scale-110 ${t.disc}`} />
        <span ref={visualRef} data-cursor="Voir" className="relative block transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-3">
          <ProductVisual product={product} />
        </span>
      </button>

      <div className="mt-auto">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${t.sub}`}>{product.tagline}</p>
            <h3 id={`p-${product.id}`} className="display mt-1 text-[clamp(2rem,3.2vw,2.75rem)]">{product.name}</h3>
          </div>
          <p className="display shrink-0 text-3xl">{euro(product.price)}</p>
        </div>
        <p className={`mt-2 line-clamp-2 text-sm ${t.sub}`}>{product.ingredients.join(' · ')}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onAdd} className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[0.78rem] font-bold uppercase tracking-[0.08em] transition active:scale-[0.97] ${t.btn}`}>
            {added ? <><Check className="h-4 w-4" aria-hidden /> Ajouté</> : <><Plus className="h-4 w-4" aria-hidden /> Ajouter au panier</>}
          </button>
          <button type="button" onClick={() => openProduct(product.id)} className="h-12 rounded-full border-2 border-current px-5 text-[0.78rem] font-bold uppercase tracking-[0.08em] transition hover:bg-current/10 active:scale-[0.97]">
            Détails<span className="sr-only"> du {product.name}</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
