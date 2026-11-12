import { brand } from '../data/brand';
import { desserts, drinks, getCombo } from '../data/combos';
import type { Extra } from '../data/extras';
import type { Product } from '../data/types';
import type { CartItem } from '../hooks/useCart';
import { round2 } from './format';

type NewItem = Omit<CartItem, 'id' | 'qty'>;

/** Article burger (seul ou en formule) — clé unique par combinaison d'options */
export function productItem(p: Product, comboId?: string, drink = drinks[0], dessert = desserts[0]): NewItem {
  const combo = getCombo(comboId);
  const needsDessert = !!combo?.includes.includes('Dessert');
  const details = [...p.ingredients];
  if (combo) details.unshift(`${combo.name} : ${combo.includes.slice(1).filter((x) => x !== 'Dessert').join(', ')}`, `Boisson : ${drink}`, ...(needsDessert ? [`Dessert : ${dessert}`] : []));
  return {
    key: [p.id, combo?.id ?? '', combo ? drink : '', needsDessert ? dessert : ''].join('|').replace(/\|+$/, ''),
    kind: 'product',
    productId: p.id,
    comboId: combo?.id,
    name: combo ? `${p.name} · ${combo.name}` : p.name,
    unitPrice: round2(p.price + (combo?.supplement ?? 0)),
    details,
    layers: p.layers,
  };
}

export function extraItem(e: Extra): NewItem {
  return { key: `extra:${e.id}`, kind: 'extra', extraId: e.id, name: e.name, unitPrice: e.price, details: ['Accompagnement'], layers: [] };
}

export function rewardItem(p: Product): NewItem {
  return { key: 'reward', kind: 'reward', productId: p.id, name: `${p.name} offert`, unitPrice: 0, details: [`Récompense fidélité (${brand.loyalty.stampsForReward} tampons) — démo`], layers: p.layers };
}

/** Nombre de burgers (hors extras et récompense) : sert aux tampons de fidélité */
export const burgerCount = (items: CartItem[]) => items.filter((i) => i.kind === 'product' || i.kind === 'custom').reduce((a, i) => a + i.qty, 0);
