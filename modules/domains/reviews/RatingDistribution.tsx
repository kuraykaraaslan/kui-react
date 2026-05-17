'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import type { ReviewDistribution } from './types';

type RatingDistributionProps = {
  distribution: ReviewDistribution;
  /** Total number of reviews — falls back to summing the distribution. */
  total?: number;
  /** Show the count for each bucket on the right side. Defaults to true. */
  showCounts?: boolean;
  className?: string;
};

const STAR_BUCKETS: (keyof ReviewDistribution)[] = [5, 4, 3, 2, 1];

export function RatingDistribution({
  distribution,
  total,
  showCounts = true,
  className,
}: RatingDistributionProps) {
  const computedTotal =
    total ??
    STAR_BUCKETS.reduce((sum, bucket) => sum + (distribution[bucket] ?? 0), 0);
  const safeTotal = Math.max(computedTotal, 1);

  return (
    <ul
      className={cn('flex flex-col gap-1.5', className)}
      aria-label="Rating distribution"
    >
      {STAR_BUCKETS.map((bucket) => {
        const count = distribution[bucket] ?? 0;
        const percent = Math.round((count / safeTotal) * 100);
        return (
          <li key={bucket} className="flex items-center gap-3 text-xs">
            <span className="flex w-10 shrink-0 items-center gap-1 text-text-secondary tabular-nums">
              {bucket}
              <FontAwesomeIcon
                icon={faStar}
                className="w-3 h-3 text-warning"
                aria-hidden="true"
              />
            </span>
            <span
              className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={`${bucket} star rating: ${count} reviews (${percent}%)`}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-warning transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </span>
            {showCounts && (
              <span className="w-12 shrink-0 text-right text-text-secondary tabular-nums">
                {count}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
