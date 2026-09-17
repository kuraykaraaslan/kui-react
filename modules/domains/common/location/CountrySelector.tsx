'use client';
import { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { isBrowser } from '@/libs/utils/isBrowser';
import { getCountryDataList } from 'countries-list';
import * as Flags from 'country-flag-icons/react/3x2';
import { cn } from '@/libs/utils/cn';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const ALL_COUNTRIES = getCountryDataList()
  .map((c) => ({ iso2: c.iso2, name: c.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

function CountryFlag({ iso2 }: { iso2?: string }) {
  if (!iso2) return null;
  const FlagComp = Flags[iso2 as keyof typeof Flags] as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;
  if (!FlagComp) return null;
  return <FlagComp className="w-4 h-auto rounded-[2px] shadow-sm shrink-0" />;
}

type CountrySelectorProps = {
  value: string;
  onChange: (iso2: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function CountrySelector({
  value,
  onChange,
  id: idProp,
  label = 'Country',
  placeholder = 'Select country…',
  disabled = false,
  hint,
  error,
  required,
  className,
}: CountrySelectorProps) {
  const uid = useId();
  const id = idProp ?? uid;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [rect, setRect] = useState<DOMRect | null>(null);
  // Reset the search field when the panel closes. Doing this during render
  // (the React-recommended pattern for "adjust state when a value changes")
  // rather than as a setState call inside the effect below avoids an extra
  // cascading render (react-hooks/set-state-in-effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setSearch('');
  }
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const portalId = `country-selector-portal-${id.replace(/:/g, '')}`;

  const selected = ALL_COUNTRIES.find((c) => c.iso2 === value);

  const filtered = search.trim()
    ? ALL_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.iso2.toLowerCase().includes(search.toLowerCase()),
      )
    : ALL_COUNTRIES;

  function handleOpen() {
    if (disabled) return;
    if (!open && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen((p) => !p);
  }

  useEffect(() => {
    if (!open) return;
    setTimeout(() => searchRef.current?.focus(), 0);

    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !document.getElementById(portalId)?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onScroll() {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    }
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, portalId]);

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const panel = open && rect && (
    <div
      id={portalId}
      role="listbox"
      aria-label="Select country"
      style={{ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 9999 }}
      className="rounded-lg border border-border bg-surface-raised shadow-lg"
    >
      <div className="p-2 border-b border-border">
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search country…"
          className={cn(
            'w-full rounded-md border border-border bg-surface-base px-2.5 py-1.5 text-sm text-text-primary',
            'placeholder:text-text-disabled',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        />
      </div>
      <ul className="max-h-56 overflow-y-auto py-1">
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-text-secondary">No results</li>
        )}
        {filtered.map((opt) => {
          const active = opt.iso2 === value;
          return (
            <li key={opt.iso2}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(opt.iso2); setOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  'focus-visible:outline-none focus-visible:bg-surface-overlay',
                  active
                    ? 'bg-primary-subtle text-primary font-medium'
                    : 'text-text-primary hover:bg-surface-overlay',
                )}
              >
                <CountryFlag iso2={opt.iso2} />
                <span className="flex-1 truncate">{opt.name}</span>
                <span className="text-xs text-text-secondary shrink-0">{opt.iso2}</span>
                {active && (
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary">
          {label}
          {required && <><span className="text-error ml-1" aria-hidden="true">*</span><span className="sr-only">(required)</span></>}
        </label>
      )}
      <div ref={triggerRef} className="relative w-full">
        <Button
          id={id}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={handleOpen}
          role="combobox"
          aria-label={label || placeholder}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            'w-full justify-between gap-2',
            error && 'border-error ring-1 ring-error',
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {selected ? (
              <>
                <CountryFlag iso2={selected.iso2} />
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <span className="text-text-disabled truncate">{placeholder}</span>
            )}
          </span>
          <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-disabled shrink-0" aria-hidden="true" />
        </Button>
      </div>
      {hint && !error && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-error" role="alert">{error}</p>}
      {isBrowser && createPortal(panel, document.body)}
    </div>
  );
}
