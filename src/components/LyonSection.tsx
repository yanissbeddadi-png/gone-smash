import { motion } from 'framer-motion';
import { Clock, Instagram, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { brand } from '../data/brand';
import { districts } from '../data/lyon';
import { LyonBadge } from './ui/Brand';
import { Reveal, SplitTitle } from './ui/Reveal';

function LyonMap({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <svg viewBox="0 0 520 560" className="h-full w-full" role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">Carte stylisée de Lyon</title>
      <desc id="map-desc">Le Rhône et la Saône se rejoignent à Confluence. Les quartiers présentés sont placés de façon schématique ; l’emplacement GONE SMASH est fictif.</desc>
      <defs>
        <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#F5E9D7" strokeOpacity=".06" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="520" height="560" fill="url(#grid)" />
      {/* colline de Fourvière */}
      <path d="M40,200 C80,170 140,190 150,240 C160,300 110,330 70,320 C30,300 20,240 40,200Z" fill="#F5E9D7" fillOpacity=".05" />
      <text x="62" y="262" fill="#F5E9D7" fillOpacity=".35" fontSize="12" fontWeight="600" letterSpacing="2">FOURVIÈRE</text>
      {/* fleuves */}
      <motion.path d="M168,0 C148,80 214,124 196,196 C178,262 146,302 178,362 C200,408 226,444 246,486 C256,510 254,536 262,560" fill="none" stroke="#F4A340" strokeWidth="16" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} />
      <motion.path d="M500,0 C436,92 388,150 366,232 C350,300 336,378 306,428 C290,456 266,474 246,486" fill="none" stroke="#F4A340" strokeWidth="22" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.2, ease: 'easeInOut' }} />
      <text x="114" y="120" fill="#F4A340" fontSize="13" fontWeight="700" letterSpacing="3" transform="rotate(-70 114 120)">SAÔNE</text>
      <text x="420" y="110" fill="#F4A340" fontSize="13" fontWeight="700" letterSpacing="3" transform="rotate(-58 420 110)">RHÔNE</text>
      {districts.map((d) => {
        const on = d.id === active;
        return (
          <g key={d.id} onMouseEnter={() => onPick(d.id)} className="cursor-pointer">
            <circle cx={d.x} cy={d.y} r={on ? 26 : 0} fill="#F4A340" fillOpacity=".18" style={{ transition: 'r .3s' }} />
            <circle cx={d.x} cy={d.y} r={on ? 9 : 6} fill={on ? '#F4A340' : '#F5E9D7'} style={{ transition: 'all .3s' }} />
            <text x={d.x + 14} y={d.y + 5} fill="#FAF8F3" fillOpacity={on ? 1 : 0.6} fontSize="14" fontWeight="700">{d.name}</text>
          </g>
        );
      })}
      {/* repère GONE SMASH (fictif) */}
      <g transform="translate(300 352)">
        <path d="M0,0 C-16,-18 -20,-30 -20,-38 A20,20 0 1 1 20,-38 C20,-30 16,-18 0,0Z" fill="#8B3028" stroke="#FAF8F3" strokeWidth="3" />
        <text x="0" y="-31" textAnchor="middle" fontFamily="Anton" fontSize="13" fill="#FAF8F3">GS</text>
      </g>
    </svg>
  );
}

export function LyonSection() {
  const [active, setActive] = useState<string>('presquile');
  const current = districts.find((d) => d.id === active)!;
  const { address } = brand;
  return (
    <section id="lyon" className="relative overflow-hidden bg-offwhite py-24 text-charcoal sm:py-32" aria-labelledby="lyon-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-brick"><span className="h-px w-10 bg-brick" />Lyon, 69</p>
            <SplitTitle lines={['NÉS À LYON.', <span key="g" className="text-brick">FAITS POUR</span>, <span key="h" className="text-brick">LES GONES.</span>]} className="display text-[clamp(3.2rem,9vw,8rem)]" />
          </div>
          <Reveal delay={0.15} className="flex flex-col justify-end gap-6 lg:col-span-5">
            <p className="text-lg text-charcoal/75">Lyon a sa culture, son caractère et surtout son amour de la bonne cuisine. Chez GONE SMASH, on s’inspire de cette ville qui ne fait jamais les choses à moitié.</p>
            <LyonBadge className="w-28 text-orange" />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-3xl bg-charcoal p-4 sm:p-6 lg:col-span-7">
            <div className="aspect-[52/56] w-full sm:aspect-[52/48]">
              <LyonMap active={active} onPick={setActive} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-offwhite/95 p-4 backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-xs" aria-live="polite">
              <p className="display text-2xl">{current.name}</p>
              <p className="mt-1 text-sm text-charcoal/70">{current.text}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-brick">Notre recette associée : {current.burger}</p>
            </div>
          </Reveal>
          <div className="lg:col-span-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/75">Les quartiers qui nous inspirent</h3>
            <ul className="grid grid-cols-2 gap-2">
              {districts.map((d) => (
                <li key={d.id}>
                  <button type="button" onClick={() => setActive(d.id)} onMouseEnter={() => setActive(d.id)} aria-pressed={d.id === active}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition ${d.id === active ? 'bg-orange text-charcoal' : 'bg-cream hover:bg-[#efdcc0]'}`}>
                    <span className="display text-xl sm:text-2xl">{d.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div id="contact" data-anchor className="mt-6 space-y-3 rounded-3xl bg-cream p-6">
              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-brick" aria-hidden />
                <div>
                  <p className="font-semibold">{address.street}, {address.zip} {address.city}</p>
                  <p className="text-sm text-charcoal/75">{address.district} · <span className="rounded bg-brick px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-offwhite">Adresse fictive — exemple</span></p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-brick" aria-hidden />
                <div className="w-full">
                <dl className="w-full text-sm">
                  {brand.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-3 border-b border-charcoal/10 py-1.5 last:border-0">
                      <dt className="font-semibold">{h.days}</dt>
                      <dd className="text-right text-charcoal/70">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pt-1 text-xs text-charcoal/70">Horaires de démonstration.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brick" aria-hidden />
                <p className="text-sm"><span className="font-semibold">{brand.phone}</span> · {brand.email}<br /><span className="text-xs text-charcoal/70">Coordonnées fictives, non joignables.</span></p>
              </div>
              <div className="flex gap-4">
                <Instagram className="mt-1 h-5 w-5 shrink-0 text-brick" aria-hidden />
                <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline underline-offset-4 hover:text-brick">{brand.instagram.handle} <span className="font-normal text-charcoal/70">(lien de démonstration)</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
