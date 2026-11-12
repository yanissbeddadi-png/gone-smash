import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ChefHat } from 'lucide-react';
import { useRef } from 'react';
import { brand } from '../data/brand';
import { getProduct, minPrice } from '../data/products';
import { euro } from '../utils/format';
import { BurgerStack } from './burger/BurgerStack';
import { CheeseSquare, OnionRing, PickleSlice, Sesame, TomatoSlice } from './burger/Floaties';
import { LyonBadge } from './ui/Brand';
import { LinkButton } from './ui/Button';
import { Marquee } from './ui/Marquee';

const hero = getProduct('le-double-trouble')!;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const k = reduce ? 0 : 1;
  const yBurger = useTransform(scrollYProgress, [0, 1], [0, 160 * k]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, -6 * k]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -260 * k]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -120 * k]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 90 * k]);

  const floatAnim = (d: number) => (reduce ? {} : { animate: { y: [0, -14, 0], rotate: [0, 8, 0] }, transition: { duration: 6 + d, repeat: Infinity, ease: 'easeInOut' as const } });

  return (
    <section id="top" ref={ref} className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal pt-20 sm:pt-24" aria-labelledby="hero-title">
      {/* halo & typographie fantôme */}
      <div aria-hidden className="pointer-events-none absolute right-[-30vw] top-[58svh] -z-10 h-[100vw] w-[100vw] rounded-full bg-orange/95 lg:right-[-8vw] lg:top-[10vh] lg:h-[62vw] lg:w-[62vw]" />
      <div aria-hidden className="pointer-events-none absolute right-[-10vw] top-[66svh] -z-10 h-[60vw] w-[60vw] rounded-full border border-charcoal/20 lg:right-[4vw] lg:top-[22vh] lg:h-[38vw] lg:w-[38vw]" />
      <span aria-hidden className="display text-stroke pointer-events-none absolute -bottom-[3vw] left-[-1vw] -z-10 select-none whitespace-nowrap text-[26vw] text-white/[0.06]">SMASH</span>

      <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-6 pb-10 lg:grid-cols-12 lg:pb-16">
        <motion.div style={{ y: yText }} className="relative z-20 lg:col-span-6 xl:col-span-6">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow mb-5 text-orange">
            <ChefHat className="h-4 w-4" aria-hidden /> Smash burgers · {brand.city}
          </motion.p>
          <h1 id="hero-title" className="display text-[clamp(5rem,23vw,13.5rem)] lg:text-[clamp(4.6rem,13vw,13.5rem)] text-offwhite">
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

        <div className="relative lg:col-span-6 xl:col-span-6">
          <motion.div style={{ y: yBurger, rotate: rot }} className="relative mx-auto w-[min(88vw,560px)] lg:w-[min(46vw,680px)] lg:translate-x-[4%]">
            <BurgerStack layers={hero.layers} mode={reduce ? 'none' : 'stagger'} seed={4} label="Illustration d’un smash burger double steak, double cheddar, bacon et pickles" />
          </motion.div>

          {/* éléments flottants */}
          <motion.div style={{ y: yFast }} className="absolute left-[2%] top-[4%] w-[16%] lg:left-[-4%]" aria-hidden><motion.div {...floatAnim(0)}><PickleSlice /></motion.div></motion.div>
          <motion.div style={{ y: ySlow }} className="absolute right-[2%] top-[0%] w-[15%]" aria-hidden><motion.div {...floatAnim(1)}><TomatoSlice /></motion.div></motion.div>
          <motion.div style={{ y: yFast }} className="absolute bottom-[8%] right-[-2%] w-[17%]" aria-hidden><motion.div {...floatAnim(2)}><CheeseSquare /></motion.div></motion.div>
          <motion.div style={{ y: ySlow }} className="absolute bottom-[18%] left-[-3%] w-[13%]" aria-hidden><motion.div {...floatAnim(1.5)}><OnionRing /></motion.div></motion.div>
          <motion.div style={{ y: yFast }} className="absolute left-[28%] top-[-4%] w-[4%]" aria-hidden><Sesame /></motion.div>
          <motion.div style={{ y: ySlow }} className="absolute right-[30%] top-[6%] w-[3%] rotate-45" aria-hidden><Sesame /></motion.div>

          {/* sticker prix */}
          <motion.a
            href="#carte"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -10 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 12 }}
            className="absolute bottom-[4%] left-[0%] z-10 grid aspect-square w-[30%] max-w-[150px] place-items-center rounded-full bg-brick text-center text-offwhite shadow-2xl ring-4 ring-charcoal sm:left-[6%]"
          >
            <span className="leading-none">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em]">dès</span>
              <span className="display block text-[clamp(1.6rem,5vw,2.6rem)]">{euro(minPrice).replace(/\s?€/, '')}€</span>
              <span className="sr-only"> — voir la carte</span>
            </span>
          </motion.a>
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="absolute right-[0%] top-[38%] z-10 w-[24%] max-w-[130px] text-cream sm:right-[4%]">
            <LyonBadge />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 -rotate-1 bg-orange py-3 text-charcoal">
        <Marquee items={['Du goût', 'Du caractère', 'Du local', 'Smashé minute', 'Made in Lyon']} />
      </div>
    </section>
  );
}
