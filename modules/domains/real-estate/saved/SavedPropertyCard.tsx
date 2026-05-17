'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faBed,
  faBath,
  faRulerCombined,
  faTrash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

type SavedPropertyCardProps = {
  title: string;
  price: number;
  currency: string;
  type: string;
  city: string;
  imageUrl?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  savedAt: Date | string;
  priceChangeAbs?: number;
  href?: string;
  onRemove?: () => void;
  className?: string;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function dayAgo(date: Date | string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export function SavedPropertyCard({
  title,
  price,
  currency,
  type,
  city,
  imageUrl,
  bedrooms,
  bathrooms,
  area,
  savedAt,
  priceChangeAbs,
  href,
  onRemove,
  className,
}: SavedPropertyCardProps) {
  const dropped = priceChangeAbs !== undefined && priceChangeAbs < 0;

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised',
        className,
      )}
    >
      <a
        href={href ?? '#'}
        className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-subtle to-surface-overlay">
            <FontAwesomeIcon icon={faHeart} className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
        )}

        {dropped && (
          <span className="absolute top-2 left-2">
            <Badge variant="success" size="sm">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              Price dropped {formatMoney(Math.abs(priceChangeAbs!), currency)}
            </Badge>
          </span>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            aria-label="Remove from saved"
            className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-error backdrop-blur transition-colors hover:bg-white hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </a>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-2">
            {href ? <a href={href} className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">{title}</a> : title}
          </h3>
          <p className="shrink-0 text-base font-bold text-text-primary tabular-nums">
            {formatMoney(price, currency)}
          </p>
        </div>

        <p className="text-xs text-text-secondary">
          {type} · {city}
        </p>

        <ul className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          {bedrooms !== undefined && bedrooms !== null && (
            <li className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faBed} className="w-3 h-3" aria-hidden="true" />
              <span className="tabular-nums">{bedrooms} bed</span>
            </li>
          )}
          {bathrooms !== undefined && bathrooms !== null && (
            <li className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faBath} className="w-3 h-3" aria-hidden="true" />
              <span className="tabular-nums">{bathrooms} bath</span>
            </li>
          )}
          {area !== undefined && area !== null && (
            <li className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faRulerCombined} className="w-3 h-3" aria-hidden="true" />
              <span className="tabular-nums">{area} m²</span>
            </li>
          )}
        </ul>

        <p className="text-[11px] text-text-secondary border-t border-border pt-2 mt-1">
          Saved {dayAgo(savedAt)}
        </p>
      </div>
    </div>
  );
}
