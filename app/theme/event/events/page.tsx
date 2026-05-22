'use client';
import { useState, useMemo } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { SearchBar } from '@/modules/ui/SearchBar';
import { Button } from '@/modules/ui/Button';
import { Select } from '@/modules/ui/Select';
import { EmptyState } from '@/modules/ui/EmptyState';
import { EventCard } from '@/modules/domains/event/EventCard';
import { EventCategoryBadge } from '@/modules/domains/event/EventCategoryBadge';
import { EVENTS, EVENT_CATEGORIES } from '@/app/theme/event/event.data';
import type { EventFormat, EventStatus } from '@/modules/domains/event/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';

const FORMAT_OPTIONS = [
  { value: '', label: 'Tüm Formatlar' },
  { value: 'PHYSICAL', label: 'Fiziksel' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'HYBRID', label: 'Hibrit' },
];

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Tarihe Göre (Yakın)' },
  { value: 'date-desc', label: 'Tarihe Göre (Uzak)' },
  { value: 'price-asc', label: 'Fiyat (Düşükten)' },
  { value: 'price-desc', label: 'Fiyat (Yüksekten)' },
];

export default function EventsListingPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [sort, setSort] = useState('date-asc');
  const [showSoldOut, setShowSoldOut] = useState(true);

  const filtered = useMemo(() => {
    let result = [...EVENTS];

    if (!showSoldOut) {
      result = result.filter((e) => e.status !== 'SOLD_OUT');
    }

    if (activeCategory) {
      result = result.filter((e) => e.category.slug === activeCategory);
    }

    if (format) {
      result = result.filter((e) => e.format === (format as EventFormat));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q)),
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'date-asc':  return a.startAt.getTime() - b.startAt.getTime();
        case 'date-desc': return b.startAt.getTime() - a.startAt.getTime();
        case 'price-asc': return (a.minPrice ?? 0) - (b.minPrice ?? 0);
        case 'price-desc': return (b.minPrice ?? 0) - (a.minPrice ?? 0);
        default: return 0;
      }
    });

    return result;
  }, [search, activeCategory, format, sort, showSoldOut]);

  function clearFilters() {
    setSearch('');
    setActiveCategory('');
    setFormat('');
    setSort('date-asc');
    setShowSoldOut(true);
  }

  const hasFilters = search || activeCategory || format || !showSoldOut;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <DocumentTitle text={`Events — ${THEME_TITLES.event}`} />
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-text-primary">Tüm Etkinlikler</h1>
        <p className="text-text-secondary text-sm mt-1">
          {filtered.length} etkinlik bulundu
        </p>
      </div>

      {/* search + sort row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar
          id="events-search"
          placeholder="Etkinlik, sanatçı ara..."
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          className="flex-1 min-w-56"
        />
        <div className="w-52">
          <Select
            id="events-sort"
            label=""
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select
            id="events-format"
            label=""
            options={FORMAT_OPTIONS}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Temizle
          </Button>
        )}
      </div>

      {/* category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            activeCategory === ''
              ? 'border-primary bg-primary text-primary-fg'
              : 'border-border bg-surface-raised text-text-secondary hover:border-border-strong hover:text-text-primary'
          }`}
        >
          Tümü
        </button>
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.categoryId}
            onClick={() => setActiveCategory(activeCategory === cat.slug ? '' : cat.slug)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat.slug
                ? 'border-primary bg-primary text-primary-fg'
                : 'border-border bg-surface-raised text-text-secondary hover:border-border-strong hover:text-text-primary'
            }`}
          >
            {cat.title}
          </button>
        ))}

        {/* sold out toggle */}
        <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={showSoldOut}
            onChange={(e) => setShowSoldOut(e.target.checked)}
            className="rounded"
          />
          Tükenenler dahil
        </label>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faTicket} className="w-5 h-5" aria-hidden="true" />}
          title="Etkinlik bulunamadı"
          description="Arama veya filtre kriterlerinize uygun etkinlik yok."
          action={
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Filtreleri temizle
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
