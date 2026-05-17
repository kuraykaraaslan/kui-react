# TransactionTypeBadge

- **id:** `fintech-transaction-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/transaction/TransactionTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge for transaction type: DEPOSIT, WITHDRAW, TRANSFER, PAYMENT, REFUND, FX, FEE.

## Variants

### All types

```tsx
{(['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PAYMENT', 'REFUND', 'FX', 'FEE'] as const).map((t) => (
  <TransactionTypeBadge key={t} type={t} />
))}
```

### Small size

```tsx
<TransactionTypeBadge type="DEPOSIT" size="sm" />
<TransactionTypeBadge type="PAYMENT" size="sm" />
<TransactionTypeBadge type="REFUND" size="sm" />
```

## Full source

```tsx
import { TransactionTypeBadge } from '@/modules/domains/fintech/transaction/TransactionTypeBadge';
<TransactionTypeBadge type="DEPOSIT" />
```
