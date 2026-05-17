# SearchBar

- **id:** `search-bar`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/SearchBar.tsx`
- **status:** stable
- **since:** 2025-02

role="searchbox" + arama ikonu + temizle butonu. Controlled / uncontrolled modda çalışır.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--surface-base`
- `--text-disabled`
- `--text-primary`

## Variants

### Default

```tsx
<SearchBar placeholder="Search components…" />
```

### With value

```tsx
<SearchBar value="Button" onChange={(v) => console.log(v)} />
```

### Loading state

```tsx
function Demo() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-2">
      <SearchBar value={q} onChange={(v) => { setQ(v); setLoading(true); }} />
      {loading
        ? <p className="flex items-center gap-1.5"><Spinner size="xs" /> Searching…</p>
        : q && <p>{q} — 24 results</p>}
    </div>
  );
}
```

### With results count

```tsx
function Demo() {
  const items = ['Button', 'Badge', 'Card', ...];
  const [q, setQ] = useState('');
  const filtered = q ? items.filter(n => n.toLowerCase().includes(q.toLowerCase())) : items;
  return (
    <div className="space-y-2">
      <SearchBar value={q} onChange={setQ} />
      <p className="text-xs text-text-secondary">{filtered.length} of {items.length} results</p>
      <ul>{filtered.map(name => <li key={name}>{name}</li>)}</ul>
    </div>
  );
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

export function SearchBar({ id = 'search', placeholder = 'Search…', value, onChange, onClear, className }) {
  const [internal, setInternal] = useState('');
  const controlled = value !== undefined;
  const currentValue = controlled ? value : internal;
  function handleChange(e) { if (!controlled) setInternal(e.target.value); onChange?.(e.target.value); }
  function handleClear() { if (!controlled) setInternal(''); onChange?.(''); onClear?.(); }
  return (
    <div className={cn('relative flex items-center', className)}>
      <span aria-hidden="true" className="absolute left-3 text-text-disabled pointer-events-none select-none">⌕</span>
      <input id={id} type="search" role="searchbox" value={currentValue} onChange={handleChange} placeholder={placeholder} autoComplete="off"
        className={cn('block w-full rounded-md border border-border bg-surface-base px-3 py-2 pl-8 text-sm text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors', currentValue && 'pr-8')} />
      {currentValue && (
        <button type="button" onClick={handleClear} aria-label="Clear search" className="absolute right-2 text-text-disabled hover:text-text-primary transition-colors focus-visible:outline-none rounded">✕</button>
      )}
    </div>
  );
}
```
