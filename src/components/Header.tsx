import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/nav';
import { useCart } from '../hooks/useCart';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Logo } from './ui/Brand';
import { OpenBadge } from './OpenBadge';
import { btn } from './ui/Button';

export function Header({ onOrder, solid = false }: { onOrder: () => void; solid?: boolean }) {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = () => setMenu(false);
  useFocusTrap(menuRef, menu, close);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const filled = scrolled || solid;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,height] duration-300 ${filled ? 'bg-charcoal/85 shadow-[0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl' : 'bg-transparent'}`}>
        <div className={`container-x flex items-center justify-between gap-4 transition-[height] duration-300 ${filled ? 'h-16' : 'h-20 sm:h-24'}`}>
          <a href="#top" className="shrink-0 rounded text-offwhite" aria-label="GONE SMASH, retour à l’accueil">
            <Logo className="text-[1.45rem] sm:text-[1.7rem]" />
          </a>
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="group relative rounded-full px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-offwhite/80 transition-colors hover:text-offwhite">
                    {n.label}
                    <span className="absolute inset-x-4 bottom-1 h-[2px] origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <OpenBadge className="hidden xl:inline-flex" />
            <button type="button" onClick={onOrder} className={btn('primary', 'sm', 'hidden sm:inline-flex')}>Commander</button>
            <button type="button" data-cart-target onClick={open} className="relative grid h-11 w-11 place-items-center rounded-full bg-white/10 text-offwhite transition hover:bg-white/20" aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}>
              <ShoppingBag className="h-5 w-5" aria-hidden />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [1.5, 1] }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-orange px-1 text-[0.72rem] font-bold text-charcoal"
                    aria-hidden
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button type="button" onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-offwhite lg:hidden" aria-label="Ouvrir le menu" aria-expanded={menu} aria-controls="mobile-menu">
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-50 flex flex-col bg-charcoal lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className="container-x flex h-20 items-center justify-between">
              <Logo className="text-[1.45rem]" />
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Fermer le menu">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Navigation mobile" className="container-x flex flex-1 flex-col justify-center">
              <ul className="space-y-1">
                {nav.map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + i * 0.06 }}>
                    <a href={n.href} onClick={close} className="display flex items-baseline gap-4 py-1 text-[clamp(2.6rem,12vw,4.5rem)] text-offwhite transition-colors hover:text-orange">
                      <span className="font-sans text-sm font-semibold text-orange">0{i + 1}</span>
                      {n.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x pb-8">
              <OpenBadge className="mb-4" />
              <button type="button" onClick={() => { close(); onOrder(); }} className={btn('primary', 'lg', 'w-full')}>Commander</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
