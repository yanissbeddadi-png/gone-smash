/** Paramètres de marque — DONNÉES DE DÉMONSTRATION à remplacer avant exploitation. */
export const brand = {
  name: 'GONE SMASH',
  signature: 'DU GOÛT. DU CARACTÈRE. DU LOCAL.',
  baseline: 'Le smash burger qui a du caractère.',
  city: 'Lyon',
  address: {
    street: '12 rue de l’Exemple',
    zip: '69002',
    city: 'Lyon',
    district: 'Presqu’île',
    isDemo: true,
  },
  phone: '04 00 00 00 00',
  email: 'bonjour@gonesmash.example',
  instagram: { handle: '@gonesmash.demo', url: 'https://www.instagram.com/' },
  hours: [
    { days: 'Lundi', time: 'Fermé' },
    { days: 'Mardi – Jeudi', time: '11h30 – 14h30 · 18h30 – 22h30' },
    { days: 'Vendredi – Samedi', time: '11h30 – 15h00 · 18h30 – 23h30' },
    { days: 'Dimanche', time: '12h00 – 22h00' },
  ],
  fees: {
    /** Frais de service affichés dans le panier (démo) */
    service: 0.5,
    /** Emballage à emporter (démo) */
    takeaway: 0.4,
  },
  pickupSlots: ['Dès que possible', '12h00', '12h30', '13h00', '19h00', '19h30', '20h00', '20h30', '21h00'],
} as const;
