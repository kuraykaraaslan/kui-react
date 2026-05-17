'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';

type EmptyWishlistStateProps = {
  title?: string;
  description?: string;
  browseHref?: string;
  onBrowse?: () => void;
  recommendations?: { productId: string; title: string; image?: string | null; href?: string }[];
  className?: string;
};

export function EmptyWishlistState({
  title = 'Your wishlist is empty',
  description = 'Save items you love by tapping the heart on any product page. They will appear here for later.',
  browseHref = '/theme/commerce/products',
  onBrowse,
  recommendations,
  className,
}: EmptyWishlistStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-border bg-surface-raised p-8 flex flex-col items-center text-center gap-4',
        className,
      )}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-primary"
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
      </div>

      <div className="max-w-md">
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>

      {onBrowse ? (
        <Button
          variant="primary"
          size="md"
          onClick={onBrowse}
          iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Browse products
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          as="a"
          href={browseHref}
          iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Browse products
        </Button>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="w-full border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-disabled mb-3">
            Popular right now
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {recommendations.slice(0, 4).map((p) => (
              <li key={p.productId}>
                <a
                  href={p.href ?? '#'}
                  className={cn(
                    'block rounded-lg border border-border bg-surface-base overflow-hidden text-left',
                    'hover:border-border-focus transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  )}
                >
                  <div className="aspect-square bg-surface-overlay">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="px-2 py-1.5 text-xs font-medium text-text-primary truncate">
                    {p.title}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
