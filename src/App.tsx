import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Minus, RotateCcw, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BurgerStack } from './components/burger/BurgerStack';
import { LAYER_META } from './components/burger/BurgerLayer';
import { OpenBadge } from './components/OpenBadge';
import { OrderSheet } from './components/OrderSheet';
import { Logo } from './components/ui/Brand';
import { Button } from './components/ui/Button';
import { getItem, items, MAX_LAYERS, MAX_PER_ITEM, type Item } from './data/simple';
import type { Layer } from './data/types';
import { useStack } from './hooks/useStack';
import { euro } from './utils/format';
import { playSound } from './utils/sound';

const SOUND_KEY = 'gonesmash.sound.v1';

/** Vignette d'un aliment = la vraie couche du burger, en petit */
function Thumb({ item }: { item: Item }) {
  return (
    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-orange/15" aria-hidden>
      <span className="absolute left-[-40%] top-1/2 w-[180%] -translate-y-1/2"><BurgerStack layers={[{ id: 't', kind: item.kind, color: item.color }]} shadow={false} seed={3} /></span>
    </span>
  );
}

function ItemButton({ item, count, full, onAdd, onRemove, compact }: { item: Item; count: number; full: boolean; onAdd: () => void; onRemove: () => void; compact?: boolean }) {
  const maxed = count >= MAX_PER_ITEM || full;
  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={onAdd}
        whileTap={{ scale: 0.92 }}
        className={`group flex w-full items-center gap-3 rounded-2xl border-2 text-left transition-colors ${compact ? 'flex-col gap-1 p-2 text-center' : 'p-3 pr-4'} ${maxed ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50' : count ? 'border-orange bg-orange/10 hover:bg-orange/20' : 'border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'}`}
        aria-label={`Ajouter ${item.label}, ${euro(item.price)}${count ? `, ${count} déjà` : ''}${maxed ? ', maximum atteint' : ''}`}
      >
        <Thumb item={item} />
        <span className={`min-w-0 ${compact ? '' : 'flex-1'}`}>
          <span className={`block font-semibold leading-tight text-offwhite ${compact ? 'text-xs' : ''}`}>{item.label}</span>
          <span className={`block text-orange ${compact ? 'text-xs' : 'text-sm'}`}>+{euro(item.price)}</span>
        </span>
      </motion.button>
      <AnimatePresence>
        {count > 0 && (
          <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: [1.4, 1] }} exit={{ scale: 0 }}
            className="pointer-events-none absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-orange px-1 text-xs font-bold text-charcoal" aria-hidden>
            {count}
          </motion.span>
        )}
      </AnimatePresence>
      {count > 0 && (
        <button type="button" onClick={onRemove} className="absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-offwhite text-charcoal shadow hover:bg-brick hover:text-offwhite" aria-label={`Retirer un ${item.label}`}>
          <Minus className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

export default function App() {
  const stack = useStack();
  const [order, setOrder] = useState(false);
  const [msg, setMsg] = useState('');
  const [pops, setPops] = useState<{ id: number; text: string; x: number }[]>([]);
  const [sound, setSound] = useState(() => { try { return localStorage.getItem(SOUND_KEY) === '1'; } catch { return false; } });
  const n = useRef(0);

  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(''), 2200);
    return () => window.clearTimeout(t);
  }, [msg]);

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    try { localStorage.setItem(SOUND_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    if (v) playSound('pop');
  };

  const add = useCallback((item: Item) => {
    const r = stack.add(item.id);
    if (r === 'max-item') return setMsg(`${MAX_PER_ITEM} ${item.label.toLowerCase()} maximum`);
    if (r === 'max-total') return setMsg(`Burger plein : ${MAX_LAYERS} couches maximum`);
    const id = ++n.current;
    setPops((p) => [...p, { id, text: `+${euro(item.price)}`, x: (Math.random() - 0.5) * 120 }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
    if (sound) playSound('drop');
  }, [stack, sound]);

  const removeLayer = useCallback((l: Layer) => { stack.remove(l.id); if (sound) playSound('pop'); }, [stack, sound]);
  const labelOf = useCallback((l: Layer) => {
    const p = stack.pieces.find((x) => x.uid === l.id);
    return `Retirer ${p ? getItem(p.itemId)?.label : 'cette couche'} du burger`;
  }, [stack.pieces]);

  // le burger rétrécit pour toujours tenir dans la scène
  const ratio = useMemo(() => stack.layers.reduce((a, l, i) => a + LAYER_META[l.kind].h - (i ? LAYER_META[l.kind].overlap : 0), 0) / 420, [stack.layers]);
  const full = stack.pieces.length >= MAX_LAYERS;
  const left = items.slice(0, 5), right = items.slice(5);
  const btn = (it: Item, compact = false) => (
    <ItemButton key={it.id} item={it} count={stack.countOf(it.id)} full={full} onAdd={() => add(it)} onRemove={() => stack.removeOne(it.id)} compact={compact} />
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative flex min-h-[100svh] flex-col overflow-x-clip bg-charcoal text-offwhite">
        <header className="container-x flex h-16 items-center justify-between gap-3 sm:h-20">
          <Logo className="text-[1.5rem] sm:text-[1.8rem]" />
          <div className="flex items-center gap-2">
            <OpenBadge className="hidden sm:inline-flex" />
            <button type="button" onClick={toggleSound} aria-pressed={sound} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={sound ? 'Couper les sons' : 'Activer les sons'}>
              {sound ? <Volume2 className="h-5 w-5" aria-hidden /> : <VolumeX className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </header>

        <main className="container-x grid flex-1 grid-cols-[minmax(0,1fr)] items-center gap-4 pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] lg:gap-10">
          <h1 className="sr-only">GONE SMASH — compose et commande ton smash burger</h1>
          <div className="hidden space-y-3 lg:block">{left.map((it) => btn(it))}</div>

          <section aria-label="Ton burger" className="sticky top-0 z-20 -mx-4 bg-charcoal px-4 pb-1 pt-2 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:bg-transparent lg:p-0">
            <p className="display text-center text-[clamp(1.8rem,6vw,3.5rem)] leading-none">Monte <span className="text-orange">ton burger.</span></p>
            <div className="relative mt-2 h-[34svh] min-h-[220px] [container-type:size] sm:h-[42svh] lg:mt-3 lg:h-[min(62vh,600px)]">
              <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square h-[92%] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
              <div className="absolute inset-x-0 bottom-[6%] top-[4%] flex items-end justify-center">
                <motion.div layout className="w-full" style={{ maxWidth: `min(80cqw, calc(88cqh / ${ratio.toFixed(3)}))` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                  <BurgerStack layers={stack.layers} mode="live" seed={5} onLayerClick={removeLayer} layerLabel={labelOf} />
                </motion.div>
              </div>
              {/* +prix qui flotte */}
              <div className="pointer-events-none absolute inset-x-0 top-[8%] flex justify-center" aria-hidden>
                <AnimatePresence>
                  {pops.map((p) => (
                    <motion.span key={p.id} className="display absolute text-3xl text-offwhite drop-shadow-[0_2px_0_#171717]"
                      initial={{ opacity: 0, y: 20, x: p.x, scale: 0.6 }} animate={{ opacity: 1, y: -30, scale: 1 }} exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.5 }}>
                      {p.text}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              {stack.pieces.length === 0 && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 top-[6%] flex justify-center">
                  <span className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-offwhite shadow-lg sm:text-sm">Clique sur un aliment pour le poser</span>
                </motion.p>
              )}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 lg:mt-3">
              <button type="button" onClick={stack.undo} disabled={!stack.pieces.length} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-xs font-bold uppercase tracking-wider transition hover:bg-white/20 disabled:opacity-30">
                <RotateCcw className="h-4 w-4" aria-hidden /> Annuler
              </button>
              <button type="button" onClick={stack.clear} disabled={!stack.pieces.length} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-xs font-bold uppercase tracking-wider transition hover:bg-brick disabled:opacity-30">
                <Trash2 className="h-4 w-4" aria-hidden /> Vider
              </button>
            </div>
            <p className="mt-1 h-5 text-center text-xs font-semibold text-orange sm:text-sm" aria-live="polite">{msg || (stack.pieces.length ? 'Clique sur une couche du burger pour la retirer' : '')}</p>
          </section>

          <div className="hidden space-y-3 lg:block">{right.map((it) => btn(it))}</div>

          {/* mobile / tablette : tous les aliments sous le burger */}
          <div className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-5 lg:hidden">{items.map((it) => btn(it, true))}</div>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-charcoal/90 backdrop-blur-xl">
          <div className="container-x flex h-20 items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-offwhite/60">Total · démo</p>
              <motion.p key={stack.total} initial={{ scale: 1.25, color: '#F4A340' }} animate={{ scale: 1, color: '#FAF8F3' }} className="display origin-left text-4xl tabular-nums" aria-live="polite">
                {euro(stack.total)}
              </motion.p>
            </div>
            <Button size="lg" onClick={() => setOrder(true)} disabled={!stack.pieces.length} className="!px-6 sm:!px-10">Commander</Button>
          </div>
        </div>

        <OrderSheet open={order} onClose={() => setOrder(false)} stack={stack} />
      </div>
    </MotionConfig>
  );
}
