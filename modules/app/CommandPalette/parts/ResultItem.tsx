'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { highlightMatches } from '../hooks/useFuzzySearch';
import type { ScoredCommand } from '../types';

type ResultItemProps = {
  id: string;
  scored: ScoredCommand;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export function ResultItem({ id, scored, active, onSelect, onHover }: ResultItemProps) {
  const { item, matches } = scored;
  return (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={active}
      tabIndex={-1}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm text-text-primary',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        active ? 'bg-surface-overlay' : 'hover:bg-surface-overlay'
      )}
    >
      <span className="flex items-center gap-2 min-w-0">
        {item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
        <span className="truncate">{highlightMatches(item.label, matches)}</span>
        {item.description && (
          <span className="text-text-secondary text-xs truncate">{item.description}</span>
        )}
      </span>
      {item.shortcut && (
        <Badge variant="neutral" size="sm">{item.shortcut}</Badge>
      )}
    </button>
  );
}
