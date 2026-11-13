// Tests Playwright de la page de commande à roulette. Usage : node e2e.test.cjs <url>
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4173/gone-smash/';
const results = [];
const ok = (n, c, x = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n} ${x}`);
const LAYER = '[role=button][aria-label^="Changer"]';
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
  const is = (n) => p.waitForFunction(([s, k]) => document.querySelectorAll(s).length === k, [LAYER, n], { timeout: 3000 }).then(() => true, () => false);
  const at = async (label) => (await p.getByRole('group', { name: new RegExp(`: ${label}$`) }).count()) === 1;
  const pick = (name) => p.getByRole('group').getByRole('button', { name: new RegExp('^' + name) }).click();

  ok('Départ : pain seul à 4,90 €, étape Viande', (await total()).startsWith('4,90') && await at('Viande') && (await is(0)));
  ok('Commander désactivé sans viande', await p.getByRole('button', { name: 'Commander', exact: true }).isDisabled());
  ok('Étapes suivantes verrouillées', await p.getByRole('button', { name: /^Étape 2 : Fromage/ }).isDisabled());
  ok('Pas de « Sans » pour la viande', (await p.getByRole('group').getByRole('button', { name: /^Sans/ }).count()) === 0);
  await pick('Double smash');
  ok('Double smash → 2 steaks + roulette sur Fromage', (await is(2)) && await at('Fromage'));
  ok('Prix 4,90 + 5,00', (await total()).startsWith('9,90'), await total());
  await pick('Sans fromage');
  ok('« Sans » avance sans rien poser', (await is(2)) && await at('Garniture'));
  await pick('Bacon'); await pick('Sauce BBQ');
  ok('Garniture + sauce posées → Frites', (await is(4)) && await at('Frites'));
  await pick('Frites cheddar-bacon');
  ok('Frites posées à côté du burger', await p.getByRole('button', { name: 'Changer : Frites cheddar-bacon' }).isVisible() && await at('Boisson'));
  await pick('Cola'); await pick('Brownie');
  ok('Fin du parcours : « C’est prêt »', await p.getByText('C’est prêt !').isVisible());
  ok('Total 21,30 €', (await total()).startsWith('21,30'), await total());
  await p.locator(`${LAYER}[aria-label="Changer : garniture"]`).click();
  ok('Clic couche → retour à son étape', await at('Garniture'));
  ok('Choix actuel coché', (await p.getByRole('group').getByRole('button', { name: /^Bacon/ }).getAttribute('aria-pressed')) === 'true');
  await pick('Tomate');
  ok('Changer un choix le remplace', (await is(4)) && (await total()).startsWith('20,30') && await at('Sauce'), await total());
  await p.getByRole('button', { name: /^Étape 2 : Fromage/ }).click();
  await pick('Raclette');
  ok('Retour par l’étape + ajout raclette', (await is(5)) && (await total()).startsWith('21,80'), await total());
  await p.getByRole('button', { name: 'Changer : Frites cheddar-bacon' }).click();
  await pick('Sans frites');
  ok('Retirer les frites', (await p.getByRole('button', { name: /^Changer : Frites/ }).waitFor({ state: 'detached', timeout: 3000 }).then(() => true, () => false)) && (await total()).startsWith('17,90'), await total());
  await p.reload({ waitUntil: 'networkidle' });
  ok('Commande conservée après rechargement', (await is(5)) && (await total()).startsWith('17,90'));

  // clavier : Entrée choisit et le focus suit la roulette
  await p.getByRole('button', { name: /^Étape 2 : Fromage/ }).click();
  await p.getByRole('group').getByRole('button', { name: /^Cheddar/ }).focus();
  await p.keyboard.press('Enter');
  ok('Clavier : focus sur l’étape suivante', ((await p.evaluate(() => document.activeElement?.getAttribute('aria-label'))) ?? '').startsWith('Salade'));

  // commande
  await p.getByRole('button', { name: 'Commander', exact: true }).last().click();
  const d = p.getByRole('dialog');
  ok('Panneau commande ouvert', await d.isVisible());
  ok('Récap : Double smash + Cola', await d.getByText('Double smash').isVisible() && await d.getByText('Cola').isVisible());
  ok('Créneau « Dès que possible » quand ouvert', (await d.locator('select option').first().innerText()).startsWith('Dès que possible'));
  await d.getByRole('button', { name: /^Commander ·/ }).click();
  ok('Validation : erreurs affichées', await d.getByText('Indique ton prénom.').isVisible() && await d.getByText(/Numéro français/).isVisible());
  await d.getByLabel('Prénom').fill('Camille'); await d.getByLabel('Téléphone').fill('06 12 34 56 78');
  await d.getByRole('button', { name: /^Commander ·/ }).click();
  await d.getByText('Merci Camille !').waitFor({ timeout: 5000 });
  ok('Confirmation simulée', await d.getByText(/rien n’est envoyé au restaurant, rien n’est payé/).isVisible());
  await d.getByRole('button', { name: 'Faire une autre commande' }).click();
  ok('Tout remis à zéro après commande', (await is(0)) && await at('Viande') && (await total()).startsWith('4,90'));
  await pick('Simple smash');
  await p.getByRole('button', { name: 'Commander', exact: true }).last().click();
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok('Échap ferme le panneau', (await p.getByRole('dialog').count()) === 0);
  await p.getByRole('button', { name: 'Recommencer' }).click();
  ok('Bouton Recommencer', (await is(0)) && await at('Viande'));

  // mobile : roulette en bas, tout visible
  const m = await ctx.newPage(); await m.setViewportSize({ width: 375, height: 700 });
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.getByRole('group').getByRole('button', { name: /^Triple smash/ }).click();
  const box = async (sel) => m.locator(sel).first().boundingBox();
  const g = await m.getByRole('group').getByRole('button').first().boundingBox();
  const bar = await box('.fixed.inset-x-0.bottom-0');
  ok('Mobile : choix visibles au-dessus de la barre', g && bar && g.y + g.height <= bar.y + 1 && g.x >= 0, JSON.stringify(g));
  for (const w of [320, 375, 768, 1024, 1440, 1920]) {
    await m.setViewportSize({ width: w, height: 900 }); await m.waitForTimeout(150);
    ok(`Pas de débordement @${w}px`, (await m.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  }

  // animations actives : parcours complet sans erreur
  const q = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const e2 = []; q.on('console', (x) => { if (['error', 'warning'].includes(x.type())) e2.push(x.text()); }); q.on('pageerror', (e) => e2.push(e.message));
  await q.goto(URL, { waitUntil: 'networkidle' });
  for (const n of ['Simple smash', 'Cheddar', 'Salade', 'Sauce maison', 'Frites classiques', 'Limonade', 'Cookie']) {
    await q.getByRole('group').getByRole('button', { name: new RegExp('^' + n) }).click();
    await q.waitForTimeout(700);
  }
  ok('Animations : parcours complet', (await q.locator(LAYER).count()) === 4 && await q.getByText('C’est prêt !').isVisible());
  ok('Console propre', errs.length === 0 && e2.length === 0, [...errs, ...e2].slice(0, 2).join(' | '));
  console.log(results.join('\n'));
  await b.close();
  process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
})().catch((e) => { console.log(results.join('\n')); console.error('CRASH', e.message.split('\n')[0]); process.exit(1); });
