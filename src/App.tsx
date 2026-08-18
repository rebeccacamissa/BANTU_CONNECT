import { useEffect, useState } from 'react';
import { Sparkles, Search, Scissors, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Business, Role, User } from './types';
import { businesses } from './data';
import { useLocalStorage } from './useLocalStorage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import { PopiaModal } from './components/PopiaModal';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { BusinessCard } from './components/BusinessCard';
import { Button, Badge } from './components/ui';

import { ExploreView } from './components/views/ExploreView';
import { LookbookView, BookingsView } from './components/views/LookBookView';
import { SmartFitView } from './components/views/SmartFitView';
import { FavoritesView } from './components/views/FavoritesView';
import { ProfileView } from './components/views/ProfileView';
import { AIStudioView } from './components/views/AIStudioView';
import { PortfolioView } from './components/views/PortfolioView';
import { AvailabilityView } from './components/views/AvailabilityView';
import { PoliciesView } from './components/views/PoliciesView';
import { CommunityCareView } from './components/views/CommunityCareView';

export default function App() {
  const [dark, setDark] = useLocalStorage<boolean>('bc-dark', false);
  const [user, setUser] = useLocalStorage<User | null>('bc-user', null);
  const [activeRole, setActiveRole] = useLocalStorage<Role>('bc-role', 'customer');
  const [saved, setSaved] = useLocalStorage<string[]>('bc-saved', []);
  const [profileEdits, setProfileEdits] = useLocalStorage<Partial<Business>>('bc-profile', {});

  const [view, setView] = useState<string>('explore');
  const [authOpen, setAuthOpen] = useState(false);
  const [popiaOpen, setPopiaOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<Business | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const role: Role = user ? (user.role === activeRole ? user.role : activeRole) : activeRole;

  const switchRole = () => {
    const next: Role = role === 'business' ? 'customer' : 'business';
    setActiveRole(next);
    setView(next === 'business' ? 'profile' : 'explore');
  };

  const mergedBusinesses: Business[] = businesses.map((b) =>
    b.id === 'b1' ? { ...b, ...profileEdits } : b
  );
  const myProfile = mergedBusinesses[0];

  const savedSet = new Set(saved);
  const toggleSave = (id: string) =>
    setSaved(savedSet.has(id) ? saved.filter((x) => x !== id) : [...saved, id]);

  const updateProfile = (b: Business) => {
    setProfileEdits({
      name: b.name, owner: b.owner, bio: b.bio, suburb: b.suburb, city: b.city,
      categories: b.categories, cover: b.cover, portfolio: b.portfolio,
      walkInsWelcome: b.walkInsWelcome, capacity: b.capacity, powerReady: b.powerReady,
      format: b.format, whatsapp: b.whatsapp, depositPct: b.depositPct,
      cancellationHours: b.cancellationHours, paymentTerms: b.paymentTerms,
      services: b.services,
      startingPrice: Math.min(...b.services.map((s) => s.price)),
    });
  };

  const onOpen = (b: Business) => setSelected(mergedBusinesses.find((x) => x.id === b.id) ?? b);

  if (!user) {
    return (
      <div className="min-h-screen bg-champagne-100 dark:bg-charcoal-300">
        <Landing onSignIn={() => setAuthOpen(true)} onPopia={() => setPopiaOpen(true)} dark={dark} onToggleDark={() => setDark(!dark)} />
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onAuth={(u) => {
              setUser(u);
              setActiveRole(u.role);
              setView(u.role === 'business' ? 'profile' : 'explore');
              setAuthOpen(false);
            }}
          />
        )}
        {popiaOpen && <PopiaModal onClose={() => setPopiaOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-champagne-100 dark:bg-charcoal-300">
      <div className="flex">
        <Sidebar
          role={role}
          view={view as any}
          onView={(v) => setView(v)}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
          onPopia={() => setPopiaOpen(true)}
          onLogout={() => { setUser(null); setView('explore'); }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar
            user={user}
            onSwitchRole={switchRole}
            onOpenAuth={() => setAuthOpen(false)}
            onMenu={() => setSidebarOpen(true)}
          />

          <main className="mx-auto w-full max-w-6xl flex-1 p-4 lg:p-8">
            {role === 'business' ? (
              <BusinessApp view={view} profile={myProfile} onUpdate={updateProfile} />
            ) : (
              <CustomerApp view={view} saved={savedSet} onToggleSave={toggleSave} onOpen={onOpen} businesses={mergedBusinesses} />
            )}
          </main>

          <footer className="border-t border-bisque-300/40 px-6 py-4 text-center text-xs text-charcoal-300/50 dark:border-charcoal-50/20 dark:text-champagne-100/40">
            Bantu Connect · Made for South African beauty micro-entrepreneurs ·
            <button onClick={() => setPopiaOpen(true)} className="ml-1 text-rose-500 hover:underline">POPIA notice</button>
          </footer>
        </div>
      </div>

      {popiaOpen && <PopiaModal onClose={() => setPopiaOpen(false)} />}
      {selected && (
        <BusinessDetailModal
          business={selected}
          onClose={() => setSelected(null)}
          onSave={() => toggleSave(selected.id)}
          saved={savedSet.has(selected.id)}
        />
      )}
    </div>
  );
}

function BusinessApp({ view, profile, onUpdate }: { view: string; profile: Business; onUpdate: (b: Business) => void }) {
  switch (view) {
    case 'profile': return <ProfileView profile={profile} onUpdate={onUpdate} />;
    case 'ai-studio': return <AIStudioView profile={profile} onApply={(bio, services) => onUpdate({ ...profile, bio, services, startingPrice: Math.min(...services.map((s) => s.price)) })} />;
    case 'portfolio': return <PortfolioView profile={profile} onUpdate={onUpdate} />;
    case 'availability': return <AvailabilityView profile={profile} onUpdate={onUpdate} />;
    case 'policies': return <PoliciesView profile={profile} onUpdate={onUpdate} />;
    case 'community': return <CommunityCareView />;
    default: return <ProfileView profile={profile} onUpdate={onUpdate} />;
  }
}

function CustomerApp({ view, saved, onToggleSave, onOpen, businesses }: { view: string; saved: Set<string>; onToggleSave: (id: string) => void; onOpen: (b: Business) => void; businesses: Business[] }) {
  switch (view) {
    case 'explore': return <ExploreView saved={saved} onToggleSave={onToggleSave} onOpen={onOpen} />;
    case 'lookbook': return <LookbookView onOpen={onOpen} />;
    case 'smartfit': return <SmartFitView onOpen={onOpen} />;
    case 'favorites': return <FavoritesView saved={saved} onToggleSave={onToggleSave} onOpen={onOpen} />;
    case 'bookings': return <BookingsView saved={saved} onOpen={onOpen} />;
    case 'community': return <CommunityCareView />;
    default: return <ExploreView saved={saved} onToggleSave={onToggleSave} onOpen={onOpen} />;
  }
}

function Landing({ onSignIn, onPopia, dark, onToggleDark }: { onSignIn: () => void; onPopia: () => void; dark: boolean; onToggleDark: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-thyme-300/20 blur-3xl" />

      <header className="relative flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white shadow-soft"><Sparkles size={20} /></span>
          <span className="font-serif text-2xl font-semibold text-charcoal-300 dark:text-champagne-100">Bantu Connect</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleDark} className="rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-charcoal-300/80 dark:bg-charcoal-200/70 dark:text-champagne-100/80 border border-bisque-300/40 dark:border-charcoal-50/20">{dark ? 'Light' : 'Dark'}</button>
          <Button onClick={onSignIn}>Sign in</Button>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl px-6 pt-12 pb-20 text-center lg:pt-24">
        <Badge tone="rose" className="mb-5"><ShieldCheck size={12} /> POPIA-compliant · South Africa</Badge>
        <h1 className="font-serif text-5xl font-semibold leading-tight text-charcoal-300 dark:text-champagne-100 lg:text-7xl text-balance">
          Where local beauty<br /><span className="text-rose-500">meets trusted clients.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-charcoal-300/70 dark:text-champagne-100/60">
          Bantu Connect links hairdressers, nail techs, lash artists and makeup
          professionals with clients across Cape Town and Johannesburg. Book
          straight through WhatsApp — no middleman, no commission.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={onSignIn}>Get started <ArrowRight size={18} /></Button>
          <Button size="lg" variant="outline" onClick={onPopia}><ShieldCheck size={16} /> Read our POPIA notice</Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RolePitch icon={<Search size={20} />} title="For Clients" points={['Browse verified studios by suburb and category', 'Smart Fit budget matcher finds services in your price range', 'Book instantly via WhatsApp — no app needed']} tone="rose" />
          <RolePitch icon={<Scissors size={20} />} title="For Beauty Pros" points={['AI Content Studio writes your bio, menu and captions', 'Showcase a portfolio and set walk-in + power-ready status', 'Generate WhatsApp booking links in seconds']} tone="thyme" />
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-5 text-center font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">Featured studios</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((b) => (
            <BusinessCard key={b.id} business={b} onOpen={onSignIn} saved={false} onToggleSave={() => {}} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RolePitch({ icon, title, points, tone }: { icon: React.ReactNode; title: string; points: string[]; tone: 'rose' | 'thyme' }) {
  const bg = tone === 'rose' ? 'bg-rose-100/70 dark:bg-rose-900/30' : 'bg-thyme-100/70 dark:bg-thyme-900/30';
  const accent = tone === 'rose' ? 'bg-rose-500' : 'bg-thyme-500';
  return (
    <div className={`rounded-3xl ${bg} p-6 text-left border border-bisque-300/40 dark:border-charcoal-50/20`}>
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${accent} text-white shadow-soft`}>{icon}</span>
      <h3 className="mt-3 font-serif text-2xl font-semibold text-charcoal-300 dark:text-champagne-100">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-charcoal-300/75 dark:text-champagne-100/65">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accent}`} />{p}
          </li>
        ))}
      </ul>
    </div>
  );
}
