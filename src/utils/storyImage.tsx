import type { Layer } from '../data/types';
import { BurgerLayer, LAYER_META } from '../components/burger/BurgerLayer';
import { euro } from './format';

const W = 1080, H = 1920;

/** Compose les couches SVG du burger en un seul SVG autonome (rendu statique, chargé à la demande). */
async function burgerSvg(layers: Layer[]) {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const pos: { layer: Layer; top: number; h: number }[] = [];
  let bottom = 0;
  layers.forEach((l, i) => {
    const m = LAYER_META[l.kind];
    if (i > 0) bottom -= m.overlap;
    pos.push({ layer: l, top: bottom + m.h, h: m.h }); // provisoire : distance du bas au sommet de la couche
    bottom += m.h;
  });
  const total = Math.max(...pos.map((p) => p.top));
  const markup = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-20 -10 460 ${total + 20}`} width={460} height={total + 20}>
      {pos.map((p) => (
        <svg key={p.layer.id} x={-10} y={total - p.top} width={420} height={p.h} overflow="visible">
          <BurgerLayer layer={p.layer} seed={5} />
        </svg>
      ))}
    </svg>,
  );
  return { markup, ratio: (total + 20) / 460 };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Génère l'image 1080×1920 (format story) du burger composé. */
export async function makeStoryImage(opts: { layers: Layer[]; name: string; price: number; details: string[]; kcal: number }): Promise<Blob> {
  await Promise.all([document.fonts.load('120px Anton'), document.fonts.load('600 36px "Inter Variable"')]).catch(() => undefined);
  const { markup, ratio } = await burgerSvg(opts.layers);
  const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup));

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#171717'; ctx.fillRect(0, 0, W, H);
  // disque orange + anneau
  ctx.fillStyle = '#F4A340'; ctx.beginPath(); ctx.arc(W / 2, 1010, 470, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(245,233,215,.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 1010, 530, 0, Math.PI * 2); ctx.stroke();

  // en-tête
  ctx.fillStyle = '#FAF8F3'; ctx.textBaseline = 'alphabetic';
  ctx.font = '64px Anton'; ctx.fillText('GONE ★ SMASH', 80, 150);
  ctx.fillStyle = '#F4A340'; ctx.font = '600 30px "Inter Variable", sans-serif'; ctx.fillText('MON BURGER COMPOSÉ', 80, 250);
  ctx.fillStyle = '#FAF8F3'; ctx.font = '150px Anton';
  const title = (opts.name.trim() || 'Mon smash').toUpperCase();
  wrap(ctx, title, W - 160).slice(0, 2).forEach((l, i) => ctx.fillText(l, 80, 400 + i * 150));

  // burger
  const bw = 760, bh = Math.min(bw * ratio, 760);
  const bwFit = bh / ratio;
  ctx.drawImage(img, (W - bwFit) / 2, 1010 + 250 - bh, bwFit, bh);

  // prix (sticker)
  ctx.fillStyle = '#8B3028'; ctx.beginPath(); ctx.arc(860, 1340, 125, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FAF8F3'; ctx.textAlign = 'center'; ctx.font = '76px Anton'; ctx.fillText(euro(opts.price).replace(/\s/g, ''), 860, 1366);
  ctx.textAlign = 'left';

  // ingrédients
  ctx.fillStyle = 'rgba(250,248,243,.85)'; ctx.font = '500 34px "Inter Variable", sans-serif';
  wrap(ctx, opts.details.join(' · '), W - 160).slice(0, 4).forEach((l, i) => ctx.fillText(l, 80, 1610 + i * 48));
  ctx.fillStyle = 'rgba(250,248,243,.55)'; ctx.font = '500 26px "Inter Variable", sans-serif';
  ctx.fillText(`≈ ${opts.kcal} kcal (estimation) · Carte de démonstration`, 80, 1850);

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/png'));
}
