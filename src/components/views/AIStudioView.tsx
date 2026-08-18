import { useState } from 'react';
import { Sparkles, Wand2, Check, FileText, ListChecks, MessageSquare } from 'lucide-react';
import type { Business } from '../../types';
import { Button, Textarea, Badge } from '../ui';

interface AIResult {
  bio: string;
  menu: { title: string; duration: string; price: string }[];
  captions: string[];
}

export function AIStudioView({
  profile,
  onApply,
}: {
  profile: Business;
  onApply: (bio: string, menu: { title: string; duration: string; price: number }[]) => void;
}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [tab, setTab] = useState<'bio' | 'menu' | 'captions'>('bio');
  const [applied, setApplied] = useState(false);

  const generate = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setApplied(false);

    setTimeout(() => {
      const lower = input.toLowerCase();

      const placeMatch = input.match(/in\s+([A-Z][a-zA-Z]+)/);
      const place = placeMatch ? placeMatch[1] : profile.suburb;

      const bio = `Welcome to ${profile.name.split("'")[0].trim() || 'our studio'} — a warm, professional beauty space in ${place}. ${
        lower.includes('braid') ? 'We specialise in protective braiding styles with gentle, scalp-friendly technique.' :
        lower.includes('makeup') ? 'We create long-wear, HD-ready makeup looks for every skin tone and occasion.' :
        lower.includes('nail') ? 'We craft meticulous nail art using premium products and hospital-grade sanitation.' :
        lower.includes('lash') || lower.includes('brow') ? 'We design healthy, fluffy lash sets and sculpted brows tailored to your features.' :
        'We deliver trusted, high-quality beauty services tailored to you.'
      } Every booking includes a consultation so we understand exactly the look you're after. Clean space, quality products, and care in every detail.`;

      const menu: { title: string; duration: string; price: string }[] = [];
      const priceRegex = /(?:R|rand)\s?(\d+)/gi;
      const serviceChunks = input.split(/[,;]|(?:\band\b)/i);

      let fallbackPrice = 300;
      serviceChunks.forEach((chunk) => {
        const c = chunk.trim();
        if (!c) return;
        const pm = c.match(priceRegex);
        if (pm) {
          const priceNum = parseInt(pm[0].replace(/\D/g, ''), 10);
          const title = c.replace(priceRegex, '').replace(/from|deposit|included|wash/gi, '').replace(/\s+/g, ' ').trim();
          if (title && priceNum) {
            menu.push({
              title: title.charAt(0).toUpperCase() + title.slice(1),
              duration: guessDuration(title),
              price: 'R' + priceNum,
            });
            if (priceNum < fallbackPrice) fallbackPrice = priceNum;
          }
        }
      });

      if (menu.length === 0) {
        menu.push(
          { title: 'Signature Service', duration: '2 hrs', price: 'R' + fallbackPrice },
          { title: 'Express Refresh', duration: '45 min', price: 'R' + Math.round(fallbackPrice / 2) },
        );
      }

      const captions = [
        `Sis, your hair deserves the best. Book your ${menu[0]?.title.toLowerCase() || 'appointment'} in ${place} — from ${menu[0]?.price || 'R450'}. DM or WhatsApp to secure your slot. #BantuConnect #BeautyZA`,
        `New look, who dis? Fresh ${menu[0]?.title.toLowerCase() || 'styles'} available this week. Clean studio, quality products, warm vibes. Book now — ${menu[0]?.price || ''} starting price.`,
        `Load shedding? Not on our watch. Power-ready studio so your appointment never gets cut short. Tap to book your ${menu[0]?.title.toLowerCase() || 'slot'} today.`,
      ];

      setLoading(false);
      setResult({ bio, menu, captions });
      setTab('bio');
    }, 1600);
  };

  const apply = () => {
    if (!result) return;
    onApply(
      result.bio,
      result.menu.map((m) => ({
        title: m.title,
        duration: m.duration,
        price: parseInt(m.price.replace(/\D/g, ''), 10) || 0,
      }))
    );
    setApplied(true);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">
          AI Content Studio
        </h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">
          Turn rough notes into polished profile copy, a menu and captions.
        </p>
      </header>

      <div className="flex items-start gap-2 rounded-2xl bg-thyme-100/60 p-3 dark:bg-thyme-900/30">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-thyme-600 dark:text-thyme-300" />
        <p className="text-xs leading-relaxed text-thyme-700 dark:text-thyme-200">
          <strong>AI Ethics:</strong> AI assists with text structuring only.
          Pricing, availability and policies remain owner-managed. Always
          review generated content before publishing.
        </p>
      </div>

      <div className="rounded-3xl bg-white/80 dark:bg-charcoal-200/80 p-5 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-300/70 dark:text-champagne-100/60">
          Rough input
        </label>
        <Textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Knotless braids in Bellville from R450, wash included, deposit R100. Also stitch cornrows R250."
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-charcoal-300/50 dark:text-champagne-100/40">
            {input.length} characters
          </span>
          <Button onClick={generate} disabled={loading || !input.trim()}>
            <Wand2 size={16} /> {loading ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="space-y-3 rounded-3xl bg-white/60 dark:bg-charcoal-200/60 p-6 border border-bisque-300/40 dark:border-charcoal-50/20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-bisque-200/40 dark:bg-charcoal-300/40 h-16">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-rose-100/40 to-transparent" />
            </div>
          ))}
          <p className="text-center text-sm text-charcoal-300/60 dark:text-champagne-100/50">
            Crafting your content...
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex gap-1 rounded-2xl bg-bisque-200/50 p-1 dark:bg-charcoal-300/60">
            <TabBtn active={tab === 'bio'} onClick={() => setTab('bio')} icon={<FileText size={14} />} label="Profile Bio" />
            <TabBtn active={tab === 'menu'} onClick={() => setTab('menu')} icon={<ListChecks size={14} />} label="Service Menu" />
            <TabBtn active={tab === 'captions'} onClick={() => setTab('captions')} icon={<MessageSquare size={14} />} label="Captions" />
          </div>

          {tab === 'bio' && (
            <Card>
              <p className="text-sm leading-relaxed text-charcoal-300/85 dark:text-champagne-100/75">
                {result.bio}
              </p>
            </Card>
          )}

          {tab === 'menu' && (
            <Card>
              <div className="divide-y divide-bisque-300/40 dark:divide-charcoal-50/20">
                {result.menu.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-300 dark:text-champagne-100">{m.title}</p>
                      <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">{m.duration}</p>
                    </div>
                    <span className="font-serif text-lg font-semibold text-rose-600 dark:text-rose-300">{m.price}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'captions' && (
            <div className="space-y-3">
              {result.captions.map((c, i) => (
                <Card key={i}>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge tone="rose">Caption {i + 1}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal-300/85 dark:text-champagne-100/75">{c}</p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(c)}
                    className="mt-2 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-300"
                  >
                    Copy to clipboard
                  </button>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={apply} variant="secondary" disabled={applied}>
              <Check size={16} /> {applied ? 'Applied to profile' : 'Apply to Profile'}
            </Button>
            {applied && (
              <span className="text-sm text-thyme-600 dark:text-thyme-300">
                Your live profile has been updated.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
        active
          ? 'bg-white text-rose-600 shadow-soft dark:bg-charcoal-200 dark:text-rose-300'
          : 'text-charcoal-300/70 dark:text-champagne-100/70'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-charcoal-200/80 p-4 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft">
      {children}
    </div>
  );
}

function guessDuration(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('braid') && t.includes('waist')) return '5 hrs';
  if (t.includes('braid')) return '4 hrs';
  if (t.includes('cornrow')) return '1.5 hrs';
  if (t.includes('bridal')) return '2.5 hrs';
  if (t.includes('makeup')) return '1.5 hrs';
  if (t.includes('lash') && t.includes('volume')) return '2.5 hrs';
  if (t.includes('lash')) return '1.5 hrs';
  if (t.includes('brow')) return '45 min';
  if (t.includes('nail') && t.includes('ext')) return '2 hrs';
  if (t.includes('nail')) return '1.5 hrs';
  if (t.includes('wash')) return '45 min';
  return '2 hrs';
}
