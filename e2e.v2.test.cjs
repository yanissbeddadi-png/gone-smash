const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.argv[2] || 'http://localhost:5173/gone-smash/';
const results = [];
const ok = (n, c, x = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n} ${x}`);
// trouve une date (UTC) tombant un jour donné de la semaine à Paris, à une heure donnée (Paris = UTC+1 en novembre)
const at = (weekday, hh, mm) => { const d = new Date(Date.UTC(2026, 10, 9, hh - 1, mm)); while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1); return d; };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('Reduced Motion')) errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  await p.clock.setFixedTime(at(2, 12, 0)); // mardi 12h00 (ouvert)
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await p.reload({ waitUntil: 'networkidle' });
  const C = p.locator('#composer');
  const total = async () => (await C.locator('aside [aria-live=polite]').innerText()).trim();

  // Surprends-moi
  const before = await C.locator('[role=img]').first().getAttribute('aria-label');
  let changed = false;
  for (let i = 0; i < 4 && !changed; i++) { await C.getByRole('button', { name: /Surprends-moi/ }).click(); await p.waitForTimeout(250); changed = (await C.locator('[role=img]').first().getAttribute('aria-label')) !== before; }
  ok('Surprends-moi change la composition', changed);
  ok('Calories estimées affichées', await C.getByText(/kcal/).first().isVisible());

  // Partage aller-retour
  await C.getByRole('button', { name: /Récap/ }).first().click();
  await C.getByPlaceholder('Ex. Le Fourvière').fill('Le Test Partage');
  const priceShared = await total();
  await C.getByRole('button', { name: 'Partager' }).click();
  await p.waitForTimeout(300);
  const link = await p.evaluate(() => navigator.clipboard.readText());
  ok('Lien de partage copié', link.includes('?burger=') && link.includes('#composer'), link.slice(0, 90));
  ok('Toast « lien copié »', await p.getByText('Lien copié').isVisible());
  const p2 = await ctx.newPage();
  await p2.clock.setFixedTime(at(2, 12, 0));
  await p2.goto(link, { waitUntil: 'networkidle' });
  await p2.waitForTimeout(600);
  ok('Lien ouvert : bannière burger partagé', await p2.getByText('Burger partagé par un gone').isVisible());
  ok('Lien ouvert : même prix', (await p2.locator('#composer aside [aria-live=polite]').innerText()).trim() === priceShared, priceShared);
  ok('Lien ouvert : nom repris', (await p2.getByPlaceholder('Ex. Le Fourvière').inputValue()) === 'Le Test Partage');
  ok('URL nettoyée après lecture', !p2.url().includes('burger='));
  await p2.close();

  // Export story
  const dlP = p.waitForEvent('download', { timeout: 40000 }).catch(async (e) => { await p.screenshot({ path: 'dbg-story.png' }); console.log('TOASTS:', await p.locator('[aria-live=polite]').allInnerTexts()); throw e; });
  await C.getByRole('button', { name: 'Story' }).click();
  const dl = await dlP;
  const file = await dl.path(); const buf = fs.readFileSync(file);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  ok('Export story PNG 1080×1920', buf.slice(1, 4).toString() === 'PNG' && w === 1080 && h === 1920, `${w}x${h} ${Math.round(buf.length / 1024)} Ko`);
  fs.copyFileSync(file, 'story.png');

  // Créations
  await C.getByRole('button', { name: 'Sauver' }).click();
  ok('Création sauvegardée', await C.getByRole('heading', { name: 'Mes créations' }).isVisible());
  await p.reload({ waitUntil: 'networkidle' });
  ok('Créations persistantes', await p.locator('#composer p', { hasText: 'Le Test Partage' }).first().isVisible());
  await C.getByRole('button', { name: 'Supprimer la création Le Test Partage' }).click();
  await p.waitForTimeout(400);
  ok('Création supprimée', !(await C.getByRole('heading', { name: 'Mes créations' }).isVisible()));

  // Upsell & promo
  await p.locator('#carte article').first().getByRole('button', { name: /Ajouter au panier/ }).click();
  await p.getByRole('button', { name: /Ouvrir le panier/ }).click();
  const D = p.getByRole('dialog', { name: /Panier/ });
  ok('Jauge promo affichée', await D.getByText(/Plus que .* pour un cookie/).isVisible());
  await D.getByRole('button', { name: /Passe Le Gone en menu/ }).click();
  await p.waitForTimeout(300);
  ok('Passage en menu (ligne remplacée)', await D.getByText('Le Gone · Menu Classique').isVisible() && (await D.getByRole('button', { name: /^Supprimer .* du panier/ }).count()) === 1);
  await D.getByRole('button', { name: /Ajouter Frites maison/ }).click();
  await p.waitForTimeout(300);
  ok('Extra ajouté en 1 tap', await D.getByText('Frites maison', { exact: true }).isVisible());
  await D.getByRole('button', { name: /Ajouter un Le Gone · Menu Classique/ }).click();
  await p.waitForTimeout(300);
  ok('Seuil promo atteint → cadeau', await D.getByText(/Cookie praline rose offert/).first().isVisible());
  ok('Carte fidélité dans le panier', await D.getByText(/Carte fidélité/).isVisible());

  // Tunnel : créneaux + tampons
  await D.getByRole('button', { name: /^Commander/ }).click();
  await p.getByRole('heading', { name: 'Ton panier' }).waitFor();
  await p.getByRole('button', { name: /^Continuer/ }).click();
  await p.getByRole('heading', { name: /Sur place ou/ }).waitFor();
  const first = await p.locator('select').first().locator('option').first().innerText();
  ok('Créneau « Dès que possible » quand ouvert', first.startsWith('Dès que possible'), first);
  const second = await p.locator('select').first().locator('option').nth(1).innerText();
  ok('Premier créneau = maintenant + 20 min arrondi', second === 'Aujourd’hui · 12h30', second);
  ok('Badge ouvert', await p.getByText(/Ouvert · ferme à 14h30/).first().isVisible());
  await p.getByRole('button', { name: /^Continuer/ }).click();
  await p.getByRole('heading', { name: 'Tes coordonnées' }).waitFor();
  await p.getByLabel(/Prénom/).fill('Camille'); await p.getByLabel(/Téléphone/).fill('0612345678');
  await p.getByRole('button', { name: /^Continuer/ }).click();
  await p.getByRole('heading', { name: 'On vérifie tout' }).waitFor();
  await p.getByRole('button', { name: /Simuler la commande/ }).click();
  await p.getByText(/Merci,/).waitFor({ timeout: 5000 });
  ok('Tampons gagnés (2 burgers)', await p.getByText('+2 tampons sur ta carte fidélité').isVisible());
  ok('Tampons persistés', (await p.evaluate(() => localStorage.getItem('gonesmash.loyalty.v1'))) === '2');

  // Fermé (lundi)
  const p3 = await ctx.newPage();
  await p3.clock.setFixedTime(at(1, 15, 0));
  await p3.goto(URL, { waitUntil: 'networkidle' });
  ok('Badge fermé le lundi', await p3.getByText('Fermé · ouvre demain à 11h30').first().isVisible());
  await p3.locator('#carte article').first().getByRole('button', { name: /Ajouter au panier/ }).click();
  await p3.evaluate(() => { location.hash = '#/commande'; });
  await p3.getByRole('button', { name: /^Continuer/ }).click();
  await p3.getByRole('heading', { name: /Sur place ou/ }).waitFor();
  const f3 = await p3.locator('select').first().locator('option').first().innerText();
  ok('Créneaux du lendemain quand fermé', f3 === 'Demain · 11h45', f3);
  await p3.close();

  // Mobile : barre collante
  const m = await ctx.newPage(); await m.setViewportSize({ width: 375, height: 812 });
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.evaluate(() => localStorage.removeItem('gonesmash.cart.v1')); await m.reload({ waitUntil: 'networkidle' });
  ok('Barre collante absente panier vide', !(await m.getByRole('button', { name: /Voir mon panier/ }).isVisible()));
  await m.locator('#carte article').first().getByRole('button', { name: /Ajouter au panier/ }).click();
  await m.waitForTimeout(500);
  ok('Barre collante mobile visible', await m.getByRole('button', { name: /Voir mon panier/ }).isVisible());
  await m.getByRole('button', { name: /Voir mon panier/ }).click();
  ok('Barre → ouvre le panier', await m.getByRole('dialog', { name: /Panier/ }).isVisible());
  await m.close();

  // Animations actives : intro, vol, rideau, sans erreurs
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const q = await ctx2.newPage();
  const errs2 = []; q.on('console', (x) => { if (['error', 'warning'].includes(x.type())) errs2.push(x.text()); }); q.on('pageerror', (e) => errs2.push(e.message));
  await q.goto(URL, { waitUntil: 'networkidle' });
  ok('Intro affichée à la 1re visite', await q.locator('.fixed.inset-0.z-\\[90\\]').count() === 1);
  await q.waitForTimeout(2200);
  ok('Intro disparue', await q.locator('.fixed.inset-0.z-\\[90\\]').count() === 0);
  await q.reload({ waitUntil: 'networkidle' });
  ok('Intro non rejouée dans la session', await q.locator('.fixed.inset-0.z-\\[90\\]').count() === 0);
  for (const id of ['histoire', 'menus', 'lyon']) {
    await q.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id); await q.waitForTimeout(1400);
    const tf = await q.evaluate((i) => [...document.querySelectorAll(`#${i} h2 > span > span`)].map((x) => getComputedStyle(x).transform), id);
    ok(`Titre XXL révélé au scroll (#${id})`, tf.length > 0 && tf.every((t) => t === 'none' || t.endsWith(', 0)')), tf.join(' '));
  }
  await q.evaluate(() => document.getElementById('carte').scrollIntoView({ behavior: 'instant' })); await q.waitForTimeout(800);
  await q.locator('#carte article').nth(2).getByRole('button', { name: /Ajouter au panier/ }).click();
  await q.waitForTimeout(150);
  ok('Burger en vol vers le panier', await q.locator('.fixed.z-\\[80\\]').count() >= 1);
  await q.waitForTimeout(1000);
  ok('Vol terminé (nettoyé)', await q.locator('.fixed.z-\\[80\\]').count() === 0);
  await q.mouse.move(700, 400); await q.waitForTimeout(200);
  ok('Curseur personnalisé desktop', await q.locator('.fixed.z-\\[100\\]').count() === 1);
  await q.evaluate(() => { location.hash = '#/commande'; }); await q.waitForTimeout(250);
  ok('Rideau de transition', await q.locator('.fixed.inset-0.z-\\[85\\]').count() === 1);
  await q.waitForTimeout(1200);
  ok('Console sans erreur (animations actives)', errs2.length === 0, errs2.slice(0, 2).join(' | '));
  ok('Console sans erreur (parcours)', errs.length === 0, errs.slice(0, 2).join(' | '));
  console.log(results.join('\n'));
  await b.close();
})().catch((e) => { console.log(results.join('\n')); console.error('CRASH', e.message.split('\n').slice(0, 4).join(' ')); process.exit(1); });
