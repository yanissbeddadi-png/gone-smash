export type LayerKind =
  | 'bunTop' | 'bunBottom' | 'steak' | 'veggie' | 'cheddar' | 'raclette' | 'stmarcellin'
  | 'pickles' | 'onionCaramel' | 'onionConfit' | 'onionCrispy' | 'lettuce' | 'tomato'
  | 'bacon' | 'sauce' | 'grilledVeg';

export type BunType = 'brioche' | 'potato';

export interface Layer {
  id: string;
  kind: LayerKind;
  bun?: BunType;
  /** Couleur de sauce */
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  ingredients: string[];
  tag?: string;
  accent: 'orange' | 'brick' | 'cream';
  layers: Layer[];
  /** Photo réelle optionnelle (ex. /images/le-gone.webp). Si absente : illustration SVG. */
  photo?: string;
  calories?: string;
}

export interface Combo {
  id: string;
  name: string;
  short: string;
  includes: string[];
  supplement: number;
  highlight?: boolean;
}

export interface Option {
  id: string;
  label: string;
  price: number;
  /** Estimation indicative */
  kcal: number;
  note?: string;
}
