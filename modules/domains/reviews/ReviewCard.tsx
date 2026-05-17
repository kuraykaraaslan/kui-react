'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { StarRating } from '@/modules/ui/StarRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import type { Review } from './types';

type ReviewCardProps = {
  review: Review;
  /**
   * Called when the helpful button is clicked. When omitted the component
   * still optimistically updates its own internal helpful counter so it
   * remains useful inside static demos.
   */
  onHelpful?: (reviewId: string) => void;
  /** Override the visible date format. Defaults to a localised long date. */
  formatDate?: (iso: string) => string;
  className?: string;
};

function defaultFormatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ReviewCard({
  review,
  onHelpful,
  formatDate = defaultFormatDate,
  className,
}: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpfulCount);
  const [marked, setMarked] = useState(false);

  const handleHelpful = () => {
    if (marked) return;
    setMarked(true);
    setHelpful((n) => n + 1);
    onHelpful?.(review.reviewId);
  };

  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-4 sm:p-5',
        'flex flex-col gap-3',
        className
      )}
    >
      <header className="flex items-start gap-3">
        <Avatar
          src={review.author.avatarUrl ?? undefined}
          name={review.author.name}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-text-primary leading-tight">
              {review.author.name}
            </span>
            {review.verified && (
              <Badge variant="success" size="sm">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-3 h-3 mr-1"
                  aria-hidden="true"
                />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
            <StarRating value={review.rating} size="sm" />
            <span aria-hidden="true">·</span>
            <time dateTime={review.createdAt}>
              {formatDate(review.createdAt)}
            </time>
          </div>
        </div>
      </header>

      {review.title && (
        <h3 className="text-base font-semibold text-text-primary leading-snug">
          {review.title}
        </h3>
      )}

      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
        {review.body}
      </p>

      <footer className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleHelpful}
          aria-pressed={marked}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            marked
              ? 'bg-primary-subtle text-primary'
              : 'text-text-secondary hover:bg-surface-overlay'
          )}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="w-3.5 h-3.5" aria-hidden="true" />
          Helpful
          <span className="tabular-nums">({helpful})</span>
        </button>
      </footer>
    </article>
  );
}
