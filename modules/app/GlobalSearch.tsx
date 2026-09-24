'use client';
import { cn } from '@/libs/utils/cn';
import { useEffect, useRef, useState } from 'react';
import { SearchBar } from '@/modules/ui/SearchBar';

export type SearchResult = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
};

export function GlobalSearch({
  placeholder = 'Search…',
  results = [],
  onSearch,
  onSelect,
  loading = false,
  className,
}: {
  placeholder?: string;
  results?: SearchResult[];
  onSearch: (query: string) => void;
  onSelect: (result: SearchResult) => void;
  loading?: boolean;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function handleChange(v: string) {
    setQuery(v);
    setHighlighted(-1);
    onSearch(v);
    setOpen(v.trim().length > 0);
  }

  function handleSelect(r: SearchResult) {
    onSelect(r);
    setQuery('');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelect(results[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const cat = r.category ?? 'Results';
    acc[cat] = acc[cat] ? [...acc[cat], r] : [r];
    return acc;
  }, {});

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-md', className)}>
      <div onKeyDown={handleKeyDown} role="combobox" aria-expanded={open} aria-haspopup="listbox">
        <SearchBar
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>

      {open && (
        <div
          role="listbox"
          aria-label="Search results"
          className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-lg border border-border bg-surface-raised shadow-xl overflow-hidden max-h-72 overflow-y-auto"
        >
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-text-secondary animate-pulse">
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-secondary">
              No results for <strong className="text-text-primary">&quot;{query}&quot;</strong>
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
                  {cat}
                </p>
                {items.map((r) => {
                  const idx = results.indexOf(r);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="option"
                      aria-selected={idx === highlighted}
                      onClick={() => handleSelect(r)}
                      onMouseEnter={() => setHighlighted(idx)}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                        'focus-visible:outline-none',
                        idx === highlighted
                          ? 'bg-primary-subtle text-primary'
                          : 'hover:bg-surface-overlay text-text-primary'
                      )}
                    >
                      {r.icon && <span aria-hidden="true" className="shrink-0 text-text-disabled">{r.icon}</span>}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.label}</p>
                        {r.description && (
                          <p className="text-xs text-text-secondary truncate">{r.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
