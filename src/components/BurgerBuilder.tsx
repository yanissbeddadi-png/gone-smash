import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Pencil, RotateCcw, ShoppingBag } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { breads, cheeses, meats, sauces, toppings } from '../data/ingredients';
import type { Layer, LayerKind } from '../data/types';
import { useBurgerBuilder } from '../hooks/useBurgerBuilder';
import { useCart } from '../hooks/useCart';
import { euro } from '../utils/format';
import { LAYER_META } from './burger/BurgerLayer';
import { BurgerStack } from './burger/BurgerStack';
import { Button } from './ui/Button';
import { SplitTitle } from './ui/Reveal';

const STEPS = ['Pain', 'Viande', 'Fromage', 'Garnitures', 'Sauce', 'Récap'] as const;

function Thumb({ kind, bun, color, count = 1 }: { kind: LayerKind; bun?: Layer['bun']; color?: string; count?: number }) {
  const layers: Layer[] = kind === 'steak' ? Array.from({ length: count }, (_, i) => ({ id: `t${i}`, kind })) : [{ id: 't', kind, bun, color }];
  return (
    <span className="flex h-12 w-14 shrink-0 items-center justify-center" aria-hidden>
      <span className="w-full">
        <BurgerStack layers={layers} shadow={false} seed={3} />
      </span>
    </span>
  );
}

