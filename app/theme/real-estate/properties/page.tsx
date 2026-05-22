'use client';
import { useState, useMemo } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faXmark,
  faTableCells,
  faList,
  faSort,
  faSlidersH,
  faChevronDown,
  faHome,
  faBuilding,
  faTree,
  faWarehouse,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';
import { PROPERTIES, CITIES, PROPERTY_TYPES } from '../real-estate.data';
import type { PropertyType, ListingType } from '@/modules/domains/real-estate/types';
import { cn } from '@/libs/utils/cn';

const LISTING_TYPES: { label: string; value: ListingType | '' }[] = [
  { label: 'Any',        value: '' },
  { label: 'For Sale',   value: 'SALE' },
  { label: 'For Rent',   value: 'RENT' },
  { label: 'Short-term', value: 'SHORT_TERM' },
];

const BEDROOM_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
];

const TYPE_ICONS: Record<PropertyType, typeof faHome> = {
  APARTMENT: faBuilding,
  HOUSE: faHome,
  VILLA: faHome,
  LAND: faTree,
  COMMERCIAL: faWarehouse,
  OFFICE: faBriefcase,
};

const TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  LAND: 'Land',
  COMMERCIAL: 'Commercial',
  OFFICE: 'Office',
};

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Area: Largest first', value: 'area_desc' },
];

