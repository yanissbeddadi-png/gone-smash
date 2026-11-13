# GONE SMASH — commande de smash burger (démo)

Une page : un burger au centre et une **demi-roulette** sur le côté (en bas sur mobile). Étapes : viande → fromage → garniture → sauce → frites → boisson → dessert. Un choix par étape : l'élément tombe sur le burger (ou à côté pour frites, boisson, dessert) et la roulette tourne vers l'étape suivante. Clic sur une couche ou une étape = on y revient pour changer. Puis « Commander » (commande **simulée** : rien n'est envoyé ni payé).

React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion. Aucun backend.

```bash
npm install
npm run dev        # http://localhost:5173/gone-smash/
npm run build      # typecheck + build de production dans dist/
npm run preview    # sert dist/ sur http://localhost:4173/gone-smash/
npm run test:e2e   # 35 tests Playwright (preview lancé, Playwright installé)
```

- Étapes, choix et prix : `src/data/simple.ts`. Horaires, adresse : `src/data/brand.ts` (DÉMO).
- Brancher une vraie prise de commande : `src/utils/order.ts` (`OrderProvider`).
- Déploiement : chaque push sur `main` publie sur GitHub Pages — https://yanissbeddadi-png.github.io/gone-smash/
- L'ancienne version complète (site multi-sections) est sur la branche `v2-complet`.
- La version précédente (boutons autour du burger, sans roulette) est le commit `500f57c`.
