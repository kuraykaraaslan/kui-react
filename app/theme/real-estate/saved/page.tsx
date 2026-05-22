'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SavedPropertyCard } from '@/modules/domains/real-estate/saved/SavedPropertyCard';
import { SavedSearchRow } from '@/modules/domains/real-estate/saved/SavedSearchRow';
import { PROPERTIES } from '../real-estate.data';

const SAVED_SEARCHES = [
  {
    id: 'ss-01',
    name: 'Bosphorus view, Beşiktaş',
    criteria: [
      { label: 'Beşiktaş' },
      { label: '3+ bed' },
      { label: '≤ ₺25M' },
      { label: 'Sea view' },
    ],
    newCount: 3,
    alertsEnabled: true,
  },
  {
    id: 'ss-02',
    name: 'Family house near schools',
    criteria: [
      { label: 'Çekmeköy' },
      { label: '4+ bed' },
      { label: 'Garden' },
    ],
    newCount: 1,
    alertsEnabled: true,
  },
  {
    id: 'ss-03',
    name: 'Beachfront holiday rental',
    criteria: [
      { label: 'Antalya' },
      { label: 'Pool' },
      { label: '≤ ₺40M' },
    ],
    newCount: 0,
    alertsEnabled: false,
  },
];

const SAVED_PROPERTY_IDS = ['p-01', 'p-02', 'p-03', 'p-05'];

const PRICE_CHANGES: Record<string, number> = {
  'p-01': -250_000,
  'p-03': -150_000,
};

const SAVED_TIMESTAMPS: Record<string, number> = {
  'p-01': Date.now() - 2 * 86_400_000,
  'p-02': Date.now() - 6 * 86_400_000,
  'p-03': Date.now() - 14 * 86_400_000,
  'p-05': Date.now() - 28 * 86_400_000,
};

export default function SavedPropertiesPage() {
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [searches, setSearches] = useState(SAVED_SEARCHES);

  const savedProps = SAVED_PROPERTY_IDS
    .filter((id) => !removed[id])
    .map((id) => PROPERTIES.find((p) => p.propertyId === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <DocumentTitle text={`Saved Properties — ${THEME_TITLES['real-estate']}`} />
      <a
        href="/theme/real-estate"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back home
      </a>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">My account</p>
        <h1 className="text-2xl font-bold text-text-primary">Saved</h1>
        <p className="mt-0.5 text-sm text-text-secondary">Favourite listings and the searches that find them.</p>
      </header>

      <section aria-label="Saved searches" className="mb-10">
        <header className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Saved searches</h2>
        </header>
        <div className="flex flex-col gap-2">
          {searches.map((s) => (
            <SavedSearchRow
              key={s.id}
              name={s.name}
              criteria={s.criteria}
              newCount={s.newCount}
              alertsEnabled={s.alertsEnabled}
              onToggleAlerts={() => setSearches((prev) =>
                prev.map((p) => p.id === s.id ? { ...p, alertsEnabled: !p.alertsEnabled } : p),
              )}
              onEdit={() => undefined}
              onDelete={() => setSearches((prev) => prev.filter((p) => p.id !== s.id))}
            />
          ))}
          {searches.length === 0 && (
            <p className="text-sm text-text-secondary italic">No saved searches.</p>
          )}
        </div>
      </section>

      <section aria-label="Saved properties">
        <header className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Saved properties · {savedProps.length}
          </h2>
        </header>
        {savedProps.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface-raised p-10 text-center">
            <FontAwesomeIcon icon={faHeart} className="w-8 h-8 text-text-disabled mb-2" aria-hidden="true" />
            <p className="text-sm text-text-secondary">No saved properties.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProps.map((p) => (
              <SavedPropertyCard
                key={p.propertyId}
                title={p.title}
                price={p.price}
                currency={p.currency}
                type={p.type}
                city={p.city}
                imageUrl={p.imageUrl}
                bedrooms={p.bedrooms}
                bathrooms={p.bathrooms}
                area={p.area}
                savedAt={new Date(SAVED_TIMESTAMPS[p.propertyId])}
                priceChangeAbs={PRICE_CHANGES[p.propertyId]}
                href={`/theme/real-estate/properties/${p.slug}`}
                onRemove={() => setRemoved((r) => ({ ...r, [p.propertyId]: true }))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
