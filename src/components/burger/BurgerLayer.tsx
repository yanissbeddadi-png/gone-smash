import { memo, useId } from 'react';
import type { Layer, LayerKind } from '../../data/types';
import { blob, rng, scatter } from '../../utils/shapes';

/** Hauteur (unités viewBox, largeur 400) et chevauchement avec la couche inférieure */
export const LAYER_META: Record<LayerKind, { h: number; overlap: number }> = {
  bunBottom: { h: 70, overlap: 0 },
  sauce: { h: 22, overlap: 12 },
  lettuce: { h: 38, overlap: 18 },
  tomato: { h: 30, overlap: 12 },
  steak: { h: 62, overlap: 9 },
  veggie: { h: 62, overlap: 9 },
  cheddar: { h: 46, overlap: 33 },
  raclette: { h: 52, overlap: 38 },
  stmarcellin: { h: 40, overlap: 26 },
  pickles: { h: 34, overlap: 12 },
  onionCaramel: { h: 32, overlap: 12 },
  onionConfit: { h: 32, overlap: 12 },
  onionCrispy: { h: 32, overlap: 12 },
  bacon: { h: 32, overlap: 12 },
  grilledVeg: { h: 32, overlap: 12 },
  bunTop: { h: 168, overlap: 18 },
};

interface Props {
  layer: Layer;
  seed?: number;
}

function Svg({ h, children, label }: { h: number; children: React.ReactNode; label?: string }) {
  return (
    <svg viewBox={`-10 0 420 ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden={label ? undefined : true} overflow="visible" style={{ display: 'block' }}>
      {children}
    </svg>
  );
}

function BunTop({ potato }: { potato: boolean }) {
  const id = useId().replace(/:/g, '');
  const base = potato ? '#E8B45A' : '#C9702A';
  const light = potato ? '#F6D58E' : '#E79A45';
  const dark = potato ? '#C48A34' : '#8E4718';
  const seeds = potato ? [] : scatter(18, 7, 70, 330, 30, 105);
  return (
    <Svg h={168}>
      <defs>
        <linearGradient id={`bt${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      {/* mie visible sous le chapeau */}
      <path d="M26,140 Q200,170 374,140 L370,156 Q200,176 30,156Z" fill="#F2D49B" />
      <path d="M30,154 Q200,174 370,154" stroke="#B5662A" strokeWidth="3" fill="none" opacity=".55" />
      {/* dôme */}
      <path d="M18,138 C14,70 92,14 200,12 C308,14 386,70 382,138 Q382,152 362,152 Q200,166 38,152 Q18,152 18,138Z" fill={`url(#bt${id})`} />
      {/* brillance dorure */}
      <path d="M78,62 C110,34 168,26 214,28" stroke="#fff" strokeOpacity={potato ? 0.35 : 0.5} strokeWidth="14" strokeLinecap="round" fill="none" />
      <ellipse cx="260" cy="40" rx="20" ry="7" fill="#fff" opacity={potato ? 0.2 : 0.32} transform="rotate(12 260 40)" />
      {seeds.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y + Math.abs(s.x - 200) * 0.18} rx="4.6" ry="2.4" fill="#FBEBC8" stroke="#D9B179" strokeWidth=".6" transform={`rotate(${(s.s - 0.5) * 70} ${s.x} ${s.y + Math.abs(s.x - 200) * 0.18})`} />
      ))}
      {potato && <path d="M60,110 Q200,128 340,110" stroke="#fff" strokeOpacity=".18" strokeWidth="5" fill="none" />}
      <path d="M22,138 Q200,162 378,138" stroke={dark} strokeWidth="4" fill="none" opacity=".6" />
    </Svg>
  );
}

