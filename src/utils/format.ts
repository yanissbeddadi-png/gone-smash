const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
export const euro = (n: number) => fmt.format(n);
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const uid = () => Math.random().toString(36).slice(2, 10);
