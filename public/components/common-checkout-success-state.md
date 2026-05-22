# CheckoutSuccessState

- **id:** `common-checkout-success-state`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/CheckoutSuccessState.tsx`
- **status:** stable
- **since:** 2026-05

Success screen shown after checkout completion; includes a confirmation icon, payment summary, and optional delivery address.

## Variants

### Başarı ekranı

```tsx
<CheckoutSuccessState
  payment={payment}
  address={deliveryAddress}
  onReset={() => window.location.reload()}
/>
```

## Full source

```tsx
import { CheckoutSuccessState } from '@/modules/domains/common/payment/CheckoutSuccessState';

<CheckoutSuccessState
  payment={payment}
  address={deliveryAddress}
  onReset={() => window.location.reload()}
/>
```
