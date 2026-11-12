import { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_PRICE, getItem, MAX_LAYERS, MAX_PER_ITEM } from '../data/simple';
import type { Layer } from '../data/types';
import { round2, uid } from '../utils/format';

export interface Piece { uid: string; itemId: string }
const KEY = 'gonesmash.simple.v1';

function load(): Piece[] {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(d) ? d.filter((p) => p && getItem(p.itemId)).slice(0, MAX_LAYERS) : [];
  } catch {
    return [];
  }
}

export type AddResult = 'ok' | 'max-item' | 'max-total';

/** Pile d'aliments entre les deux pains, dans l'ordre des clics */
export function useStack() {
  const [pieces, setPieces] = useState<Piece[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(pieces)); } catch { /* ignore */ }
  }, [pieces]);

  const countOf = useCallback((itemId: string) => pieces.filter((p) => p.itemId === itemId).length, [pieces]);

  const add = useCallback((itemId: string): AddResult => {
    if (pieces.length >= MAX_LAYERS) return 'max-total';
    if (countOf(itemId) >= MAX_PER_ITEM) return 'max-item';
    setPieces((ps) => [...ps, { uid: uid(), itemId }]);
    return 'ok';
  }, [pieces.length, countOf]);

  const remove = useCallback((u: string) => setPieces((ps) => ps.filter((p) => p.uid !== u)), []);
  /** Retire la dernière couche de cet aliment */
  const removeOne = useCallback((itemId: string) => setPieces((ps) => {
    const i = ps.map((p) => p.itemId).lastIndexOf(itemId);
    return i < 0 ? ps : ps.filter((_, k) => k !== i);
  }), []);
  const undo = useCallback(() => setPieces((ps) => ps.slice(0, -1)), []);
  const clear = useCallback(() => setPieces([]), []);

  const layers: Layer[] = useMemo(() => [
    { id: 'bunBottom', kind: 'bunBottom', bun: 'brioche' },
    ...pieces.map((p) => { const it = getItem(p.itemId)!; return { id: p.uid, kind: it.kind, color: it.color }; }),
    { id: 'bunTop', kind: 'bunTop', bun: 'brioche' },
  ], [pieces]);

  const total = useMemo(() => round2(BASE_PRICE + pieces.reduce((a, p) => a + (getItem(p.itemId)?.price ?? 0), 0)), [pieces]);

  /** Résumé « 2 × Steak smashé » dans l'ordre d'apparition */
  const summary = useMemo(() => {
    const m = new Map<string, number>();
    pieces.forEach((p) => m.set(p.itemId, (m.get(p.itemId) ?? 0) + 1));
    return [...m].map(([id, n]) => ({ item: getItem(id)!, n }));
  }, [pieces]);

  return { pieces, layers, total, summary, countOf, add, remove, removeOne, undo, clear };
}
