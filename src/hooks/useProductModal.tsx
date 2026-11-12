import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface State { productId: string; comboId?: string; fromCombo?: boolean }
interface Ctx { state: State | null; openProduct: (productId: string, comboId?: string, fromCombo?: boolean) => void; closeProduct: () => void }

const C = createContext<Ctx | null>(null);

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State | null>(null);
  const openProduct = useCallback((productId: string, comboId?: string, fromCombo?: boolean) => setState({ productId, comboId, fromCombo }), []);
  const closeProduct = useCallback(() => setState(null), []);
  const v = useMemo(() => ({ state, openProduct, closeProduct }), [state, openProduct, closeProduct]);
  return <C.Provider value={v}>{children}</C.Provider>;
}

export function useProductModal() {
  const c = useContext(C);
  if (!c) throw new Error('useProductModal hors provider');
  return c;
}