function BunBottom({ potato }: { potato: boolean }) {
  const base = potato ? '#E3AE55' : '#C46C2A';
  return (
    <Svg h={70}>
      <path d="M24,14 Q200,4 376,14 L370,48 Q366,66 340,66 L60,66 Q34,66 30,48Z" fill={base} />
      <path d="M24,14 Q200,4 376,14 L374,26 Q200,18 26,26Z" fill="#F2D49B" />
      <path d="M26,26 Q200,18 374,26" stroke="#B5662A" strokeWidth="3" fill="none" opacity=".7" />
      <path d="M44,58 Q200,64 356,58" stroke="#000" strokeOpacity=".18" strokeWidth="6" fill="none" />
    </Svg>
  );
}

function Patty({ seed, veggie }: { seed: number; veggie?: boolean }) {
  const outer = blob(200, 33, 196, 26, 40, 7, seed + 3, 0.9);
  const inner = blob(200, 36, 186, 20, 32, 4, seed + 11, 0.9);
  const dots = scatter(34, seed + 5, 20, 380, 14, 52);
  const c1 = veggie ? '#6E5A2C' : '#5B2C18';
  const c2 = veggie ? '#4F4120' : '#3A1A0E';
  const crust = veggie ? '#8D7438' : '#8A4423';
  return (
    <Svg h={62}>
      <path d={outer} fill={c2} />
      <path d={inner} fill={c1} />
      {/* croûte caramélisée du smash */}
      <path d={blob(200, 20, 176, 8, 28, 4, seed + 2, 1)} fill={crust} opacity=".9" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={0.8 + d.s * 2} fill={veggie ? (i % 3 === 0 ? '#7FA03A' : i % 3 === 1 ? '#D27A2C' : '#2F2614') : i % 2 ? '#2A1209' : '#A65A2E'} opacity={0.75} />
      ))}
      <path d="M40,16 Q200,6 360,16" stroke="#fff" strokeOpacity=".14" strokeWidth="3" fill="none" />
    </Svg>
  );
}

function meltPath(base: number, drips: { x: number; w: number; len: number }[], left = 18, right = 382) {
  let d = `M${left + 10},6 Q200,0 ${right - 10},6 L${right + 8},${base + 18} Q${right},${base + 20} ${right - 22},${base}`;
  [...drips].sort((a, b) => b.x - a.x).forEach((dr) => {
    d += ` L${dr.x + dr.w / 2},${base} C${dr.x + dr.w / 2},${base + dr.len * 1.25} ${dr.x - dr.w / 2},${base + dr.len * 1.25} ${dr.x - dr.w / 2},${base}`;
  });
  d += ` L${left + 22},${base} Q${left},${base + 20} ${left - 8},${base + 18} Z`;
  return d;
}

function Cheese({ seed, kind }: { seed: number; kind: 'cheddar' | 'raclette' }) {
  const r = rng(seed + 17);
  const n = kind === 'raclette' ? 7 : 5;
  const drips = Array.from({ length: n }, (_, i) => ({
    x: 50 + (i + 0.5) * (300 / n) + (r() - 0.5) * 24,
    w: 14 + r() * 14,
    len: (kind === 'raclette' ? 16 : 10) + r() * (kind === 'raclette' ? 20 : 16),
  }));
  const fill = kind === 'cheddar' ? '#F39A1C' : '#F1CF86';
  const hi = kind === 'cheddar' ? '#FFC75A' : '#FBE9BE';
  const sh = kind === 'cheddar' ? '#D57A0E' : '#D9AE5E';
  return (
    <Svg h={kind === 'raclette' ? 52 : 46}>
      <path d={meltPath(14, drips)} fill={sh} transform="translate(0,2)" />
      <path d={meltPath(14, drips)} fill={fill} />
      <path d="M34,7 Q200,1 366,7" stroke={hi} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {drips.map((d, i) => (
        <ellipse key={i} cx={d.x - d.w * 0.15} cy={14 + d.len * 0.55} rx={d.w * 0.14} ry={d.len * 0.22} fill="#fff" opacity=".35" />
      ))}
    </Svg>
  );
}

