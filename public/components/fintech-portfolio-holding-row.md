# PortfolioHoldingRow

- **id:** `fintech-portfolio-holding-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/portfolio/PortfolioHoldingRow.tsx`
- **status:** stable
- **since:** 2026-05

Portfolio table row: currency badge, name, holding amount, USD value, 24h delta, P&L.

## Variants

### Profit / loss rows

```tsx
<PortfolioHoldingRow symbol="BTC" amount={0.05} currency="BTC" usdValue={3421} costBasis={2980} dayChangePct={2.34} />
```

### No cost basis (no P&L)

```tsx
<PortfolioHoldingRow symbol="USD" amount={3420} currency="USD" usdValue={3420} />
```

## Full source

```tsx
import { PortfolioHoldingRow } from '@/modules/domains/fintech/portfolio/PortfolioHoldingRow';
<PortfolioHoldingRow symbol="BTC" name="Bitcoin" amount={0.05} currency="BTC" usdValue={3421} costBasis={2980} dayChangePct={2.34} />
```
