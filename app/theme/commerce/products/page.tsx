import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { ProductCard } from '@/modules/domains/commerce/product/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faChevronDown,
  faStar,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { PRODUCTS, CATEGORIES } from '../commerce.data';

export const metadata: Metadata = {
  title: buildPageTitle('Products', THEME_TITLES['commerce']),
};

const SORT_OPTIONS = [
  'Featured',
  'Price: Low to High',
  'Price: High to Low',
  'Avg. Customer Review',
  'Newest Arrivals',
];

const PRICE_RANGES = [
  { label: 'Under $25', href: '#' },
  { label: '$25 to $50', href: '#' },
  { label: '$50 to $100', href: '#' },
  { label: '$100 to $200', href: '#' },
  { label: 'Over $200', href: '#' },
];

const STAR_FILTERS = [4, 3, 2, 1];

export default function ProductsPage() {
  const sorted = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="bg-surface-raised min-h-screen">
      <div className="mx-auto max-w-[1500px] px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-text-secondary mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            <li><a href="/theme/commerce" className="hover:text-primary hover:underline">Home</a></li>
            <li className="text-text-disabled">›</li>
            <li className="text-text-primary">All Products</li>
          </ol>
        </nav>

        <div className="flex gap-5">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-52 shrink-0 space-y-6">
            {/* Department */}
            <div>
              <h2 className="text-sm font-bold text-text-primary border-b border-border pb-2 mb-3">
                Department
              </h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/theme/commerce/products"
                    className="block px-1 py-0.5 text-sm font-semibold text-primary"
                  >
                    All Departments
                  </a>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.categoryId}>
                    <a
                      href={`/theme/commerce/products?category=${cat.slug}`}
                      className="block px-1 py-0.5 text-sm text-text-secondary hover:text-primary hover:underline transition-colors"
                    >
                      {cat.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer review */}
            <div>
              <h2 className="text-sm font-bold text-text-primary border-b border-border pb-2 mb-3">
                Avg. Customer Review
              </h2>
              <ul className="space-y-1.5">
                {STAR_FILTERS.map((stars) => (
                  <li key={stars}>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary hover:underline"
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`w-3 h-3 ${i < stars ? 'text-[var(--warning)]' : 'text-text-disabled'}`}
                          aria-hidden="true"
                        />
                      ))}
                      <span>& Up</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div>
              <h2 className="text-sm font-bold text-text-primary border-b border-border pb-2 mb-3">
                Price
              </h2>
              <ul className="space-y-1">
                {PRICE_RANGES.map((range) => (
                  <li key={range.label}>
                    <a
                      href={range.href}
                      className="block px-1 py-0.5 text-sm text-text-secondary hover:text-primary hover:underline"
                    >
                      {range.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product type */}
            <div>
              <h2 className="text-sm font-bold text-text-primary border-b border-border pb-2 mb-3">
                Product Type
              </h2>
              <ul className="space-y-1">
                {(['Physical', 'Digital', 'Service'] as const).map((type) => (
                  <li key={type}>
                    <a
                      href={`/theme/commerce/products?type=${type.toUpperCase()}`}
                      className="block px-1 py-0.5 text-sm text-text-secondary hover:text-primary hover:underline"
                    >
                      {type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
              <div>
                <h1 className="text-xl font-bold text-text-primary">All Products</h1>
                <p className="text-xs text-text-secondary mt-0.5">
                  1–{PRODUCTS.length} of {PRODUCTS.length} results
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  type="button"
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-sm text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
                >
                  <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" aria-hidden="true" />
                  Filters
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-7 py-1.5 rounded border border-border bg-surface-base text-sm text-text-primary hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-border-focus cursor-pointer">
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-base rounded">
                <FontAwesomeIcon icon={faBoxOpen} className="w-12 h-12 text-text-disabled mb-4" aria-hidden="true" />
                <p className="text-text-secondary text-sm">No products found.</p>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                {sorted.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    href={`/theme/commerce/products/${product.slug}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
