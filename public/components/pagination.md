# Pagination

- **id:** `pagination`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Pagination.tsx`
- **status:** stable
- **since:** 2025-02

Sayfa navigasyonu. Ellipsis ile büyük sayfa sayılarını kısaltır. aria-label ve aria-current="page" ile erişilebilir.

## Variants

### Default

```tsx
const [page, setPage] = useState(1);
<Pagination page={page} totalPages={10} onPageChange={setPage} />
```

### Sizes

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} size="sm" />
<Pagination page={page} totalPages={10} onPageChange={setPage} size="lg" />
```

### First / Last + Jump to page

```tsx
<Pagination page={page} totalPages={20} onPageChange={setPage} showFirstLast showJumpTo />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function Pagination({ page, totalPages, onPageChange, className }) {
  // builds visible pages with ellipsis ...
  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Go to previous page" className="...">‹</button>
      {/* page buttons */}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Go to next page" className="...">›</button>
    </nav>
  );
}
```
