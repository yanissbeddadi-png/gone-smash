import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useUI, type Flight } from '../hooks/useUI';
import { BurgerStack } from './burger/BurgerStack';

function Flyer({ f, onDone }: { f: Flight; onDone: () => void }) {
  // cible : icône panier du header, sinon barre collante mobile
  const target = document.querySelector('[data-cart-target]')?.getBoundingClientRect();
  const size = Math.min(140, f.from.width);
  const x0 = f.from.left + f.from.width / 2 - size / 2;
  const y0 = f.from.top + f.from.height / 2 - size / 2;
  const x1 = target ? target.left + target.width / 2 - size / 2 : window.innerWidth - size;
  const y1 = target ? target.top + target.height / 2 - size / 2 : 0;
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      style={{ width: size }}
      initial={{ x: x0, y: y0, scale: 1, opacity: 1, rotate: 0 }}
      animate={{ x: [x0, (x0 + x1) / 2, x1], y: [y0, Math.min(y0, y1) - 120, y1], scale: [1, 0.8, 0.18], rotate: [0, -12, -30], opacity: [1, 1, 0.6] }}
      transition={{ duration: 0.75, ease: [0.5, 0, 0.3, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={onDone}
      aria-hidden
    >
      <BurgerStack layers={f.layers} shadow={false} seed={3} />
    </motion.div>
  );
}

export function FlyToCart() {
  const { flights, endFlight } = useUI();
  if (!flights.length) return null;
  return createPortal(<>{flights.map((f) => <Flyer key={f.id} f={f} onDone={() => endFlight(f.id)} />)}</>, document.body);
}
