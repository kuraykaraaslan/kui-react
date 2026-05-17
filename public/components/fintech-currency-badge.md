# CurrencyBadge

- **id:** `fintech-currency-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/wallet/CurrencyBadge.tsx`
- **status:** stable
- **since:** 2026-05

Currency code badge with distinct colour per currency: TRY, USD, EUR, GBP, BTC, ETH.

## Variants

### All currencies

```tsx
{(['TRY', 'USD', 'EUR', 'GBP', 'BTC', 'ETH'] as const).map((c) => (
  <CurrencyBadge key={c} currency={c} />
))}
```

### Small size

```tsx
<CurrencyBadge currency="TRY" size="sm" />
<CurrencyBadge currency="USD" size="sm" />
<CurrencyBadge currency="EUR" size="sm" />
```

## Full source

```tsx
import { CurrencyBadge } from '@/modules/domains/fintech/wallet/CurrencyBadge';
<CurrencyBadge currency="USD" />
```
