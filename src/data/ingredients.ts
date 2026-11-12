import type { BunType, Layer, LayerKind, Option } from './types';

/** Prix de base du burger composé : pain + sauce inclus */
export const BUILDER_BASE_PRICE = 4.9;

export const breads: (Option & { id: BunType })[] = [
  { id: 'brioche', label: 'Brioche classique', price: 0, note: 'Dorée, moelleuse, légèrement toastée' },
  { id: 'potato', label: 'Potato bun', price: 0.5, note: 'Plus souple, plus fondant' },
];

export const meats: (Option & { count: number })[] = [
  { id: 'none', label: 'Sans viande', price: 0, count: 0, note: 'On reste léger' },
  { id: 'single', label: 'Un steak smashé', price: 3.5, count: 1, note: '90 g, croûte caramélisée' },
  { id: 'double', label: 'Deux steaks smashés', price: 6, count: 2, note: 'Le format recommandé' },
  { id: 'triple', label: 'Trois steaks smashés', price: 8, count: 3, note: 'Faim de gone' },
];

export const cheeses: (Option & { kind: LayerKind | null })[] = [
  { id: 'cheddar', label: 'Cheddar', price: 1, kind: 'cheddar', note: 'Affiné, fondant' },
  { id: 'stmarcellin', label: 'Saint-Marcellin', price: 1.8, kind: 'stmarcellin', note: 'Crémeux, coulant' },
  { id: 'raclette', label: 'Raclette', price: 1.5, kind: 'raclette', note: 'Généreuse, filante' },
  { id: 'none', label: 'Sans fromage', price: 0, kind: null },
];

export const toppings: (Option & { kind: LayerKind })[] = [
  { id: 'pickles', label: 'Pickles', price: 0.5, kind: 'pickles' },
  { id: 'onionCaramel', label: 'Oignons caramélisés', price: 0.8, kind: 'onionCaramel' },
  { id: 'onionCrispy', label: 'Oignons croustillants', price: 0.8, kind: 'onionCrispy' },
  { id: 'lettuce', label: 'Salade', price: 0.4, kind: 'lettuce' },
  { id: 'tomato', label: 'Tomates', price: 0.5, kind: 'tomato' },
  { id: 'bacon', label: 'Bacon', price: 1.5, kind: 'bacon' },
];

export const sauces: (Option & { color: string })[] = [
  { id: 'maison', label: 'Sauce maison', price: 0, color: '#E79A57', note: 'Notre recette, douce et relevée' },
  { id: 'fumee', label: 'Sauce fumée', price: 0, color: '#6E3218', note: 'Barbecue, notes boisées' },
  { id: 'poivre', label: 'Sauce poivre', price: 0, color: '#B89A72', note: 'Crémeuse, poivre concassé' },
  { id: 'relevee', label: 'Sauce relevée', price: 0, color: '#C23B22', note: 'Piment doux, ça chauffe' },
];

export interface BuilderState {
  bread: BunType;
  meat: string;
  cheese: string;
  toppings: string[];
  sauce: string;
}

export const defaultBuilder: BuilderState = {
  bread: 'brioche',
  meat: 'double',
  cheese: 'cheddar',
  toppings: ['pickles', 'onionCaramel'],
  sauce: 'maison',
};

/** Ordre d'empilement des garnitures sous / sur la viande */
const UNDER: LayerKind[] = ['lettuce', 'tomato'];

export function buildLayers(s: BuilderState): Layer[] {
  const meat = meats.find((m) => m.id === s.meat) ?? meats[0];
  const cheese = cheeses.find((c) => c.id === s.cheese);
  const sauce = sauces.find((x) => x.id === s.sauce) ?? sauces[0];
  const tops = toppings.filter((t) => s.toppings.includes(t.id));
  const layers: Layer[] = [{ id: 'bunBottom', kind: 'bunBottom', bun: s.bread }];
  layers.push({ id: `sauce-${sauce.id}`, kind: 'sauce', color: sauce.color });
  tops.filter((t) => UNDER.includes(t.kind)).forEach((t) => layers.push({ id: t.id, kind: t.kind }));
  for (let i = 0; i < meat.count; i++) {
    layers.push({ id: `steak-${i}`, kind: 'steak' });
    if (cheese?.kind) layers.push({ id: `cheese-${i}-${cheese.id}`, kind: cheese.kind });
  }
  if (meat.count === 0 && cheese?.kind) layers.push({ id: `cheese-0-${cheese.id}`, kind: cheese.kind });
  tops.filter((t) => !UNDER.includes(t.kind)).forEach((t) => layers.push({ id: t.id, kind: t.kind }));
  layers.push({ id: 'bunTop', kind: 'bunTop', bun: s.bread });
  return layers;
}

export function priceLines(s: BuilderState) {
  const bread = breads.find((b) => b.id === s.bread)!;
  const meat = meats.find((m) => m.id === s.meat)!;
  const cheese = cheeses.find((c) => c.id === s.cheese)!;
  const sauce = sauces.find((x) => x.id === s.sauce)!;
  const tops = toppings.filter((t) => s.toppings.includes(t.id));
  const lines = [
    { label: 'Base (pain + sauce)', price: BUILDER_BASE_PRICE },
    { label: bread.label, price: bread.price },
    { label: meat.label, price: meat.price },
    { label: cheese.label, price: cheese.price },
    ...tops.map((t) => ({ label: t.label, price: t.price })),
    { label: sauce.label, price: sauce.price },
  ];
  const total = Math.round(lines.reduce((a, l) => a + l.price, 0) * 100) / 100;
  return { lines, total };
}

export function describeBuilder(s: BuilderState): string[] {
  const { lines } = priceLines(s);
  return lines.slice(1).map((l) => l.label);
}
