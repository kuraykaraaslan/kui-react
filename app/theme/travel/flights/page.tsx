'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { FlightCabinBadge } from '@/modules/domains/travel/flight/FlightCabinBadge';
import { FlightSegmentStatusBadge } from '@/modules/domains/travel/flight/FlightSegmentStatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass, faPlane, faLocationDot, faCalendar,
  faUsers, faArrowRight, faClock, faSort, faFilter, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FLIGHTS } from '../travel.data';
import type { FlightCabinClass, FlightSegmentStatus } from '@/modules/domains/travel/types';

const CABIN_OPTIONS: FlightCabinClass[] = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];

const CABIN_LABELS: Record<FlightCabinClass, string> = {
  ECONOMY:         'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS:        'Business',
  FIRST:           'First Class',
};

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'duration';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc',   label: 'Cheapest first' },
  { value: 'price_desc',  label: 'Most expensive' },
  { value: 'duration',    label: 'Shortest flight' },
];

export default function FlightsPage() {
  const [origin, setOrigin]               = useState('');
  const [destination, setDestination]     = useState('');
  const [cabinFilter, setCabinFilter]     = useState<FlightCabinClass | ''>('');
  const [statusFilter, setStatusFilter]   = useState<FlightSegmentStatus | ''>('');
  const [sort, setSort]                   = useState<SortKey>('recommended');
  const [filtersOpen, setFiltersOpen]     = useState(false);

  let filtered = FLIGHTS.filter((f) => {
    if (origin && !f.origin.toLowerCase().includes(origin.toLowerCase()) &&
        !f.originCity.toLowerCase().includes(origin.toLowerCase())) return false;
    if (destination && !f.destination.toLowerCase().includes(destination.toLowerCase()) &&
        !f.destinationCity.toLowerCase().includes(destination.toLowerCase())) return false;
    if (cabinFilter && f.cabin !== cabinFilter) return false;
    if (statusFilter && f.status !== statusFilter) return false;
    return true;
  });

  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const hasFilters = !!origin || !!destination || !!cabinFilter || !!statusFilter;

  return (
    <div className="bg-surface-base min-h-screen">
      <DocumentTitle text={`Flights — ${THEME_TITLES['travel']}`} />
      {/* ── Search bar hero ── */}
      <div className="bg-primary py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-2xl font-extrabold text-primary-fg mb-5 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlane} className="w-5 h-5" aria-hidden="true" />
            Search Flights
          </h1>
          <div className="bg-surface-base rounded-2xl shadow-lg p-4 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                placeholder="From — city or IATA code"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-surface-base text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus"
                aria-label="Origin"
              />
            </div>
            <div className="relative flex-1 min-w-[160px]">
              <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                placeholder="To — city or IATA code"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-surface-base text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus"
                aria-label="Destination"
              />
            </div>
            <div className="relative min-w-[152px]">
              <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <input type="date" aria-label="Departure date" className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus" />
            </div>
            <div className="relative min-w-[148px]">
              <FontAwesomeIcon icon={faUsers} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <select aria-label="Passengers" className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-surface-base text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-border-focus">
                <option>1 adult</option>
                <option>2 adults</option>
                <option>3 adults</option>
                <option>2 adults, 1 child</option>
              </select>
            </div>
            <Button variant="primary" size="lg" iconLeft={<FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" aria-hidden="true" />} className="px-8">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Sort + filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-surface-raised border border-border rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FontAwesomeIcon icon={faSort} className="w-4 h-4 text-text-secondary" aria-hidden="true" />
            <span className="text-sm font-medium text-text-secondary">Sort:</span>
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

          <button
            type="button"
            onClick={() => setFiltersOpen((p) => !p)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" aria-hidden="true" />
            Filters
            {hasFilters && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-fg text-xs font-bold">!</span>
            )}
          </button>
        </div>

        {/* Filter drawer */}
        {filtersOpen && (
          <div className="mb-5 bg-surface-raised border border-border rounded-xl p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Cabin class</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCabinFilter('')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    cabinFilter === '' ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:border-border-strong'
                  )}
                >
                  All
                </button>
                {CABIN_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCabinFilter(cabinFilter === c ? '' : c)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      cabinFilter === c ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:border-border-strong'
                    )}
                  >
                    {CABIN_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={() => { setOrigin(''); setDestination(''); setCabinFilter(''); setStatusFilter(''); }}
                className="self-end inline-flex items-center gap-1.5 text-xs text-error font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-text-secondary mb-4">
          <span className="font-semibold text-text-primary">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'flight' : 'flights'} found
        </p>

        {/* Flight list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((flight) => (
              <article
                key={flight.flightId}
                className="bg-surface-raised border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-border-strong transition-all duration-200"
              >
                {/* Airline strip */}
                <div className="sm:w-40 shrink-0 flex flex-row sm:flex-col items-center justify-center gap-2 p-4 border-b sm:border-b-0 sm:border-r border-border bg-surface-base">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle">
                    <FontAwesomeIcon icon={faPlane} className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-text-primary line-clamp-1">{flight.airline}</p>
                    <p className="text-xs text-text-secondary font-mono">{flight.flightNumber}</p>
                  </div>
                </div>

                {/* Route + info */}
                <div className="flex-1 p-4 flex flex-col sm:flex-row items-center gap-4">
                  {/* Times */}
                  <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                    {/* Origin */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-2xl font-extrabold text-text-primary tracking-tight">{flight.origin}</p>
                      <p className="text-sm text-text-secondary font-medium">{flight.departureTime}</p>
                      <p className="text-xs text-text-disabled truncate max-w-[80px]">{flight.originCity}</p>
                    </div>

                    {/* Duration line */}
                    <div className="flex flex-col items-center gap-1 flex-1 px-1">
                      {flight.duration && (
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
                          {flight.duration}
                        </span>
                      )}
                      <div className="flex items-center w-full gap-1">
                        <div className="flex-1 h-px bg-border" />
                        <FontAwesomeIcon icon={faPlane} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <span className="text-xs text-success font-medium">Direct</span>
                    </div>

                    {/* Destination */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-2xl font-extrabold text-text-primary tracking-tight">{flight.destination}</p>
                      <p className="text-sm text-text-secondary font-medium">{flight.arrivalTime}</p>
                      <p className="text-xs text-text-disabled truncate max-w-[80px]">{flight.destinationCity}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <FlightCabinBadge cabin={flight.cabin} size="sm" />
                    <FlightSegmentStatusBadge status={flight.status} size="sm" />
                  </div>
                </div>

                {/* Price column */}
                <div className="sm:w-44 shrink-0 flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3 p-4 border-t sm:border-t-0 sm:border-l border-border bg-surface-base">
                  <div className="sm:text-right">
                    <p className="text-xs text-text-secondary">from</p>
                    <p className="text-2xl font-extrabold text-text-primary leading-none">
                      ${flight.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary">per person</p>
                  </div>
                  <Button
                    as="a"
                    href={`/theme/travel/flights/${flight.flightId}`}
                    variant="primary"
                    size="sm"
                    fullWidth
                    iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
                  >
                    Select
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-raised border border-border rounded-xl text-text-secondary">
            <FontAwesomeIcon icon={faPlane} className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="font-semibold text-text-primary">No flights found</p>
            <p className="text-sm mt-1">Try a different origin, destination, or cabin class.</p>
          </div>
        )}
      </div>
    </div>
  );
}
