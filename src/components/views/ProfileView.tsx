import { User, Phone, MapPin, Star, MessageCircle, Edit3 } from 'lucide-react';
import type { Business } from '../../types';
import { zar } from '../../data';
import { Badge, Button, Field, Input, Textarea, PowerReadyBadge, CapacityBadge, WalkInBadge } from '../ui';
import { waLink } from '../../whatsapp';
import { useState } from 'react';

export function ProfileView({
  profile,
  onUpdate,
}: {
  profile: Business;
  onUpdate: (b: Business) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Business>(profile);

  const save = () => {
    onUpdate(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-300 dark:text-champagne-100">
            Studio Profile & Bio
          </h1>
          <p className="text-sm text-charcoal-300/60 dark:text-champagne-100/50">
            How clients see your business.
          </p>
        </div>
        <Button
          variant={editing ? 'primary' : 'outline'}
          size="sm"
          onClick={() => (editing ? save() : setEditing(true))}
        >
          <Edit3 size={14} /> {editing ? 'Save' : 'Edit'}
        </Button>
      </header>

      <div className="overflow-hidden rounded-3xl bg-white/80 dark:bg-charcoal-200/80 border border-bisque-300/40 dark:border-charcoal-50/20 shadow-soft">
        <div className="relative h-40 w-full">
          <img
            src={profile.cover}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-300/70 to-transparent" />
        </div>
        <div className="p-5">
          {!editing ? (
            <>
              <h2 className="font-serif text-2xl font-semibold text-charcoal-300 dark:text-champagne-100">
                {profile.name}
              </h2>
              <p className="mb-3 inline-flex items-center gap-1.5 text-sm text-charcoal-300/60 dark:text-champagne-100/50">
                <User size={14} /> {profile.owner} ·{' '}
                <MapPin size={14} /> {profile.suburb}, {profile.city}
              </p>
              <p className="mb-4 text-sm leading-relaxed text-charcoal-300/80 dark:text-champagne-100/70">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.categories.map((c) => (
                  <Badge key={c} tone="rose">{c}</Badge>
                ))}
                <WalkInBadge welcome={profile.walkInsWelcome} />
                <CapacityBadge capacity={profile.capacity} />
                <PowerReadyBadge ready={profile.powerReady} />
                <Badge tone="neutral">{profile.format}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-bisque-200/40 p-3 dark:bg-charcoal-300/40">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-charcoal-300/50 dark:text-champagne-100/40">
                    Starting from
                  </p>
                  <p className="font-serif text-2xl font-semibold text-rose-600 dark:text-rose-300">
                    {zar(profile.startingPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-charcoal-300 dark:text-champagne-100">
                    <Star size={14} className="fill-rose-500 text-rose-500" />
                    {profile.rating}
                  </p>
                  <p className="text-xs text-charcoal-300/50 dark:text-champagne-100/40">
                    {profile.reviewCount} reviews
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Field label="Business name">
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
              <Field label="Owner name">
                <Input
                  value={draft.owner}
                  onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
                />
              </Field>
              <Field label="Bio">
                <Textarea
                  rows={4}
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Suburb">
                  <Input
                    value={draft.suburb}
                    onChange={(e) =>
                      setDraft({ ...draft, suburb: e.target.value })
                    }
                  />
                </Field>
                <Field label="City">
                  <Input
                    value={draft.city}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 dark:bg-charcoal-200/70 p-4 border border-bisque-300/40 dark:border-charcoal-50/20">
        <p className="mb-2 text-sm font-semibold text-charcoal-300/80 dark:text-champagne-100/80">
          WhatsApp booking link
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-xl bg-bisque-200/50 px-3 py-2 text-xs text-charcoal-300/70 dark:bg-charcoal-300/60 dark:text-champagne-100/60">
            {waLink(profile.whatsapp, profile.owner)}
          </code>
          <a
            href={waLink(profile.whatsapp, profile.owner)}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              <MessageCircle size={14} /> Open
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
