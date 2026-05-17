# PaymentStatusBadge

- **id:** `common-payment-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/PaymentStatusBadge.tsx`
- **status:** stable
- **since:** 2025-03

Color-coded badge for all PaymentStatus values: PENDING / AUTHORIZED / PAID / FAILED / CANCELLED / REFUNDED.

## Variants

### All statuses

```tsx
<PaymentStatusBadge status="PENDING" />
<PaymentStatusBadge status="AUTHORIZED" />
<PaymentStatusBadge status="PAID" />
<PaymentStatusBadge status="FAILED" />
<PaymentStatusBadge status="CANCELLED" />
<PaymentStatusBadge status="REFUNDED" />
```

### With dot, large

```tsx
<PaymentStatusBadge status="PENDING" dot size="lg" />
<PaymentStatusBadge status="PAID" dot size="lg" />
<PaymentStatusBadge status="FAILED" dot size="lg" />
```

## Full source

```tsx
'use client';
import { PaymentStatusBadge } from '@/modules/domains/common/payment/PaymentStatusBadge';

<PaymentStatusBadge status="PAID" />
<PaymentStatusBadge status="PENDING" dot size="lg" />
```
