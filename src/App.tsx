import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Check, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { BurgerStack } from './components/burger/BurgerStack';
import { LAYER_META } from './components/burger/BurgerLayer';
import { OpenBadge } from './components/OpenBadge';
import { OrderSheet } from './components/OrderSheet';
import { Sides } from './components/Sides';
import { Logo } from './components/ui/Brand';
import { Button } from './components/ui/Button';
import { Wheel } from './components/Wheel';
import { stepIndex, steps, type Option, type SideKind, type Step, type StepId } from './data/simple';
import type { Layer } from './data/types';
import { useOrder } from './hooks/useOrder';
import { euro } from './utils/format';
import { playSound } from './utils/sound';

const SOUND_KEY = 'gonesmash.sound.v1';
const LG = '(min-width: 1024px)';
const useLg = () => useSyncExternalStore(
  (cb) => { const m = matchMedia(LG); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); },
  () => matchMedia(LG).matches,
);
const stepOfLayer = (l: Layer) => stepIndex(l.id.split('-')[0] as StepId);

export default function App() {
  const order = useOrder();
  const lg = useLg();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [pops, setPops] = useState<{ id: number; text: string; x: number }[]>([]);
  const [sound, setSound] = useState(() => { try { return localStorage.getItem(SOUND_KEY) === '1'; } catch { return false; } });
  const n = useRef(0);

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    try { localStorage.setItem(SOUND_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    if (v) playSound('pop');
  };

  const choose = useCallback((s: Step, o: Option) => {
    order.choose(s.id, o.id);
    setMsg(o.id === 'none' ? `Sans ${s.label.toLowerCase()}` : `${o.label} ajouté`);
    if (o.price > 0) {
      const id = ++n.current;
      setPops((p) => [...p, { id, text: `+${euro(o.price)}`, x: (Math.random() - 0.5) * 120 }]);
      window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
    }
    if (sound) { playSound('tick'); if (o.id !== 'none') window.setTimeout(() => playSound('drop'), 120); }
  }, [order, sound]);

  const goTo = useCallback((i: number) => { order.goTo(i); if (sound) playSound('tick'); }, [order, sound]);
  const pickSide = useCallback((k: SideKind) => goTo(steps.findIndex((s) => s.side === k)), [goTo]);
  const labelOf = useCallback((l: Layer) => `Changer : ${steps[stepOfLayer(l)]?.label.toLowerCase() ?? 'couche'}`, []);
  const reset = useCallback(() => { order.reset(); setMsg('Nouveau burger'); }, [order]);

  // le burger rétrécit pour toujours tenir dans la scène
  const ratio = useMemo(() => order.layers.reduce((a, l, i) => a + LAYER_META[l.kind].h - (i ? LAYER_META[l.kind].overlap : 0), 0) / 420, [order.layers]);

  const wheel = <Wheel step={order.step} choices={order.choices} side={lg} onChoose={choose} onOrder={() => setOpen(true)} onReset={reset} />;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative flex min-h-[100svh] flex-col overflow-x-clip bg-charcoal text-offwhite [--D:min(100vw,34rem)] lg:[--D:min(calc(100svh-11rem),52rem)]">
        <header className="container-x flex h-16 items-center justify-between gap-3 sm:h-20">
          <Logo className="text-[1.5rem] sm:text-[1.8rem]" />
          <div className="flex items-center gap-2">
            <OpenBadge className="hidden sm:inline-flex" />
            {order.ready && (
              <button type="button" onClick={reset} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-brick" aria-label="Recommencer"><RotateCcw className="h-5 w-5" aria-hidden /></button>
            )}
            <button type="button" onClick={toggleSound} aria-pressed={sound} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={sound ? 'Couper les sons' : 'Activer les sons'}>
              {sound ? <Volume2 className="h-5 w-5" aria-hidden /> : <VolumeX className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col pb-20 lg:pr-[calc(var(--D)/2+1rem)]">
          <h1 className="sr-only">GONE SMASH — compose et commande ton smash burger</h1>

          <nav aria-label="Étapes" className="container-x">
            <ol className="flex items-center justify-center gap-0.5 sm:gap-2">
              {steps.map((s, i) => {
                const cur = order.step === i;
                const done = order.choices[s.id] !== undefined;
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => goTo(i)} disabled={!order.ready && i > 0} aria-current={cur ? 'step' : undefined}
                      aria-label={`Étape ${i + 1} : ${s.label}${done ? ', choisie' : ''}`}
                      className={`flex h-9 items-center gap-1.5 rounded-full px-1 text-xs font-bold uppercase transition disabled:opacity-30 sm:px-3 sm:tracking-wider ${cur ? 'bg-orange text-charcoal' : done ? 'bg-white/10 text-offwhite hover:bg-white/20' : 'text-offwhite/70 hover:bg-white/10'}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full ${cur ? 'bg-charcoal text-orange' : 'bg-white/10'}`}>{done && !cur ? <Check className="h-3 w-3" aria-hidden /> : i + 1}</span>
                      <span className={cur ? '' : 'hidden xl:inline'}>{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <section aria-label="Ton burger" className="container-x relative min-h-[220px] flex-1">
            <div className="absolute inset-0 [container-type:size]">
            <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square h-[90%] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
            <div className="absolute inset-x-0 bottom-[7%] top-[5%] flex items-end justify-center">
              <motion.div layout className="w-full" style={{ maxWidth: `min(52cqw, 62cqh, calc(84cqh / ${ratio.toFixed(3)}))` }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                <BurgerStack layers={order.layers} mode="live" seed={5} onLayerClick={(l) => goTo(stepOfLayer(l))} layerLabel={labelOf} />
              </motion.div>
            </div>
            <div className="absolute inset-x-[max(0px,calc(50%-45cqh))] bottom-[5%] top-0">
              <Sides sides={order.sides} onPick={pickSide} />
            </div>
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
            {!order.ready && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 top-[6%] flex justify-center">
                <span className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-offwhite shadow-lg sm:text-sm">Choisis ta viande sur la roulette</span>
              </motion.p>
            )}
            </div>
            <p className="sr-only" aria-live="polite">{msg}</p>
          </section>

          {!lg && <div className="relative h-[calc(var(--D)/2+0.75rem)] overflow-hidden">{wheel}</div>}
        </main>

        {lg && <div className="fixed bottom-20 right-0 top-20 z-10 w-[calc(var(--D)/2+1rem)] overflow-hidden">{wheel}</div>}

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-charcoal/90 backdrop-blur-xl">
          <div className="container-x flex h-20 items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-offwhite/60">Total · démo</p>
              <motion.p key={order.total} initial={{ scale: 1.25, color: '#F4A340' }} animate={{ scale: 1, color: '#FAF8F3' }} className="display origin-left text-4xl tabular-nums" aria-live="polite">
                {euro(order.total)}
              </motion.p>
            </div>
            <Button size="lg" onClick={() => setOpen(true)} disabled={!order.ready} className="!px-6 sm:!px-10">Commander</Button>
          </div>
        </div>

        <OrderSheet open={open} onClose={() => setOpen(false)} order={order} />
      </div>
    </MotionConfig>
  );
}
