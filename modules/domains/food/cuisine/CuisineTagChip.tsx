'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type CuisineTagChipProps = {
  label: string;
  selected?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function CuisineTagChip({
  label,
  selected,
  count,
  href,
  onClick,
  className,
}: CuisineTagChipProps) {
  const baseClass = cn(
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
    selected
      ? 'bg-primary text-primary-fg border-primary hover:bg-primary-hover'
      : 'bg-surface-base text-text-secondary border-border hover:border-border-focus hover:text-text-primary',
    className,
  );

  const content = (
    <>
      {selected && (
        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />
      )}
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] tabular-nums',
            selected ? 'bg-primary-fg/20' : 'bg-surface-overlay text-text-secondary',
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClass} aria-pressed={selected ? 'true' : undefined}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClass}
      aria-pressed={selected ? 'true' : 'false'}
    >
      {content}
    </button>
  );
}
