import { Star, MapPin, Zap, Heart } from 'lucide-react';
import type { Business } from '../types';
import { zar } from '../data';
import { Badge, Stars, PowerReadyBadge, WalkInBadge } from './ui';

export function BusinessCard({ business, onOpen, saved, onToggleSave }: { business: Business; onOpen: () => void; saved: boolean; onToggleSave: () => void }) {
  return (
    <article onClick={onOpen} className="group cursor-pointer overflow-hidden rounded-2xl bg-white/80 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg dark:bg-charcoal-200/80 border border-bisque-300/40 dark:border-charcoal-50/20">
      <div className="relative h-44 w-full overflow-hidden">
        <img src={business.cover} alt={business.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-300/70 to-transparent" />
        <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur transition hover:scale-110" aria-label="Save">
          <Heart size={16} className={saved ? 'fill-rose-500 text-rose-500' : 'text-charcoal-300/70'} />
        </button>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {business.categories.map((c) => (<span key={c} className="rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">{c}</span>))}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-semibold leading-tight text-charcoal-300 dark:text-champagne-100">{business.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bisque-200/60 px-2 py-0.5 text-xs font-bold text-charcoal-300 dark:bg-charcoal-50/30 dark:text-champagne-100"><Star size={11} className="fill-rose-500 text-rose-500" />{business.rating}</span>
        </div>
        <p className="mb-2 inline-flex items-center gap-1 text-xs text-charcoal-300/60 dark:text-champagne-100/50"><MapPin size={12} /> {business.suburb}, {business.city} · {business.distanceKm} km</p>
        <div className="mb-3 flex flex-wrap gap-1.5"><WalkInBadge welcome={business.walkInsWelcome} /><PowerReadyBadge ready={business.powerReady} /></div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-charcoal-300/50 dark:text-champagne-100/40">Starting from</p>
            <p className="font-serif text-2xl font-semibold text-rose-600 dark:text-rose-300">{zar(business.startingPrice)}</p>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition group-hover:bg-rose-500 group-hover:text-white dark:bg-rose-900/40 dark:text-rose-200">View profile</span>
        </div>
      </div>
    </article>
  );
}
