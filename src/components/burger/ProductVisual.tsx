import type { Product } from '../../data/types';
import { BurgerStack } from './BurgerStack';

/** Photo réelle si fournie dans la data, sinon illustration SVG. */
export function ProductVisual({ product, className = '', eager = false }: { product: Product; className?: string; eager?: boolean }) {
  if (product.photo)
    return <img src={product.photo.startsWith('/') ? import.meta.env.BASE_URL + product.photo.slice(1) : product.photo} alt={`${product.name} — ${product.ingredients.join(', ')}`} width={800} height={800} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`h-auto w-full object-contain ${className}`} />;
  return <BurgerStack layers={product.layers} seed={product.id.length} className={className} label={`Illustration du burger ${product.name}`} />;
}
