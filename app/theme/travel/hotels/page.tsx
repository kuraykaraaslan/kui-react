'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass, faStar, faLocationDot, faArrowRight,
  faWifi, faSwimmingPool, faDumbbell, faUtensils,
  faSliders, faSort, faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faStar as faStarFull } from '@fortawesome/free-regular-svg-icons';
import { HOTELS } from '../travel.data';

const REVIEW_LABELS: Record<string, string> = {
  '9': 'Exceptional',
  '8': 'Excellent',
  '7': 'Very Good',
  '0': 'Any score',
};

const AMENITY_OPTIONS = ['Free Wi-Fi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'];
const AMENITY_ICONS: Record<string, typeof faWifi> = {
  'Free Wi-Fi': faWifi,
  'Pool':       faSwimmingPool,
  'Gym':        faDumbbell,
  'Restaurant': faUtensils,
};

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'rating';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc',   label: 'Price: low to high' },
  { value: 'price_desc',  label: 'Price: high to low' },
  { value: 'rating',      label: 'Top reviewed' },
];

function StarRating({ stars, size = 'sm' }: { stars: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={i < stars ? faStarFull : faStarEmpty}
          className={cn(cls, i < stars ? 'text-warning' : 'text-text-disabled')}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewBadge({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const score = rating.toFixed(1);
  const label = rating >= 9 ? 'Exceptional' : rating >= 8 ? 'Excellent' : rating >= 7 ? 'Very Good' : 'Good';
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div>
        <p className="text-xs font-semibold text-text-primary text-right">{label}</p>
        <p className="text-xs text-text-secondary text-right">{reviewCount.toLocaleString()} reviews</p>
      </div>
      <div className="flex h-9 w-11 items-center justify-center rounded-lg bg-primary text-primary-fg text-base font-extrabold shrink-0">
        {score}
      </div>
    </div>
  );
}

export default function HotelsPage() {
  const [destination, setDestination]         = useState('');
  const [minStars, setMinStars]               = useState(0);
  const [maxPrice, setMaxPrice]               = useState(0);
  const [minRating, setMinRating]             = useState(0);
  const [amenities, setAmenities]             = useState<string[]>([]);
  const [sort, setSort]                       = useState<SortKey>('recommended');
  const [filtersOpen, setFiltersOpen]         = useState(false);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  let filtered = HOTELS.filter((h) => {
    if (destination && !h.city.toLowerCase().includes(destination.toLowerCase()) &&
        !h.country.toLowerCase().includes(destination.toLowerCase()) &&
        !h.name.toLowerCase().includes(destination.toLowerCase())) return false;
    if (minStars && h.stars < minStars) return false;
    if (maxPrice > 0 && h.pricePerNight > maxPrice) return false;
    if (minRating > 0 && (h.rating ?? 0) < minRating) return false;
    if (amenities.length > 0 && !amenities.every((a) => h.amenities.includes(a))) return false;
    return true;
  });

  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === 'rating')     filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const hasFilters = !!destination || minStars > 0 || maxPrice > 0 || minRating > 0 || amenities.length > 0;

  const FilterPanel = () => (
    <aside className="space-y-4 text-sm">
      {/* Destination */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">Search</h3>
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            placeholder="City, country or hotel"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>
      </div>

      {/* Budget */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">Budget per night</h3>
        <div className="space-y-2">
          {[
            { label: 'Any price',    value: 0   },
            { label: 'Up to $150',   value: 150  },
            { label: 'Up to $300',   value: 300  },
            { label: 'Up to $500',   value: 500  },
            { label: 'Up to $700',   value: 700  },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="maxPrice"
                value={opt.value}
                checked={maxPrice === opt.value}
                onChange={() => setMaxPrice(opt.value)}
                className="accent-primary"
              />
              <span className="text-text-primary group-hover:text-primary transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Star rating */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">Star rating</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setMinStars(minStars === s ? 0 : s)}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                minStars === s && s > 0
                  ? 'border-primary bg-primary-subtle text-primary'
                  : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
              )}
            >
              {s === 0 ? 'Any' : (
                <>
                  <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-warning" aria-hidden="true" />
                  {s}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Review score */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">Review score</h3>
        <div className="space-y-2">
          {[0, 7, 8, 9].map((score) => (
            <label key={score} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                value={score}
                checked={minRating === score}
                onChange={() => setMinRating(score)}
                className="accent-primary"
              />
              <span className="text-text-primary group-hover:text-primary transition-colors">
                {score === 0 ? 'Any score' : `${REVIEW_LABELS[String(score)]} ${score}+`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-surface-raised border border-border rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-text-primary">Amenities</h3>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="accent-primary rounded"
              />
              <FontAwesomeIcon
                icon={AMENITY_ICONS[a] ?? faCircleCheck}
                className="w-3.5 h-3.5 text-text-secondary"
                aria-hidden="true"
              />
              <span className="text-text-primary group-hover:text-primary transition-colors">{a}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setDestination(''); setMinStars(0); setMaxPrice(0);
            setMinRating(0); setAmenities([]);
          }}
          className="w-full py-2 text-sm text-error font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <DocumentTitle text={`Hotels — ${THEME_TITLES['travel']}`} />
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Hotels &amp; Accommodation
        </h1>
        <p className="mt-1 text-text-secondary text-sm">
          {filtered.length.toLocaleString()} properties found worldwide
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Sidebar (desktop) ── */}
        <div className="hidden lg:block w-60 shrink-0">
          <FilterPanel />
        </div>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-surface-raised border border-border rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSort} className="w-4 h-4 text-text-secondary" aria-hidden="true" />
              <span className="text-sm font-medium text-text-secondary">Sort by:</span>
              <div className="flex flex-wrap gap-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSort(opt.value)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      sort === opt.value
                        ? 'bg-primary text-primary-fg'
                        : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen((p) => !p)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <FontAwesomeIcon icon={faSliders} className="w-4 h-4" aria-hidden="true" />
              Filters
              {hasFilters && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-fg text-xs font-bold">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Mobile filter panel */}
          {filtersOpen && (
            <div className="lg:hidden mb-5">
              <FilterPanel />
            </div>
          )}

          {/* Hotel list */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((hotel) => (
                <article
                  key={hotel.hotelId}
                  className="bg-surface-raised border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-border-strong transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative sm:w-52 lg:w-60 h-48 sm:h-auto shrink-0 overflow-hidden bg-surface-sunken">
                    {hotel.imageUrl ? (
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-subtle to-info-subtle flex items-center justify-center">
                        <FontAwesomeIcon icon={faLocationDot} className="w-10 h-10 text-primary/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                    {/* Stars + name */}
                    <div>
                      {hotel.stars != null && <StarRating stars={hotel.stars} size="md" />}
                      <h2 className="text-base font-bold text-text-primary mt-1 line-clamp-1">{hotel.name}</h2>
                      <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0 text-primary" aria-hidden="true" />
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenity chips */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {hotel.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-surface-overlay text-text-secondary border border-border"
                        >
                          <FontAwesomeIcon icon={AMENITY_ICONS[a] ?? faCircleCheck} className="w-2.5 h-2.5" aria-hidden="true" />
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-surface-overlay text-text-secondary border border-border">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price column */}
                  <div className="sm:w-44 lg:w-52 shrink-0 p-4 flex flex-col items-stretch justify-between gap-3 border-t sm:border-t-0 sm:border-l border-border bg-surface-base">
                    {/* Review badge */}
                    {hotel.rating != null && hotel.reviewCount != null && (
                      <ReviewBadge rating={hotel.rating} reviewCount={hotel.reviewCount} />
                    )}

                    {/* Price + book */}
                    <div className="mt-auto space-y-2">
                      <div>
                        <p className="text-xs text-text-secondary">from</p>
                        <p className="text-2xl font-extrabold text-text-primary leading-none">
                          ${hotel.pricePerNight.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-secondary">per night</p>
                      </div>
                      <p className="text-xs text-success font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" aria-hidden="true" />
                        Free cancellation
                      </p>
                      <Button
                        as="a"
                        href={`/theme/travel/hotels/${hotel.slug}`}
                        variant="primary"
                        fullWidth
                        iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
                      >
                        View Deal
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-text-secondary bg-surface-raised border border-border rounded-xl">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="font-semibold text-text-primary">No hotels match your filters</p>
              <p className="text-sm mt-1">Try widening your search or removing some filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
