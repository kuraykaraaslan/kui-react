# PriceTag

- **id:** `nft-price-tag`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/nft/asset/PriceTag.tsx`
- **status:** stable
- **since:** 2026-05

Dual ETH / USD price display with optional last-sale delta arrow.

## Variants

### Listed with delta

```tsx
<PriceTag label="Current price" priceEth={0.85} priceUsd={2635} lastSalePriceEth={0.72} size="lg" />
```

### Sizes

```tsx
<PriceTag label="Md" priceEth={0.42} priceUsd={1300} size="md" />
```

## Full source

```tsx
'use client';

export function PriceTag({ label, priceEth, priceUsd, lastSalePriceEth, size = 'md' }) {
  // ETH icon + value, optional USD line, optional delta arrow
}
```
