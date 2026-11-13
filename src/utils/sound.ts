/** Micro-sons synthétisés (WebAudio, aucun fichier). Désactivés par défaut, activables dans le footer. */
export type SoundName = 'pop' | 'sizzle' | 'drop' | 'tick';
let ctx: AudioContext | null = null;

export function playSound(name: SoundName) {
  try {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(ctx.destination);
    if (name === 'sizzle') {
      // bruit filtré court : grésillement de plancha
      const len = Math.floor(ctx.sampleRate * 0.35);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() > 0.7 ? 1 : 0.25);
      const src = ctx.createBufferSource();
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 2500;
      src.buffer = buf; src.connect(f); f.connect(g);
      g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      src.start(t);
      return;
    }
    const o = ctx.createOscillator();
    if (name === 'tick') {
      // cliquet de roulette
      o.type = 'triangle';
      o.frequency.setValueAtTime(1400, t);
      g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g); o.start(t); o.stop(t + 0.05);
      return;
    }
    o.type = 'sine';
    o.frequency.setValueAtTime(name === 'pop' ? 520 : 300, t);
    o.frequency.exponentialRampToValueAtTime(name === 'pop' ? 880 : 140, t + 0.12);
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g); o.start(t); o.stop(t + 0.17);
  } catch { /* audio indisponible */ }
}
