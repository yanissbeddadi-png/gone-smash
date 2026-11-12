import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildLayers, defaultBuilder, describeBuilder, priceLines, type BuilderState } from '../data/ingredients';

const KEY = 'gonesmash.builder.v1';

function load(): BuilderState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultBuilder, ...JSON.parse(raw) } : defaultBuilder;
  } catch {
    return defaultBuilder;
  }
}

export function useBurgerBuilder() {
  const [state, setState] = useState<BuilderState>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const set = useCallback(<K extends keyof BuilderState>(k: K, v: BuilderState[K]) => setState((s) => ({ ...s, [k]: v })), []);
  const toggleTopping = useCallback((id: string) => setState((s) => ({ ...s, toppings: s.toppings.includes(id) ? s.toppings.filter((t) => t !== id) : [...s.toppings, id] })), []);
  const reset = useCallback(() => setState(defaultBuilder), []);

  const layers = useMemo(() => buildLayers(state), [state]);
  const price = useMemo(() => priceLines(state), [state]);
  const details = useMemo(() => describeBuilder(state), [state]);
  const key = useMemo(() => `custom:${state.bread}|${state.meat}|${state.cheese}|${[...state.toppings].sort().join(',')}|${state.sauce}`, [state]);

  return { state, set, toggleTopping, reset, layers, price, details, key };
}
