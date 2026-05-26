'use client';
import { forwardRef } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type CommandPaletteInputProps = {
  id: string;
  value: string;
  onChange: (next: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  listboxId: string;
  activeDescendantId?: string;
};

export const CommandPaletteInput = forwardRef<HTMLInputElement, CommandPaletteInputProps>(
  function CommandPaletteInput(
    { id, value, onChange, onKeyDown, placeholder, listboxId, activeDescendantId },
    ref
  ) {
    return (
      <div className="relative flex items-center">
        <span
          aria-hidden="true"
          className="absolute left-3 text-text-disabled pointer-events-none text-sm"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5" />
        </span>
        <input
          ref={ref}
          id={id}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'block w-full rounded-md border border-border bg-surface-base pl-9 pr-3 py-2 text-sm',
            'text-text-primary placeholder:text-text-disabled',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus',
            'transition-colors'
          )}
        />
      </div>
    );
  }
);
