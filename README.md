# GONE SMASH — site de démonstration

Smash burgers à Lyon. React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion. Aucun backend.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de production dans dist/
npm run preview    # sert dist/ sur http://localhost:4173
npm run test:e2e   # 73 tests Playwright (preview lancé, Playwright installé)
```

Déploiement : chaque push sur `main` construit le site et le publie sur la branche `gh-pages` (GitHub Pages) via `.github/workflows/deploy.yml`.
URL : https://yanissbeddadi-png.github.io/gone-smash/ — pour un domaine personnalisé, builder avec `BASE_PATH=/`.

Fonctionnalités clés : configurateur visuel (Surprends-moi, lien de partage `?burger=`, image story 1080×1920, mes créations, calories estimées), panier (passage en menu, accompagnements, jauge cadeau, fidélité à tampons, barre collante mobile), tunnel de commande simulé avec créneaux calculés sur les horaires, hero « anatomie » éclaté au scroll (desktop).

Contenus modifiables : `src/data/` (marque, horaires, frais, carte, ingrédients et prix du configurateur, menus, quartiers).
Photos réelles : déposer le fichier dans `public/images/` puis renseigner `photo` du produit dans `src/data/products.ts`.

⚠️ Marque, adresse, horaires, recettes, prix et commande sont **fictifs** (démonstration).
