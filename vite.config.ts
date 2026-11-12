import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base GitHub Pages (https://<user>.github.io/gone-smash/). Mettre '/' pour un domaine personnalisé.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/gone-smash/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] } },
    },
  },
});
