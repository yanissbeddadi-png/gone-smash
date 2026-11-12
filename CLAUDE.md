# GONE SMASH — notes projet

- Stack : Vite 5 + React 18 + TS strict + Tailwind 3 + framer-motion 11 + lucide-react. Polices auto-hébergées (@fontsource : Anton display, Inter variable). Pas de router : SPA one-page, tunnel de commande sur le hash `#/commande` (App.tsx).
- Données centralisées dans `src/data/*` (brand, products, ingredients, combos, lyon, nav). Tout ce qui est commercial est DÉMO : ne jamais présenter comme réel.
- Visuels = illustrations SVG générées (`components/burger/BurgerLayer.tsx`, une couche par ingrédient, formes organiques seedées via `utils/shapes.ts`). `BurgerStack` empile les couches (modes none/stagger/live) et sert partout : hero, carte, configurateur, panier, savoir-faire. `LAYER_META` règle hauteur/chevauchement de chaque couche.
- `ProductVisual` affiche `product.photo` si défini, sinon le SVG.
- État : `useCart` (Context + reducer, localStorage `gonesmash.cart.v1`), `useBurgerBuilder` (localStorage `gonesmash.builder.v1`), `useProductModal`. `useFocusTrap` pour modal/tiroir/menu mobile (Échap, focus restauré, scroll bloqué).
- Commande : `utils/order.ts` → interface `OrderProvider`, implémentation `demoOrderProvider` (n'envoie rien). Brancher le vrai système ici.
- Navigation d'étapes du tunnel : cibles absolues (`setStep(step+1)`), pas fonctionnelles, pour qu'un double-clic pendant la transition ne saute pas une étape.
- Grilles avec enfants `min-w-max` : utiliser `grid-cols-[minmax(0,1fr)]` sinon débordement mobile.
- Titres XXL masqués (SplitTitle) : garder `pt/-mt 0.14em` sinon les accents (É, À) sont rognés.
- `html { position: relative }` requis par useScroll (warning framer sinon).
- Tests : `e2e.test.cjs` (Playwright, `npm run test:e2e` sur la preview) — 34 vérifications ; Lighthouse mobile : Perf ~88, A11y/BP/SEO 100.
- Déploiement : GitHub Pages via workflow (branche gh-pages), base Vite `/gone-smash/` (env BASE_PATH pour changer).
