import type { Combo } from './types';

export const combos: Combo[] = [
  { id: 'classique', name: 'Menu Classique', short: 'L’essentiel', includes: ['Burger au choix', 'Frites maison', 'Boisson 33 cl'], supplement: 3.9 },
  { id: 'gourmand', name: 'Menu Gourmand', short: 'Pour les affamés', includes: ['Burger au choix', 'Grandes frites maison', 'Boisson 33 cl'], supplement: 4.9, highlight: true },
  { id: 'gone', name: 'Menu Gone', short: 'Le grand jeu', includes: ['Burger au choix', 'Frites maison', 'Boisson 33 cl', 'Dessert'], supplement: 6.9 },
];

export const drinks = ['Cola', 'Limonade artisanale', 'Thé glacé maison', 'Eau pétillante'];
export const desserts = ['Cookie praline rose', 'Tarte au chocolat', 'Fromage blanc & coulis'];

export const getCombo = (id?: string) => combos.find((c) => c.id === id);
