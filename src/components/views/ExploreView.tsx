import { useMemo, useState } from 'react';
import { Search, Map as MapIcon, LayoutGrid } from 'lucide-react';
import type { Business, Category } from '../../types';
import { businesses } from '../../data';
import { BusinessCard } from '../BusinessCard';
import { CategoryPill, Input, Badge } from '../ui';

const ALL_CATS: Category[] = ['HAIR', 'MAKEUP', 'NAILS', 'LASHES & BROWS'];

export function ExploreView({ saved, onToggleSave, onOpen }: { saved: Set<string>; onToggleSave: (id: string) => void; onOpen: (b: Business) => void }) {
  const [query, setQuery] = useState('');
  const [cats, setCats] = useState<Category[]>([]);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const toggleCat = (c: Category) => setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesQuery = !q || b.suburb.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.name.toLowerCase().includes(q);
      const matchesCat = cats.length === 0 || cats.some((c) => b.categories.includes(c));
      return matchesQuery && matchesCat;
    });
  }, [query, cats]);
  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Explore the Directory</h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">Discover trusted beauty professionals near you.</p>
      </header>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300/40 dark:text-champagne-100/40" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by suburb or city — Bellville, Rosebank, Gqeberha..." className="pl-9" />
        </div>
        <div className="flex rounded-xl bg-bisque-200/50 p-1 dark:bg-charcoal-300/60">
          <button onClick={() => setView('grid')} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${view === 'grid' ? 'bg-white text-rose-600 shadow-soft dark:bg-charcoal-200 dark:text-rose-300' : 'text-charcoal-300/70 dark:text-champagne-100/70'}`}><LayoutGrid size={14} /> Grid</button>
          <button onClick={() => setView('map')} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${view === 'map' ? 'bg-white text-rose-600 shadow-soft dark:bg-charcoal-200 dark:text-rose-300' : 'text-charcoal-300/70 dark:text-champagne-100/70'}`}><MapIcon size={14} /> Map</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_CATS.map((c) => (<CategoryPill key={c} label={c} active={cats.includes(c)} onClick={() => toggleCat(c)} />))}
      </div>
      {view === 'grid' ? (
        filtered.length === 0 ? (<EmptyState />) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((b) => (<BusinessCard key={b.id} business={b} onOpen={() => onOpen(b)} saved={saved.has(b.id)} onToggleSave={() => onToggleSave(b.id)} />))}
          </div>
        )
      ) : (
        <MapView businesses={filtered} saved={saved} onToggleSave={onToggleSave} onOpen={onOpen} />
      )}
    </div>
  );
}

function MapView({ businesses, saved, onToggleSave, onOpen }: { businesses: Business[]; saved: Set<string>; onToggleSave: (id: string) => void; onOpen: (b: Business) => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-grid bg-thyme-100/40 dark:bg-charcoal-200/60 border border-bisque-300/40 dark:border-charcoal-50/20">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-transparent to-thyme-100/30" />
        <div className="absolute left-4 top-4"><Badge tone="neutral">Live directory map (demo)</Badge></div>
        {businesses.map((b, i) => {
          const left = 15 + ((i * 23) % 65);
          const top = 18 + ((i * 37) % 60);
          return (
            <button key={b.id} onClick={() => onOpen(b)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-soft-lg ring-4 ring-rose-100/50 transition hover:scale-110 dark:ring-rose-900/40">{b.name.charAt(0)}</span>
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-charcoal-300 opacity-0 transition group-hover:opacity-100 dark:bg-charcoal-200/90 dark:text-champagne-100">{b.name}</span>
            </button>
          );
        })}
      </div>
      <div className="space-y-3 overflow-y-auto scrollbar-thin max-h-[420px]">
        {businesses.map((b) => (
          <button key={b.id} onClick={() => onOpen(b)} className="flex w-full gap-3 rounded-2xl bg-white/70 p-3 text-left transition hover:shadow-soft dark:bg-charcoal-200/70 border border-bisque-300/40 dark:border-charcoal-50/20">
            <img src={b.cover} alt={b.name} className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base font-semibold text-charcoal-300 dark:text-champagne-100">{b.name}</p>
              <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">{b.suburb} · {b.distanceKm} km</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-10 text-center dark:bg-charcoal-200/40 dark:border-charcoal-50/30">
      <p className="font-serif text-xl text-charcoal-300/70 dark:text-champagne-100/60">No businesses match your filters.</p>
      <p className="text-sm text-charcoal-300/50 dark:text-champagne-100/40">Try a different suburb or category.</p>
    </div>
  );
}
