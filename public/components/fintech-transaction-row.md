# TransactionRow

- **id:** `fintech-transaction-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/transaction/TransactionRow.tsx`
- **status:** stable
- **since:** 2026-05

Transaction list row with icon, description, date, amount (coloured by direction), and status badge.

## Variants

### Completed deposit

```tsx
<TransactionRow transaction={depositTransaction} />
```

### Mixed statuses

```tsx
<TransactionRow transaction={depositTx} />
<TransactionRow transaction={paymentTx} />
<TransactionRow transaction={failedTx} />
```

## Full source

```tsx
import { TransactionRow } from '@/modules/domains/fintech/transaction/TransactionRow';
<TransactionRow transaction={transaction} />
```
