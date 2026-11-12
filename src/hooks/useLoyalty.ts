import { useCallback, useEffect, useState } from 'react';
import { brand } from '../data/brand';

const KEY = 'gonesmash.loyalty.v1';
const EVT = 'gonesmash:loyalty';

const read = () => { try { return Math.max(0, Number(localStorage.getItem(KEY)) || 0); } catch { return 0; } };

/** Carte de fidélité de démonstration (navigateur uniquement), synchronisée entre composants */
export function useLoyalty() {
  const [stamps, setStamps] = useState(read);
  useEffect(() => {
    const on = () => setStamps(read());
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  const write = useCallback((n: number) => {
    try { localStorage.setItem(KEY, String(Math.max(0, n))); } catch { /* ignore */ }
    window.dispatchEvent(new Event(EVT));
  }, []);
  const goal = brand.loyalty.stampsForReward;
  return {
    stamps,
    goal,
    canRedeem: stamps >= goal,
    addStamps: (n: number) => write(read() + n),
    consumeReward: () => write(read() - goal),
  };
}