function StMarcellin({ seed }: { seed: number }) {
  const blobs = [70, 145, 215, 290, 345].map((x, i) => ({ x, d: blob(x, 20, 46, 14, 16, 5, seed + i * 7, 0.2) }));
  const specks = scatter(14, seed, 40, 370, 10, 30);
  return (
    <Svg h={40}>
      {blobs.map((b, i) => <path key={i} d={b.d} fill="#E9DCC1" transform="translate(0,3)" />)}
      {blobs.map((b, i) => <path key={i + 'f'} d={b.d} fill="#F7EEDB" />)}
      <path d="M90,22 C110,40 120,40 128,26 M240,24 C252,42 262,40 268,26" fill="#F7EEDB" />
      {specks.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={1 + s.s * 1.6} fill={i % 2 ? '#D9B37A' : '#C79A5B'} opacity=".55" />)}
      <path d="M50,12 Q200,4 350,12" stroke="#fff" strokeWidth="3" strokeOpacity=".8" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function Sauce({ color }: { color: string }) {
  return (
    <Svg h={22}>
      <path d="M30,6 Q200,0 370,6 L364,12 C352,26 342,26 336,12 L262,12 C254,22 246,22 240,12 L150,12 C140,26 128,26 122,12 L60,12 C54,18 46,18 40,12Z" fill={color} />
      <path d="M60,6 Q200,2 330,6" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" />
    </Svg>
  );
}

function Lettuce({ seed }: { seed: number }) {
  const r = rng(seed);
  let d = 'M6,24';
  for (let x = 6; x < 394; x += 18) {
    const y = 26 + (r() - 0.5) * 10;
    d += ` Q${x + 9},${y + 14} ${x + 18},${y}`;
  }
  d += ' L392,12 Q200,-2 8,12 Z';
  return (
    <Svg h={38}>
      <path d={d} fill="#5E8A2E" />
      <path d="M14,14 Q200,0 386,14 L386,20 Q200,10 14,20Z" fill="#9CC556" />
      <path d="M40,18 Q120,26 200,18 Q280,26 360,18" stroke="#C4E07E" strokeWidth="2" fill="none" />
    </Svg>
  );
}

function Tomato() {
  return (
    <Svg h={30}>
      {[110, 290].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="16" rx="100" ry="12" fill="#A82B20" />
          <ellipse cx={cx} cy="14" rx="94" ry="9" fill="#D9432F" />
          <ellipse cx={cx} cy="14" rx="70" ry="5.5" fill="#EE6A4E" />
          {[-40, -14, 14, 40].map((dx) => <ellipse key={dx} cx={cx + dx} cy="14" rx="4" ry="2" fill="#F7C35C" opacity=".8" />)}
        </g>
      ))}
    </Svg>
  );
}

function Pickles({ seed }: { seed: number }) {
  const r = rng(seed);
  const items = [40, 105, 170, 235, 300, 360].map((x) => ({ x: x + (r() - 0.5) * 12, rot: (r() - 0.5) * 14, y: 17 + (r() - 0.5) * 5 }));
  return (
    <Svg h={34}>
      {items.map((p, i) => (
        <g key={i} transform={`rotate(${p.rot} ${p.x} ${p.y})`}>
          <ellipse cx={p.x} cy={p.y} rx="38" ry="13" fill="#4E6420" />
          <ellipse cx={p.x} cy={p.y - 1} rx="33" ry="9.5" fill="#8DA24A" />
          {[-14, -5, 5, 14].map((dx) => <ellipse key={dx} cx={p.x + dx} cy={p.y - 1} rx="2.2" ry="1.4" fill="#D6DE9A" />)}
        </g>
      ))}
    </Svg>
  );
}

