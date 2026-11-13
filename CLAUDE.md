# GONE SMASH — notes projet

- V4 = page unique de commande : burger au centre + demi-roulette d'étapes (desktop : collée au bord droit, `fixed` ; mobile : en bas). 1 choix par étape → l'élément est posé et la roulette tourne d'un demi-tour vers l'étape suivante. La V2 (site complet) vit sur la branche `v2-complet` ; ne pas la remettre sur `main` sans demande.
- Stack : Vite 5 + React 18 + TS strict + Tailwind 3 + framer-motion 11 + lucide-react. Polices @fontsource (Anton, Inter). Base Vite `/gone-smash/` (env BASE_PATH).
- Tout ce qui est commercial est DÉMO (prix, horaires, adresse, commande) : ne jamais présenter comme réel.
- Fichiers clés : `App.tsx` (page, étapes cliquables), `data/simple.ts` (`steps` : viande, fromage, garniture, sauce, frites, boisson, dessert ; option `none` = « Sans »), `hooks/useOrder.ts` (un choix par étape, localStorage `gonesmash.v4`, dérive couches/accompagnements/total), `components/Wheel.tsx` (roulette), `components/Sides.tsx` (SVG frites/boisson/dessert), `components/OrderSheet.tsx` (formulaire + confirmation simulée), `utils/order.ts` (`OrderProvider`, brancher le vrai système ici), `utils/schedule.ts` (créneaux à l'heure de Lyon).
- Roulette : le disque a un « tour » cumulé (+1 avance, −1 recule) ; l'étape courante est dessinée sur la moitié visible, l'étape quittée sur la moitié cachée (`aria-hidden`). Les choix restent droits via une contre-rotation (`useTransform`). Positionner avec `x/y` framer, pas les classes `translate` (le `rotate` inline les écrase).
- Visuels = SVG générés : `burger/BurgerLayer.tsx` (`LAYER_META` = hauteur/chevauchement), `burger/BurgerStack.tsx` (mode `live` = chute/sortie animées ; ids de couche `étape-option-k` pour animer un remplacement).
- La scène du burger utilise les container queries sur un div `absolute inset-0` : un élément `flex-1` en `container-type:size` donne `cqh = 0` dans Chrome.
- Le parent racine reste en `overflow-x-clip`.
- Tests : `e2e.test.cjs` (35, Playwright, `npm run test:e2e` sur la preview). Lighthouse mobile : Perf ~98, A11y 100.
