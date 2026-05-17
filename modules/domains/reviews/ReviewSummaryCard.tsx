'use client';
import { cn } from '@/libs/utils/cn';
import { StarRating } from '@/modules/ui/StarRating';
import { RatingDistribution } from './RatingDistribution';
import type { ReviewSummary } from './types';

type ReviewSummaryCardProps = {
  summary: ReviewSummary;
  /**
   * Short headline shown above the average score, e.g. "Customer reviews"
   * or "Guest ratings". Defaults to "Ratings & reviews".
   */
  title?: string;
  /** Singular noun for the review count caption (defaults to "review"). */
  reviewNoun?: string;
  className?: string;
};

export function ReviewSummaryCard({
  summary,
  title = 'Ratings & reviews',
  reviewNoun = 'review',
  className,
}: ReviewSummaryCardProps) {
  const { average, total, distribution } = summary;
  const pluralCount = `${total} ${reviewNoun}${total === 1 ? '' : 's'}`;

  return (
    <section
      aria-labelledby="review-summary-title"
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 sm:p-6',
        className
      )}
    >
      <h2
        id="review-summary-title"
        className="text-base font-semibold text-text-primary"
      >
        {title}
      </h2>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center sm:items-start sm:w-44 shrink-0">
          <div className="text-5xl font-bold text-text-primary leading-none tabular-nums">
            {average.toFixed(1)}
          </div>
          <div className="mt-2">
            <StarRating value={average} size="md" />
          </div>
          <div className="mt-1 text-xs text-text-secondary">
            Based on {pluralCount}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <RatingDistribution distribution={distribution} total={total} />
        </div>
      </div>
    </section>
  );
}
