import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { brand } from '../data/brand';
import type { Layer } from '../data/types';
import { round2, uid } from '../utils/format';

export interface CartItem {
  id: string;
  /** Clé de regroupement : même produit + mêmes options = même ligne */
  key: string;
  kind: 'product' | 'custom';
  productId?: string;
  name: string;
  unitPrice: number;
  qty: number;
  details: string[];
  layers: Layer[];
}

type Action =
  | { type: 'add'; item: Omit<CartItem, 'id' | 'qty'>; qty?: number }
  | { type: 'qty'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

const STORAGE_KEY = 'gonesmash.cart.v1';

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case 'add': {
      const found = state.find((i) => i.key === a.item.key);
      if (found) return state.map((i) => (i === found ? { ...i, qty: Math.min(20, i.qty + (a.qty ?? 1)) } : i));
      return [...state, { ...a.item, id: uid(), qty: a.qty ?? 1 }];
    }
    case 'qty':
      return a.qty <= 0 ? state.filter((i) => i.id !== a.id) : state.map((i) => (i.id === a.id ? { ...i, qty: Math.min(20, a.qty) } : i));
    case 'remove':
      return state.filter((i) => i.id !== a.id);
    case 'clear':
      return [];
  }
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((i) => i && typeof i.unitPrice === 'number' && i.qty > 0) : [];
  } catch {
    return [];
  }
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, 'id' | 'qty'>, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Dernier ajout, pour le toast de confirmation */
  lastAdded: { name: string; at: number } | null;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartCtx['lastAdded']>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* stockage indisponible */ }
  }, [items]);

  const add = useCallback<CartCtx['add']>((item, qty) => {
    dispatch({ type: 'add', item, qty });
    setLastAdded({ name: item.name, at: Date.now() });
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((a, i) => a + i.qty, 0);
    const subtotal = round2(items.reduce((a, i) => a + i.unitPrice * i.qty, 0));
    const serviceFee = count ? brand.fees.service : 0;
    return {
      items, count, subtotal, serviceFee, total: round2(subtotal + serviceFee), isOpen, lastAdded,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty: (id, qty) => dispatch({ type: 'qty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [items, isOpen, lastAdded, add]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart hors CartProvider');
  return c;
}
