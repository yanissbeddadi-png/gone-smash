import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildLayers, decodeBuilder, defaultBuilder, describeBuilder, encodeBuilder, estimateKcal, priceLines, randomBuilder, type BuilderState } from '../data/ingredients';

const KEY = 'gonesmash.builder.v1';
export const SHARE_PARAM = 'burger';

interface Shared { state: BuilderState; name: string }

/** Lit un burger partagé depuis l'URL (?burger=code~Nom) puis nettoie l'URL */
function readShared(): Shared | null {
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get(SHARE_PARAM);
    if (!raw) return null;
    const [code, ...rest] = raw.split('~');
    const state = decodeBuilder(code);
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    return state ? { state, name: rest.join('~').slice(0, 32) } : null;
  } catch {
    return null;
  }
}

/** Lu une seule fois au chargement (l'initialiseur de useState peut être rejoué en StrictMode) */
const initialShared = typeof window !== 'undefined' ? readShared() : null;

function load(): BuilderState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultBuilder, ...JSON.parse(raw) } : defaultBuilder;
  } catch {
    return defaultBuilder;
  }
}

export function shareUrl(state: BuilderState, name: string) {
  const url = new URL(window.location.href);
  url.hash = 'composer';
  url.search = '';
  url.searchParams.set(SHARE_PARAM, encodeBuilder(state) + (name.trim() ? `~${name.trim().slice(0, 32)}` : ''));
  return url.toString();
}

export function useBurgerBuilder() {
  const shared = initialShared;
  const [state, setState] = useState<BuilderState>(() => shared?.state ?? load());

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const set = useCallback(<K extends keyof BuilderState>(k: K, v: BuilderState[K]) => setState((s) => ({ ...s, [k]: v })), []);
  const toggleTopping = useCallback((id: string) => setState((s) => ({ ...s, toppings: s.toppings.includes(id) ? s.toppings.filter((t) => t !== id) : [...s.toppings, id] })), []);
  const reset = useCallback(() => setState(defaultBuilder), []);
  const randomize = useCallback(() => setState((s) => randomBuilder(s)), []);
  const replace = useCallback((s: BuilderState) => setState(s), []);

  const layers = useMemo(() => buildLayers(state), [state]);
  const price = useMemo(() => priceLines(state), [state]);
  const details = useMemo(() => describeBuilder(state), [state]);
  const kcal = useMemo(() => estimateKcal(state), [state]);
  const key = useMemo(() => `custom:${encodeBuilder(state)}`, [state]);

  return { state, set, toggleTopping, reset, randomize, replace, layers, price, details, kcal, key, shared };
}
