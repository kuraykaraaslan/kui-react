# AssetAllocationCard

- **id:** `fintech-asset-allocation-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/portfolio/AssetAllocationCard.tsx`
- **status:** stable
- **since:** 2026-05

Donut chart + total / change header. Self-contained portfolio summary tile.

## Variants

### Positive change

```tsx
<AssetAllocationCard assets={[...]} changePct={4.2} changeAbsUsd={552} />
```

### Negative change

```tsx
<AssetAllocationCard assets={[...]} changePct={-2.8} changeAbsUsd={-72} />
```

## Full source

```tsx
import { AssetAllocationCard } from '@/modules/domains/fintech/portfolio/AssetAllocationCard';
<AssetAllocationCard assets={[{ currency, usdEquivalent }]} changePct={4.2} changeAbsUsd={464} />
```
