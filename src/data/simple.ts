import type { LayerKind } from './types';

/** Prix de base : pain brioché (haut + bas). DÉMO. */
export const BASE_PRICE = 4.9;
export const MAX_PER_ITEM = 3;
export const MAX_LAYERS = 12;

export interface Item {
  id: string;
  label: string;
  price: number;
  kind: LayerKind;
  color?: string;
}

/** Aliments cliquables (prix DÉMO) */
export const items: Item[] = [
  { id: 'steak', label: 'Steak smashé', price: 2.5, kind: 'steak' },
  { id: 'cheddar', label: 'Cheddar', price: 1, kind: 'cheddar' },
  { id: 'raclette', label: 'Raclette', price: 1.5, kind: 'raclette' },
  { id: 'bacon', label: 'Bacon', price: 1.5, kind: 'bacon' },
  { id: 'pickles', label: 'Pickles', price: 0.5, kind: 'pickles' },
  { id: 'onionCaramel', label: 'Oignons caramélisés', price: 0.8, kind: 'onionCaramel' },
  { id: 'onionCrispy', label: 'Oignons croustillants', price: 0.8, kind: 'onionCrispy' },
  { id: 'lettuce', label: 'Salade', price: 0.4, kind: 'lettuce' },
  { id: 'tomato', label: 'Tomate', price: 0.5, kind: 'tomato' },
  { id: 'sauce', label: 'Sauce maison', price: 0.3, kind: 'sauce', color: '#E79A57' },
];

export const getItem = (id: string) => items.find((i) => i.id === id);
