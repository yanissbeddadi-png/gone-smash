import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex select-none whitespace-nowrap items-center justify-center gap-2 overflow-hidden rounded-full font-semibold uppercase tracking-[0.08em] transition-[transform,background-color,color,box-shadow,border-color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40';
const variants: Record<Variant, string> = {
  primary: 'bg-orange text-charcoal shadow-[0_8px_30px_-8px_rgba(244,163,64,.7)] hover:bg-[#ffb85c] hover:shadow-[0_12px_40px_-8px_rgba(244,163,64,.9)]',
  dark: 'bg-charcoal text-offwhite hover:bg-brick',
  outline: 'border-2 border-current bg-transparent hover:bg-offwhite hover:text-charcoal hover:border-offwhite',
  ghost: 'bg-transparent hover:bg-white/10',
  light: 'bg-offwhite text-charcoal hover:bg-cream',
};
const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.72rem]',
  md: 'h-12 px-6 text-[0.78rem]',
  lg: 'h-14 px-8 text-[0.85rem] sm:h-16 sm:px-10',
};

export const btn = (v: Variant = 'primary', s: Size = 'md', extra = '') => `${base} ${variants[v]} ${sizes[s]} ${extra}`;

interface Common { variant?: Variant; size?: Size; children: ReactNode }

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant = 'primary', size = 'md', className = '', children, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={btn(variant, size, className)} {...rest}>{children}</button>
  ),
);
Button.displayName = 'Button';

export function LinkButton({ variant = 'primary', size = 'md', className = '', children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={btn(variant, size, className)} {...rest}>{children}</a>;
}
