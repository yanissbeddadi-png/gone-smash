import { ArrowUpRight, Instagram } from 'lucide-react';
import { useState } from 'react';
import { brand } from '../data/brand';
import { nav } from '../data/nav';
import { Logo } from './ui/Brand';

export function Footer() {
  const [legal, setLegal] = useState<null | 'mentions' | 'confidentialite'>(null);
  return (
    <footer className="grain relative overflow-hidden bg-charcoal pt-20 text-offwhite" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Informations GONE SMASH</h2>
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-4xl" />
            <p className="mt-4 max-w-sm text-offwhite/65">Smash burgers indépendants, nés à Lyon. Viande saisie à blanc, pain brioché toasté, recettes de caractère. {brand.signature}</p>
            <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-orange hover:text-charcoal">
              <Instagram className="h-4 w-4" aria-hidden /> {brand.instagram.handle} <span className="sr-only">(lien de démonstration, nouvel onglet)</span>
            </a>
          </div>
          <nav className="lg:col-span-2" aria-label="Pied de page">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">Naviguer</p>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="text-offwhite/75 transition hover:text-offwhite">{n.label}</a></li>)}
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">Nous trouver</p>
            <address className="mt-4 not-italic text-offwhite/75">
              {brand.address.street}<br />{brand.address.zip} {brand.address.city}<br />{brand.phone}<br />{brand.email}
            </address>
            <p className="mt-2 text-xs text-offwhite/60">Coordonnées fictives (exemple).</p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">Horaires (démo)</p>
            <dl className="mt-4 space-y-1 text-sm">
              {brand.hours.map((h) => <div key={h.days} className="flex justify-between gap-3"><dt className="text-offwhite/75">{h.days}</dt><dd className="text-right text-offwhite/55">{h.time}</dd></div>)}
            </dl>
          </div>
        </div>

        {legal && (
          <div className="mt-12 rounded-3xl bg-white/5 p-6 text-sm text-offwhite/75" role="region" aria-label={legal === 'mentions' ? 'Mentions légales' : 'Politique de confidentialité'}>
            <p className="display text-2xl text-offwhite">{legal === 'mentions' ? 'Mentions légales' : 'Politique de confidentialité'}</p>
            <p className="mt-2">À compléter avant publication : {legal === 'mentions' ? 'raison sociale, forme juridique, capital, SIRET, RCS, adresse du siège, directeur de la publication, hébergeur (nom, adresse, téléphone).' : 'responsable de traitement, finalités, base légale, durées de conservation, destinataires, droits RGPD et contact, cookies et traceurs. Ce site de démonstration ne collecte aucune donnée : le panier est stocké uniquement dans le navigateur (localStorage).'}</p>
            <button type="button" onClick={() => setLegal(null)} className="mt-3 text-sm font-semibold underline underline-offset-4">Fermer</button>
          </div>
        )}

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 py-6 text-sm text-offwhite/60 sm:flex-row">
          <p>© {new Date().getFullYear()} GONE SMASH — Marque et site de démonstration.</p>
          <div className="flex gap-6">
            <button type="button" onClick={() => setLegal('mentions')} className="hover:text-offwhite" aria-expanded={legal === 'mentions'}>Mentions légales (à compléter)</button>
            <button type="button" onClick={() => setLegal('confidentialite')} className="hover:text-offwhite" aria-expanded={legal === 'confidentialite'}>Confidentialité (à compléter)</button>
          </div>
        </div>
      </div>
      <a href="#top" className="group block border-t border-white/10">
        <span className="sr-only">Retour en haut de page</span>
        <p className="display flex items-center justify-center gap-4 whitespace-nowrap py-4 text-[16vw] leading-none text-offwhite/[0.08] transition-colors duration-500 group-hover:text-orange" aria-hidden>
          GONE SMASH <ArrowUpRight className="h-[0.5em] w-[0.5em]" />
        </p>
      </a>
    </footer>
  );
}
