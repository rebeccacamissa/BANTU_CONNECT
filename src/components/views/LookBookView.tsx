import { useMemo, useState } from 'react';
import { Images, MessageCircle } from 'lucide-react';
import type { Business } from '../../types';
import { businesses, zar } from '../../data';
import { CategoryPill, Badge, Button } from '../ui';
import { waLink } from '../../whatsapp';

export function LookbookView({ onOpen }: { onOpen: (b: Business) => void }) {
  const all = useMemo(() => businesses.flatMap((b) => b.portfolio.map((src, i) => ({ src, business: b, idx: i }))), []);
  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Visual Lookbook</h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">A scrollable feed of work from across the directory.</p>
      </header>
      <div className="columns-2 gap-3 sm:columns-3 xl:columns-4 [&>*]:mb-3">
        {all.map((item, i) => (
          <button key={i} onClick={() => onOpen(item.business)} className="group relative block w-full overflow-hidden rounded-2xl border border-bisque-300/40 dark:border-charcoal-50/20">
            <img src={item.src} alt={`${item.business.name} work`} className="w-full object-cover transition duration-500 group-hover:scale-105" style={{ aspectRatio: item.idx % 2 === 0 ? '3/4' : item.idx % 3 === 0 ? '1/1' : '4/5' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-300/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 right-3 translate-y-2 text-left opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-serif text-lg font-semibold text-white drop-shadow">{item.business.name}</p>
              <p className="text-xs text-white/90">{item.business.suburb} · from {zar(item.business.startingPrice)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BookingsView({ saved, onOpen }: { saved: Set<string>; onOpen: (b: Business) => void }) {
  const savedList = businesses.filter((b) => saved.has(b.id));
  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">My Bookings & Reviews</h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">Manage upcoming bookings and leave reviews.</p>
      </header>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Saved to book</h2>
        {savedList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-8 text-center text-sm text-charcoal-300/50 dark:bg-charcoal-200/40 dark:border-charcoal-50/30 dark:text-champagne-100/40">Save a business to start a booking here.</div>
        ) : (
          <div className="space-y-3">
            {savedList.map((b) => (
              <div key={b.id} className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 dark:bg-charcoal-200/70 border border-bisque-300/40 dark:border-charcoal-50/20 sm:flex-row sm:items-center">
                <img src={b.cover} alt={b.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-lg font-semibold text-charcoal-300 dark:text-champagne-100">{b.name}</p>
                  <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">{b.suburb} · from {zar(b.startingPrice)}</p>
                  <div className="mt-1.5 flex gap-1.5"><Badge tone={b.walkInsWelcome ? 'green' : 'amber'}>{b.walkInsWelcome ? 'Walk-ins' : 'Appointment'}</Badge></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onOpen(b)}>View</Button>
                  <a href={waLink(b.whatsapp, b.owner)} target="_blank" rel="noreferrer"><Button size="sm" className="bg-emerald-500 hover:bg-emerald-600"><MessageCircle size={14} /> Book</Button></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">Past reviews</h2>
        <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-6 text-center text-sm text-charcoal-300/50 dark:bg-charcoal-200/40 dark:border-charcoal-50/30 dark:text-champagne-100/40">Your completed bookings will appear here so you can leave a star rating and review.</div>
      </section>
    </div>
  );
}
