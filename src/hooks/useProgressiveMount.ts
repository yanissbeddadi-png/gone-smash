import { useEffect, useState } from 'react';

type IdleWin = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };

/**
 * Monte n blocs l'un après l'autre pendant les temps morts du navigateur :
 * le rendu initial est découpé en petites tâches (meilleur TBT/INP).
 * Lien profond (#ancre ou ?param) : tout est monté immédiatement.
 */
export function useProgressiveMount(n: number) {
  const [count, setCount] = useState(() => (window.location.hash.length > 1 || window.location.search ? n : 0));
  useEffect(() => {
    if (count >= n) return;
    const w = window as IdleWin;
    const next = () => setCount((c) => c + 1);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(next, { timeout: 400 });
      return () => (window as unknown as { cancelIdleCallback: (i: number) => void }).cancelIdleCallback(id);
    }
    const t = window.setTimeout(next, 30);
    return () => window.clearTimeout(t);
  }, [count, n]);
  /** Monte tout de suite (ex. navigation vers une ancre) */
  const all = () => setCount(n);
  return { count, all };
}
