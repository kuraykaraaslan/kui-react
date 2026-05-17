# StockStatusBadge

- **id:** `commerce-stock-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/product/StockStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Inventory status badge mapping stock levels to semantic colours.

## Variants

### All stock statuses

```tsx
{(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as const).map((s) => (
  <StockStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
{(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as const).map((s) => (
  <StockStatusBadge key={s} status={s} size="sm" />
))}
```

## Full source

```tsx
import { StockStatusBadge } from '@/modules/domains/commerce/product/StockStatusBadge';
<StockStatusBadge status="IN_STOCK" />
```
