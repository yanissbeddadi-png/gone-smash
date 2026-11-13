import type { LayerKind } from './types';

/** Prix de base : pain brioché (haut + bas). DÉMO. */
export const BASE_PRICE = 4.9;

export type StepId = 'meat' | 'cheese' | 'garnish' | 'sauce' | 'fries' | 'drink' | 'dessert';
export type SideKind = 'fries' | 'drink' | 'dessert';

export interface Option {
  id: string;
  label: string;
  /** Nom court affiché sur la roulette */
  short?: string;
  price: number;
  /** Couches posées dans le burger (bas → haut) */
  layers?: { kind: LayerKind; color?: string }[];
  /** Variante visuelle d'un accompagnement */
  art?: string;
}

export interface Step {
  id: StepId;
  label: string;
  /** Accompagnement posé à côté du burger (sinon couche du burger) */
  side?: SideKind;
  /** false = il faut choisir (pas d'option « Sans ») */
  optional: boolean;
  options: Option[];
}

const none: Option = { id: 'none', label: 'Sans', price: 0 };
const steak = { kind: 'steak' as const };

/** Parcours de la roulette, dans l'ordre. Prix DÉMO. */
export const steps: Step[] = [
  {
    id: 'meat', label: 'Viande', optional: false, options: [
      { id: 'simple', label: 'Simple smash', short: 'Simple', price: 3, layers: [steak] },
      { id: 'double', label: 'Double smash', short: 'Double', price: 5, layers: [steak, steak] },
      { id: 'triple', label: 'Triple smash', short: 'Triple', price: 6.8, layers: [steak, steak, steak] },
      { id: 'veggie', label: 'Galette veggie', short: 'Veggie', price: 3.2, layers: [{ kind: 'veggie' }] },
    ],
  },
  {
    id: 'cheese', label: 'Fromage', optional: true, options: [
      { id: 'cheddar', label: 'Cheddar', price: 1, layers: [{ kind: 'cheddar' }] },
      { id: 'raclette', label: 'Raclette', price: 1.5, layers: [{ kind: 'raclette' }] },
      { id: 'stmarcellin', label: 'Saint-Marcellin', price: 1.8, layers: [{ kind: 'stmarcellin' }] },
      none,
    ],
  },
  {
    id: 'garnish', label: 'Garniture', optional: true, options: [
      { id: 'lettuce', label: 'Salade', price: 0.4, layers: [{ kind: 'lettuce' }] },
      { id: 'tomato', label: 'Tomate', price: 0.5, layers: [{ kind: 'tomato' }] },
      { id: 'pickles', label: 'Pickles', price: 0.5, layers: [{ kind: 'pickles' }] },
      { id: 'onionCaramel', label: 'Oignons confits', price: 0.8, layers: [{ kind: 'onionCaramel' }] },
      { id: 'onionCrispy', label: 'Oignons frits', price: 0.8, layers: [{ kind: 'onionCrispy' }] },
      { id: 'bacon', label: 'Bacon', price: 1.5, layers: [{ kind: 'bacon' }] },
      none,
    ],
  },
  {
    id: 'sauce', label: 'Sauce', optional: true, options: [
      { id: 'maison', label: 'Sauce maison', short: 'Maison', price: 0.3, layers: [{ kind: 'sauce', color: '#E79A57' }] },
      { id: 'bbq', label: 'Sauce BBQ', short: 'BBQ', price: 0.5, layers: [{ kind: 'sauce', color: '#6B2A17' }] },
      { id: 'samourai', label: 'Sauce samouraï', short: 'Samouraï', price: 0.5, layers: [{ kind: 'sauce', color: '#D9481F' }] },
      { id: 'moutarde', label: 'Moutarde miel', price: 0.5, layers: [{ kind: 'sauce', color: '#D9A520' }] },
      none,
    ],
  },
  {
    id: 'fries', label: 'Frites', side: 'fries', optional: true, options: [
      { id: 'classic', label: 'Frites classiques', short: 'Classiques', price: 2.5, art: 'classic' },
      { id: 'sweet', label: 'Frites de patate douce', short: 'Patate douce', price: 3, art: 'sweet' },
      { id: 'loaded', label: 'Frites cheddar-bacon', short: 'Cheddar-bacon', price: 3.9, art: 'loaded' },
      none,
    ],
  },
  {
    id: 'drink', label: 'Boisson', side: 'drink', optional: true, options: [
      { id: 'cola', label: 'Cola', price: 2.5, art: 'cola' },
      { id: 'lemonade', label: 'Limonade maison', short: 'Limonade', price: 3, art: 'lemonade' },
      { id: 'icetea', label: 'Thé glacé maison', short: 'Thé glacé', price: 3, art: 'icetea' },
      { id: 'water', label: 'Eau plate', short: 'Eau', price: 1.5, art: 'water' },
      none,
    ],
  },
  {
    id: 'dessert', label: 'Dessert', side: 'dessert', optional: true, options: [
      { id: 'cookie', label: 'Cookie', price: 2.5, art: 'cookie' },
      { id: 'brownie', label: 'Brownie', price: 3, art: 'brownie' },
      { id: 'tiramisu', label: 'Tiramisu', price: 3.5, art: 'tiramisu' },
      none,
    ],
  },
];

export const DONE = steps.length;
export const stepIndex = (id: StepId) => steps.findIndex((s) => s.id === id);
export const getOption = (step: StepId, id?: string) => steps[stepIndex(step)].options.find((o) => o.id === id);
