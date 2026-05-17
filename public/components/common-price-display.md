# PriceDisplay

- **id:** `common-price-display`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/money/PriceDisplay.tsx`
- **status:** stable
- **since:** 2025-03

Currency formatter using Intl.NumberFormat. Supports any ISO 4217 code and locale. Strikethrough prop renders an original/crossed-out price.

## Variants

### Sizes

```tsx
<PriceDisplay amount={1299.99} currency="USD" size="sm" />
<PriceDisplay amount={1299.99} currency="USD" size="md" />
<PriceDisplay amount={1299.99} currency="USD" size="lg" />
<PriceDisplay amount={1299.99} currency="USD" size="xl" />
```

### Multi-currency + strikethrough

```tsx
<PriceDisplay amount={2499} currency="TRY" size="lg" />
<PriceDisplay amount={1799} currency="TRY" size="lg" strikethrough />
<PriceDisplay amount={89.99} currency="USD" locale="en-US" size="lg" />
<PriceDisplay amount={74.99} currency="EUR" locale="de-DE" size="lg" />
```

## Full source

```tsx
'use client';
import { PriceDisplay } from '@/modules/domains/common/money/PriceDisplay';

<PriceDisplay amount={1299.99} currency="USD" size="lg" />
<PriceDisplay amount={1799} currency="USD" size="lg" strikethrough />
```
