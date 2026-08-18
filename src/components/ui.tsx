import { Star, Zap, Clock, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Capacity } from '../types';

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? 'fill-rose-500 text-rose-500'
              : 'fill-bisque-300/40 text-bisque-300/60 dark:fill-charcoal-50/20 dark:text-charcoal-50/30'
          }
        />
      ))}
    </span>
  );
}

export function Badge({
  children,
  tone = 'rose',
  className = '',
}: {
  children: ReactNode;
  tone?: 'rose' | 'thyme' | 'amber' | 'green' | 'neutral';
  className?: string;
}) {
  const tones: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
    thyme: 'bg-thyme-100 text-thyme-700 dark:bg-thyme-900/50 dark:text-thyme-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    neutral: 'bg-bisque-200/70 text-charcoal-300/80 dark:bg-charcoal-50/30 dark:text-champagne-100/80',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PowerReadyBadge({ ready }: { ready: boolean }) {
  if (!ready) return null;
  return (
    <Badge tone="green">
      <Zap size={11} /> Power Ready
    </Badge>
  );
}

export function CapacityBadge({ capacity }: { capacity: Capacity }) {
  const tone = capacity === 'Low' ? 'green' : capacity === 'Moderate' ? 'amber' : 'rose';
  return <Badge tone={tone as 'green' | 'amber' | 'rose'}>{capacity}</Badge>;
}

export function WalkInBadge({ welcome }: { welcome: boolean }) {
  return welcome ? (
    <Badge tone="green">Walk-ins Welcome</Badge>
  ) : (
    <Badge tone="amber">By Appointment</Badge>
  );
}

export function Button({
  children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false,
}: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg'; className?: string; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600 shadow-soft active:scale-[0.98]',
    secondary: 'bg-thyme-500 text-white hover:bg-thyme-600 shadow-soft active:scale-[0.98]',
    outline: 'border border-rose-400/60 text-rose-600 hover:bg-rose-100 dark:text-rose-300 dark:border-rose-400/50 dark:hover:bg-rose-900/30',
    ghost: 'text-charcoal-300/80 hover:bg-bisque-200/60 dark:text-champagne-100/80 dark:hover:bg-charcoal-50/30',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-300/70 dark:text-champagne-100/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-charcoal-300/50 dark:text-champagne-100/40">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input {...rest}
      className={`w-full rounded-xl border border-bisque-300/70 bg-white/70 px-3.5 py-2.5 text-sm text-charcoal-300 placeholder:text-charcoal-300/40 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-300/40 dark:border-charcoal-50/40 dark:bg-charcoal-200/60 dark:text-champagne-100 dark:placeholder:text-champagne-100/40 ${className}`} />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return (
    <textarea {...rest}
      className={`w-full rounded-xl border border-bisque-300/70 bg-white/70 px-3.5 py-2.5 text-sm text-charcoal-300 placeholder:text-charcoal-300/40 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-300/40 dark:border-charcoal-50/40 dark:bg-charcoal-200/60 dark:text-champagne-100 dark:placeholder:text-champagne-100/40 ${className}`} />
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2" aria-pressed={checked}>
      <span className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? 'bg-rose-500' : 'bg-bisque-300 dark:bg-charcoal-50/50'}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
      </span>
      {label && <span className="text-sm font-medium text-charcoal-300/80 dark:text-champagne-100/80">{label}</span>}
    </button>
  );
}

export function MetaLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 text-xs text-charcoal-300/70 dark:text-champagne-100/60">{icon}{children}</span>;
}

export function DistanceTag({ km }: { km: number }) { return <MetaLine icon={<MapPin size={12} />}>{km} km away</MetaLine>; }
export function DurationTag({ text }: { text: string }) { return <MetaLine icon={<Clock size={12} />}>{text}</MetaLine>; }

export function CategoryPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
        active ? 'bg-rose-500 text-white shadow-soft' : 'bg-white/70 text-charcoal-300/70 hover:bg-rose-100 border border-bisque-300/60 dark:bg-charcoal-200/60 dark:text-champagne-100/70 dark:border-charcoal-50/30 dark:hover:bg-rose-900/30'}`}>{label}</button>
  );
}
