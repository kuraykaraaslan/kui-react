# ProductTypeBadge

- **id:** `commerce-product-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/product/ProductTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge for product type: Physical, Digital, or Service.

## Variants

### All types

```tsx
{(['PHYSICAL', 'DIGITAL', 'SERVICE'] as const).map((t) => (
  <ProductTypeBadge key={t} type={t} />
))}
```

### Small size

```tsx
{(['PHYSICAL', 'DIGITAL', 'SERVICE'] as const).map((t) => (
  <ProductTypeBadge key={t} type={t} size="sm" />
))}
```

## Full source

```tsx
import { ProductTypeBadge } from '@/modules/domains/commerce/product/ProductTypeBadge';
<ProductTypeBadge type="DIGITAL" />
```
