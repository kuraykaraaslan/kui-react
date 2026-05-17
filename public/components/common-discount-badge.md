# DiscountBadge

- **id:** `common-discount-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/discount/DiscountBadge.tsx`
- **status:** stable
- **since:** 2025-04

Formats and displays a discount: percentage (e.g. "20% off"), fixed amount with currency, or free shipping.

## Variants

### All types

```tsx
<DiscountBadge discountType="PERCENTAGE" discountValue={20} />
<DiscountBadge discountType="FIXED" discountValue={50} currency="TRY" />
<DiscountBadge discountType="FREE_SHIPPING" discountValue={0} />
```

### Sizes

```tsx
<DiscountBadge discountType="PERCENTAGE" discountValue={10} size="sm" />
<DiscountBadge discountType="PERCENTAGE" discountValue={10} size="md" />
<DiscountBadge discountType="PERCENTAGE" discountValue={10} size="lg" />
```

## Full source

```tsx
'use client';
import { DiscountBadge } from '@/modules/domains/common/discount/DiscountBadge';

<DiscountBadge discountType="PERCENTAGE" discountValue={20} />
<DiscountBadge discountType="FIXED" discountValue={50} currency="TRY" />
<DiscountBadge discountType="FREE_SHIPPING" discountValue={0} />
```
