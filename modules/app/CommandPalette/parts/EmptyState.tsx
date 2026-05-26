'use client';
import { cn } from '@/libs/utils/cn';
import type { CommandItem } from '../types';

type EmptyStateProps = {
  query: string;
  suggestions: CommandItem[];
  onSelect: (cmd: CommandItem) => void;
};

export function EmptyState({ query, suggestions, onSelect }: EmptyStateProps) {
  return (
    <div className="py-4 text-center">
      <p className="text-sm text-text-secondary">
        No commands found for &quot;{query}&quot;
      </p>
      {suggestions.length > 0 && (
        <>
          <p className="mt-3 text-xs text-text-disabled">Try one of these instead:</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {suggestions.map((cmd) => (
              <button
                key={cmd.id ?? cmd.label}
                type="button"
                onClick={() => onSelect(cmd)}
                className={cn(
                  'rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs',
                  'text-text-secondary hover:bg-surface-overlay transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus'
                )}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
