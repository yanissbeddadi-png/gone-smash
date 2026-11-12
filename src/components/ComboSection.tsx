import { ArrowRight, Check } from 'lucide-react';
import { combos } from '../data/combos';
import { getProduct, minPrice } from '../data/products';
import { useProductModal } from '../hooks/useProductModal';
import { euro, round2 } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { Cookie, Cup, Fries } from './burger/Floaties';
import { Reveal, SplitTitle } from './ui/Reveal';

const burger = getProduct('le-gone')!;

export function ComboSection() {
  const { openProduct } = useProductModal();
  return (
    <section id="menus" className="relative bg-cream py-24 text-charcoal sm:py-32" aria-labelledby="menus-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-brick"><span className="h-px w-10 bg-brick" />Les formules</p>
            <SplitTitle lines={['PASSE-LE', 'EN MENU.']} className="display text-[clamp(3.4rem,10vw,8.5rem)]" />
          </div>
          <p className="max-w-sm text-charcoal/70">Frites maison coupées chaque matin, boissons fraîches, desserts de quartier. Choisis ta formule, puis ton burger.</p>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {combos.map((c, i) => {
            const dark = !!c.highlight;
            return (
              <Reveal as="li" key={c.id} delay={i * 0.1} className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 ${dark ? 'bg-charcoal text-offwhite md:-my-4' : 'bg-offwhite'}`}>
                {dark && <span className="absolute right-5 top-5 rounded-full bg-orange px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-charcoal">Recommandé</span>}
                <p className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? 'text-orange' : 'text-brick'}`}>{c.short}</p>
                <h3 className="display mt-2 text-5xl">{c.name}</h3>
                <div className="relative my-6 flex h-48 items-end justify-center gap-1 transition-transform duration-500 group-hover:scale-[1.04]" aria-hidden>
                  <span aria-hidden className={`absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full ${dark ? 'bg-brick' : 'bg-orange/80'}`} />
                  <Fries large={c.id === 'gourmand'} className={`relative z-0 -mr-4 ${c.id === 'gourmand' ? 'h-40' : 'h-32'} w-auto -rotate-6`} />
                  <div className="relative z-10 w-36"><BurgerStack layers={burger.layers} seed={i + 1} shadow={false} /></div>
                  <Cup className="relative z-0 -ml-3 h-32 w-auto rotate-6" />
                  {c.id === 'gone' && <Cookie className="absolute bottom-0 right-2 z-20 h-14 w-14" />}
                </div>
                <ul className="space-y-2">
                  {c.includes.map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 ${dark ? 'text-orange' : 'text-brick'}`} strokeWidth={3} aria-hidden /> {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-end justify-between border-t border-current/10 pt-5">
                  <div>
                    <p className="display text-4xl">+{euro(c.supplement)}</p>
                    <p className={`text-xs ${dark ? 'text-offwhite/60' : 'text-charcoal/75'}`}>soit dès {euro(round2(minPrice + c.supplement))} avec le burger</p>
                  </div>
                </div>
                <button type="button" onClick={() => openProduct(burger.id, c.id, true)} className={`mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full text-[0.78rem] font-bold uppercase tracking-[0.08em] transition active:scale-[0.97] ${dark ? 'bg-orange text-charcoal hover:bg-offwhite' : 'bg-charcoal text-offwhite hover:bg-brick'}`}>
                  Choisir ce menu <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-8 text-center text-xs text-charcoal/70">Prix de démonstration.</p>
      </div>
    </section>
  );
}
