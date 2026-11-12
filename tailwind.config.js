/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: { DEFAULT: '#171717', 800: '#1f1f1f', 700: '#2a2a2a', 600: '#3a3a3a' },
        orange: { DEFAULT: '#F4A340', 600: '#E08A22' },
        cream: '#F5E9D7',
        brick: { DEFAULT: '#8B3028', 400: '#B4493E' },
        offwhite: '#FAF8F3',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      letterSpacing: { tightest: '-0.02em' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spinSlow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
