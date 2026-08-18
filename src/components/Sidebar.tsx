import { User, Sparkles, Images, CalendarClock, ScrollText, Compass, BookOpen, Wand2, Heart, CalendarCheck, Sun, Moon, Shield, LogOut, HandHeart } from 'lucide-react';
import type { Role } from '../types';
import type { BusinessView, CustomerView } from '../types';

type View = BusinessView | CustomerView;

const BUSINESS_NAV: { id: BusinessView; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Studio Profile & Bio', icon: <User size={18} /> },
  { id: 'ai-studio', label: 'AI Content Studio', icon: <Sparkles size={18} /> },
  { id: 'portfolio', label: 'Portfolio Gallery', icon: <Images size={18} /> },
  { id: 'availability', label: 'Availability & Walk-In', icon: <CalendarClock size={18} /> },
  { id: 'policies', label: 'Policies & Deposits', icon: <ScrollText size={18} /> },
  { id: 'community', label: 'Community Care Board', icon: <HandHeart size={18} /> },
];

const CUSTOMER_NAV: { id: CustomerView; label: string; icon: React.ReactNode }[] = [
  { id: 'explore', label: 'Explore Directory & Map', icon: <Compass size={18} /> },
  { id: 'lookbook', label: 'Visual Lookbook Feed', icon: <BookOpen size={18} /> },
  { id: 'smartfit', label: 'Smart Fit Budget Matcher', icon: <Wand2 size={18} /> },
  { id: 'favorites', label: 'Saved Favorites', icon: <Heart size={18} /> },
  { id: 'bookings', label: 'My Bookings & Reviews', icon: <CalendarCheck size={18} /> },
  { id: 'community', label: 'Community Care Board', icon: <HandHeart size={18} /> },
];

export function Sidebar({ role, view, onView, dark, onToggleDark, onPopia, onLogout, open, onClose }: { role: Role; view: View; onView: (v: View) => void; dark: boolean; onToggleDark: () => void; onPopia: () => void; onLogout: () => void; open: boolean; onClose: () => void }) {
  const nav = role === 'business' ? BUSINESS_NAV : CUSTOMER_NAV;
  const title = role === 'business' ? 'The Studio' : 'Discovery';
  return (
    <>
      {open && (<div className="fixed inset-0 z-30 bg-charcoal-300/40 backdrop-blur-sm lg:hidden" onClick={onClose} />)}
      <aside className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col bg-champagne-50/95 backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0 dark:bg-charcoal-200/95 border-r border-bisque-300/40 dark:border-charcoal-50/20 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-soft"><Sparkles size={20} /></span>
          <div>
            <p className="font-serif text-xl font-semibold leading-none text-charcoal-300 dark:text-champagne-100">Bantu Connect</p>
            <p className="text-[11px] uppercase tracking-widest text-rose-500">{title}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3">
          {nav.map((item) => (
            <button key={item.id} onClick={() => { onView(item.id); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${view === item.id ? 'bg-rose-500 text-white shadow-soft' : 'text-charcoal-300/75 hover:bg-bisque-200/60 dark:text-champagne-100/75 dark:hover:bg-charcoal-50/20'}`}>{item.icon}{item.label}</button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-bisque-300/40 p-3 dark:border-charcoal-50/20">
          <button onClick={onToggleDark} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-charcoal-300/75 transition hover:bg-bisque-200/60 dark:text-champagne-100/75 dark:hover:bg-charcoal-50/20">{dark ? <Sun size={18} /> : <Moon size={18} />}{dark ? 'Light mode' : 'Dark mode'}</button>
          <button onClick={onPopia} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-charcoal-300/75 transition hover:bg-bisque-200/60 dark:text-champagne-100/75 dark:hover:bg-charcoal-50/20"><Shield size={18} />POPIA Privacy</button>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-charcoal-300/75 transition hover:bg-bisque-200/60 dark:text-champagne-100/75 dark:hover:bg-charcoal-50/20"><LogOut size={18} />Sign out</button>
        </div>
      </aside>
    </>
  );
}
