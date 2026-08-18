import { useState } from 'react';
import { Sparkles, Scissors, Search, X, Check } from 'lucide-react';
import type { Role, Category, User } from '../types';
import { Button, Input, Field } from './ui';

const ALL_CATEGORIES: Category[] = ['HAIR', 'MAKEUP', 'NAILS', 'LASHES & BROWS'];

export function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [role, setRole] = useState<Role>('customer');
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const toggleCat = (c: Category) => setCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const submit = () => {
    onAuth({ name: name || (role === 'business' ? 'Studio Owner' : 'Guest User'), email: email || 'guest@bantuconnect.co.za', role, categories });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-300/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-3xl bg-champagne-50 p-7 shadow-soft-lg dark:bg-charcoal-200 border border-bisque-300/50 dark:border-charcoal-50/30">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-300/60 hover:bg-bisque-200/60 dark:text-champagne-100/60 dark:hover:bg-charcoal-50/30"><X size={18} /></button>
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500 text-white"><Sparkles size={18} /></span>
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-none text-charcoal-300 dark:text-champagne-100">{mode === 'login' ? 'Welcome back' : 'Join Bantu Connect'}</h2>
            <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">South Africa's beauty directory</p>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-bisque-200/50 p-1 dark:bg-charcoal-300/60">
          <button onClick={() => setMode('login')} className={`rounded-xl py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-rose-600 shadow-soft dark:bg-charcoal-200 dark:text-rose-300' : 'text-charcoal-300/70 dark:text-champagne-100/70'}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`rounded-xl py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-rose-600 shadow-soft dark:bg-charcoal-200 dark:text-rose-300' : 'text-charcoal-300/70 dark:text-champagne-100/70'}`}>Sign up</button>
        </div>
        <div className="space-y-4">
          {mode === 'signup' && (<Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zodwa Nkosi" /></Field>)}
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.co.za" /></Field>
          {mode === 'login' && (<Field label="Password"><Input type="password" placeholder="••••••••" /></Field>)}
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-300/70 dark:text-champagne-100/60">I am a...</span>
            <div className="grid grid-cols-2 gap-2">
              <RoleCard active={role === 'customer'} onClick={() => setRole('customer')} icon={<Search size={18} />} title="Customer" sub="Find Services" />
              <RoleCard active={role === 'business'} onClick={() => setRole('business')} icon={<Scissors size={18} />} title="Business Owner" sub="The Studio" />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-300/70 dark:text-champagne-100/60">Categories of interest</span>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((c) => {
                const on = categories.includes(c);
                return (
                  <button key={c} onClick={() => toggleCat(c)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? 'bg-thyme-500 text-white' : 'bg-white/70 text-charcoal-300/70 border border-bisque-300/60 dark:bg-charcoal-200/60 dark:text-champagne-100/70 dark:border-charcoal-50/30'}`}>
                    {on && <Check size={12} />}{c}
                  </button>
                );
              })}
            </div>
          </div>
          <Button onClick={submit} className="w-full" size="lg">{mode === 'login' ? 'Login' : 'Create account'}</Button>
          <p className="text-center text-[11px] text-charcoal-300/50 dark:text-champagne-100/40">By continuing you agree to our POPIA privacy notice.</p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition ${active ? 'border-rose-400 bg-rose-100/70 dark:bg-rose-900/30 dark:border-rose-400/60' : 'border-bisque-300/60 bg-white/60 hover:border-rose-300 dark:bg-charcoal-200/60 dark:border-charcoal-50/30'}`}>
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${active ? 'bg-rose-500 text-white' : 'bg-bisque-200/60 text-charcoal-300/70 dark:bg-charcoal-50/30 dark:text-champagne-100/70'}`}>{icon}</span>
      <span className="text-sm font-bold text-charcoal-300 dark:text-champagne-100">{title}</span>
      <span className="text-[11px] text-charcoal-300/60 dark:text-champagne-100/50">{sub}</span>
    </button>
  );
}
