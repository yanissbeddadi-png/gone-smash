import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { BASE_PRICE } from '../data/simple';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { Order } from '../hooks/useOrder';
import { euro } from '../utils/format';
import { orderProvider } from '../utils/order';
import { pickupSlots } from '../utils/schedule';
import { Button } from './ui/Button';

const PHONE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export function OrderSheet({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order }) {
  const ref = useRef<HTMLDivElement>(null);
  const slots = useMemo(() => pickupSlots(), [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ ref: string; name: string; total: number } | null>(null);

  const close = () => {
    if (done) { order.reset(); setDone(null); setTouched(false); }
    onClose();
  };
  useFocusTrap(ref, open, close);

  const errName = name.trim().length < 2 ? 'Indique ton prénom.' : '';
  const errPhone = !PHONE.test(phone.trim()) ? 'Numéro français, ex. 06 12 34 56 78.' : '';
  const slotValue = slot || slots[0]?.value || '';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (errName || errPhone) return;
    setSending(true);
    const r = await orderProvider.submit({
      customer: { name: name.trim(), phone: phone.trim() },
      slot: slots.find((s) => s.value === slotValue)?.label ?? '',
      items: [{ name: 'Pain brioché', qty: 1, unitPrice: BASE_PRICE }, ...order.summary.map((l) => ({ name: `${l.step} : ${l.label}`, qty: 1, unitPrice: l.price }))],
      total: order.total,
    });
    setSending(false);
    setDone({ ref: r.reference, name: name.trim(), total: order.total });
  };

  const input = (err: string) => `mt-1 h-12 w-full rounded-xl border-2 bg-white px-4 text-charcoal focus:outline-none ${touched && err ? 'border-brick' : 'border-charcoal/15 focus:border-charcoal'}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
          <motion.div
            ref={ref} role="dialog" aria-modal="true" aria-labelledby="order-title"
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="relative max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-offwhite p-6 text-charcoal sm:rounded-3xl"
          >
            <button type="button" onClick={close} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-charcoal/5 hover:bg-charcoal/10" aria-label="Fermer">
              <X className="h-5 w-5" aria-hidden />
            </button>
            {done ? (
              <div className="py-4 text-center" role="status">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange"><Check className="h-8 w-8" aria-hidden /></span>
                <h2 id="order-title" className="display mt-5 text-5xl">Merci {done.name} !</h2>
                <p className="mt-3 text-charcoal/75">Commande <strong>simulée</strong> · <span className="font-mono text-brick">{done.ref}</span> · {euro(done.total)}</p>
                <p className="mt-4 rounded-2xl bg-cream p-4 text-sm text-charcoal/75">Démo : rien n’est envoyé au restaurant, rien n’est payé.</p>
                <Button size="lg" className="mt-6 w-full" onClick={close}>Faire une autre commande</Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 id="order-title" className="display text-4xl">Ta commande</h2>
                <ul className="mt-4 space-y-1 text-sm">
                  <li className="flex justify-between"><span>Pain brioché</span><span className="tabular-nums">{euro(BASE_PRICE)}</span></li>
                  {order.summary.map((l) => (
                    <li key={l.step} className="flex justify-between"><span><span className="text-charcoal/60">{l.step} · </span>{l.label}</span><span className="tabular-nums">{euro(l.price)}</span></li>
                  ))}
                </ul>
                <div className="mt-3 flex items-end justify-between border-t-2 border-dashed border-charcoal/15 pt-3">
                  <span className="text-sm font-bold uppercase tracking-wider">Total</span>
                  <span className="display text-4xl">{euro(order.total)}</span>
                </div>
                <div className="mt-5 space-y-3">
                  <label className="block text-sm font-semibold">Prénom
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={input(errName)} aria-invalid={touched && !!errName} aria-describedby={touched && errName ? 'e-name' : undefined} />
                    {touched && errName && <span id="e-name" className="mt-1 block text-sm text-brick">{errName}</span>}
                  </label>
                  <label className="block text-sm font-semibold">Téléphone
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" className={input(errPhone)} aria-invalid={touched && !!errPhone} aria-describedby={touched && errPhone ? 'e-phone' : undefined} />
                    {touched && errPhone && <span id="e-phone" className="mt-1 block text-sm text-brick">{errPhone}</span>}
                  </label>
                  <label className="block text-sm font-semibold">Retrait
                    <select value={slotValue} onChange={(e) => setSlot(e.target.value)} className={input('')}>
                      {slots.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                </div>
                <Button type="submit" size="lg" className="mt-6 w-full" disabled={sending}>
                  {sending ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Envoi…</> : <>Commander · {euro(order.total)}</>}
                </Button>
                <p className="mt-3 text-center text-xs text-charcoal/70">Démo : aucune vraie commande, aucun paiement.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
