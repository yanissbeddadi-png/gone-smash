import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const v: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: d, ease: [0.2, 0.8, 0.2, 1] } }),
};

export function Reveal({ children, delay = 0, className = '', as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'p' | 'span' }) {
  const M = motion[as];
  return (
    <M className={className} variants={v} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }} custom={delay}>
      {children}
    </M>
  );
}

const line: Variants = {
  hidden: { y: '105%' },
  show: (i: number) => ({ y: '0%', transition: { duration: 0.9, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] } }),
};

/**
 * Titre XXL dont chaque ligne monte depuis un masque.
 * Le déclencheur « in view » est porté par le titre (jamais rogné) et non par les lignes
 * masquées, invisibles pour l'IntersectionObserver tant qu'elles sont hors du masque.
 */
export function SplitTitle({ lines, className = '', as = 'h2' }: { lines: ReactNode[]; className?: string; as?: 'h1' | 'h2' | 'h3' }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {lines.map((l, i) => (
        <span key={i} className="-mt-[0.14em] block overflow-hidden pb-[0.04em] pt-[0.14em]">
          <motion.span className="block" variants={line} custom={i}>
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
