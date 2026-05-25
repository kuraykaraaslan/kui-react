import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { ProductCard } from '@/modules/domains/commerce/product/ProductCard';
import { ProductImageGallery } from '@/modules/domains/commerce/product/ProductImageGallery';
import { StockStatusBadge } from '@/modules/domains/commerce/product/StockStatusBadge';
import { ProductTypeBadge } from '@/modules/domains/commerce/product/ProductTypeBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faBolt,
  faStar,
  faStarHalfAlt,
  faTruck,
  faRotateLeft,
  faShieldHalved,
  faMinus,
  faPlus,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { PRODUCTS, CATEGORIES } from '../../commerce.data';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  return { title: buildPageTitle(product?.title ?? slug, THEME_TITLES['commerce']) };
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <FontAwesomeIcon
            key={s}
            icon={rating >= s ? faStar : rating >= s - 0.5 ? faStarHalfAlt : faStarEmpty}
            className={`w-4 h-4 ${rating >= s || rating >= s - 0.5 ? 'text-[var(--warning)]' : 'text-text-disabled'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-sm text-text-secondary">
        {rating.toFixed(1)} <span className="text-text-disabled">({count.toLocaleString()} reviews)</span>
      </span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.categoryId === product.categoryId);
  const related = PRODUCTS
    .filter((p) => p.productId !== product.productId && p.categoryId === product.categoryId)
    .slice(0, 4);
  const relatedProducts = related.length > 0
    ? related
    : PRODUCTS.filter((p) => p.productId !== product.productId).slice(0, 4);

  const displayPrice = product.salePrice ?? product.basePrice;
  const discount = product.salePrice != null
    ? Math.round((1 - product.salePrice / product.basePrice) * 100)
    : null;
  const inStock = product.stockStatus !== 'OUT_OF_STOCK';

  return (
    <div className="bg-surface-base min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-6">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/theme/commerce' },
            { label: 'Products', href: '/theme/commerce/products' },
            ...(category ? [{ label: category.title, href: `/theme/commerce/products?category=${category.slug}` }] : []),
            { label: product.title },
          ]}
          maxItems={4}
          className="mb-6"
        />

        {/* ── Product layout ── */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Left: image gallery */}
          <ProductImageGallery
            images={[
              { src: product.image, alt: product.title },
              ...(product.gallery ?? []).map((src) => ({ src, alt: product.title })),
            ]}
            thumbsVisible={5}
          />

          {/* Right: details */}
          <div className="space-y-5">
            {/* Type + stock */}
            <div className="flex flex-wrap gap-2">
              <ProductTypeBadge type={product.type} />
              {!inStock && <StockStatusBadge status={product.stockStatus} />}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-text-primary leading-tight">{product.title}</h1>

            {/* Ratings */}
            {product.rating != null && product.reviewCount != null && (
              <Stars rating={product.rating} count={product.reviewCount} />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-text-primary">
                {formatPrice(displayPrice, product.currency)}
              </span>
              {product.salePrice != null && (
                <>
                  <span className="text-base text-text-disabled line-through">
                    {formatPrice(product.basePrice, product.currency)}
                  </span>
                  <Badge variant="error" size="sm">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>

            {/* Delivery perks */}
            {inStock && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: faTruck,        label: 'Free delivery' },
                  { icon: faRotateLeft,   label: '30-day return' },
                  { icon: faShieldHalved, label: 'Secure pay' },
                ].map((perk) => (
                  <div key={perk.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface-raised p-3 text-center">
                    <FontAwesomeIcon icon={perk.icon} className="w-4 h-4 text-[var(--success-fg)]" aria-hidden="true" />
                    <span className="text-[11px] text-text-secondary">{perk.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-sunken px-3 py-1 text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + actions */}
            <div className="pt-2 border-t border-border space-y-3">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">Quantity</span>
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button type="button" className="px-3 py-2 text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none" aria-label="Decrease quantity">
                    <FontAwesomeIcon icon={faMinus} className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-text-primary border-x border-border select-none">1</span>
                  <button type="button" className="px-3 py-2 text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none" aria-label="Increase quantity">
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
                {inStock
                  ? <span className="text-xs text-success font-medium">In Stock</span>
                  : <StockStatusBadge status={product.stockStatus} size="sm" />
                }
              </div>

              {/* CTA row */}
              <div className="flex gap-3">
                <Button
                  as="a"
                  href="/theme/commerce/cart"
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconLeft={<FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />}
                  className="!bg-[var(--success-fg)] hover:!bg-[var(--success)] !border-[var(--success-fg)]"
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                {inStock && (
                  <Button
                    as="a"
                    href="/theme/commerce/cart"
                    variant="outline"
                    size="lg"
                    fullWidth
                    iconLeft={<FontAwesomeIcon icon={faBolt} className="w-4 h-4" />}
                  >
                    Buy Now
                  </Button>
                )}

                <button
                  type="button"
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-border text-text-secondary hover:text-error hover:border-error transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  aria-label="Add to wishlist"
                >
                  <FontAwesomeIcon icon={faHeart} className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-text-primary mb-6">You May Also Like</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.productId}
                  product={p}
                  href={`/theme/commerce/products/${p.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
