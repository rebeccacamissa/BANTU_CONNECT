import { X, Star, MessageCircle, Zap, Clock, ShieldCheck, MapPin } from 'lucide-react';
import type { Business } from '../types';
import { zar } from '../data';
import { Button, Stars, Badge, PowerReadyBadge, CapacityBadge, WalkInBadge } from './ui';
import { waLink } from '../whatsapp';

export function BusinessDetailModal({ business, onClose, onSave, saved }: { business: Business; onClose: () => void; onSave: () => void; saved: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-300/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl animate-scale-in overflow-y-auto scrollbar-thin rounded-3xl bg-champagne-50 shadow-soft-lg dark:bg-charcoal-200 border border-bisque-300/50 dark:border-charcoal-50/30">
        <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
          <img src={business.cover} alt={business.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-300/80 via-charcoal-300/10 to-transparent" />
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/80 p-1.5 text-charcoal-300 hover:bg-white dark:bg-charcoal-200/80 dark:text-champagne-100"><X size={18} /></button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-white drop-shadow">{business.name}</h2>
              <p className="text-sm text-white/90">by {business.owner} · {business.suburb}, {business.city}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-sm font-bold text-charcoal-300"><Star size={14} className="fill-rose-500 text-rose-500" />{business.rating}</div>
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {business.categories.map((c) => (<Badge key={c} tone="rose">{c}</Badge>))}
            <WalkInBadge welcome={business.walkInsWelcome} /><CapacityBadge capacity={business.capacity} /><PowerReadyBadge ready={business.powerReady} /><Badge tone="neutral">{business.format}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-charcoal-300/80 dark:text-champagne-100/70">{business.bio}</p>
          <section>
            <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Portfolio</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {business.portfolio.map((src, i) => (<div key={i} className="aspect-square overflow-hidden rounded-xl bg-bisque-200/50"><img src={src} alt={`${business.name} work ${i + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>))}
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Service Menu</h3>
            <div className="divide-y divide-bisque-300/40 rounded-2xl border border-bisque-300/40 bg-white/50 dark:divide-charcoal-50/20 dark:border-charcoal-50/20 dark:bg-charcoal-300/40">
              {business.services.map((s) => (<div key={s.title} className="flex items-center justify-between gap-3 px-4 py-3"><div><p className="text-sm font-semibold text-charcoal-300 dark:text-champagne-100">{s.title}</p><p className="inline-flex items-center gap-1 text-xs text-charcoal-300/60 dark:text-champagne-100/50"><Clock size={11} /> {s.duration}</p></div><span className="font-serif text-lg font-semibold text-rose-600 dark:text-rose-300">{zar(s.price)}</span></div>))}
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Policies</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <PolicyCard icon={<ShieldCheck size={16} />} label="Deposit" value={`${business.depositPct}%`} />
              <PolicyCard icon={<Clock size={16} />} label="Cancellation" value={`${business.cancellationHours}h notice`} />
              <PolicyCard icon={<MapPin size={16} />} label="Payment" value={business.paymentTerms} />
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Verified Reviews ({business.reviewCount})</h3>
            <div className="space-y-3">
              {business.reviews.map((r, i) => (<div key={i} className="rounded-2xl border border-bisque-300/40 bg-white/50 p-4 dark:border-charcoal-50/20 dark:bg-charcoal-300/40"><div className="mb-1 flex items-center justify-between"><span className="text-sm font-semibold text-charcoal-300 dark:text-champagne-100">{r.author}</span><span className="text-xs text-charcoal-300/50 dark:text-champagne-100/40">{r.date}</span></div><Stars value={r.rating} /><p className="mt-1.5 text-sm text-charcoal-300/75 dark:text-champagne-100/65">{r.text}</p></div>))}
            </div>
          </section>
          <div className="sticky bottom-0 -mx-6 -mb-6 flex gap-2 border-t border-bisque-300/40 bg-champagne-50/90 p-4 backdrop-blur dark:border-charcoal-50/20 dark:bg-charcoal-200/90">
            <Button variant="outline" onClick={onSave} className="flex-1">{saved ? 'Saved' : 'Save'}</Button>
            <a href={waLink(business.whatsapp, business.owner)} target="_blank" rel="noreferrer" className="flex-1"><Button className="w-full bg-emerald-500 hover:bg-emerald-600"><MessageCircle size={16} /> WhatsApp Me to Book</Button></a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-bisque-300/40 bg-white/50 p-3 dark:border-charcoal-50/20 dark:bg-charcoal-300/40">
      <div className="mb-1 flex items-center gap-1.5 text-rose-500">{icon}<span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="text-sm font-semibold text-charcoal-300 dark:text-champagne-100">{value}</p>
    </div>
  );
}
