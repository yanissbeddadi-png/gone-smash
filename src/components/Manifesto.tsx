import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { Layer } from '../data/types';
import { BurgerStack } from './burger/BurgerStack';
import { Reveal, SplitTitle } from './ui/Reveal';

const macros: { n: string; title: string; text: string; layers: Layer[]; bg: string; zoom: string; alt: string }[] = [
  { n: '01', title: 'La croûte', text: 'Boule de bœuf écrasée sur plaque brûlante : réaction de Maillard, bords dentelés, jus gardé à cœur.', layers: [{ id: 's', kind: 'steak' }], bg: 'bg-brick', zoom: 'w-[340%] left-[-120%] top-[36%]', alt: 'Gros plan illustré sur la croûte caramélisée d’un steak smashé' },
  { n: '02', title: 'Le fondant', text: 'Le fromage est posé sur la viande encore sur la plaque, il fond et nappe chaque aspérité.', layers: [{ id: 's', kind: 'steak' }, { id: 'c', kind: 'cheddar' }], bg: 'bg-orange', zoom: 'w-[300%] left-[-40%] top-[16%]', alt: 'Gros plan illustré sur du cheddar fondu coulant sur un steak' },
  { n: '03', title: 'Le moelleux', text: 'Pain brioché beurré et toasté face coupée : croustillant dehors, moelleux dedans, il tient la route.', layers: [{ id: 'b', kind: 'bunTop', bun: 'brioche' }], bg: 'bg-cream', zoom: 'w-[230%] left-[-50%] top-[8%]', alt: 'Gros plan illustré sur la texture dorée d’un pain brioché' },
];

function Macro({ m, i }: { m: (typeof macros)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const s = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.12, 1]);
  return (
    <Reveal delay={i * 0.12} className={`${i === 1 ? 'md:mt-24' : i === 2 ? 'md:mt-10' : ''}`}>
      <figure>
        <div ref={ref} className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${m.bg}`} role="img" aria-label={m.alt}>
          <motion.div style={{ y, scale: s }} className={`absolute ${m.zoom}`}>
            <BurgerStack layers={m.layers} shadow={false} seed={i + 2} />
          </motion.div>
          <span className="display absolute left-5 top-4 text-6xl text-charcoal/80 mix-blend-multiply">{m.n}</span>
        </div>
        <figcaption className="mt-5">
          <h3 className="display text-3xl text-offwhite">{m.title}</h3>
          <p className="mt-2 max-w-xs text-offwhite/70">{m.text}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['8%', '-22%']);
  return (
    <section id="histoire" ref={ref} className="grain relative overflow-hidden bg-charcoal py-24 sm:py-32" aria-labelledby="manifeste-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6 text-orange"><span className="h-px w-10 bg-orange" />Manifeste</p>
            <SplitTitle lines={['PAS DE BLABLA.', <span key="q" className="text-orange">QUE DU SMASH.</span>]} className="display text-[clamp(3.2rem,9vw,8.5rem)] text-offwhite" />
          </div>
          <Reveal delay={0.2} className="self-end lg:col-span-4">
            <p className="text-lg leading-relaxed text-offwhite/80">
              Une viande saisie à haute température, un pain brioché légèrement toasté, du fromage fondant et des recettes qui ne font aucun compromis.{' '}
              <strong className="font-semibold text-offwhite">GONE SMASH, c’est notre vision du burger : généreux, authentique et sans détour.</strong>
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6 lg:mt-24 lg:gap-10">
          {macros.map((m, i) => <Macro key={m.n} m={m} i={i} />)}
        </div>
      </div>
      <motion.p aria-hidden style={{ x }} className="display text-stroke mt-24 whitespace-nowrap text-[18vw] leading-none text-white/10">
        Saisi · Smashé · Servi
      </motion.p>
    </section>
  );
}
