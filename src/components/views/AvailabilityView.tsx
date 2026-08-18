import { useState } from 'react';
import { Phone, MessageCircle, Zap, Store, Home, Car } from 'lucide-react';
import type { Business, Capacity, Format } from '../../types';
import { Button, Field, Input, Toggle, WalkInBadge, CapacityBadge, PowerReadyBadge } from '../ui';
import { waLink } from '../../whatsapp';

const CAPACITIES: Capacity[] = ['Low', 'Moderate', 'Fully Booked'];
const FORMATS: { value: Format; icon: React.ReactNode; label: string }[] = [
  { value: 'Home-Based Salon', icon: <Home size={16} />, label: 'Home-Based' },
  { value: 'Commercial Studio', icon: <Store size={16} />, label: 'Commercial' },
  { value: 'Mobile Stylist', icon: <Car size={16} />, label: 'Mobile' },
];

export function AvailabilityView({
  profile,
  onUpdate,
}: {
  profile: Business;
  onUpdate: (b: Business) => void;
}) {
  const [phone, setPhone] = useState(profile.whatsapp);
  const set = (patch: Partial<Business>) => onUpdate({ ...profile, ...patch });

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">
          Availability & Walk-In Status
        </h1>
        <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">
          Control how clients see your booking status.
        </p>
      </header>

      <Section title="Operational Status">
        <Row label="Walk-in policy">
          <div className="flex items-center gap-3">
            <Toggle checked={profile.walkInsWelcome} onChange={(v) => set({ walkInsWelcome: v })} />
            <WalkInBadge welcome={profile.walkInsWelcome} />
          </div>
        </Row>
        <Row label="Booking capacity">
          <div className="flex gap-2">
            {CAPACITIES.map((c) => (
              <button key={c} onClick={() => set({ capacity: c })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  profile.capacity === c ? 'bg-rose-500 text-white shadow-soft' : 'bg-white/70 text-charcoal-300/70 border border-bisque-300/60 dark:bg-charcoal-200/60 dark:text-champagne-100/70 dark:border-charcoal-50/30'}`}>{c}</button>
            ))}
          </div>
          <div className="mt-2"><CapacityBadge capacity={profile.capacity} /></div>
        </Row>
        <Row label="Load shedding / power ready">
          <div className="flex items-center gap-3">
            <Toggle checked={profile.powerReady} onChange={(v) => set({ powerReady: v })} />
            <PowerReadyBadge ready={profile.powerReady} />
          </div>
          <p className="mt-1 text-xs text-charcoal-300/50 dark:text-champagne-100/40">Inverter / generator backup for lamps and dryers.</p>
        </Row>
      </Section>

      <Section title="Studio Format">
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((f) => (
            <button key={f.value} onClick={() => set({ format: f.value })}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                profile.format === f.value ? 'border-rose-400 bg-rose-100/70 dark:bg-rose-900/30 dark:border-rose-400/60' : 'border-bisque-300/60 bg-white/60 hover:border-rose-300 dark:bg-charcoal-200/60 dark:border-charcoal-50/30'}`}>
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${profile.format === f.value ? 'bg-rose-500 text-white' : 'bg-bisque-200/60 text-charcoal-300/70 dark:bg-charcoal-50/30 dark:text-champagne-100/70'}`}>{f.icon}</span>
              <span className="text-xs font-semibold text-charcoal-300 dark:text-champagne-100">{f.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="WhatsApp Booking Engine">
        <Field label="WhatsApp number" hint="+27 format, digits only">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-charcoal-300/50 dark:text-champagne-100/50" />
            <Input value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setPhone(v); set({ whatsapp: v }); }} placeholder="27821234567" />
          </div>
        </Field>
        <div className="mt-3 rounded-2xl bg-bisque-200/40 p-3 dark:bg-charcoal-300/40">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-charcoal-300/60 dark:text-champagne-100/50">Generated click-to-chat link</p>
          <code className="block truncate text-xs text-charcoal-300/70 dark:text-champagne-100/60">{waLink(profile.whatsapp, profile.owner)}</code>
          <a href={waLink(profile.whatsapp, profile.owner)} target="_blank" rel="noreferrer" className="mt-3 inline-block">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600"><MessageCircle size={14} /> Test link</Button>
          </a>
        </div>
        {profile.powerReady && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300"><Zap size={14} /> Power-ready badge visible to clients</div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/80 dark:bg-charcoal-200/80 p-5 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft">
      <h2 className="mb-4 font-serif text-xl font-semibold text-charcoal-300 dark:text-champagne-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-300/60 dark:text-champagne-100/50">{label}</p>
      {children}
    </div>
  );
}
