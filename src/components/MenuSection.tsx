import { Info } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { Reveal, SplitTitle } from './ui/Reveal';

export function MenuSection() {
  return (
    <section id="carte" className="relative bg-offwhite py-24 text-charcoal sm:py-32" aria-labelledby="carte-title">
      <div className="container-x">
        <div className="mb-12 grid items-end gap-6 lg:mb-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-brick"><span className="h-px w-10 bg-brick" />Six recettes, zéro compromis</p>
            <SplitTitle lines={['LA CARTE']} className="display text-[clamp(4rem,13vw,11rem)]" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="text-lg text-charcoal/75">Chaque burger est smashé à la commande, servi dans un pain brioché toasté. Ajoute-le tel quel ou passe-le en menu.</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-medium text-brick">
              <Info className="h-4 w-4" aria-hidden /> Carte de démonstration — recettes et prix fictifs
            </p>
          </Reveal>
        </div>
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3" aria-label="Burgers de la carte">
          {products.map((p, i) => (
            <li key={p.id} className="w-[84vw] shrink-0 snap-center sm:w-auto">
              <ProductCard product={p} index={i} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-charcoal/70 sm:hidden" aria-hidden>Fais glisser pour voir toute la carte →</p>
      </div>
    </section>
  );
}
