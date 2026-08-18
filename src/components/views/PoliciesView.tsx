import { ShieldCheck, Clock, CreditCard, Percent } from 'lucide-react';
import type { Business } from '../../types';
import { Field, Input, Textarea, Badge } from '../ui';

export function PoliciesView({ profile, onUpdate }: { profile: Business; onUpdate: (b: Business) => void }) {
  const set = (patch: Partial<Business>) => onUpdate({ ...profile, ...patch });
  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Policies & Deposit Terms</h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">Set clear expectations before clients book.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <PolicyCard icon={<Percent size={18} />} title="Deposit Percentage">
          <Field label="Deposit required">
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={100} step={5} value={profile.depositPct} onChange={(e) => set({ depositPct: Number(e.target.value) })} className="flex-1 accent-rose-500" />
              <span className="w-14 text-right font-serif text-2xl font-semibold text-rose-600 dark:text-rose-300">{profile.depositPct}%</span>
            </div>
          </Field>
        </PolicyCard>
        <PolicyCard icon={<Clock size={18} />} title="Cancellation Window">
          <Field label="Notice required (hours)"><Input type="number" min={0} value={profile.cancellationHours} onChange={(e) => set({ cancellationHours: Number(e.target.value) || 0 })} /></Field>
          <div className="mt-2"><Badge tone="amber">{profile.cancellationHours}h notice to reschedule</Badge></div>
        </PolicyCard>
      </div>
      <PolicyCard icon={<CreditCard size={18} />} title="Payment Terms">
        <Field label="Accepted payment methods & terms"><Textarea rows={3} value={profile.paymentTerms} onChange={(e) => set({ paymentTerms: e.target.value })} placeholder="e.g. Cash, SnapScan, EFT. 50% deposit secures slot." /></Field>
      </PolicyCard>
      <div className="flex items-start gap-2 rounded-2xl bg-thyme-100/60 p-3 dark:bg-thyme-900/30">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-thyme-600 dark:text-thyme-300" />
        <p className="text-xs leading-relaxed text-thyme-700 dark:text-thyme-200">Clear policies build trust and reduce no-shows. These terms appear on your public profile so clients can review them before booking.</p>
      </div>
    </div>
  );
}

function PolicyCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/80 dark:bg-charcoal-200/80 p-5 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">{icon}</span>
        <h2 className="font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">{title}</h2>
      </div>
      {children}
    </section>
  );
}
