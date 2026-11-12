/** Générateur pseudo-aléatoire déterministe (formes organiques stables entre rendus) */
export function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Pt = [number, number];

/** Courbe fermée lissée (Catmull-Rom → Bézier) */
export function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/** Ellipse organique (bords irréguliers) */
export function blob(cx: number, cy: number, rx: number, ry: number, n: number, amp: number, seed: number, squareness = 0.6): string {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    // superellipse : flancs plus plats
    const e = 2 / (2 + squareness * 4);
    const x = Math.sign(c) * Math.pow(Math.abs(c), e) * rx;
    const y = Math.sign(s) * Math.pow(Math.abs(s), e) * ry;
    const k = 1 + (r() - 0.5) * (amp / Math.max(rx, ry)) * 2;
    pts.push([cx + x * (1 + (k - 1) * 0.4), cy + y * k]);
  }
  return smoothClosed(pts);
}

export function scatter(n: number, seed: number, x0: number, x1: number, y0: number, y1: number) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: x0 + r() * (x1 - x0), y: y0 + r() * (y1 - y0), s: r() }));
}
