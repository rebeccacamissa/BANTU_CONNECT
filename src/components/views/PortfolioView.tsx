import { Images, Upload, X } from 'lucide-react';
import type { Business } from '../../types';
import { Button } from '../ui';

export function PortfolioView({ profile, onUpdate }: { profile: Business; onUpdate: (b: Business) => void }) {
  const removeImage = (idx: number) => { onUpdate({ ...profile, portfolio: profile.portfolio.filter((_, i) => i !== idx) }); };
  const addPlaceholder = () => { onUpdate({ ...profile, portfolio: [...profile.portfolio, 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'] }); };
  return (
    <div className="space-y-5 animate-fade-in">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Portfolio Gallery</h1>
          <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">Showcase your best work to attract clients.</p>
        </div>
        <Button size="sm" variant="outline" onClick={addPlaceholder}><Upload size={14} /> Add</Button>
      </header>
      {profile.portfolio.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-12 text-center dark:bg-charcoal-200/40 dark:border-charcoal-50/30">
          <Images size={36} className="mx-auto mb-3 text-rose-300" />
          <p className="font-serif text-xl text-charcoal-300/70 dark:text-champagne-100/60">No portfolio images yet</p>
          <p className="text-sm text-charcoal-300/50 dark:text-champagne-100/40">Upload photos of your work to fill your gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {profile.portfolio.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-bisque-300/40 dark:border-charcoal-50/20">
              <img src={src} alt={`Portfolio ${i + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <button onClick={() => removeImage(i)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-charcoal-300 opacity-0 transition group-hover:opacity-100 hover:bg-white"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
