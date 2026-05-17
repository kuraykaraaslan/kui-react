# TransactionStatusBadge

- **id:** `fintech-transaction-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/transaction/TransactionStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Status badge tracking a transaction lifecycle: PENDING, COMPLETED, FAILED, CANCELLED.

## Variants

### All statuses

```tsx
{(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const).map((s) => (
  <TransactionStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
<TransactionStatusBadge status="COMPLETED" size="sm" />
<TransactionStatusBadge status="PENDING" size="sm" />
<TransactionStatusBadge status="FAILED" size="sm" />
```

## Full source

```tsx
import { TransactionStatusBadge } from '@/modules/domains/fintech/transaction/TransactionStatusBadge';
<TransactionStatusBadge status="COMPLETED" />
```
