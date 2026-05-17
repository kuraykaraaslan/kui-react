'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';

type StarRatingSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<StarRatingSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

const gapClasses: Record<StarRatingSize, string> = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

const TOTAL_STARS = 5;

type StarRatingProps = {
  /** Current rating value (0–5, decimals supported when readonly). */
  value: number;
  /** Visual size of each star. Defaults to 'md'. */
  size?: StarRatingSize;
  /**
   * When true (default) the component is purely presentational.
   * When false, supply `onChange` to let users pick a whole-star rating.
   */
  readonly?: boolean;
  /** Called with the new (whole-star) value when interactive. */
  onChange?: (value: number) => void;
  /**
   * Accessible label override. When omitted a sensible default is generated
   * such as "4.5 out of 5 stars".
   */
  'aria-label'?: string;
  /** Optional caption shown next to the stars (e.g. "(312 reviews)"). */
  caption?: React.ReactNode;
  className?: string;
};

function clampValue(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > TOTAL_STARS) return TOTAL_STARS;
  return value;
}

export function StarRating({
  value,
  size = 'md',
  readonly = true,
  onChange,
  'aria-label': ariaLabel,
  caption,
  className,
}: StarRatingProps) {
  const safeValue = clampValue(value);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !readonly && typeof onChange === 'function';
  const displayValue = isInteractive && hoverValue !== null ? hoverValue : safeValue;
  const labelText = ariaLabel ?? `${safeValue.toFixed(1)} out of ${TOTAL_STARS} stars`;
  const starClass = sizeClasses[size];

  if (!isInteractive) {
    return (
      <span
        className={cn('inline-flex items-center', gapClasses[size], className)}
        role="img"
        aria-label={labelText}
      >
        {Array.from({ length: TOTAL_STARS }, (_, i) => {
          const starIndex = i + 1;
          const filled = displayValue >= starIndex;
          const half = !filled && displayValue >= starIndex - 0.5;
          return (
            <FontAwesomeIcon
              key={starIndex}
              icon={filled ? faStar : half ? faStarHalfStroke : faStarRegular}
              className={cn(starClass, filled || half ? 'text-warning' : 'text-text-disabled')}
              aria-hidden="true"
            />
          );
        })}
        {caption && (
          <span className="ml-2 text-sm text-text-secondary">{caption}</span>
        )}
      </span>
    );
  }

  return (
    <span
      role="radiogroup"
      aria-label={ariaLabel ?? 'Rating'}
      className={cn('inline-flex items-center', gapClasses[size], className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) => {
        const starIndex = i + 1;
        const filled = displayValue >= starIndex;
        const checked = safeValue === starIndex;
        return (
          <button
            key={starIndex}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${starIndex} ${starIndex === 1 ? 'star' : 'stars'}`}
            onClick={() => onChange?.(starIndex)}
            onMouseEnter={() => setHoverValue(starIndex)}
            onFocus={() => setHoverValue(starIndex)}
            onBlur={() => setHoverValue(null)}
            className={cn(
              'rounded-sm transition-colors p-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <FontAwesomeIcon
              icon={filled ? faStar : faStarRegular}
              className={cn(starClass, filled ? 'text-warning' : 'text-text-disabled')}
              aria-hidden="true"
            />
          </button>
        );
      })}
      {caption && (
        <span className="ml-2 text-sm text-text-secondary">{caption}</span>
      )}
    </span>
  );
}
