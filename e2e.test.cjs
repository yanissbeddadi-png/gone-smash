const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://localhost:5173/';
const results = [];
const ok = (name, cond, extra = '') => { results.push(`${cond ? 'PASS' : 'FAIL'}  ${name} ${extra}`); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('Reduced Motion enabled')) errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  const badge = async () => (await p.getByRole('button', { name: /Ouvrir le panier/ }).getAttribute('aria-label')).match(/(\d+) article/)[1];

  // 1. Ajout depuis la carte
  await p.locator('#carte article').first().getByRole('button', { name: /Ajouter au panier/ }).click();
  ok('Ajout produit carte → compteur 1', (await badge()) === '1');
  ok('Toast de confirmation', await p.getByText('ajouté au panier').waitFor({ timeout: 3000 }).then(() => true, () => false));

  // 2. Configurateur
  const total = async () => (await p.locator('#composer aside [aria-live=polite]').innerText()).trim();
  const t0 = await total();
  const layersBefore = await p.locator('#composer [role=img] .burger-spread').count();
  await p.locator('#composer').getByRole('button', { name: /Viande/ }).first().click();
  await p.locator('#composer fieldset').getByText('Trois steaks smashés').click();
  await p.waitForTimeout(500);
  const t1 = await total();
  const layersAfter = await p.locator('#composer [role=img] .burger-spread').count();
  ok('Configurateur : 3 steaks → prix change', t0 !== t1, `${t0} → ${t1}`);
  ok('Configurateur : couches visuelles ajoutées', layersAfter === layersBefore + 2, `${layersBefore} → ${layersAfter}`);
  await p.locator('#composer').getByRole('button', { name: /Garnitures/ }).first().click();
  await p.locator('#composer fieldset').getByText('Bacon', { exact: true }).click();
  await p.locator('#composer fieldset').getByText('Pickles', { exact: true }).click(); // retrait
  await p.waitForTimeout(500);
  const t2 = await total();
  ok('Garnitures multi-choix (bacon +1,50, pickles -0,50)', t2 !== t1, `${t1} → ${t2}`);
  const expected = (4.9 + 0 + 8 + 1 + 0.8 + 1.5).toFixed(2).replace('.', ',');
  ok('Calcul du prix exact', t2.startsWith(expected), `${t2} vs ${expected}`);
  await p.locator('#composer').getByRole('button', { name: /Récap/ }).first().click();
  await p.getByPlaceholder('Ex. Le Fourvière').fill('Le Test');
  await p.locator('#composer aside').getByRole('button', { name: /Ajouter mon burger au panier/ }).click();
  ok('Burger composé ajouté → compteur 2', (await badge()) === '2');
  await p.getByRole('button', { name: 'Réinitialiser la composition' }).click();
  await p.waitForTimeout(300);
  ok('Réinitialisation', (await total()).startsWith('13,20'), await total());

  // 3. Persistance
  await p.reload({ waitUntil: 'networkidle' });
  ok('Panier persistant après rechargement', (await badge()) === '2');

  // 4. Tiroir panier
  await p.getByRole('button', { name: /Ouvrir le panier/ }).click();
  const dlg = p.getByRole('dialog', { name: /Panier/ });
  ok('Tiroir panier ouvert', await dlg.isVisible());
  ok('Personnalisation affichée', await dlg.getByText('« Le Test »').isVisible());
  await dlg.getByRole('button', { name: 'Ajouter un Le Gone' }).click();
  ok('Quantité +1 → compteur 3', (await badge()) === '3');
  const dTotal = await dlg.locator('dd.display').innerText();
  ok('Total tiroir (2×11,90 + 16,20 + 0,50 = 40,50)', dTotal.startsWith('40,50'), dTotal);
  await dlg.getByRole('button', { name: /Supprimer « Le Test »/ }).click();
  await p.waitForTimeout(400);
  ok('Suppression ligne → compteur 2', (await badge()) === '2');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok('Échap ferme le tiroir', !(await dlg.isVisible()));

  // 5. Modal produit depuis menu combo
  await p.locator('#menus').getByRole('button', { name: /Choisir ce menu/ }).nth(2).click();
  const modal = p.getByRole('dialog').filter({ has: p.locator('#pm-title') });
  ok('Modal formule ouverte', await modal.isVisible());
  await modal.getByRole('button', { name: 'Le Canut' }).click();
  ok('Choix dessert affiché (Menu Gone)', await modal.getByLabel('Dessert').isVisible());
  await modal.getByRole('button', { name: /Ajouter ·/ }).click();
  await p.waitForTimeout(400);
  ok('Menu ajouté → compteur 3', (await badge()) === '3');

  // 6. Tunnel de commande
  await p.getByRole('button', { name: /Ouvrir le panier/ }).click();
  await p.getByRole('dialog', { name: /Panier/ }).getByRole('button', { name: /^Commander/ }).click();
  await p.waitForTimeout(600);
  ok('Route #/commande', p.url().includes('#/commande'));
  await p.getByRole('button', { name: /^Continuer/ }).click();
  await p.getByText('Sur place', { exact: true }).click();
  await p.getByRole('button', { name: /^Continuer/ }).click();
  await p.getByRole('heading', { name: 'Tes coordonnées' }).waitFor(); await p.waitForTimeout(400); await p.getByRole('button', { name: /^Continuer/ }).click(); // sans remplir
  ok('Validation formulaire (erreurs affichées)', await p.getByText('Vérifie les champs indiqués.').isVisible());
  await p.getByLabel(/Prénom/).fill('Camille');
  await p.getByLabel(/Téléphone/).fill('06 12 34 56 78');
  await p.getByRole('button', { name: /^Continuer/ }).click();
  ok('Récapitulatif', await p.getByText('On vérifie tout').isVisible());
  await p.getByRole('button', { name: /Simuler la commande/ }).click();
  await p.getByText(/Merci,/).waitFor({ timeout: 4000 });
  ok('Confirmation simulée', await p.getByText(/aucune commande n’a été transmise/).isVisible());
  ok('Panier vidé après confirmation', (await badge()) === '0');
  await p.getByRole('link', { name: 'Retour à l’accueil', exact: true }).click();
  await p.waitForTimeout(600);
  ok('Retour accueil', await p.locator('#hero-title').isVisible());

  // 7. Panier vide
  await p.getByRole('button', { name: /Ouvrir le panier/ }).click();
  ok('État panier vide', await p.getByText('Ton panier crie famine.').isVisible());
  await p.keyboard.press('Escape');

  // 8. Menu mobile + débordements
  const m = await b.newPage({ viewport: { width: 375, height: 812 } });
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await m.waitForTimeout(700);
  ok('Menu mobile ouvert', await m.getByRole('dialog', { name: 'Menu' }).isVisible());
  await m.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: /La carte/ }).click();
  await m.waitForFunction(() => Math.abs(document.getElementById('carte').getBoundingClientRect().top) < 120, null, { timeout: 4000 }).catch(() => {});
  ok('Lien menu mobile → section carte', Math.abs(await m.evaluate(() => document.getElementById('carte').getBoundingClientRect().top)) < 120);
  for (const w of [320, 375, 768, 1024, 1280, 1920]) {
    await m.setViewportSize({ width: w, height: 900 });
    await m.waitForTimeout(200);
    const over = await m.evaluate(() => {
      const bad = [];
      document.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed') { let a = el, clipped = false; while ((a = a.parentElement)) { const o = getComputedStyle(a); if (o.overflowX !== 'visible' || o.overflow === 'hidden') { clipped = true; break; } } if (!clipped) bad.push(el.tagName + '.' + String(el.className).slice(0, 40)); } });
      return { sw: document.documentElement.scrollWidth - innerWidth, bad: bad.slice(0, 3) };
    });
    ok(`Pas de débordement horizontal @${w}px`, over.sw <= 0 && over.bad.length === 0, JSON.stringify(over));
  }
  ok('Console sans erreur ni warning', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(results.join('\n'));
  await b.close();
})().catch(async (e) => { console.log(results.join('\n')); console.error('CRASH', e.message); process.exit(1); });
