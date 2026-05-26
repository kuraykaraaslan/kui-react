# Table

- **id:** `table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Table/Table.tsx`
- **status:** stable
- **since:** 2025-02

Responsive table. scope="col" headers, hover row highlight, empty-state message, and custom cell render support.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### With data

```tsx
<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge> },
  ]}
  rows={[{ name: 'Jane Doe', email: 'jane@example.com', status: 'Active' }]}
/>
```

### Empty state

```tsx
<Table columns={[...]} rows={[]} emptyMessage="No users found." />
```

### Sortable columns

```tsx
<Table
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
  ]}
  rows={rows}
/>
```

## Full source

```tsx
import { cn } from '@/libs/utils/cn';

export function Table({ columns, rows, caption, emptyMessage = 'No results found.', className }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-surface-sunken border-b border-border">
          <tr>{columns.map((col) => <th key={col.key} scope="col" className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-left">{col.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface-base">
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-text-secondary">{emptyMessage}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface-overlay transition-colors">
              {columns.map((col) => <td key={col.key} className="px-4 py-3 text-text-primary">{col.render ? col.render(row) : String(row[col.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```
