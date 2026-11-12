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
}

export function BurgerStack({ layers, mode = 'none', seed = 1, shadow = true, className = '', label }: Props) {
  const items = layers.map((layer, i) => {
    const m = LAYER_META[layer.kind];
    const style = {
      aspectRatio: `${VBW} / ${m.h}`,
      marginBottom: i === 0 ? 0 : `-${((m.overlap / VBW) * 100).toFixed(3)}%`,
      zIndex: i + 1,
      ['--i' as string]: i,
    };
    const inner = (
      <div className="burger-spread h-full w-full">
        <BurgerLayer layer={layer} seed={seed} />
      </div>
    );
    if (mode === 'none') return <div key={layer.id} className="relative w-full" style={style}>{inner}</div>;
    if (mode === 'stagger')
      return (
        <motion.div
          key={layer.id}
          className="relative w-full"
          style={style}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.09, type: 'spring', stiffness: 260, damping: 18 }}
        >
          {inner}
        </motion.div>
      );
    return (
      <motion.div
        key={layer.id}
        layout="position"
        className="relative w-full"
        style={style}
        initial={{ opacity: 0, y: -90, scale: 1.04 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, rotate: 6, transition: { duration: 0.22 } }}
        transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.8 }}
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