function Choice({ type, name, checked, onChange, title, note, price, visual, priceLabel }: {
  type: 'radio' | 'checkbox'; name: string; checked: boolean; onChange: () => void; title: string; note?: string; price: number; visual: ReactNode; priceLabel?: string;
}) {
  return (
    <label className={`group/c relative flex min-h-[72px] cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 pr-4 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange ${checked ? 'border-orange bg-orange/10' : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]'}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {visual}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-tight text-offwhite">{title}</span>
        {note && <span className="mt-0.5 block text-xs text-offwhite/55">{note}</span>}
      </span>
      <span className="shrink-0 text-right text-sm font-semibold text-offwhite/80">{priceLabel ?? (price ? `+${euro(price)}` : 'Inclus')}</span>
      <span className={`absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-orange text-charcoal transition-transform ${checked ? 'scale-100' : 'scale-0'}`} aria-hidden>
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    </label>
  );
}

export function BurgerBuilder() {
  const b = useBurgerBuilder();
  const { add, open } = useCart();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [added, setAdded] = useState(false);

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(Math.max(0, Math.min(STEPS.length - 1, n))); };

  const ratio = useMemo(() => b.layers.reduce((a, l, i) => a + LAYER_META[l.kind].h - (i ? LAYER_META[l.kind].overlap : 0), 0) / 420, [b.layers]);

  const onAdd = () => {
    const n = name.trim().slice(0, 32);
    add({ key: `${b.key}|${n}`, kind: 'custom', name: n ? `« ${n} »` : 'Mon burger composé', unitPrice: b.price.total, details: b.details, layers: b.layers });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const panel = (() => {
    switch (step) {
      case 0:
        return breads.map((x) => <Choice key={x.id} type="radio" name="bread" checked={b.state.bread === x.id} onChange={() => b.set('bread', x.id)} title={x.label} note={x.note} price={x.price} visual={<Thumb kind="bunTop" bun={x.id} />} />);
      case 1:
        return meats.map((x) => <Choice key={x.id} type="radio" name="meat" checked={b.state.meat === x.id} onChange={() => b.set('meat', x.id)} title={x.label} note={x.note} price={x.price} visual={x.count ? <Thumb kind="steak" count={x.count} /> : <span className="grid h-12 w-14 place-items-center text-xs text-offwhite/40" aria-hidden>—</span>} />);
      case 2:
        return cheeses.map((x) => <Choice key={x.id} type="radio" name="cheese" checked={b.state.cheese === x.id} onChange={() => b.set('cheese', x.id)} title={x.label} note={x.note} price={x.price} visual={x.kind ? <Thumb kind={x.kind} /> : <span className="grid h-12 w-14 place-items-center text-xs text-offwhite/40" aria-hidden>—</span>} />);
      case 3:
        return toppings.map((x) => <Choice key={x.id} type="checkbox" name="toppings" checked={b.state.toppings.includes(x.id)} onChange={() => b.toggleTopping(x.id)} title={x.label} price={x.price} visual={<Thumb kind={x.kind} />} />);
      case 4:
        return sauces.map((x) => <Choice key={x.id} type="radio" name="sauce" checked={b.state.sauce === x.id} onChange={() => b.set('sauce', x.id)} title={x.label} note={x.note} price={x.price} visual={<span className="grid h-12 w-14 place-items-center" aria-hidden><span className="h-9 w-9 rounded-[50%_50%_50%_8%] rotate-45 ring-2 ring-white/20" style={{ background: x.color }} /></span>} />);
      default:
        return (
          <div className="space-y-3 sm:col-span-2">
            <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
              {[
                ['Pain', breads.find((x) => x.id === b.state.bread)!.label, 0],
                ['Viande', meats.find((x) => x.id === b.state.meat)!.label, 1],
                ['Fromage', cheeses.find((x) => x.id === b.state.cheese)!.label, 2],
                ['Garnitures', b.state.toppings.length ? toppings.filter((t) => b.state.toppings.includes(t.id)).map((t) => t.label).join(', ') : 'Aucune', 3],
                ['Sauce', sauces.find((x) => x.id === b.state.sauce)!.label, 4],
              ].map(([k, v, s]) => (
                <li key={k as string} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-24 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-orange">{k}</span>
                  <span className="flex-1 text-sm text-offwhite">{v}</span>
                  <button type="button" onClick={() => go(s as number)} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/15" aria-label={`Modifier : ${k}`}>
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <label className="block text-sm font-semibold text-offwhite/80">
              Donne-lui un nom <span className="font-normal text-offwhite/60">(optionnel)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="Ex. Le Fourvière" className="mt-1 h-12 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 text-offwhite placeholder:text-offwhite/30 focus:border-orange focus:outline-none" />
            </label>
          </div>
        );
    }
  })();

  const addBtn = (cls = '') => (
    <Button onClick={onAdd} size="lg" className={`w-full ${cls}`}>
      {added ? <><Check className="h-5 w-5" aria-hidden /> Ajouté au panier</> : <><ShoppingBag className="h-5 w-5" aria-hidden /> Ajouter mon burger au panier</>}
    </Button>
  );

  return (
    <section id="composer" className="grain relative overflow-hidden bg-charcoal-800 py-24 text-offwhite sm:py-32" aria-labelledby="builder-title">
      <div className="container-x">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-orange"><span className="h-px w-10 bg-orange" />Le configurateur</p>
            <SplitTitle lines={['COMPOSE', <span key="t" className="text-orange">TON BURGER.</span>]} className="display text-[clamp(3.4rem,10vw,8.5rem)]" />
          </div>
          <p className="max-w-sm text-offwhite/70">Six étapes, des milliers de combinaisons. Ton burger se construit sous tes yeux, couche par couche, et le prix suit en temps réel.</p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
          {/* SCÈNE — burger visuel (au centre sur desktop, en haut et collant sur mobile) */}
          <div className="sticky top-16 z-10 -mx-4 bg-charcoal-800/95 px-4 pb-3 pt-2 backdrop-blur sm:mx-0 sm:px-0 lg:static lg:order-2 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
            <div className="relative overflow-hidden rounded-3xl bg-charcoal ring-1 ring-white/5 lg:sticky lg:top-24">
              <div aria-hidden className="absolute left-1/2 top-[54%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="relative h-[32svh] min-h-[220px] [container-type:size] sm:h-[42svh] lg:h-[min(68vh,640px)]">
                <div className="absolute inset-x-0 bottom-[10%] top-[6%] flex items-end justify-center">
                  <motion.div layout className="w-full" style={{ maxWidth: `min(78cqw, calc(84cqh / ${ratio.toFixed(3)}))` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                    <BurgerStack layers={b.layers} mode="live" seed={5} label={`Aperçu de ton burger : ${b.details.join(', ')}`} />
                  </motion.div>
                </div>
              </div>
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-charcoal/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-orange backdrop-blur">Étape {step + 1}/6</span>
              </div>
              <button type="button" onClick={() => { b.reset(); setName(''); go(0); }} className="absolute right-3 top-3 inline-flex h-10 items-center gap-2 rounded-full bg-charcoal/80 px-3 text-xs font-bold uppercase tracking-wider text-offwhite backdrop-blur transition hover:bg-brick" aria-label="Réinitialiser la composition">
                <RotateCcw className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Réinitialiser</span>
              </button>
              <div className="absolute bottom-3 right-3 rounded-2xl bg-offwhite px-4 py-2 text-charcoal lg:hidden" aria-hidden>
                <motion.span key={b.price.total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="display block text-2xl">{euro(b.price.total)}</motion.span>
              </div>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="lg:order-1">
            <nav aria-label="Étapes du configurateur" className="no-scrollbar -mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <ol className="flex min-w-max gap-1.5 lg:grid lg:min-w-0 lg:grid-cols-3">
                {STEPS.map((s, i) => (
                  <li key={s}>
                    <button type="button" onClick={() => go(i)} aria-current={i === step ? 'step' : undefined} className={`flex h-10 w-full items-center gap-2 rounded-full px-3.5 text-xs font-bold uppercase tracking-[0.1em] transition ${i === step ? 'bg-orange text-charcoal' : i < step ? 'bg-white/10 text-offwhite' : 'bg-white/[0.04] text-offwhite/55 hover:text-offwhite'}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.65rem] ${i === step ? 'bg-charcoal text-orange' : 'bg-white/10'}`}>{i < step ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> : i + 1}</span>
                      {s}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.fieldset
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <legend className="mb-1 display text-3xl">
                    {['Choisis ton pain', 'Choisis ta viande', 'Choisis ton fromage', 'Ajoute tes garnitures', 'Choisis ta sauce', 'Ton burger est prêt'][step]}
                  </legend>
                  <p className="mb-4 text-sm text-offwhite/55">{['Toasté minute, face coupée.', 'Bœuf français haché du jour, smashé à la commande.', 'Posé sur la viande, encore sur la plaque.', 'Plusieurs choix possibles.', 'Une sauce incluse.', 'Vérifie, nomme-le, ajoute-le.'][step]}</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">{panel}</div>
                </motion.fieldset>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => go(step - 1)} disabled={step === 0} className="border border-white/15 text-offwhite" aria-label="Étape précédente">
                <ArrowLeft className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Retour</span>
              </Button>
              {step < STEPS.length - 1 ? (
                <Button variant="light" onClick={() => go(step + 1)} className="flex-1">
                  {STEPS[step + 1] === 'Récap' ? 'Voir le récap' : `Suivant : ${STEPS[step + 1]}`} <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <div className="flex-1 lg:hidden">{addBtn('!h-12 !text-[0.72rem] !px-3')}</div>
              )}
            </div>
          </div>

          {/* RÉCAP & PRIX */}
          <aside className="lg:order-3" aria-label="Récapitulatif et prix">
            <div className="rounded-3xl bg-offwhite p-6 text-charcoal lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brick">Ton burger</p>
              <ul className="mt-4 space-y-2 text-sm" aria-label="Détail du prix">
                <AnimatePresence initial={false}>
                  {b.price.lines.map((l) => (
                    <motion.li key={l.label} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex justify-between gap-4">
                      <span className="text-charcoal/75">{l.label}</span>
                      <span className="font-semibold tabular-nums">{l.price ? euro(l.price) : 'Inclus'}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="mt-5 flex items-end justify-between border-t-2 border-dashed border-charcoal/15 pt-4">
                <span className="text-sm font-bold uppercase tracking-[0.14em]">Total</span>
                <motion.span key={b.price.total} initial={{ scale: 1.25, color: '#8B3028' }} animate={{ scale: 1, color: '#171717' }} className="display text-5xl tabular-nums" aria-live="polite">
                  {euro(b.price.total)}
                </motion.span>
              </div>
              <div className="mt-5 hidden lg:block">{addBtn()}</div>
              <div className="mt-3 lg:hidden">{step < STEPS.length - 1 && addBtn('!h-12 !text-[0.72rem]')}</div>
              {added && <button type="button" onClick={open} className="mt-3 w-full text-center text-sm font-semibold text-brick underline underline-offset-4">Voir le panier</button>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
