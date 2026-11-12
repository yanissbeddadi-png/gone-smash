/** Accompagnements à l'unité (prix DÉMO) proposés en upsell dans le panier */
export const extras = [
  { id: 'frites', name: 'Frites maison', price: 3.2, kcal: 380 },
  { id: 'grandes-frites', name: 'Grandes frites maison', price: 4.2, kcal: 520 },
  { id: 'boisson', name: 'Limonade artisanale 33 cl', price: 2.8, kcal: 130 },
  { id: 'cookie', name: 'Cookie praline rose', price: 2.9, kcal: 310 },
] as const;
export type Extra = (typeof extras)[number];
