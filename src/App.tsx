import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BurgerBuilder } from './components/BurgerBuilder';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { ComboSection } from './components/ComboSection';
import { Craft } from './components/Craft';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LyonSection } from './components/LyonSection';
import { Manifesto } from './components/Manifesto';
import { MenuSection } from './components/MenuSection';
import { ProductModal } from './components/ProductModal';
import { Toast } from './components/Toast';
import { CartProvider, useCart } from './hooks/useCart';
import { ProductModalProvider } from './hooks/useProductModal';

const CHECKOUT = '#/commande';
const isCheckout = () => window.location.hash.startsWith(CHECKOUT);

function Shell() {
  const [checkout, setCheckout] = useState(isCheckout);
  const { count, open } = useCart();

  useEffect(() => {
    const on = () => {
      const c = isCheckout();
      setCheckout(c);
      if (!c) {
        const id = window.location.hash.slice(1);
        // laisse la page d'accueil se monter avant de scroller vers l'ancre
        requestAnimationFrame(() => requestAnimationFrame(() => (id ? document.getElementById(id) : null)?.scrollIntoView()));
      }
    };
    window.addEventListener('hashchange', on);
    if (window.location.hash.length > 1) on();
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const goCheckout = useCallback(() => { window.location.hash = CHECKOUT; }, []);
  const onOrder = useCallback(() => {
    if (count > 0) open();
    else if (isCheckout()) window.location.hash = '#carte';
    else document.getElementById('carte')?.scrollIntoView();
  }, [count, open]);

  return (
    <>
      <a href="#main" className="sr-only z-[70] rounded-full bg-orange px-4 py-2 font-semibold text-charcoal focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Aller au contenu</a>
      <Header onOrder={onOrder} solid={checkout} />
      <AnimatePresence mode="wait" initial={false}>
        {checkout ? (
          <motion.div key="checkout" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Checkout />
          </motion.div>
        ) : (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <main id="main">
              <Hero />
              <Manifesto />
              <MenuSection />
              <BurgerBuilder />
              <ComboSection />
              <Craft />
              <LyonSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
      <CartDrawer onCheckout={goCheckout} />
      <ProductModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <ProductModalProvider>
          <Shell />
        </ProductModalProvider>
      </CartProvider>
    </MotionConfig>
  );
}
