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
  /**
   * Horaires structurés (0 = dimanche … 6 = samedi), plages HH:MM. DÉMO.
   * L'affichage texte (`hoursDisplay`) et les créneaux de retrait en sont dérivés.
   */
  schedule: {
    0: [{ open: '12:00', close: '22:00' }],
    1: [],
    2: [{ open: '11:30', close: '14:30' }, { open: '18:30', close: '22:30' }],
    3: [{ open: '11:30', close: '14:30' }, { open: '18:30', close: '22:30' }],
    4: [{ open: '11:30', close: '14:30' }, { open: '18:30', close: '22:30' }],
    5: [{ open: '11:30', close: '15:00' }, { open: '18:30', close: '23:30' }],
    6: [{ open: '11:30', close: '15:00' }, { open: '18:30', close: '23:30' }],
  } as Record<number, { open: string; close: string }[]>,
  hoursDisplay: [
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
  /** Délai minimum de préparation avant le premier créneau (minutes) */
  prepMinutes: 20,
  /** Offre de démonstration : cadeau dès un montant de panier */
  promo: { threshold: 25, gift: 'Cookie praline rose', isDemo: true },
  /** Fidélité de démonstration : 1 tampon par burger */
  loyalty: { stampsForReward: 10 },
} as const;
