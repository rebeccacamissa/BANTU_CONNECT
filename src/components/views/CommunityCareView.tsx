import { useCallback, useEffect, useState } from 'react';
import {
  Heart, Crown, Plus, Sparkles, MapPin, Target, Check, X,
  Gift, Loader2, MessageCircle, HandHeart, Users,
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { waLink } from '../../whatsapp';
import type { Sponsorship } from '../../types';
import { Badge, Button, Field, Input, Textarea, CategoryPill } from '../ui';

const CATEGORIES = ['HAIR', 'MAKEUP', 'NAILS', 'LASHES & BROWS'];

const OCCASIONS = [
  'Matric Ball',
  'Job Interview',
  'Restoring Confidence',
  'Graduation',
  'Birthday Treat',
  'Other',
];

export function CommunityCareView() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('sponsorships')
      .select('*, sponsorship_contributions(*)')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setSponsorships((data ?? []) as unknown as Sponsorship[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = filterCat
    ? sponsorships.filter((s) => s.service_category === filterCat)
    : sponsorships;

  const totalRaised = sponsorships.reduce(
    (sum, s) => sum + s.contributions.reduce((a, c) => a + c.amount, 0),
    0
  );
  const fundedCount = sponsorships.filter((s) => s.status === 'funded').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-champagne-100 to-thyme-100/60 p-6 dark:from-rose-900/40 dark:via-charcoal-200 dark:to-thyme-900/30 border border-bisque-300/40 dark:border-charcoal-50/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Badge tone="rose" className="mb-3"><HandHeart size={12} /> Community Care</Badge>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-charcoal-300 dark:text-champagne-100">Sponsor a Crown</h1>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-300/70 dark:text-champagne-100/60">
              Every woman deserves to feel beautiful. Support someone preparing
              for a matric ball, a job interview, or rebuilding confidence —
              or list yourself if you need a hand.
            </p>
          </div>
          <Button onClick={() => setShowRequest(true)} size="lg"><Plus size={18} /> Request a Crown</Button>
        </div>
        <div className="relative mt-5 flex gap-6">
          <Stat icon={<Gift size={16} />} label="Raised so far" value={`R${totalRaised.toLocaleString('en-ZA')}`} />
          <Stat icon={<Crown size={16} />} label="Crowns funded" value={String(fundedCount)} />
          <Stat icon={<Users size={16} />} label="Open requests" value={String(sponsorships.filter((s) => s.status === 'open').length)} />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-300/60 dark:text-champagne-100/50">Filter:</span>
        <CategoryPill label="All" active={filterCat === null} onClick={() => setFilterCat(null)} />
        {CATEGORIES.map((c) => (
          <CategoryPill key={c} label={c} active={filterCat === c} onClick={() => setFilterCat(c)} />
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-bisque-200/40 dark:bg-charcoal-50/20" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-300/60 bg-rose-100/50 p-6 text-center dark:bg-rose-900/20">
          <p className="font-serif text-lg text-rose-700 dark:text-rose-300">Couldn't load the board</p>
          <p className="text-sm text-rose-600/70 dark:text-rose-200/60">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={load}>Try again</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bisque-300/60 bg-white/40 p-12 text-center dark:bg-charcoal-200/40 dark:border-charcoal-50/30">
          <Crown size={36} className="mx-auto mb-3 text-rose-300" />
          <p className="font-serif text-xl text-charcoal-300/70 dark:text-champagne-100/60">No requests yet</p>
          <p className="text-sm text-charcoal-300/50 dark:text-champagne-100/40">Be the first to list a crown or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <SponsorshipCard key={s.id} sponsorship={s} onChanged={load} />
          ))}
        </div>
      )}

      {showRequest && (
        <RequestCrownModal
          onClose={() => setShowRequest(false)}
          onCreated={() => { setShowRequest(false); load(); }}
        />
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-charcoal-300/60 dark:text-champagne-100/50">{icon} {label}</p>
      <p className="font-serif text-2xl font-semibold text-rose-600 dark:text-rose-300">{value}</p>
    </div>
  );
}

function SponsorshipCard({ sponsorship, onChanged }: { sponsorship: Sponsorship; onChanged: () => void }) {
  const [showSponsor, setShowSponsor] = useState(false);
  const raised = sponsorship.contributions.reduce((a, c) => a + c.amount, 0);
  const pct = Math.min(100, Math.round((raised / sponsorship.goal_amount) * 100));
  const remaining = Math.max(0, sponsorship.goal_amount - raised);
  const isFunded = sponsorship.status === 'funded' || raised >= sponsorship.goal_amount;

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-2xl bg-white/80 dark:bg-charcoal-200/80 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft transition hover:shadow-soft-lg">
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-soft"><Crown size={22} /></span>
            <div>
              <h3 className="font-serif text-xl font-semibold leading-tight text-charcoal-300 dark:text-champagne-100">{sponsorship.recipient_name}</h3>
              <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">{sponsorship.occasion}</p>
            </div>
          </div>
          {isFunded ? <Badge tone="green"><Check size={11} /> Funded</Badge> : <Badge tone="rose">Open</Badge>}
        </div>

        <div className="px-5">
          <p className="text-sm leading-relaxed text-charcoal-300/75 dark:text-champagne-100/65">{sponsorship.story}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-5">
          <Badge tone="thyme">{sponsorship.service_category}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-charcoal-300/60 dark:text-champagne-100/50"><MapPin size={12} /> {sponsorship.suburb}, {sponsorship.city}</span>
        </div>

        <div className="mt-4 px-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-charcoal-300/80 dark:text-champagne-100/80">R{raised.toLocaleString('en-ZA')} raised</span>
            <span className="text-charcoal-300/60 dark:text-champagne-100/50">of R{sponsorship.goal_amount.toLocaleString('en-ZA')}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-bisque-200/60 dark:bg-charcoal-50/30">
            <div className={`h-full rounded-full transition-all duration-700 ${isFunded ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-charcoal-300/50 dark:text-champagne-100/40">{isFunded ? 'This crown has been fully funded.' : `R${remaining.toLocaleString('en-ZA')} still needed`}</p>
        </div>

        {sponsorship.contributions.length > 0 && (
          <div className="mt-3 px-5">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-charcoal-300/50 dark:text-champagne-100/40">Recent supporters</p>
            <div className="flex flex-wrap gap-1.5">
              {sponsorship.contributions.slice(-3).reverse().map((c) => (
                <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-thyme-100/70 px-2 py-0.5 text-[11px] font-medium text-thyme-700 dark:bg-thyme-900/40 dark:text-thyme-200">
                  <Heart size={10} className="fill-thyme-500 text-thyme-500" />
                  {c.anonymous ? 'Anonymous' : c.sponsor_name} · R{c.amount}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 p-5 pt-4">
          {isFunded ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-100 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"><Sparkles size={16} /> Crown secured</div>
          ) : (
            <>
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setShowSponsor(true)}><Gift size={15} /> Sponsor this Crown</Button>
              {sponsorship.recipient_contact && (
                <a href={waLink(sponsorship.recipient_contact, sponsorship.recipient_name)} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-300/60 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-400/40"><MessageCircle size={15} /></Button>
                </a>
              )}
            </>
          )}
        </div>
      </article>

      {showSponsor && (
        <SponsorModal sponsorship={sponsorship} remaining={remaining} onClose={() => setShowSponsor(false)} onDone={() => { setShowSponsor(false); onChanged(); }} />
      )}
    </>
  );
}

function SponsorModal({ sponsorship, remaining, onClose, onDone }: { sponsorship: Sponsorship; remaining: number; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(Math.min(remaining, 100));
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const presets = [50, 100, 250, remaining].filter((v, i, arr) => v > 0 && arr.indexOf(v) === i);

  const submit = async () => {
    if (!name.trim() && !anonymous) { setError('Please enter your name or choose to give anonymously.'); return; }
    if (amount <= 0 || amount > remaining) { setError(`Amount must be between R1 and R${remaining}.`); return; }
    setSubmitting(true);
    setError(null);

    const { error: err } = await supabase.from('sponsorship_contributions').insert({
      sponsorship_id: sponsorship.id,
      sponsor_name: anonymous ? 'Anonymous' : name.trim(),
      amount,
      message: message.trim() || null,
      anonymous,
    });

    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(onDone, 1800);
  };

  if (success) {
    return (
      <ModalShell onClose={onClose}>
        <div className="py-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"><Check size={32} /></span>
          <h3 className="mt-4 font-serif text-2xl font-semibold text-charcoal-300 dark:text-champagne-100">Thank you for your kindness</h3>
          <p className="mt-2 text-sm text-charcoal-300/70 dark:text-champagne-100/60">Your contribution of R{amount.toLocaleString('en-ZA')} has been recorded. You've helped {sponsorship.recipient_name} get closer to their crown.</p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white"><Gift size={20} /></span>
        <div>
          <h2 className="font-serif text-2xl font-semibold leading-none text-charcoal-300 dark:text-champagne-100">Sponsor {sponsorship.recipient_name}</h2>
          <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">{sponsorship.occasion} · R{remaining.toLocaleString('en-ZA')} still needed</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-300/60 dark:text-champagne-100/50">Quick amounts</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p} onClick={() => setAmount(p)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${amount === p ? 'bg-rose-500 text-white shadow-soft' : 'bg-white/70 text-charcoal-300/70 border border-bisque-300/60 dark:bg-charcoal-200/60 dark:text-champagne-100/70 dark:border-charcoal-50/30'}`}>{p === remaining ? `Cover the rest (R${p})` : `R${p}`}</button>
            ))}
          </div>
        </div>
        <Field label="Contribution amount (ZAR)"><Input type="number" min={1} max={remaining} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></Field>
        {!anonymous && <Field label="Your name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Auntie Thandi" /></Field>}
        <Field label="Message of encouragement (optional)"><Textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="You've got this! Wishing you all the best..." /></Field>
        <label className="flex items-center gap-2 text-sm text-charcoal-300/75 dark:text-champagne-100/70"><input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-4 w-4 rounded accent-rose-500" /> Give anonymously</label>
        {error && <p className="rounded-xl bg-rose-100/60 px-3 py-2 text-xs text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p>}
        <div className="flex items-center gap-1.5 rounded-xl bg-thyme-100/60 p-2.5 text-xs text-thyme-700 dark:bg-thyme-900/30 dark:text-thyme-200"><Target size={14} className="shrink-0" /> Your contribution is securely recorded and goes directly toward the goal. Bantu Connect takes no commission.</div>
        <Button onClick={submit} disabled={submitting} className="w-full" size="lg">{submitting ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Sponsor R{amount.toLocaleString('en-ZA')}</>}</Button>
      </div>
    </ModalShell>
  );
}

function RequestCrownModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [story, setStory] = useState('');
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [goal, setGoal] = useState(500);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || !story.trim() || !suburb.trim() || !city.trim()) { setError('Please fill in your name, story, suburb and city.'); return; }
    if (goal < 50) { setError('Goal amount must be at least R50.'); return; }
    setSubmitting(true);
    setError(null);

    const { error: err } = await supabase.from('sponsorships').insert({
      recipient_name: name.trim(),
      recipient_contact: contact.trim() || null,
      story: story.trim(),
      occasion,
      service_category: category,
      suburb: suburb.trim(),
      city: city.trim(),
      goal_amount: goal,
    });

    setSubmitting(false);
    if (err) { setError(err.message); return; }
    onCreated();
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white"><Crown size={20} /></span>
        <div>
          <h2 className="font-serif text-2xl font-semibold leading-none text-charcoal-300 dark:text-champagne-100">Request a Crown</h2>
          <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">Tell your story and let the community help.</p>
        </div>
      </div>
      <div className="space-y-3">
        <Field label="Your name (or a nickname)"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lerato M." /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Occasion"><select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full rounded-xl border border-bisque-300/70 bg-white/70 px-3 py-2.5 text-sm text-charcoal-300 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300/40 dark:border-charcoal-50/40 dark:bg-charcoal-200/60 dark:text-champagne-100">{OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>
          <Field label="Service category"><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-bisque-300/70 bg-white/70 px-3 py-2.5 text-sm text-charcoal-300 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300/40 dark:border-charcoal-50/40 dark:bg-charcoal-200/60 dark:text-champagne-100">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Suburb"><Input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Khayelitsha" /></Field>
          <Field label="City"><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Cape Town" /></Field>
        </div>
        <Field label="Your story" hint="A few sentences about why this would help."><Textarea rows={3} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Share what this sponsorship would mean to you..." /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Goal amount (ZAR)"><Input type="number" min={50} value={goal} onChange={(e) => setGoal(Number(e.target.value) || 0)} /></Field>
          <Field label="WhatsApp number (optional)" hint="So sponsors can reach you"><Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="27821234567" /></Field>
        </div>
        {error && <p className="rounded-xl bg-rose-100/60 px-3 py-2 text-xs text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p>}
        <Button onClick={submit} disabled={submitting} className="w-full" size="lg">{submitting ? <><Loader2 size={16} className="animate-spin" /> Posting...</> : <><Heart size={16} /> Post my request</>}</Button>
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-300/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in rounded-3xl bg-champagne-50 p-7 shadow-soft-lg dark:bg-charcoal-200 border border-bisque-300/50 dark:border-charcoal-50/30">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-300/60 hover:bg-bisque-200/60 dark:text-champagne-100/60 dark:hover:bg-charcoal-50/30"><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}
