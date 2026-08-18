import { Heart } from 'lucide-react';
import type { Business } from '../../types';
import { businesses } from '../../data';
import { BusinessCard } from '../BusinessCard';

export function FavoritesView({ saved, onToggleSave, onOpen }: { saved: Set<string>; onToggleSave: (id: string) => void; onOpen: (b: Business) => void }) {
  const list = businesses.filter((b) => saved.has(b.id));
  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Saved Favorites</h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">Your shortlist of beauty professionals.</p>
      </header>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-12 text-center dark:bg-charcoal-200/40 dark:border-charcoal-50/30">
          <Heart size={36} className="mx-auto mb-3 text-rose-300" />
          <p className="font-serif text-xl text-charcoal-300/70 dark:text-champagne-100/60">No favorites yet</p>
          <p className="text-sm text-charcoal-300/50 dark:text-champagne-100/40">Tap the heart on any business to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((b) => (<BusinessCard key={b.id} business={b} onOpen={() => onOpen(b)} saved onToggleSave={() => onToggleSave(b.id)} />))}
        </div>
      )}
    </div>
  );
}
