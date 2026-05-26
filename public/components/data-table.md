# DataTable

- **id:** `data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/DataTable.tsx`
- **status:** stable
- **since:** 2025-03

Unified table with `mode="static" | "paginated" | "server"`. Multi-column sort (Shift+click), global search, per-column filter (text + select), pagination, and unified loading/empty/error state.

## Design tokens consumed

- `--border`
- `--secondary`
- `--surface-base`
- `--text-secondary`

## Variants

### Full example

```tsx
<DataTable
  caption="Users"
  searchPlaceholder="Search users…"
  pageSize={5}
  rows={users}
  columns={[
    { key: 'name',   header: 'Name' },
    { key: 'email',  header: 'Email' },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={...}>{r.status}</Badge> },
    { key: 'joined', header: 'Joined' },
  ]}
/>
```

### Sortable columns

```tsx
<DataTable
  rows={products}
  columns={[
    { key: 'name',  header: 'Product',  sortable: true },
    { key: 'price', header: 'Price',    sortable: true, align: 'right' },
  ]}
/>
```

### Server mode (mode="server")

```tsx
// Unified server-side data flow — the component owns sort/filter/pagination state
// and calls `fetchPage` whenever it changes.
<DataTable<User>
  mode="server"
  fetchPage={async ({ page, pageSize, sort, search, filters }) => {
    const res = await fetch(buildUrl({ page, pageSize, sort, search, filters }));
    const { rows, total } = await res.json();
    return { rows, total };
  }}
  pageSize={5}
  searchPlaceholder="Search users…"
  columns={[
    { key: 'name',  header: 'Name',  sortable: true },
    { key: 'email', header: 'Email', sortable: true, filter: { kind: 'text' } },
    { key: 'team',  header: 'Team',  sortable: true, filter: { kind: 'select', options: [
      { label: 'Platform', value: 'platform' },
      { label: 'Growth',   value: 'growth' },
    ] } },
  ]}
/>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useMemo, useState } from 'react';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';

export function DataTable({ columns, rows, caption, searchable = true, searchPlaceholder = 'Search…', pageSize: defaultPageSize = 10, pageSizeOptions = [5,10,25,50], emptyMessage = 'No results found.', className }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => columns.some((col) => !col.render && String(row[col.key] ?? '').toLowerCase().includes(q)));
  }, [rows, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn('space-y-3', className)}>
      {searchable && (
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={searchPlaceholder} className="flex-1 min-w-40" />
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-border bg-surface-base px-2 py-1.5 text-sm">
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      {/* table body ... */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-text-secondary">Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length}</p>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
}
```
