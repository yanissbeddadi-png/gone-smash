import type { BunType, Layer, LayerKind, Option } from './types';

/** Prix de base du burger composé : pain + sauce inclus */
export const BUILDER_BASE_PRICE = 4.9;

export const breads: (Option & { id: BunType })[] = [
  { id: 'brioche', label: 'Brioche classique', price: 0, kcal: 260, note: 'Dorée, moelleuse, légèrement toastée' },
  { id: 'potato', label: 'Potato bun', price: 0.5, kcal: 230, note: 'Plus souple, plus fondant' },
];

export const meats: (Option & { count: number })[] = [
  { id: 'none', label: 'Sans viande', price: 0, kcal: 0, count: 0, note: 'On reste léger' },
  { id: 'single', label: 'Un steak smashé', price: 3.5, kcal: 230, count: 1, note: '90 g, croûte caramélisée' },
  { id: 'double', label: 'Deux steaks smashés', price: 6, kcal: 460, count: 2, note: 'Le format recommandé' },
  { id: 'triple', label: 'Trois steaks smashés', price: 8, kcal: 690, count: 3, note: 'Faim de gone' },
];

export const cheeses: (Option & { kind: LayerKind | null })[] = [
  { id: 'cheddar', label: 'Cheddar', price: 1, kcal: 110, kind: 'cheddar', note: 'Affiné, fondant' },
  { id: 'stmarcellin', label: 'Saint-Marcellin', price: 1.8, kcal: 140, kind: 'stmarcellin', note: 'Crémeux, coulant' },
  { id: 'raclette', label: 'Raclette', price: 1.5, kcal: 130, kind: 'raclette', note: 'Généreuse, filante' },
  { id: 'none', label: 'Sans fromage', price: 0, kcal: 0, kind: null },
];

export const toppings: (Option & { kind: LayerKind })[] = [
  { id: 'pickles', label: 'Pickles', price: 0.5, kcal: 5, kind: 'pickles' },
  { id: 'onionCaramel', label: 'Oignons caramélisés', price: 0.8, kcal: 60, kind: 'onionCaramel' },
  { id: 'onionCrispy', label: 'Oignons croustillants', price: 0.8, kcal: 90, kind: 'onionCrispy' },
  { id: 'lettuce', label: 'Salade', price: 0.4, kcal: 5, kind: 'lettuce' },
  { id: 'tomato', label: 'Tomates', price: 0.5, kcal: 10, kind: 'tomato' },
  { id: 'bacon', label: 'Bacon', price: 1.5, kcal: 120, kind: 'bacon' },
];

export const sauces: (Option & { color: string })[] = [
  { id: 'maison', label: 'Sauce maison', price: 0, kcal: 90, color: '#E79A57', note: 'Notre recette, douce et relevée' },
  { id: 'fumee', label: 'Sauce fumée', price: 0, kcal: 70, color: '#6E3218', note: 'Barbecue, notes boisées' },
  { id: 'poivre', label: 'Sauce poivre', price: 0, kcal: 80, color: '#B89A72', note: 'Crémeuse, poivre concassé' },
  { id: 'relevee', label: 'Sauce relevée', price: 0, kcal: 60, color: '#C23B22', note: 'Piment doux, ça chauffe' },
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

/** Estimation calorique indicative (non contractuelle) */
export function estimateKcal(s: BuilderState): number {
  const all = [breads.find((b) => b.id === s.bread), meats.find((m) => m.id === s.meat), cheeses.find((c) => c.id === s.cheese), sauces.find((x) => x.id === s.sauce), ...toppings.filter((t) => s.toppings.includes(t.id))];
  const meatCount = meats.find((m) => m.id === s.meat)?.count ?? 0;
  const cheese = cheeses.find((c) => c.id === s.cheese)?.kcal ?? 0;
  // le fromage est posé sur chaque steak
  const extraCheese = meatCount > 1 ? cheese * (meatCount - 1) : 0;
  return Math.round((all.reduce((a, o) => a + (o?.kcal ?? 0), 0) + extraCheese) / 10) * 10;
}

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** Composition aléatoire valide (au moins un steak, 0 à 4 garnitures), différente de `avoid` si fourni */
export function randomBuilder(avoid?: BuilderState): BuilderState {
  for (let i = 0; i < 10; i++) {
    const n = Math.floor(Math.random() * 5);
    const tops = [...toppings].sort(() => Math.random() - 0.5).slice(0, n).map((t) => t.id);
    const s: BuilderState = { bread: pick(breads).id, meat: pick(meats.slice(1)).id, cheese: pick(cheeses).id, toppings: tops, sauce: pick(sauces).id };
    if (!avoid || encodeBuilder(s) !== encodeBuilder(avoid)) return s;
  }
  return defaultBuilder;
}

/** Encodage compact pour lien de partage : pain.viande.fromage.garnitures(-).sauce */
export function encodeBuilder(s: BuilderState): string {
  return [s.bread, s.meat, s.cheese, [...s.toppings].sort().join('-') || '0', s.sauce].join('.');
}

export function decodeBuilder(code: string): BuilderState | null {
  const [bread, meat, cheese, tops, sauce] = code.split('.');
  const t = tops === '0' || !tops ? [] : tops.split('-');
  if (!breads.some((b) => b.id === bread) || !meats.some((m) => m.id === meat) || !cheeses.some((c) => c.id === cheese) || !sauces.some((x) => x.id === sauce)) return null;
  if (!t.every((id) => toppings.some((x) => x.id === id))) return null;
  return { bread: bread as BunType, meat, cheese, toppings: t, sauce };
}
