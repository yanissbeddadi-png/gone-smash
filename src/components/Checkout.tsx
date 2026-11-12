import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { brand } from '../data/brand';
import { useCart } from '../hooks/useCart';
import { euro, round2 } from '../utils/format';
import { orderProvider, type OrderPayload, type OrderResult } from '../utils/order';
import { CartLine } from './CartLine';
import { CartTotals, EmptyCart } from './CartDrawer';
import { BurgerStack } from './burger/BurgerStack';
import { Button, LinkButton } from './ui/Button';

const STEPS = ['Panier', 'Retrait', 'Coordonnées', 'Récapitulatif', 'Confirmation'];
type Mode = 'surplace' | 'emporter';
interface Info { name: string; phone: string; email: string; notes: string }

const PHONE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(i: Info) {
  const e: Partial<Record<keyof Info, string>> = {};
  if (i.name.trim().length < 2) e.name = 'Indique ton prénom (2 caractères minimum).';
  if (!PHONE.test(i.phone.trim())) e.phone = 'Numéro au format français, ex. 06 12 34 56 78.';
  if (i.email.trim() && !EMAIL.test(i.email.trim())) e.email = 'Adresse e-mail invalide.';
  return e;
}

export function Checkout() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>('emporter');
  const [slot, setSlot] = useState<string>(brand.pickupSlots[0]);
  const [info, setInfo] = useState<Info>({ name: '', phone: '', email: '', notes: '' });
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<(OrderResult & { name: string; total: number }) | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  const errors = validate(info);
  const extra = mode === 'emporter' ? [{ label: 'Emballage à emporter (démo)', amount: brand.fees.takeaway }] : [];
  const total = round2(cart.total + extra.reduce((a, e) => a + e.amount, 0));

  useEffect(() => { window.scrollTo({ top: 0 }); headRef.current?.focus(); }, [step]);

  // Cible absolue (et non fonctionnelle) : un double clic pendant la transition ne saute pas d'étape
  const next = () => setStep(Math.min(4, step + 1));
  const prev = () => setStep(Math.max(0, step - 1));

  const onInfo = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length === 0) next();
  };

  const submit = async () => {
    setSending(true);
    const payload: OrderPayload = {
      mode, slot, notes: info.notes.trim() || undefined,
      customer: { name: info.name.trim(), phone: info.phone.trim(), email: info.email.trim() || undefined },
      items: cart.items.map(({ name, qty, unitPrice, details }) => ({ name, qty, unitPrice, details })),
      subtotal: cart.subtotal,
      fees: [{ label: 'Frais de service', amount: cart.serviceFee }, ...extra],
      total,
    };
    const r = await orderProvider.submit(payload);
    setResult({ ...r, name: payload.customer.name, total });
    cart.clear();
    setSending(false);
    setStep(4);
  };

  const field = (k: keyof Info, label: string, opts: { type?: string; auto?: string; required?: boolean; placeholder?: string } = {}) => {
    const err = touched ? errors[k] : undefined;
    return (
      <label className="block">
        <span className="text-sm font-semibold">{label}{opts.required ? <span className="text-brick"> *</span> : <span className="font-normal text-charcoal/70"> (optionnel)</span>}</span>
        <input
          type={opts.type ?? 'text'} autoComplete={opts.auto} value={info[k]} placeholder={opts.placeholder} required={opts.required}
          onChange={(e) => setInfo({ ...info, [k]: e.target.value })}
          aria-invalid={!!err} aria-describedby={err ? `err-${k}` : undefined}
          className={`mt-1 h-12 w-full rounded-xl border-2 bg-white px-4 transition focus:outline-none ${err ? 'border-brick' : 'border-charcoal/15 focus:border-charcoal'}`}
        />
        {err && <span id={`err-${k}`} className="mt-1 block text-sm font-medium text-brick">{err}</span>}
      </label>
    );
  };

  const empty = cart.items.length === 0 && step < 4;

  return (
    <main id="main" className="min-h-[100svh] bg-offwhite pb-24 pt-24 text-charcoal sm:pt-28">
      <div className="container-x">
        <a href="#carte" className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal/70 hover:text-charcoal"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour à la carte</a>
        <div className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm text-brick" role="note">
          <strong>Parcours de démonstration.</strong> Aucune commande n’est transmise au restaurant et aucun paiement n’est demandé.
        </div>

        <ol className="no-scrollbar mt-8 flex gap-2 overflow-x-auto" aria-label="Étapes de commande">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] ${i === step ? 'bg-charcoal text-offwhite' : i < step ? 'bg-orange text-charcoal' : 'bg-charcoal/5 text-charcoal/70'}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[0.65rem]">{i < step ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> : i + 1}</span>{s}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div>
            <h1 ref={headRef} tabIndex={-1} className="display text-[clamp(2.8rem,7vw,5.5rem)] outline-none">
              {step === 4 ? 'C’est dans la boîte.' : ['Ton panier', 'Sur place ou à emporter ?', 'Tes coordonnées', 'On vérifie tout', ''][step]}
            </h1>
            <AnimatePresence mode="wait">
              <motion.div key={step + (empty ? 'e' : '')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="mt-6" style={{ pointerEvents: 'auto' }}>
                {empty ? (
                  <div className="rounded-3xl bg-charcoal text-offwhite"><EmptyCart onNavigate={() => undefined} /></div>
                ) : step === 0 ? (
                  <>
                    <ul><AnimatePresence initial={false}>{cart.items.map((i) => <CartLine key={i.id} item={i} />)}</AnimatePresence></ul>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <LinkButton href="#carte" variant="light" className="border-2 border-charcoal/15">Ajouter autre chose</LinkButton>
                      <Button variant="dark" onClick={next} className="flex-1">Continuer <ArrowRight className="h-4 w-4" aria-hidden /></Button>
                    </div>
                  </>
                ) : step === 1 ? (
                  <>
                    <fieldset>
                      <legend className="sr-only">Mode de retrait</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {([['surplace', 'Sur place', 'Installe-toi, on t’apporte ton plateau.', Store], ['emporter', 'À emporter', `Retrait au comptoir. Emballage ${euro(brand.fees.takeaway)} (démo).`, ShoppingBag]] as const).map(([v, t, d, Icon]) => (
                          <label key={v} className={`flex cursor-pointer gap-4 rounded-3xl border-2 p-5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange ${mode === v ? 'border-charcoal bg-charcoal text-offwhite' : 'border-charcoal/10 bg-white hover:border-charcoal/40'}`}>
                            <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                            <Icon className={`h-7 w-7 shrink-0 ${mode === v ? 'text-orange' : 'text-brick'}`} aria-hidden />
                            <span><span className="display block text-2xl">{t}</span><span className="text-sm opacity-70">{d}</span></span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label className="mt-6 block max-w-sm">
                      <span className="text-sm font-semibold">Créneau souhaité</span>
                      <select value={slot} onChange={(e) => setSlot(e.target.value)} className="mt-1 h-12 w-full rounded-xl border-2 border-charcoal/15 bg-white px-3">
                        {brand.pickupSlots.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </label>
                    <p className="mt-2 text-sm text-charcoal/75">Lieu : {brand.address.street}, {brand.address.zip} {brand.address.city} (adresse fictive).</p>
                    <Nav onPrev={prev} onNext={next} />
                  </>
                ) : step === 2 ? (
                  <form onSubmit={onInfo} noValidate className="max-w-xl space-y-4">
                    {field('name', 'Prénom', { auto: 'given-name', required: true, placeholder: 'Camille' })}
                    {field('phone', 'Téléphone', { type: 'tel', auto: 'tel', required: true, placeholder: '06 12 34 56 78' })}
                    {field('email', 'E-mail', { type: 'email', auto: 'email', placeholder: 'camille@exemple.fr' })}
                    <label className="block">
                      <span className="text-sm font-semibold">Une précision ? <span className="font-normal text-charcoal/70">(optionnel)</span></span>
                      <textarea value={info.notes} onChange={(e) => setInfo({ ...info, notes: e.target.value })} rows={3} maxLength={240} placeholder="Allergie, sans oignons…" className="mt-1 w-full rounded-xl border-2 border-charcoal/15 bg-white px-4 py-3 focus:border-charcoal focus:outline-none" />
                    </label>
                    <p className="text-xs text-charcoal/70">Données de démonstration : rien n’est enregistré ni transmis.</p>
                    {touched && Object.keys(errors).length > 0 && <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-brick"><AlertTriangle className="h-4 w-4" aria-hidden /> Vérifie les champs indiqués.</p>}
                    <Nav onPrev={prev} submit />
                  </form>
                ) : step === 3 ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white p-5 ring-1 ring-charcoal/10">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brick">Retrait</p>
                        <p className="mt-2 font-semibold">{mode === 'surplace' ? 'Sur place' : 'À emporter'} · {slot}</p>
                        <button type="button" onClick={() => setStep(1)} className="mt-2 text-sm underline underline-offset-4">Modifier</button>
                      </div>
                      <div className="rounded-3xl bg-white p-5 ring-1 ring-charcoal/10">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brick">Coordonnées</p>
                        <p className="mt-2 font-semibold">{info.name}</p>
                        <p className="text-sm text-charcoal/70">{info.phone}{info.email && ` · ${info.email}`}</p>
                        {info.notes && <p className="mt-1 text-sm italic text-charcoal/70">« {info.notes} »</p>}
                        <button type="button" onClick={() => setStep(2)} className="mt-2 text-sm underline underline-offset-4">Modifier</button>
                      </div>
                    </div>
                    <ul className="mt-4 divide-y divide-charcoal/10 rounded-3xl bg-white px-5 ring-1 ring-charcoal/10">
                      {cart.items.map((i) => (
                        <li key={i.id} className="flex justify-between gap-3 py-3 text-sm"><span><strong>{i.qty} ×</strong> {i.name}</span><span className="tabular-nums">{euro(round2(i.qty * i.unitPrice))}</span></li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button variant="light" onClick={prev} className="border-2 border-charcoal/15"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Button>
                      <Button onClick={submit} disabled={sending} size="lg" className="flex-1">
                        {sending ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Simulation en cours…</> : <>Simuler la commande · {euro(total)}</>}
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-charcoal/70">En cliquant, rien n’est envoyé ni payé : la commande est simulée dans ton navigateur.</p>
                  </>
                ) : result ? (
                  <div className="overflow-hidden rounded-3xl bg-charcoal p-8 text-offwhite sm:p-12" role="status">
                    <div className="mx-auto mb-6 w-40"><BurgerStack layers={[{ id: 'b', kind: 'bunBottom', bun: 'brioche' }, { id: 's', kind: 'steak' }, { id: 'c', kind: 'cheddar' }, { id: 'o', kind: 'pickles' }, { id: 't', kind: 'bunTop', bun: 'brioche' }]} mode="stagger" /></div>
                    <p className="display text-center text-5xl sm:text-6xl">Merci, <span className="text-orange">{result.name}</span> !</p>
                    <p className="mx-auto mt-4 max-w-md text-center text-offwhite/75">Commande <strong>simulée</strong> · référence <span className="font-mono text-orange">{result.reference}</span> · {euro(result.total)}</p>
                    <p className="mx-auto mt-4 max-w-md rounded-2xl bg-white/5 p-4 text-center text-sm text-offwhite/70">Ceci est une démonstration : aucune commande n’a été transmise au restaurant et aucun paiement n’a été effectué.</p>
                    <div className="mt-8 flex justify-center"><LinkButton href="#top">Retour à l’accueil</LinkButton></div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 4 && !empty && (
            <aside className="h-fit rounded-3xl bg-cream p-6 lg:sticky lg:top-24" aria-label="Résumé de la commande">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brick">Ta commande · {cart.count} article{cart.count > 1 ? 's' : ''}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {cart.items.map((i) => <li key={i.id} className="flex justify-between gap-3"><span className="truncate">{i.qty} × {i.name}</span><span className="shrink-0 tabular-nums">{euro(round2(i.qty * i.unitPrice))}</span></li>)}
              </ul>
              <div className="mt-4 border-t-2 border-dashed border-charcoal/15 pt-4"><CartTotals extra={step >= 1 ? extra : []} /></div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

function Nav({ onPrev, onNext, submit }: { onPrev: () => void; onNext?: () => void; submit?: boolean }) {
  return (
    <div className="mt-8 flex gap-3">
      <Button variant="light" onClick={onPrev} className="border-2 border-charcoal/15"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Button>
      <Button variant="dark" type={submit ? 'submit' : 'button'} onClick={submit ? undefined : onNext} className="flex-1">Continuer <ArrowRight className="h-4 w-4" aria-hidden /></Button>
    </div>
  );
}
