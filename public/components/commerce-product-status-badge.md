# ProductStatusBadge

- **id:** `commerce-product-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/product/ProductStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays product lifecycle status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK'] as const).map((s) => (
  <ProductStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<ProductStatusBadge status="PUBLISHED" size="sm" />
<ProductStatusBadge status="PUBLISHED" size="md" />
```

## Full source

```tsx
import { ProductStatusBadge } from '@/modules/domains/commerce/product/ProductStatusBadge';
<ProductStatusBadge status="PUBLISHED" />
```
