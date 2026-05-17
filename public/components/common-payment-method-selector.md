# PaymentMethodSelector

- **id:** `common-payment-method-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/PaymentMethodSelector.tsx`
- **status:** stable
- **since:** 2025-04

Radio-group style card selector for payment methods. Shows icon, label, and description. Default set: credit card, debit card, bank transfer, wallet.

## Variants

### Default (4 methods)

```tsx
<PaymentMethodSelector value={method} onChange={setMethod} />
```

## Full source

```tsx
'use client';
import { PaymentMethodSelector } from '@/modules/domains/common/payment/PaymentMethodSelector';

const [method, setMethod] = useState<PaymentMethod>('CREDIT_CARD');

<PaymentMethodSelector value={method} onChange={setMethod} />
```
