import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DONE, steps, type Option, type Step } from '../data/simple';
import type { Choices } from '../hooks/useOrder';
import { euro } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { SideArt } from './Sides';

interface Props {
  step: number;
  choices: Choices;
  /** true : demi-roue collée au bord droit (desktop). false : demi-roue qui monte du bas (mobile). */
  side: boolean;
  onChoose: (s: Step, o: Option) => void;
  onOrder: () => void;
  onReset: () => void;
}

const R = 40; // rayon des choix, en % du disque

function Thumb({ step, o }: { step: Step; o: Option }) {
  if (o.id === 'none') return <X className="h-1/2 w-1/2 text-offwhite/60" aria-hidden />;
  if (step.side) return <span className="h-[78%] w-[78%]"><SideArt kind={step.side} art={o.art!} /></span>;
  return (
    <span className="absolute left-[-30%] top-1/2 w-[160%] -translate-y-1/2">
      <BurgerStack layers={o.layers!.map((l, k) => ({ id: `t${k}`, kind: l.kind, color: l.color }))} shadow={false} seed={3} />
    </span>
  );
}

/** Une moitié de roue : les choix d'une étape posés sur l'arc */
function Half({ index, angle, side, rot, active, choices, onChoose, onOrder, onReset }: {
  index: number; side: boolean; angle: number; rot: MotionValue<number>; active: boolean; choices: Choices;
  onChoose: Props['onChoose']; onOrder: () => void; onReset: () => void;
}) {
  const upright = useTransform(rot, (v) => -v);
  const at = (deg: number, r = R) => ({ left: `${50 + r * Math.cos((deg * Math.PI) / 180)}%`, top: `${50 + r * Math.sin((deg * Math.PI) / 180)}%` });
  const hide = active ? {} : { 'aria-hidden': true as const, tabIndex: -1 };

  if (index >= DONE)
    return (
      <div className={active ? '' : 'pointer-events-none'} aria-hidden={!active || undefined}>
        <motion.div style={{ ...at(angle, side ? 32 : 30), x: '-50%', y: '-50%', rotate: upright }} className="absolute flex w-[28%] flex-col items-center gap-2 text-center">
          <p className="display text-[calc(var(--D)*0.045)] leading-none">C’est prêt !</p>
          <button type="button" onClick={onOrder} {...hide} className="w-full rounded-full bg-orange px-4 py-3 text-sm font-bold uppercase tracking-wider text-charcoal hover:bg-orange-600">Commander</button>
          <button type="button" onClick={onReset} {...hide} className="inline-flex items-center gap-1 text-xs font-semibold text-offwhite/70 underline-offset-4 hover:underline">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Recommencer
          </button>
        </motion.div>
      </div>
    );

  const step = steps[index];
  const n = step.options.length;
  const spread = Math.min(side ? 168 : 140, (n - 1) * 28);
  return (
    <div role="group" aria-label={`Étape ${index + 1} sur ${DONE} : ${step.label}`} aria-hidden={!active || undefined} className={active ? '' : 'pointer-events-none'} data-current={active || undefined}>
      {step.options.map((o, j) => {
        const deg = angle + (n > 1 ? spread * (j / (n - 1) - 0.5) : 0);
        const picked = choices[step.id] === o.id;
        return (
          <motion.button
            key={o.id}
            type="button"
            {...hide}
            onClick={() => onChoose(step, o)}
            aria-pressed={picked}
            aria-label={`${o.id === 'none' ? `Sans ${step.label.toLowerCase()}` : o.label}${o.price ? `, ${euro(o.price)}` : ''}`}
            style={{ ...at(deg), x: '-50%', y: '-50%', rotate: upright }}
            whileTap={{ scale: 0.9 }}
            className="group absolute flex w-[calc(var(--D)*0.16)] flex-col items-center text-center lg:w-[calc(var(--D)*0.15)]"
          >
            <span className={`relative grid aspect-square w-[80%] place-items-center overflow-hidden rounded-full border-2 transition ${picked ? 'border-orange bg-orange/25' : 'border-white/15 bg-white/[0.06] group-hover:border-orange/70 group-hover:bg-white/10'}`}>
              <Thumb step={step} o={o} />
              {picked && <span className="absolute right-[8%] top-[8%] grid h-5 w-5 place-items-center rounded-full bg-orange text-charcoal"><Check className="h-3 w-3" aria-hidden /></span>}
            </span>
            <span className="mt-1 block hyphens-auto break-words text-xs font-semibold leading-tight text-offwhite" lang="fr">{o.short ?? o.label}</span>
            {o.price > 0 && <span className="block text-xs text-orange">+{euro(o.price)}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Demi-roulette : une étape visible à la fois, elle tourne d'un demi-tour à chaque choix */
export function Wheel({ step, choices, side, onChoose, onOrder, onReset }: Props) {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const root = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  // « tour » cumulé : +1 en avançant, −1 en reculant. L'étape quittée reste dessinée sur la moitié cachée.
  const [view, setView] = useState({ step, turn: 0, prev: null as null | { step: number; turn: number } });
  if (view.step !== step) setView({ step, turn: view.turn + (step > view.step ? 1 : -1), prev: { step: view.step, turn: view.turn } });

  useEffect(() => {
    const target = view.turn * 180;
    if (reduce) { rot.set(target); return; }
    const a = animate(rot, target, { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 });
    return () => a.stop();
  }, [view.turn, reduce, rot]);

  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    root.current?.querySelector<HTMLButtonElement>('[data-current] button, button:not([aria-hidden])')?.focus({ preventScroll: true });
  }, [view.step]);

  const base = side ? 180 : -90; // direction de la moitié visible
  const half = (s: number, t: number, active: boolean) => (
    <Half key={`${s}:${t}`} index={s} side={side} angle={base - t * 180} rot={rot} active={active} choices={choices}
      onChoose={(st, o) => { refocus.current = true; onChoose(st, o); }} onOrder={onOrder} onReset={() => { refocus.current = true; onReset(); }} />
  );
  const cur = steps[view.step];

  return (
    <div ref={root} className="relative h-full w-full">
      <motion.div
        style={{ rotate: rot }}
        className={`absolute aspect-square w-[var(--D)] rounded-full border border-white/10 bg-charcoal-800 shadow-[0_0_80px_rgba(0,0,0,0.6)] ${side ? 'right-[calc(var(--D)/-2)] top-1/2 -mt-[calc(var(--D)/2)]' : 'left-1/2 top-0 -ml-[calc(var(--D)/2)]'}`}
      >
        <div aria-hidden className="absolute inset-[3%] rounded-full [background:repeating-conic-gradient(rgba(244,163,64,0.55)_0_1deg,transparent_1deg_15deg)] [mask:radial-gradient(circle,transparent_64%,#000_65%,#000_67%,transparent_68%)]" />
        {view.prev && half(view.prev.step, view.prev.turn, false)}
        {half(view.step, view.turn, true)}
      </motion.div>
      {/* moyeu fixe : nom de l'étape */}
      <div aria-hidden className={`pointer-events-none absolute aspect-square w-[calc(var(--D)*0.36)] rounded-full bg-orange text-charcoal ${side ? 'right-[calc(var(--D)*-0.18)] top-1/2 -translate-y-1/2' : 'left-1/2 top-[calc(var(--D)*0.32)] -translate-x-1/2'}`}>
        <motion.div key={view.step} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className={`absolute flex flex-col items-center justify-center gap-1 text-center ${side ? 'inset-y-0 left-0 w-1/2 pl-[6%]' : 'inset-x-0 top-0 h-1/2 pt-[8%]'}`}>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal/80">{cur ? `Étape ${view.step + 1}/${DONE}` : 'Bravo'}</span>
          <span className="display text-[max(1.1rem,calc(var(--D)*0.036))] leading-none">{cur ? cur.label : 'Prêt'}</span>
        </motion.div>
      </div>
    </div>
  );
}
