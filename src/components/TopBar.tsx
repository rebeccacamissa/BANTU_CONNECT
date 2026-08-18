import { Menu, Sparkles, RefreshCw, User } from 'lucide-react';
import type { Role, User as UserType } from '../types';

export function TopBar({ user, onSwitchRole, onOpenAuth, onMenu }: { user: UserType | null; onSwitchRole: () => void; onOpenAuth: () => void; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-bisque-300/40 bg-champagne-50/85 px-4 py-3 backdrop-blur dark:bg-charcoal-200/85 dark:border-charcoal-50/20 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="grid h-9 w-9 place-items-center rounded-xl bg-bisque-200/60 text-charcoal-300/80 lg:hidden dark:bg-charcoal-50/30 dark:text-champagne-100/80"><Menu size={18} /></button>
        <div className="flex items-center gap-2 lg:hidden">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500 text-white"><Sparkles size={16} /></span>
          <span className="font-serif text-lg font-semibold text-charcoal-300 dark:text-champagne-100">Bantu Connect</span>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-charcoal-300/80 dark:text-champagne-100/80">{user ? `Hello, ${user.name}` : 'Welcome'}</p>
          <p className="text-xs text-charcoal-300/50 dark:text-champagne-100/40">{user ? (user.role === 'business' ? 'Business Owner · The Studio' : 'Customer · Discovery') : 'Sign in to personalise your experience'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user && (<button onClick={onSwitchRole} title="Switch active role (demo mode)" className="inline-flex items-center gap-1.5 rounded-full bg-thyme-100 px-3 py-1.5 text-xs font-semibold text-thyme-700 transition hover:bg-thyme-200 dark:bg-thyme-900/40 dark:text-thyme-200 dark:hover:bg-thyme-900/60"><RefreshCw size={13} />Switch to {user.role === 'business' ? 'Customer' : 'Business'}</button>)}
        {user ? (<span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>) : (<button onClick={onOpenAuth} className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-600"><User size={15} /> Sign in</button>)}
      </div>
    </header>
  );
}
