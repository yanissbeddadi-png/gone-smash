import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getProduct } from '../data/products';
import { BurgerStack } from './burger/BurgerStack';
import { SplitTitle } from './ui/Reveal';

const steps = [
  { t: 'La viande est déposée sur la plaque', d: 'Une boule de bœuf fraîchement hachée, assaisonnée au dernier moment, sur une plancha à plus de 230 °C.' },
  { t: 'Elle est smashée', d: 'Un coup de presse franc et la viande s’étale : surface de contact maximale, croûte dentelée, jus préservé.' },
  { t: 'Le fromage fond', d: 'Retournée après une minute, la viande reçoit son fromage qui fond directement au contact de la plaque.' },
  { t: 'Le pain est toasté', d: 'Le pain brioché, beurré face coupée, dore quelques secondes : il croustille et ne se détrempe pas.' },
  { t: 'Le burger est assemblé', d: 'Sauce, viande, garnitures, chapeau. Emballé et servi immédiatement, sans temps mort.' },
];

const gone = getProduct('le-gone')!;

function Scene({ step }: { step: number }) {
  const flat = step >= 1;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#232120] ring-1 ring-white/5">
      {/* plancha */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="heat" cx="50%" cy="80%" r="60%">
            <stop offset="0" stopColor="#F4A340" stopOpacity=".28" />
            <stop offset="1" stopColor="#F4A340" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="400" height="300" fill="url(#heat)" />
        <path d="M20,230 L380,230 L392,262 L8,262Z" fill="#3A3734" />
        <path d="M8,262 L392,262 L392,276 L8,276Z" fill="#1B1A19" />
        <path d="M20,230 L380,230" stroke="#5A5652" strokeWidth="2" />
        {/* vapeur / chaleur */}
        {[90, 160, 240, 310].map((x, i) => (
          <motion.path key={x} d={`M${x},210 q-8,-16 0,-32 q8,-16 0,-32`} stroke="#fff" strokeOpacity=".18" strokeWidth="3" fill="none" strokeLinecap="round"
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }} />
        ))}
        {step < 4 && (
          <>
            {/* steak : boule → smash */}
            <motion.ellipse cx="200" fill="#5B2C18" initial={false}
              animate={{ rx: flat ? 140 : 52, ry: flat ? 20 : 44, cy: flat ? 211 : 186 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} />
            <motion.ellipse cx="200" fill="#8A4423" initial={false}
              animate={{ rx: flat ? 124 : 34, ry: flat ? 6 : 18, cy: flat ? 198 : 170, opacity: flat ? 0.9 : 0.5 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} />
            {/* fromage */}
            <motion.path d="M70,206 L330,206 L334,216 Q320,236 308,216 L250,216 Q240,240 228,216 L160,216 Q148,234 138,216 L72,216 Z" fill="#F39A1C" initial={false}
              animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? -14 : -50 }} transition={{ duration: 0.5 }} />
            {/* presse */}
            <motion.g initial={false} animate={{ y: step === 1 ? 0 : -150, opacity: step === 1 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
              <rect x="110" y="168" width="180" height="22" rx="4" fill="#9A9590" />
              <rect x="110" y="168" width="180" height="6" rx="3" fill="#C9C4BE" />
              <rect x="186" y="96" width="28" height="74" rx="6" fill="#171717" />
              <rect x="150" y="84" width="100" height="22" rx="11" fill="#8B3028" />
            </motion.g>
            {/* pains qui toastent */}
            <motion.g initial={false} animate={{ opacity: step === 3 ? 1 : 0, x: step === 3 ? 0 : 60 }}>
              <path d="M40,226 Q40,196 80,192 Q120,196 120,226Z" fill="#C9702A" transform="translate(0,4)" />
              <path d="M290,226 Q290,196 330,192 Q370,196 370,226Z" fill="#C9702A" transform="translate(0,4)" />
            </motion.g>
            {/* grésillement */}
            {flat && [130, 200, 270].map((x, i) => (
              <motion.circle key={x} cx={x} cy={200} r="3" fill="#F5E9D7" animate={{ y: [0, -22], opacity: [1, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }} />
            ))}
          </>
        )}
      </svg>
      <AnimatePresence>
        {step === 4 && (
          <motion.div key="burger" className="absolute inset-x-0 bottom-[12%] mx-auto w-[46%]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BurgerStack layers={gone.layers} mode="stagger" seed={9} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute left-5 top-4 flex items-baseline gap-2 text-offwhite">
        <motion.span key={step} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="display text-6xl text-orange">0{step + 1}</motion.span>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-offwhite/60">/ 05</span>
      </div>
    </div>
  );
}

export function Craft() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="savoir-faire" className="grain relative bg-charcoal py-24 text-offwhite sm:py-32" aria-labelledby="craft-title">
      <div className="container-x">
        <p className="eyebrow mb-5 text-orange"><span className="h-px w-10 bg-orange" />Savoir-faire</p>
        <SplitTitle lines={['LE SECRET EST', <span key="s" className="text-orange">DANS LE SMASH.</span>]} className="display max-w-5xl text-[clamp(3.2rem,9vw,8rem)]" />

        <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          <div className="sticky top-16 z-10 -mx-4 bg-charcoal px-4 pb-4 pt-2 sm:mx-0 sm:px-0 lg:top-28 lg:h-fit lg:bg-transparent lg:p-0">
            <div className="mx-auto max-w-[520px] lg:max-w-none" aria-hidden>
              <Scene step={active} />
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              {steps.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-orange' : 'bg-white/10'}`} />)}
            </div>
          </div>
          <ol className="relative">
            {steps.map((s, i) => (
              <li key={s.t} ref={(el) => { refs.current[i] = el; }} data-i={i} className="flex min-h-[46svh] flex-col justify-center border-l-2 py-8 pl-6 transition-colors duration-500 lg:min-h-[62vh] lg:pl-10" style={{ borderColor: i === active ? '#F4A340' : 'rgba(255,255,255,.08)' }}>
                <span className={`display text-2xl transition-colors ${i === active ? 'text-orange' : 'text-offwhite/30'}`}>Étape 0{i + 1}</span>
                <h3 className={`display mt-2 text-[clamp(2.2rem,4.5vw,3.75rem)] transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-40'}`}>{s.t}</h3>
                <p className={`mt-4 max-w-md text-lg text-offwhite/70 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-50'}`}>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
