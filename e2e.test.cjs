// Tests Playwright de la page de commande simple. Usage : node e2e.test.cjs <url>
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4173/gone-smash/';
const results = [];
const ok = (n, c, x = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n} ${x}`);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('Reduced Motion')) errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push(e.message));
  await p.clock.setFixedTime(new Date('2026-11-10T11:00:00Z')); // mardi 12h00 à Lyon (ouvert)
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  const total = async () => (await p.locator('.display.tabular-nums').innerText()).trim();
  const layers = () => p.locator('[role=button][aria-label^="Retirer"]').count();
  // attend que le nombre de couches se stabilise (sorties animées)
  const is = (n) => p.waitForFunction((k) => document.querySelectorAll('[role=button][aria-label^="Retirer"]').length === k, n, { timeout: 3000 }).then(() => true, () => false);
  const add = (name) => p.getByRole('button', { name: new RegExp('^Ajouter ' + name) }).first().click();

  ok('Départ : pain seul à 4,90 €', (await total()).startsWith('4,90') && (await layers()) === 0);
  ok('Commander désactivé si burger vide', await p.getByRole('button', { name: 'Commander' }).isDisabled());
  await add('Steak smashé'); await add('Cheddar');
  ok('Clic → couches ajoutées', (await layers()) === 2);
  ok('Prix mis à jour (4,90 + 2,50 + 1,00)', (await total()).startsWith('8,40'), await total());
  await add('Steak smashé'); await add('Steak smashé'); await add('Steak smashé');
  ok('3 max par aliment (3 steaks + cheddar)', await is(4));
  ok('Message limite', await p.getByText('3 steak smashé maximum').isVisible());
  await p.locator('[role=button][aria-label="Retirer Cheddar du burger"]').click();
  ok('Clic sur une couche → retirée', (await is(3)) && (await total()).startsWith('12,40'), await total());
  await p.getByRole('button', { name: 'Retirer un Steak smashé' }).click();
  ok('Bouton − retire un aliment', await is(2));
  await p.getByRole('button', { name: 'Annuler' }).click();
  ok('Annuler retire la dernière couche', await is(1));
  await add('Bacon'); await add('Pickles');
  await p.reload({ waitUntil: 'networkidle' });
  ok('Burger conservé après rechargement', await is(3));
  await p.getByRole('button', { name: 'Vider' }).click();
  ok('Vider', await is(0));

  // limite totale
  for (const n of ['Steak smashé', 'Cheddar', 'Raclette', 'Bacon']) for (let i = 0; i < 3; i++) await add(n);
  await add('Pickles');
  ok('12 couches maximum', (await is(12)) && await p.getByText(/Burger plein/).isVisible());
  await p.getByRole('button', { name: 'Vider' }).click();
  await is(0);

  // commande
  await add('Steak smashé'); await add('Cheddar'); await add('Pickles');
  await p.getByRole('button', { name: 'Commander' }).click();
  const d = p.getByRole('dialog');
  ok('Panneau commande ouvert', await d.isVisible());
  ok('Récap : 1 × Steak smashé', await d.getByText('1 × Steak smashé').isVisible());
  ok('Créneau « Dès que possible » quand ouvert', (await d.locator('select option').first().innerText()).startsWith('Dès que possible'));
  await d.getByRole('button', { name: /^Commander ·/ }).click();
  ok('Validation : erreurs affichées', await d.getByText('Indique ton prénom.').isVisible() && await d.getByText(/Numéro français/).isVisible());
  await d.getByLabel('Prénom').fill('Camille'); await d.getByLabel('Téléphone').fill('06 12 34 56 78');
  await d.getByRole('button', { name: /^Commander ·/ }).click();
  await d.getByText('Merci Camille !').waitFor({ timeout: 5000 });
  ok('Confirmation simulée', await d.getByText(/rien n’est envoyé au restaurant, rien n’est payé/).isVisible());
  await d.getByRole('button', { name: 'Faire un autre burger' }).click();
  ok('Burger vidé après commande', await is(0));
  await add('Bacon');
  await p.getByRole('button', { name: 'Commander' }).click();
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok('Échap ferme le panneau', (await p.getByRole('dialog').count()) === 0);

  // mobile : burger toujours visible en scrollant
  const m = await ctx.newPage(); await m.setViewportSize({ width: 375, height: 700 });
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.getByRole('button', { name: /^Ajouter Sauce maison/ }).click();
  await m.waitForTimeout(300);
  ok('Mobile : burger collant visible', Math.abs(await m.evaluate(() => document.querySelector('section[aria-label="Ton burger"]').getBoundingClientRect().top)) < 2);
  for (const w of [320, 375, 768, 1024, 1440, 1920]) {
    await m.setViewportSize({ width: w, height: 900 }); await m.waitForTimeout(150);
    ok(`Pas de débordement @${w}px`, (await m.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  }

  // animations actives : pas d'erreur
  const q = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const e2 = []; q.on('console', (x) => { if (['error', 'warning'].includes(x.type())) e2.push(x.text()); }); q.on('pageerror', (e) => e2.push(e.message));
  await q.goto(URL, { waitUntil: 'networkidle' });
  for (const n of ['Steak smashé', 'Cheddar', 'Tomate', 'Salade']) await q.getByRole('button', { name: new RegExp('^Ajouter ' + n) }).click();
  await q.waitForTimeout(1200);
  ok('Animations : couches posées', (await q.locator('[role=button][aria-label^="Retirer"]').count()) === 4);
  ok('Console propre', errs.length === 0 && e2.length === 0, [...errs, ...e2].slice(0, 2).join(' | '));
  console.log(results.join('\n'));
  await b.close();
  process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
})().catch((e) => { console.log(results.join('\n')); console.error('CRASH', e.message.split('\n')[0]); process.exit(1); });
