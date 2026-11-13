import { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_PRICE, DONE, getOption, steps, type SideKind, type StepId } from '../data/simple';
import type { Layer } from '../data/types';
import { round2 } from '../utils/format';

const KEY = 'gonesmash.v4';
export type Choices = Partial<Record<StepId, string>>;
interface State { choices: Choices; step: number }

function load(): State {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!d || typeof d !== 'object') throw 0;
    const choices: Choices = {};
    for (const s of steps) if (getOption(s.id, d.choices?.[s.id])) choices[s.id] = d.choices[s.id];
    const step = Number.isInteger(d.step) && d.step >= 0 && d.step <= DONE ? d.step : 0;
    return { choices, step: choices.meat ? step : 0 };
  } catch {
    return { choices: {}, step: 0 };
  }
}

/** Parcours de commande : un choix par étape, la roulette avance après chaque choix */
export function useOrder() {
  const [state, setState] = useState<State>(load);
  const { choices, step } = state;

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const choose = useCallback((id: StepId, optionId: string) => setState((s) => {
    const i = steps.findIndex((x) => x.id === id);
    return { choices: { ...s.choices, [id]: optionId }, step: Math.min(i + 1, DONE) };
  }), []);
  const goTo = useCallback((i: number) => setState((s) => ({ ...s, step: Math.max(0, Math.min(DONE, s.choices.meat ? i : 0)) })), []);
  const reset = useCallback(() => setState({ choices: {}, step: 0 }), []);

  /** Pain bas → viande → fromage → garniture → sauce → pain haut. Ids stables par option : changer de choix anime la sortie/entrée. */
  const layers: Layer[] = useMemo(() => {
    const mid = steps.filter((s) => !s.side).flatMap((s) => {
      const o = getOption(s.id, choices[s.id]);
      return (o?.layers ?? []).map((l, k) => ({ id: `${s.id}-${o!.id}-${k}`, kind: l.kind, color: l.color }));
    });
    return [{ id: 'bunBottom', kind: 'bunBottom', bun: 'brioche' }, ...mid, { id: 'bunTop', kind: 'bunTop', bun: 'brioche' }];
  }, [choices]);

  const sides = useMemo(() => steps.filter((s) => s.side).flatMap((s) => {
    const o = getOption(s.id, choices[s.id]);
    return o?.art ? [{ kind: s.side as SideKind, art: o.art, label: o.label }] : [];
  }), [choices]);

  /** Lignes du récap (hors « Sans ») */
  const summary = useMemo(() => steps.flatMap((s) => {
    const o = getOption(s.id, choices[s.id]);
    return o && o.id !== 'none' ? [{ step: s.label, label: o.label, price: o.price }] : [];
  }), [choices]);

  const total = useMemo(() => round2(BASE_PRICE + summary.reduce((a, l) => a + l.price, 0)), [summary]);

  return { choices, step, layers, sides, summary, total, ready: !!choices.meat, choose, goTo, reset };
}
export type Order = ReturnType<typeof useOrder>;
