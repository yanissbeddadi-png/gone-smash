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
