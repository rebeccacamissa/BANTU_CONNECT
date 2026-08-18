import { useMemo, useState } from 'react';
import { Wand2, Check, Package } from 'lucide-react';
import type { Business, Category } from '../../types';
import { businesses, zar } from '../../data';
import { CategoryPill, Input, Badge, Button } from '../ui';

const ALL_CATS: Category[] = ['HAIR', 'MAKEUP', 'NAILS', 'LASHES & BROWS'];

interface Match {
  business: Business;
  service: { title: string; duration: string; price: number };
}

export function SmartFitView({
  onOpen,
}: {
  onOpen: (b: Business) => void;
}) {
  const [budget, setBudget] = useState(450);
  const [cats, setCats] = useState<Category[]>([]);

  const toggleCat = (c: Category) =>
    setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const matches = useMemo<Match[]>(() => {
    return businesses
      .filter((b) => cats.length === 0 || cats.some((c) => b.categories.includes(c)))
      .flatMap((b) =>
        b.services
          .filter((s) => s.price <= budget)
          .map((service) => ({ business: b, service }))
      )
      .sort((a, b) => a.service.price - b.service.price);
  }, [budget, cats]);

  const bundles = useMemo(() => {
    const out: { business: Business; items: Match['service'][]; total: number }[] = [];
    businesses
      .filter((b) => cats.length === 0 || cats.some((c) => b.categories.includes(c)))
      .forEach((b) => {
        const sorted = [...b.services].sort((a, c) => a.price - c.price);
        for (let i = 0; i < sorted.length; i++) {
          for (let j = i + 1; j < sorted.length; j++) {
            const pair = [sorted[i], sorted[j]];
            const total = pair[0].price + pair[1].price;
            if (total <= budget) {
              out.push({ business: b, items: pair, total });
            }
          }
        }
      });
    return out.sort((a, b) => b.total - a.total).slice(0, 4);
  }, [budget, cats]);

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">
          Smart Fit Budget Matcher
        </h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">
          Tell us your budget — we'll find services and bundles that fit.
        </p>
      </header>

      <div className="rounded-3xl bg-gradient-to-br from-rose-100 to-thyme-100/60 p-5 dark:from-charcoal-200 dark:to-charcoal-300/60 border border-bisque-300/40 dark:border-charcoal-50/20">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-300/80 dark:text-champagne-100/80">
            <Wand2 size={16} className="text-rose-500" /> Maximum budget
          </span>
          <span className="font-serif text-3xl font-semibold text-rose-600 dark:text-rose-300">
            {zar(budget)}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="w-28"
          />
          <span className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">
            ZAR
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_CATS.map((c) => (
            <CategoryPill
              key={c}
              label={c}
              active={cats.includes(c)}
              onClick={() => toggleCat(c)}
            />
          ))}
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">
          Individual services under {zar(budget)}
        </h2>
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-8 text-center text-sm text-charcoal-300/50 dark:bg-charcoal-200/40 dark:border-charcoal-50/30 dark:text-champagne-100/40">
            No services fit this budget. Try increasing it.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {matches.map((m, i) => (
              <button
                key={i}
                onClick={() => onOpen(m.business)}
                className="group flex items-center gap-3 rounded-2xl bg-white/70 p-3 text-left transition hover:shadow-soft dark:bg-charcoal-200/70 border border-bisque-300/40 dark:border-charcoal-50/20"
              >
                <img
                  src={m.business.cover}
                  alt={m.business.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-charcoal-300 dark:text-champagne-100">
                    {m.service.title}
                  </p>
                  <p className="truncate text-xs text-charcoal-300/60 dark:text-champagne-100/50">
                    {m.business.name} · {m.service.duration}
                  </p>
                </div>
                <span className="font-serif text-lg font-semibold text-rose-600 dark:text-rose-300">
                  {zar(m.service.price)}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 inline-flex items-center gap-2 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">
          <Package size={18} className="text-thyme-500" /> Bundle deals under{' '}
          {zar(budget)}
        </h2>
        {bundles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-8 text-center text-sm text-charcoal-300/50 dark:bg-charcoal-200/40 dark:border-charcoal-50/30 dark:text-champagne-100/40">
            No two-service bundles fit this budget.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bundles.map((bundle, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/70 p-4 dark:bg-charcoal-200/70 border border-bisque-300/40 dark:border-charcoal-50/20"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-charcoal-300 dark:text-champagne-100">
                    {bundle.business.name}
                  </span>
                  <Badge tone="thyme">Bundle · {zar(bundle.total)}</Badge>
                </div>
                <ul className="space-y-1.5">
                  {bundle.items.map((it) => (
                    <li
                      key={it.title}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="inline-flex items-center gap-1.5 text-charcoal-300/80 dark:text-champagne-100/70">
                        <Check size={13} className="text-thyme-500" />
                        {it.title}
                      </span>
                      <span className="text-charcoal-300/60 dark:text-champagne-100/50">
                        {zar(it.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onOpen(bundle.business)}
                >
                  View studio
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
