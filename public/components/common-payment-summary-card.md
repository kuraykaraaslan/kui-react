# PaymentSummaryCard

- **id:** `common-payment-summary-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/PaymentSummaryCard.tsx`
- **status:** stable
- **since:** 2025-04

Read-only payment summary card: amount, method, provider, provider reference, and status badge.

## Variants

### Paid via Stripe

```tsx
<PaymentSummaryCard payment={{ provider: 'Stripe', method: 'CREDIT_CARD', status: 'PAID', amount: 153.96, currency: 'USD', ... }} />
```

### Pending bank transfer

```tsx
<PaymentSummaryCard payment={{ provider: 'Iyzico', method: 'BANK_TRANSFER', status: 'PENDING', amount: 2499, currency: 'TRY', ... }} />
```

## Full source

```tsx
'use client';
import { PaymentSummaryCard } from '@/modules/domains/common/payment/PaymentSummaryCard';

<PaymentSummaryCard payment={order.payment} />
```
