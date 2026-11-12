# GONE SMASH — commande de smash burger (démo)

Une page : un burger au centre, on clique sur les aliments, ils tombent dessus en animation. Clic sur une couche = elle s'en va. Puis « Commander » (commande **simulée** : rien n'est envoyé ni payé).

React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion. Aucun backend.

```bash
npm install
npm run dev        # http://localhost:5173/gone-smash/
npm run build      # typecheck + build de production dans dist/
npm run preview    # sert dist/ sur http://localhost:4173/gone-smash/
npm run test:e2e   # 28 tests Playwright (preview lancé, Playwright installé)
```

- Aliments et prix : `src/data/simple.ts`. Horaires, adresse : `src/data/brand.ts` (DÉMO).
- Brancher une vraie prise de commande : `src/utils/order.ts` (`OrderProvider`).
- Déploiement : chaque push sur `main` publie sur GitHub Pages — https://yanissbeddadi-png.github.io/gone-smash/
- L'ancienne version complète (site multi-sections) est sur la branche `v2-complet`.