function Onions({ seed, tone }: { seed: number; tone: 'caramel' | 'confit' }) {
  const r = rng(seed);
  const c = tone === 'caramel' ? ['#9A4A16', '#C46A24', '#E09A4C'] : ['#6E2A2E', '#93404A', '#B9686A'];
  const strands = Array.from({ length: 22 }, () => {
    const x = 26 + r() * 340, y = 9 + r() * 16, w = 30 + r() * 40, b = (r() - 0.3) * 14;
    return { d: `M${x},${y} q${w / 2},${b} ${w},${(r() - 0.5) * 6}`, c: c[Math.floor(r() * 3)] };
  });
  return (
    <Svg h={32}>
      <path d={blob(200, 18, 176, 11, 24, 3, seed, 1)} fill={c[0]} />
      {strands.map((s, i) => <path key={i} d={s.d} stroke={s.c} strokeWidth="6" strokeLinecap="round" fill="none" />)}
    </Svg>
  );
}

function CrispyOnions({ seed }: { seed: number }) {
  const r = rng(seed);
  const bits = Array.from({ length: 34 }, () => ({ x: 22 + r() * 356, y: 8 + r() * 18, rot: r() * 360, s: 6 + r() * 7 }));
  return (
    <Svg h={32}>
      {bits.map((b, i) => (
        <path key={i} d={`M${b.x - b.s},${b.y} q${b.s},-${b.s * 0.9} ${b.s * 2},0`} transform={`rotate(${b.rot} ${b.x} ${b.y})`} stroke={i % 3 ? '#D9963A' : '#B06B22'} strokeWidth="5" strokeLinecap="round" fill="none" />
      ))}
    </Svg>
  );
}

function Bacon({ seed }: { seed: number }) {
  const r = rng(seed);
  const strip = (y: number, off: number) => {
    let d = `M8,${y}`;
    for (let x = 8; x < 392; x += 32) d += ` q16,${(r() > 0.5 ? -1 : 1) * 8} 32,0`;
    return { d, off };
  };
  const s = [strip(11, 0), strip(22, 1)];
  return (
    <Svg h={32}>
      {s.map((st, i) => (
        <g key={i}>
          <path d={st.d} stroke="#6E2216" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d={st.d} stroke="#A9402C" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d={st.d} stroke="#EDBFA4" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="22 14" />
        </g>
      ))}
    </Svg>
  );
}

function GrilledVeg() {
  return (
    <Svg h={32}>
      {[70, 170, 250, 330].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={16} rx="44" ry="11" fill={i % 2 ? '#B8382A' : '#3F5E22'} />
          <ellipse cx={x} cy={14} rx="38" ry="7" fill={i % 2 ? '#E0573E' : '#C9D27E'} />
          {[-20, -6, 8, 22].map((dx) => <path key={dx} d={`M${x + dx - 4},9 l8,10`} stroke="#3A2414" strokeWidth="2.4" opacity=".55" />)}
        </g>
      ))}
    </Svg>
  );
}

function BurgerLayerBase({ layer, seed = 1 }: Props) {
  const s = seed * 31 + layer.id.length * 7;
  switch (layer.kind) {
    case 'bunTop': return <BunTop potato={layer.bun === 'potato'} />;
    case 'bunBottom': return <BunBottom potato={layer.bun === 'potato'} />;
    case 'steak': return <Patty seed={s + (layer.id.charCodeAt(layer.id.length - 1) || 0)} />;
    case 'veggie': return <Patty seed={s} veggie />;
    case 'cheddar': return <Cheese seed={s + layer.id.charCodeAt(layer.id.length - 1)} kind="cheddar" />;
    case 'raclette': return <Cheese seed={s} kind="raclette" />;
    case 'stmarcellin': return <StMarcellin seed={s} />;
    case 'sauce': return <Sauce color={layer.color ?? '#E79A57'} />;
    case 'lettuce': return <Lettuce seed={s} />;
    case 'tomato': return <Tomato />;
    case 'pickles': return <Pickles seed={s} />;
    case 'onionCaramel': return <Onions seed={s} tone="caramel" />;
    case 'onionConfit': return <Onions seed={s} tone="confit" />;
    case 'onionCrispy': return <CrispyOnions seed={s} />;
    case 'bacon': return <Bacon seed={s} />;
    case 'grilledVeg': return <GrilledVeg />;
  }
}

export const BurgerLayer = memo(BurgerLayerBase);
