import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Layer, LayerKind } from '../../data/types';
import { BurgerLayer, LAYER_META } from './BurgerLayer';

const VBW = 420;

/** Libellés « anatomie » par type de couche (1re occurrence uniquement) */
const LABELS: Partial<Record<LayerKind, [string, string]>> = {
  bunTop: ['Brioche', 'beurrée, toastée minute'],
  bacon: ['Bacon', 'grillé croustillant'],
  pickles: ['Pickles', 'croquants, acidulés'],
  cheddar: ['Cheddar affiné', 'fondu sur la plaque'],
  steak: ['Steak smashé', '90 g, croûte dentelée'],
  sauce: ['Sauce secrète', 'la recette maison'],
  bunBottom: ['Base brioche', 'face coupée toastée'],
};

function ExplodedLayer({ layer, i, n, progress, gap, label, side, intro }: {
  layer: Layer; i: number; n: number; progress: MotionValue<number>; gap: number; label?: [string, string]; side: 'left' | 'right'; intro: boolean;
}) {
  const m = LAYER_META[layer.kind];
  const y = useTransform(progress, [0.08, 0.62], [0, -i * gap]);
  const labelOpacity = useTransform(progress, [0.3 + (i / n) * 0.2, 0.55 + (i / n) * 0.2], [0, 1]);
  const labelX = useTransform(labelOpacity, [0, 1], [side === 'right' ? -16 : 16, 0]);
  return (
    <motion.div
      className="relative w-full"
      style={{ aspectRatio: `${VBW} / ${m.h}`, marginBottom: i === 0 ? 0 : `-${((m.overlap / VBW) * 100).toFixed(3)}%`, zIndex: i + 1, y }}
    >
      <motion.div
        className="h-full w-full"
        initial={intro ? { opacity: 0, y: -60 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 + i * 0.09, type: 'spring', stiffness: 260, damping: 18 }}
      >
        <BurgerLayer layer={layer} seed={4} />
      </motion.div>
      {label && (
        <motion.div
          style={{ opacity: labelOpacity, x: labelX }}
          className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-3 whitespace-nowrap ${side === 'right' ? 'left-[98%]' : 'right-[98%] flex-row-reverse text-right'}`}
          aria-hidden
        >
          <span className="h-[3px] w-[clamp(2rem,5vw,5rem)] rounded-full bg-charcoal" />
          <span className="rounded-2xl bg-charcoal px-5 py-3 leading-tight shadow-2xl">
            <span className="display block text-[clamp(1.6rem,2.4vw,2.4rem)] text-offwhite">{label[0]}</span>
            <span className="block text-[clamp(0.85rem,1.1vw,1.1rem)] text-offwhite/75">{label[1]}</span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

/** Burger dont les couches s'écartent selon `progress` (0 → 1), avec étiquettes. */
export function ExplodedBurger({ layers, progress, label }: { layers: Layer[]; progress: MotionValue<number>; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gap, setGap] = useState(40);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setGap(el.clientWidth * 0.06));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const seen = new Set<LayerKind>();
  let k = 0;
  const lift = useTransform(progress, [0.08, 0.62], [0, (layers.length - 1) * gap * 0.5]);
  return (
    <motion.div ref={ref} style={{ y: lift }} className="relative" role="img" aria-label={label}>
      <div aria-hidden className="absolute -bottom-[4%] left-[6%] right-[6%] h-[9%] rounded-[50%] bg-black/40 blur-md" />
      <div className="relative flex flex-col-reverse">
        {layers.map((l, i) => {
          const lab = !seen.has(l.kind) ? LABELS[l.kind] : undefined;
          seen.add(l.kind);
          const side = lab ? (k++ % 2 === 0 ? 'left' : 'right') : 'right';
          return <ExplodedLayer key={l.id} layer={l} i={i} n={layers.length} progress={progress} gap={gap} label={lab} side={side} intro />;
        })}
      </div>
    </motion.div>
  );
}
