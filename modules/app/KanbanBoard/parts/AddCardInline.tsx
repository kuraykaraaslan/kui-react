'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

// TODO M4: inline "+ Add card" form per column (title input + Enter to commit,
// Esc to cancel, onCardCreate callback). M1 renders a disabled stub for
// visual parity with the EJS sibling and Trello/Linear conventions.
type AddCardInlineProps = {
  className?: string;
};

export function AddCardInline({ className }: AddCardInlineProps) {
  return (
    <button
      type="button"
      disabled
      aria-label="Add card (coming soon)"
      className={cn(
        'flex items-center gap-2 w-full px-3 py-2 rounded-md',
        'text-xs font-medium text-text-disabled',
        'border border-dashed border-border bg-transparent',
        'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <FontAwesomeIcon icon={faPlus} aria-hidden="true" className="w-3 h-3" />
      Add card
    </button>
  );
}
