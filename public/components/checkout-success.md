# CheckoutSuccess

- **id:** `checkout-success`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/CheckoutSuccess.tsx`
- **status:** stable
- **since:** 2025-04

Başarılı ödeme sonrası gösterilen onay ekranı: QR bilet, sipariş özeti, yazdır/geri dön butonları.

## Variants

### Başarı ekranı

```tsx
<CheckoutSuccess
  orderId="ORD-XY9Z12"
  ticketId="TKT-A1B2C3"
  buyerName="Ahmet Yılmaz"
  buyerEmail="ahmet@example.com"
  event={event}
  venue={venue}
  cartItems={cartItems}
  total={total}
/>
```

## Full source

```tsx
import { CheckoutSuccess } from '@/modules/domains/event/CheckoutSuccess';
<CheckoutSuccess
  orderId="ORD-XY9Z12"
  ticketId="TKT-A1B2C3"
  buyerName="Ahmet Yılmaz"
  buyerEmail="ahmet@example.com"
  event={{ eventId, title, startAt, slug }}
  venue={{ name, city }}
  cartItems={[{ pricing, quantity: 2 }]}
  total={3000}
/>
```
