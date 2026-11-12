# GONE SMASH — notes projet

- V3 = page unique de commande : burger au centre, 1 clic aliment = 1 couche animée. La V2 (site complet) vit sur la branche `v2-complet` ; ne pas la remettre sur `main` sans demande.
- Stack : Vite 5 + React 18 + TS strict + Tailwind 3 + framer-motion 11 + lucide-react. Polices @fontsource (Anton, Inter). Base Vite `/gone-smash/` (env BASE_PATH).
- Tout ce qui est commercial est DÉMO (prix, horaires, adresse, commande) : ne jamais présenter comme réel.
- Fichiers clés : `App.tsx` (page), `data/simple.ts` (aliments, prix, limites 3/aliment et 12 couches), `hooks/useStack.ts` (pile ordonnée, localStorage `gonesmash.simple.v1`), `components/OrderSheet.tsx` (formulaire + confirmation simulée), `utils/order.ts` (`OrderProvider`, brancher le vrai système ici), `utils/schedule.ts` (créneaux à l'heure de Lyon).
- Visuels = SVG générés : `burger/BurgerLayer.tsx` (une couche par ingrédient, `LAYER_META` = hauteur/chevauchement), `burger/BurgerStack.tsx` (mode `live` = chute/sortie animées, `onLayerClick` pour retirer).
- Le burger se redimensionne via container queries (`cqh/cqw` + ratio calculé depuis `LAYER_META`).
- Mobile : la scène du burger est `sticky` ; le parent doit rester en `overflow-x-clip` (overflow-x-hidden casse sticky).
- Ne pas mettre `aria-disabled` sur les boutons aliments : ils restent cliquables pour afficher le message de limite.
- Tests : `e2e.test.cjs` (28, Playwright, `npm run test:e2e` sur la preview). Lighthouse mobile : Perf ~98, A11y 100.
