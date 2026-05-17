'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFire, faClock } from '@fortawesome/free-solid-svg-icons';

type FeaturedDishCardProps = {
  name: string;
  restaurantName: string;
  imageUrl?: string | null;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  prepTimeMin?: number;
  badge?: string;
  hot?: boolean;
  href?: string;
  className?: string;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export function FeaturedDishCard({
  name,
  restaurantName,
  imageUrl,
  price,
  currency,
  rating,
  reviewCount,
  prepTimeMin,
  badge,
  hot,
  href,
  className,
}: FeaturedDishCardProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised',
        href && 'transition-all hover:shadow-md hover:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warning/20 to-error/20">
            <FontAwesomeIcon icon={faFire} className="w-10 h-10 text-warning" aria-hidden="true" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1.5">
          {badge && (
            <Badge variant="primary" size="sm">{badge}</Badge>
          )}
          {hot && (
            <Badge variant="error" size="sm">
              <FontAwesomeIcon icon={faFire} className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              Hot
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs uppercase tracking-wide text-text-secondary font-medium">
          {restaurantName}
        </p>
        <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-2">
          {name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
          {rating !== undefined && (
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-warning" aria-hidden="true" />
              <span className="font-semibold text-text-primary tabular-nums">{rating.toFixed(1)}</span>
              {reviewCount !== undefined && <span>({reviewCount})</span>}
            </span>
          )}
          {prepTimeMin !== undefined && (
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
              {prepTimeMin} min
            </span>
          )}
        </div>

        <p className="mt-auto pt-2 text-base font-bold text-text-primary tabular-nums">
          {formatPrice(price, currency)}
        </p>
      </div>
    </Wrapper>
  );
}
