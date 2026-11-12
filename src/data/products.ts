import type { Layer, Product } from './types';

const S = {
  maison: '#E79A57',
  fumee: '#6E3218',
  poivre: '#B89A72',
  moutarde: '#D4A12A',
  secrete: '#D9652E',
};

const L = (kind: Layer['kind'], i: number, extra: Partial<Layer> = {}): Layer => ({ id: `${kind}-${i}`, kind, ...extra });

export const products: Product[] = [
  {
    id: 'le-gone',
    name: 'Le Gone',
    price: 11.9,
    tagline: 'Le classique de la maison',
    description: 'Deux steaks smashés à la plancha, cheddar affiné, oignons caramélisés lentement et notre sauce maison. Simple, net, imparable.',
    ingredients: ['Pain brioché', 'Deux steaks smashés', 'Cheddar', 'Oignons caramélisés', 'Sauce maison'],
    tag: 'Signature',
    accent: 'orange',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.maison }), L('steak', 0), L('cheddar', 0), L('steak', 1), L('cheddar', 1), L('onionCaramel', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
  {
    id: 'le-canut',
    name: 'Le Canut',
    price: 12.9,
    tagline: 'Hommage à la Croix-Rousse',
    description: 'Un steak smashé, Saint-Marcellin coulant, oignons confits et sauce à la moutarde. Le burger qui a grimpé les pentes.',
    ingredients: ['Pain brioché', 'Steak smashé', 'Saint-Marcellin', 'Oignons confits', 'Sauce moutarde'],
    tag: 'Lyonnais',
    accent: 'cream',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.moutarde }), L('steak', 0), L('stmarcellin', 0), L('onionConfit', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
  {
    id: 'le-presquile',
    name: 'Le Presqu’île',
    price: 13.5,
    tagline: 'Entre deux fleuves',
    description: 'Double steak, cheddar, pickles croquants, sauce fumée et oignons croustillants. Le contraste du fondant et du craquant.',
    ingredients: ['Double steak', 'Cheddar', 'Pickles', 'Sauce fumée', 'Oignons croustillants'],
    accent: 'brick',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.fumee }), L('steak', 0), L('cheddar', 0), L('steak', 1), L('pickles', 0), L('onionCrispy', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
  {
    id: 'le-vieux-lyon',
    name: 'Le Vieux Lyon',
    price: 12.9,
    tagline: 'Réconfortant comme une traboule',
    description: 'Steak smashé, raclette fondue généreusement, oignons confits et sauce au poivre. Parfait les soirs où la brume monte de la Saône.',
    ingredients: ['Pain brioché', 'Steak smashé', 'Raclette', 'Oignons confits', 'Sauce poivre'],
    accent: 'orange',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.poivre }), L('steak', 0), L('raclette', 0), L('onionConfit', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
  {
    id: 'le-veggie',
    name: 'Le Veggie',
    price: 11.5,
    tagline: 'Zéro viande, plein de caractère',
    description: 'Galette végétale saisie à la plancha, cheddar fondu, légumes grillés et sauce maison. Végétarien, pas triste.',
    ingredients: ['Pain brioché', 'Galette végétale', 'Cheddar', 'Légumes grillés', 'Sauce maison'],
    tag: 'Végétarien',
    accent: 'cream',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.maison }), L('lettuce', 0), L('veggie', 0), L('cheddar', 0), L('grilledVeg', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
  {
    id: 'le-double-trouble',
    name: 'Le Double Trouble',
    price: 14.9,
    tagline: 'Pour les très grandes faims',
    description: 'Double steak, double cheddar, bacon croustillant, pickles et notre sauce secrète. On vous aura prévenus.',
    ingredients: ['Double steak', 'Double cheddar', 'Bacon', 'Pickles', 'Sauce secrète'],
    tag: 'Le plus généreux',
    accent: 'brick',
    layers: [L('bunBottom', 0, { bun: 'brioche' }), L('sauce', 0, { color: S.secrete }), L('steak', 0), L('cheddar', 0), L('steak', 1), L('cheddar', 1), L('bacon', 0), L('pickles', 0), L('bunTop', 0, { bun: 'brioche' })],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const minPrice = Math.min(...products.map((p) => p.price));
