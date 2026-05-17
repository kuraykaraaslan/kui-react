'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping, faTrash, faTag } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { StockStatusBadge } from '../product/StockStatusBadge';
import type { StockStatus } from '../types';

export type WishlistItem = {
  productId: string;
  title: string;
  image?: string | null;
  basePrice: number;
  salePrice?: number | null;
  currency: string;
  stockStatus: StockStatus;
  addedAt?: Date | string;
  /** Price at the time of adding to wishlist, used to detect drops. */
  priceWhenAdded?: number;
  slug?: string;
};

type WishlistItemCardProps = {
  item: WishlistItem;
  onMoveToCart?: (item: WishlistItem) => void;
  onRemove?: (item: WishlistItem) => void;
  className?: string;
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatAdded(date?: Date | string) {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function WishlistItemCard({
  item,
  onMoveToCart,
  onRemove,
  className,
}: WishlistItemCardProps) {
  const currentPrice = item.salePrice ?? item.basePrice;
  const onSale = item.salePrice != null && item.salePrice < item.basePrice;
  const priceDrop =
    item.priceWhenAdded != null && currentPrice < item.priceWhenAdded
      ? item.priceWhenAdded - currentPrice
      : null;
  const inStock = item.stockStatus === 'IN_STOCK' || item.stockStatus === 'LOW_STOCK';

  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-surface-raised overflow-hidden flex flex-col sm:flex-row gap-0 sm:gap-4',
        className,
      )}
    >
      <div className="relative w-full sm:w-40 shrink-0 aspect-square sm:aspect-auto bg-surface-overlay">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-disabled">
            <FontAwesomeIcon icon={faHeart} className="w-6 h-6" aria-hidden="true" />
          </div>
        )}
        {onSale && (
          <Badge variant="error" size="sm" className="absolute top-2 left-2">
            Sale
          </Badge>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.slug ? (
              <a
                href={`/theme/commerce/products/${item.slug}`}
                className="font-semibold text-text-primary hover:text-primary focus-visible:outline-none focus-visible:underline truncate block"
              >
                {item.title}
              </a>
            ) : (
              <p className="font-semibold text-text-primary truncate">{item.title}</p>
            )}
            {item.addedAt && (
              <p className="mt-0.5 text-xs text-text-secondary">
                Saved {formatAdded(item.addedAt)}
              </p>
            )}
          </div>
          <StockStatusBadge status={item.stockStatus} size="sm" />
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-text-primary">
            {formatPrice(currentPrice, item.currency)}
          </span>
          {onSale && (
            <span className="text-sm text-text-disabled line-through">
              {formatPrice(item.basePrice, item.currency)}
            </span>
          )}
          {priceDrop != null && (
            <Badge variant="success" size="sm" className="gap-1">
              <FontAwesomeIcon icon={faTag} className="w-3 h-3" aria-hidden="true" />
              Down {formatPrice(priceDrop, item.currency)}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {onMoveToCart && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onMoveToCart(item)}
              disabled={!inStock}
              iconLeft={<FontAwesomeIcon icon={faCartShopping} className="w-3.5 h-3.5" aria-hidden="true" />}
              aria-label={`Move ${item.title} to cart`}
            >
              {inStock ? 'Move to cart' : 'Out of stock'}
            </Button>
          )}
          {onRemove && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(item)}
              iconLeft={<FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />}
              aria-label={`Remove ${item.title}`}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
