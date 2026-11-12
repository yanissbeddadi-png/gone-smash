import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Piège le focus, ferme sur Échap, bloque le scroll de la page et restaure le focus à la fermeture */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const first = root?.querySelector<HTMLElement>('[data-autofocus]') ?? root?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !root) return;
      const els = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [active, onClose, ref]);
}
