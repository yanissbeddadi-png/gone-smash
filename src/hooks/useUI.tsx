import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Layer } from '../data/types';
import { playSound, type SoundName } from '../utils/sound';

export interface Flight { id: number; layers: Layer[]; from: DOMRect }
interface Notice { id: number; text: string }

interface UICtx {
  notice: Notice | null;
  notify: (text: string) => void;
  flights: Flight[];
  /** Fait voler la vignette du burger depuis l'élément source jusqu'à l'icône panier */
  flyToCart: (from: Element | null | undefined, layers: Layer[]) => void;
  endFlight: (id: number) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
  play: (s: SoundName) => void;
}

const C = createContext<UICtx | null>(null);
const SOUND_KEY = 'gonesmash.sound.v1';

export function UIProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [sound, setSoundState] = useState(() => { try { return localStorage.getItem(SOUND_KEY) === '1'; } catch { return false; } });
  const n = useRef(0);

  const notify = useCallback((text: string) => setNotice({ id: ++n.current, text }), []);
  const flyToCart = useCallback((from: Element | null | undefined, layers: Layer[]) => {
    if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setFlights((f) => [...f, { id: ++n.current, layers, from: from.getBoundingClientRect() }]);
  }, []);
  const endFlight = useCallback((id: number) => setFlights((f) => f.filter((x) => x.id !== id)), []);
  const setSound = useCallback((v: boolean) => {
    setSoundState(v);
    try { localStorage.setItem(SOUND_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    if (v) playSound('pop');
  }, []);
  const play = useCallback((s: SoundName) => { if (sound) playSound(s); }, [sound]);

  const v = useMemo(() => ({ notice, notify, flights, flyToCart, endFlight, sound, setSound, play }), [notice, notify, flights, flyToCart, endFlight, sound, setSound, play]);
  return <C.Provider value={v}>{children}</C.Provider>;
}

export function useUI() {
  const c = useContext(C);
  if (!c) throw new Error('useUI hors UIProvider');
  return c;
}
