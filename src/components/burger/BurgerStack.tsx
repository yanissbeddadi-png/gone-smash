import { AnimatePresence, motion } from 'framer-motion';
import type { Layer } from '../../data/types';
import { BurgerLayer, LAYER_META } from './BurgerLayer';

const VBW = 420;

interface Props {
  layers: Layer[];
  /** none : statique · stagger : empilement à l'apparition · live : ajout/suppression animés */
  mode?: 'none' | 'stagger' | 'live';
  seed?: number;
  shadow?: boolean;
  className?: string;
  label?: string;
  /** Rend chaque couche (hors pains) cliquable — ex. pour la retirer */
  onLayerClick?: (layer: Layer) => void;
  layerLabel?: (layer: Layer) => string;
}

export function BurgerStack({ layers, mode = 'none', seed = 1, shadow = true, className = '', label, onLayerClick, layerLabel }: Props) {
  const items = layers.map((layer, i) => {
    const m = LAYER_META[layer.kind];
    const style = {
      aspectRatio: `${VBW} / ${m.h}`,
      marginBottom: i === 0 ? 0 : `-${((m.overlap / VBW) * 100).toFixed(3)}%`,
      zIndex: i + 1,
      ['--i' as string]: i,
    };
    const inner = (
      <div className="burger-spread pointer-events-none h-full w-full">
        <BurgerLayer layer={layer} seed={seed} />
      </div>
    );
    const clickable = !!onLayerClick && layer.kind !== 'bunTop' && layer.kind !== 'bunBottom';
    const clickProps = clickable
      ? {
          role: 'button',
          tabIndex: 0,
          'aria-label': layerLabel?.(layer) ?? 'Retirer cette couche',
          onClick: () => onLayerClick!(layer),
          onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLayerClick!(layer); } },
          className: 'relative block w-full cursor-pointer outline-none transition-[filter] hover:brightness-110 focus-visible:brightness-110 focus-visible:drop-shadow-[0_0_0_#F4A340]',
        }
      : { className: 'relative w-full' };

    if (mode === 'none') return <div key={layer.id} style={style} {...clickProps}>{inner}</div>;
    if (mode === 'stagger')
      return (
        <motion.div key={layer.id} style={style} {...clickProps}
          initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.09, type: 'spring', stiffness: 260, damping: 18 }}>
          {inner}
        </motion.div>
      );
    return (
      <motion.div
        key={layer.id}
        layout="position"
        style={style}
        {...clickProps}
        initial={{ opacity: 0, y: -260, rotate: (i % 2 ? 1 : -1) * 6, scale: 1.08 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, x: i % 2 ? 140 : -140, rotate: i % 2 ? 18 : -18, transition: { duration: 0.28 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.9 }}
      >
        {inner}
      </motion.div>
    );
  });

  return (
    <div className={`relative ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      {shadow && <div aria-hidden className="absolute -bottom-[4%] left-[6%] right-[6%] h-[9%] rounded-[50%] bg-black/40 blur-md" />}
      <div className="relative flex flex-col-reverse">
        {mode === 'live' ? <AnimatePresence initial={false} mode="popLayout">{items}</AnimatePresence> : items}
      </div>
    </div>
  );
}
