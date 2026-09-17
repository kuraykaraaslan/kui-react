'use client';
import { cn } from '@/libs/utils/cn';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke, faArrowRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

type HotelCardProps = {
  hotel: {
    hotelId: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    stars?: number | null;
    pricePerNight: number;
    currency: string;
    imageUrl?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
  };
  href?: string;
  dealBadge?: string;
  className?: string;
};

function StarRating({ stars }: { stars: number }) {
  return (
    <div role="img" className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < Math.floor(stars)) {
          return <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3 text-warning" aria-hidden="true" />;
        }
        if (i < stars) {
          return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className="w-3 h-3 text-warning" aria-hidden="true" />;
        }
        return <FontAwesomeIcon key={i} icon={faStarEmpty} className="w-3 h-3 text-text-disabled" aria-hidden="true" />;
      })}
    </div>
  );
}

export function HotelCard({ hotel, href, dealBadge, className }: HotelCardProps) {
  const body = (
    <div className="flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-surface-sunken overflow-hidden">
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Deal badge */}
        {dealBadge && (
          <div className="absolute top-2 left-2 bg-error text-text-inverse text-xs font-bold px-2 py-1 rounded-md shadow">
            {dealBadge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Stars + Name */}
        <div>
          {hotel.stars != null && <StarRating stars={hotel.stars} />}
          <h3 className="text-base font-semibold text-text-primary mt-1 line-clamp-1">{hotel.name}</h3>
          <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
            <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" aria-hidden="true" />
            {hotel.city}, {hotel.country}
          </p>
        </div>

        {/* Rating */}
        {hotel.rating != null && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-10 rounded-lg bg-primary text-primary-fg text-sm font-bold">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-xs text-text-secondary">
              {hotel.reviewCount != null ? `${hotel.reviewCount.toLocaleString()} reviews` : 'Rated'}
            </span>
          </div>
        )}

        {/* Price + Book */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          <div>
            <p className="text-xl font-bold text-text-primary">
              {hotel.currency} {hotel.pricePerNight.toLocaleString()}
            </p>
            <span className="text-xs text-text-secondary">per night</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );

  const baseClass = cn(
    'rounded-xl border border-border bg-surface-raised overflow-hidden flex flex-col',
    'hover:shadow-md hover:border-border-focus transition-all duration-200',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(baseClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus')}
      >
        {body}
      </a>
    );
  }
  return <div className={baseClass}>{body}</div>;
}