export default function PropertiesPage() {
  const [city, setCity] = useState('');
  const [type, setType] = useState<PropertyType | ''>('');
  const [listingType, setListingType] = useState<ListingType | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = useMemo(() => {
    let result = PROPERTIES.filter((p) => {
      if (city && p.city !== city) return false;
      if (type && p.type !== type) return false;
      if (listingType && p.listingType !== listingType) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (minBeds && (p.bedrooms == null || p.bedrooms < Number(minBeds))) return false;
      return true;
    });

    if (sort === 'newest') result = [...result].sort((a, b) => (a.daysOnMarket ?? 99) - (b.daysOnMarket ?? 99));
    else if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'area_desc') result = [...result].sort((a, b) => (b.area ?? 0) - (a.area ?? 0));

    return result;
  }, [city, type, listingType, minPrice, maxPrice, minBeds, sort]);

  const hasFilters = city || type || listingType || minPrice || maxPrice || minBeds;

  function clearFilters() {
    setCity('');
    setType('');
    setListingType('');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <DocumentTitle text={`Properties — ${THEME_TITLES['real-estate']}`} />

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Properties</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            {hasFilters ? ' (filtered)' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sort */}
          <div className="relative hidden sm:block">
            <FontAwesomeIcon icon={faSort} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" aria-hidden="true" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-border bg-surface-raised text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus appearance-none"
              aria-label="Sort properties"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" aria-hidden="true" />
          </div>

          {/* View mode */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-2 flex items-center gap-1.5 text-sm transition-colors focus-visible:outline-none',
                viewMode === 'grid' ? 'bg-primary text-primary-fg' : 'bg-surface-raised text-text-secondary hover:bg-surface-overlay'
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <FontAwesomeIcon icon={faTableCells} className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-2 flex items-center gap-1.5 text-sm transition-colors focus-visible:outline-none border-l border-border',
                viewMode === 'list' ? 'bg-primary text-primary-fg' : 'bg-surface-raised text-text-secondary hover:bg-surface-overlay'
              )}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <FontAwesomeIcon icon={faList} className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Sidebar toggle on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
            aria-expanded={sidebarOpen}
          >
            <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Filters
            {hasFilters && <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-fg text-xs font-bold">!</span>}
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar filters ── */}
        <aside
          className={cn(
            'shrink-0 w-64 space-y-6',
            sidebarOpen ? 'block' : 'hidden lg:block'
          )}
          aria-label="Property filters"
        >
          <div className="sticky top-20 rounded-2xl border border-border bg-surface-raised p-5 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-text-primary">Filters</h2>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline focus-visible:outline-none"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Listing type tabs */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Listing Type</p>
              <div className="grid grid-cols-2 gap-1.5">
                {LISTING_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    onClick={() => setListingType(lt.value)}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      listingType === lt.value
                        ? 'bg-primary text-primary-fg'
                        : 'border border-border text-text-secondary hover:border-border-focus hover:text-text-primary'
                    )}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">City</p>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                aria-label="Filter by city"
              >
                <option value="">All cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Property type */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Property Type</p>
              <div className="space-y-1">
                <button
                  onClick={() => setType('')}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left focus-visible:outline-none',
                    type === '' ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:bg-surface-overlay'
                  )}
                >
                  All types
                </button>
                {PROPERTY_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left focus-visible:outline-none',
                      type === t ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:bg-surface-overlay'
                    )}
                  >
                    <FontAwesomeIcon icon={TYPE_ICONS[t]} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {TYPE_LABELS[t]}
                    <span className="ml-auto text-xs text-text-disabled">
                      {PROPERTIES.filter((p) => p.type === t).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Bedrooms</p>
              <div className="flex gap-1.5 flex-wrap">
                {BEDROOM_OPTIONS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setMinBeds(b.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      minBeds === b.value
                        ? 'bg-primary text-primary-fg border-primary'
                        : 'border-border text-text-secondary hover:border-border-focus'
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Price Range</p>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Results ── */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {city && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-medium">
                  {city}
                  <button onClick={() => setCity('')} aria-label={`Remove ${city} filter`} className="hover:text-primary-active">
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                  </button>
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-medium">
                  {TYPE_LABELS[type]}
                  <button onClick={() => setType('')} aria-label={`Remove ${TYPE_LABELS[type]} filter`} className="hover:text-primary-active">
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                  </button>
                </span>
              )}
              {listingType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-medium">
                  {LISTING_TYPES.find((l) => l.value === listingType)?.label}
                  <button onClick={() => setListingType('')} aria-label="Remove listing type filter" className="hover:text-primary-active">
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                  </button>
                </span>
              )}
              {minBeds && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-medium">
                  {minBeds}+ beds
                  <button onClick={() => setMinBeds('')} aria-label="Remove bedroom filter" className="hover:text-primary-active">
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                  </button>
                </span>
              )}
            </div>
          )}

          {filtered.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.propertyId}
                    property={property}
                    href={`/theme/real-estate/properties/${property.slug}`}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((property) => (
                  <a
                    key={property.propertyId}
                    href={`/theme/real-estate/properties/${property.slug}`}
                    className="group flex gap-4 rounded-xl border border-border bg-surface-raised hover:border-border-focus hover:shadow-sm transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    <div className="shrink-0 w-40 sm:w-52 h-36 overflow-hidden bg-surface-sunken">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary-subtle to-surface-overlay" />
                      )}
                    </div>
                    <div className="flex-1 py-3 pr-4 min-w-0">
                      <p className="text-lg font-bold text-text-primary">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: property.currency === 'TRY' ? 'TRY' : 'USD',
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </p>
                      <h3 className="text-sm font-medium text-text-primary line-clamp-1 mt-0.5">{property.title}</h3>
                      <p className="text-xs text-text-secondary mt-1">{property.district ? `${property.district}, ` : ''}{property.city}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                        {property.bedrooms != null && <span>{property.bedrooms} bd</span>}
                        {property.bathrooms != null && <span>{property.bathrooms} ba</span>}
                        {property.area != null && <span>{property.area} m²</span>}
                        {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
                      </div>
                      {property.daysOnMarket != null && (
                        <p className="text-xs text-text-disabled mt-1.5">
                          {property.daysOnMarket === 0 ? 'Listed today' : `Listed ${property.daysOnMarket} day${property.daysOnMarket !== 1 ? 's' : ''} ago`}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )
          ) : (
            <div className="py-20 text-center rounded-2xl border border-border bg-surface-raised">
              <FontAwesomeIcon icon={faFilter} className="w-10 h-10 text-text-disabled mx-auto mb-4" aria-hidden="true" />
              <p className="text-text-secondary text-sm font-medium">No properties match your filters.</p>
              <p className="text-text-disabled text-xs mt-1">Try adjusting or clearing your filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
