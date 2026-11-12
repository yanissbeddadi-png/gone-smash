import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ChefHat, MousePointer2 } from 'lucide-react';
import { useRef } from 'react';
import { brand } from '../data/brand';
import { getProduct, minPrice } from '../data/products';
import { useMedia } from '../hooks/useMedia';
import { euro } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { ExplodedBurger } from './burger/ExplodedBurger';
import { CheeseSquare, OnionRing, PickleSlice, Sesame, TomatoSlice } from './burger/Floaties';
import { LyonBadge } from './ui/Brand';
import { LinkButton } from './ui/Button';
import { Marquee } from './ui/Marquee';

const hero = getProduct('le-double-trouble')!;
const heroLabel = 'Illustration d’un smash burger double steak, double cheddar, bacon et pickles';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia('(min-width: 1024px)');
  /** Séquence « anatomie » : desktop uniquement, désactivée si animations réduites */
  const explode = desktop && !reduce;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: explode ? ['start start', 'end end'] : ['start start', 'end start'] });
  const k = reduce ? 0 : 1;

  // mobile / sans séquence : parallaxe simple
  const yBurger = useTransform(p, [0, 1], [0, 160 * k]);
  const rot = useTransform(p, [0, 1], [0, -6 * k]);
  const yFast = useTransform(p, [0, 1], [0, -260 * k]);
  const ySlow = useTransform(p, [0, 1], [0, -120 * k]);
  const yText = useTransform(p, [0, 1], [0, 90 * k]);

  // desktop : le titre s'efface, le burger se centre puis s'éclate
  const fade = useTransform(p, [0.04, 0.3], [1, 0]);
  const textX = useTransform(p, [0.04, 0.3], ['0vw', '-6vw']);
  const centerX = useTransform(p, [0.04, 0.4], ['0vw', '-24vw']);
  const scale = useTransform(p, [0.04, 0.45], [1, 0.6]);
  const caption = useTransform(p, [0.55, 0.7], [0, 1]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);
  const floatOut = useTransform(p, [0.04, 0.25], [1, 0]);

  const floatAnim = (d: number) => (reduce ? {} : { animate: { y: [0, -14, 0], rotate: [0, 8, 0] }, transition: { duration: 6 + d, repeat: Infinity, ease: 'easeInOut' as const } });

  return (
    <section id="top" ref={ref} className={`relative isolate bg-charcoal ${explode ? 'h-[230vh]' : ''}`} aria-labelledby="hero-title">
      <div className={`grain relative flex flex-col overflow-hidden pt-20 sm:pt-24 ${explode ? 'sticky top-0 h-screen' : 'min-h-[100svh]'}`}>
        {/* halo & typographie fantôme */}
        <motion.div aria-hidden style={explode ? { x: centerX } : undefined} className="pointer-events-none absolute right-[-30vw] top-[58svh] -z-10 h-[100vw] w-[100vw] rounded-full bg-orange/95 lg:right-[-8vw] lg:top-[10vh] lg:h-[62vw] lg:w-[62vw]" />
        <div aria-hidden className="pointer-events-none absolute right-[-10vw] top-[66svh] -z-10 h-[60vw] w-[60vw] rounded-full border border-charcoal/20 lg:right-[4vw] lg:top-[22vh] lg:h-[38vw] lg:w-[38vw]" />
        <span aria-hidden className="display text-stroke pointer-events-none absolute -bottom-[3vw] left-[-1vw] -z-10 select-none whitespace-nowrap text-[26vw] text-white/[0.06]">SMASH</span>

        {explode && (
          <motion.p style={{ opacity: caption }} className="container-x pointer-events-none absolute inset-x-0 top-28 z-30" aria-hidden>
            <span className="eyebrow text-orange">Anatomie d’un smash</span>
            <span className="display mt-2 block max-w-[22vw] text-[clamp(2.4rem,4vw,4.2rem)] text-offwhite">{hero.name}</span>
            <span className="display block text-[clamp(1.6rem,2.4vw,2.4rem)] text-orange">{euro(hero.price)}</span>
          </motion.p>
        )}

        <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-6 pb-10 lg:grid-cols-12 lg:pb-16">
          <motion.div style={explode ? { opacity: fade, x: textX } : { y: yText }} className="relative z-20 lg:col-span-6">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow mb-5 text-orange">
              <ChefHat className="h-4 w-4" aria-hidden /> Smash burgers · {brand.city}
            </motion.p>
            <h1 id="hero-title" className="display text-[clamp(5rem,23vw,13.5rem)] text-offwhite lg:text-[clamp(4.6rem,13vw,13.5rem)]">
              {['LYON', 'A FAIM.'].map((w, i) => (
                <span key={w} className="-mt-[0.14em] block overflow-hidden pb-[0.03em] pt-[0.14em]">
                  <motion.span className={`block ${i === 1 ? 'text-orange' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}>
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 max-w-md text-lg text-offwhite/80 sm:text-xl">
              {brand.baseline} Viande saisie à blanc, pain brioché toasté, fromage qui coule. <span className="text-offwhite">Sans détour.</span>
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#carte" size="lg">Découvrir la carte <ArrowDownRight className="h-5 w-5" aria-hidden /></LinkButton>
              <LinkButton href="#composer" size="lg" variant="outline" className="text-offwhite">Composer mon burger</LinkButton>
            </motion.div>
          </motion.div>

          <div className="relative lg:col-span-6">
            {explode ? (
              <motion.div style={{ x: centerX, scale }} className="relative z-10 mx-auto w-[min(46vw,640px)] origin-center translate-x-[4%]">
                <ExplodedBurger layers={hero.layers} progress={p} label={heroLabel} />
              </motion.div>
            ) : (
              <motion.div style={{ y: yBurger, rotate: rot }} className="relative mx-auto w-[min(88vw,560px)]">
                <BurgerStack layers={hero.layers} mode={reduce ? 'none' : 'stagger'} seed={4} label={heroLabel} />
              </motion.div>
            )}

            {/* éléments flottants */}
            <motion.div style={{ opacity: explode ? floatOut : 1 }} className="pointer-events-none absolute inset-0" aria-hidden>
              <motion.div style={{ y: yFast }} className="absolute left-[2%] top-[4%] w-[16%] lg:left-[-4%]"><motion.div {...floatAnim(0)}><PickleSlice /></motion.div></motion.div>
              <motion.div style={{ y: ySlow }} className="absolute right-[2%] top-[0%] w-[15%]"><motion.div {...floatAnim(1)}><TomatoSlice /></motion.div></motion.div>
              <motion.div style={{ y: yFast }} className="absolute bottom-[8%] right-[-2%] w-[17%]"><motion.div {...floatAnim(2)}><CheeseSquare /></motion.div></motion.div>
              <motion.div style={{ y: ySlow }} className="absolute bottom-[18%] left-[-3%] w-[13%]"><motion.div {...floatAnim(1.5)}><OnionRing /></motion.div></motion.div>
              <motion.div style={{ y: yFast }} className="absolute left-[28%] top-[-4%] w-[4%]"><Sesame /></motion.div>
              <motion.div style={{ y: ySlow }} className="absolute right-[30%] top-[6%] w-[3%] rotate-45"><Sesame /></motion.div>
            </motion.div>

            {/* sticker prix */}
            <motion.div style={{ opacity: explode ? floatOut : 1 }} className="absolute bottom-[4%] left-[0%] z-20 w-[30%] max-w-[150px] sm:left-[6%]">
              <motion.a
                href="#carte"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -10 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 12 }}
                className="grid aspect-square w-full place-items-center rounded-full bg-brick text-center text-offwhite shadow-2xl ring-4 ring-charcoal"
              >
                <span className="leading-none">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em]">dès</span>
                  <span className="display block text-[clamp(1.6rem,5vw,2.6rem)]">{euro(minPrice).replace(/\s?€/, '')}€</span>
                  <span className="sr-only"> — voir la carte</span>
                </span>
              </motion.a>
            </motion.div>
            <motion.div style={{ opacity: explode ? floatOut : 1 }} className="absolute right-[0%] top-[38%] z-20 w-[24%] max-w-[130px] text-cream sm:right-[4%]">
              <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}><LyonBadge /></motion.div>
            </motion.div>
          </div>
        </div>

        {explode && (
          <motion.p style={{ opacity: hint }} className="pointer-events-none absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/70" aria-hidden>
            <MousePointer2 className="h-4 w-4 animate-bounce" /> Scrolle pour l’ouvrir
          </motion.p>
        )}

        <div className="relative z-10 -rotate-1 bg-orange py-3 text-charcoal">
          <Marquee items={['Du goût', 'Du caractère', 'Du local', 'Smashé minute', 'Made in Lyon']} />
        </div>
      </div>
    </section>
  );
}
