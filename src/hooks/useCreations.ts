import { useCallback, useEffect, useState } from 'react';
import type { BuilderState } from '../data/ingredients';
import { uid } from '../utils/format';

export interface Creation { id: string; name: string; state: BuilderState; at: number }
const KEY = 'gonesmash.creations.v1';
export const MAX_CREATIONS = 6;

function load(): Creation[] {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(d) ? d.filter((c) => c && c.state && c.name) : [];
  } catch {
    return [];
  }
}

/** Compositions sauvegardées par le visiteur (navigateur uniquement) */
export function useCreations() {
  const [list, setList] = useState<Creation[]>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  }, [list]);
  const save = useCallback((name: string, state: BuilderState) => {
    setList((l) => [{ id: uid(), name: name.trim().slice(0, 32) || `Création n°${l.length + 1}`, state, at: Date.now() }, ...l].slice(0, MAX_CREATIONS));
  }, []);
  const remove = useCallback((id: string) => setList((l) => l.filter((c) => c.id !== id)), []);
  return { list, save, remove };
}
