# CheckoutSuccessState

- **id:** `common-checkout-success-state`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/CheckoutSuccessState.tsx`
- **status:** stable
- **since:** 2026-05

Ödeme tamamlama sonrası başarı ekranı; onay ikonu, ödeme özeti ve opsiyonel teslimat adresi.

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
