import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSliders,
  faStar,
  faMotorcycle,
  faTag,
  faStore,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: buildPageTitle('Restaurants', THEME_TITLES['food']),
};
import { RestaurantCard } from '@/modules/domains/food/restaurant/RestaurantCard';
import { RESTAURANTS, CUISINE_TYPES } from '../food.data';

const FILTER_TABS = [
  { id: 'all',          label: 'All',           icon: faStore },
  { id: 'offers',       label: 'Offers',        icon: faTag },
  { id: 'free-delivery',label: 'Free delivery', icon: faMotorcycle },
  { id: 'top-rated',   label: 'Top rated',     icon: faStar },
];

export default function RestaurantsListingPage() {
  const freeDelivery = RESTAURANTS.filter((r) => r.deliveryFee === 0);
  const withPromo    = RESTAURANTS.filter((r) => r.promoText);

  return (
    <div className="bg-surface-base text-text-primary">
      {/* Sub-header */}
      <div className="sticky top-16 z-30 border-b border-border bg-surface-base shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb + search row */}
          <div className="flex items-center justify-between gap-3 py-3 flex-wrap">
            <Breadcrumb
              items={[
                { label: 'Home',        href: '/theme/food' },
                { label: 'Restaurants' },
              ]}
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 py-2 w-52 focus-within:ring-2 focus-within:ring-border-focus transition-shadow">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search restaurants…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
                  aria-label="Search restaurants"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <FontAwesomeIcon icon={faSliders} className="w-3.5 h-3.5" aria-hidden="true" />
                Filters
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0" role="tablist" aria-label="Filter restaurants">
            {FILTER_TABS.map((tab, i) => {
              const isActive = i === 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={[
                    'inline-flex items-center gap-1.5 shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    isActive
                      ? 'border-text-primary text-text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong',
                  ].join(' ')}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-3.5 h-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-52 shrink-0 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
                Cuisine
              </p>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 cursor-pointer py-1 group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-border-focus"
                    aria-label="All cuisines"
                  />
                  <span className="text-sm text-text-primary font-medium">All</span>
                </label>
                {CUISINE_TYPES.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer py-1 group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-border-focus"
                      aria-label={c}
                    />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
                Delivery time
              </p>
              <div className="flex flex-col gap-1">
                {['Under 30 min', '30–45 min', '45+ min'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="delivery-time"
                      className="w-4 h-4 accent-primary focus-visible:ring-2 focus-visible:ring-border-focus"
                      aria-label={opt}
                    />
                    <span className="text-sm text-text-secondary">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
                Rating
              </p>
              <div className="flex flex-col gap-1">
                {['4.5+', '4.0+', '3.5+'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 accent-primary focus-visible:ring-2 focus-visible:ring-border-focus"
                      aria-label={`Rating ${opt}`}
                    />
                    <span className="text-sm text-text-secondary">★ {opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Mobile cuisine chips */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--surface-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                All
              </button>
              {CUISINE_TYPES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border bg-surface-raised text-text-secondary hover:border-border-focus hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Offers section */}
            {withPromo.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-text-primary">Deals & Offers</h2>
                  <span className="text-xs text-text-secondary">{withPromo.length} restaurants</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {withPromo.map((r) => (
                    <RestaurantCard
                      key={r.restaurantId}
                      restaurant={r}
                      href={`/theme/food/restaurants/${r.slug}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All restaurants */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-text-primary">All restaurants</h2>
                <span className="text-xs text-text-secondary">{RESTAURANTS.length} restaurants</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {RESTAURANTS.map((r) => (
                  <RestaurantCard
                    key={r.restaurantId}
                    restaurant={r}
                    href={`/theme/food/restaurants/${r.slug}`}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
