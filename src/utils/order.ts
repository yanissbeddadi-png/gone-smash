import type { CartItem } from '../hooks/useCart';

/**
 * Couche d'abstraction commande. Pour une exploitation réelle, implémenter
 * OrderProvider vers le système de caisse / commande choisi (API, webhook…)
 * et remplacer `orderProvider` ci-dessous. Aucun paiement n'est géré ici.
 */
export interface OrderPayload {
  mode: 'surplace' | 'emporter';
  customer: { name: string; phone: string; email?: string };
  slot: string;
  notes?: string;
  items: Pick<CartItem, 'name' | 'qty' | 'unitPrice' | 'details'>[];
  subtotal: number;
  fees: { label: string; amount: number }[];
  total: number;
}

export interface OrderResult {
  reference: string;
  simulated: boolean;
}

export interface OrderProvider {
  submit(order: OrderPayload): Promise<OrderResult>;
}

/** Fournisseur de démonstration : n'envoie rien, ne débite rien. */
export const demoOrderProvider: OrderProvider = {
  async submit() {
    await new Promise((r) => setTimeout(r, 900));
    return { reference: `DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, simulated: true };
  },
};

export const orderProvider: OrderProvider = demoOrderProvider;
