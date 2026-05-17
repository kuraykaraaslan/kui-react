# PaymentCardTile

- **id:** `fintech-payment-card-tile`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/card/PaymentCardTile.tsx`
- **status:** stable
- **since:** 2026-05

Skeuomorphic payment card tile with scheme brand, kind icon (virtual / physical), and status badge.

## Variants

### Three states

```tsx
<PaymentCardTile nickname="…" scheme="visa" kind="physical" status="active" last4="4291" expiry="11/28" />
```

### Virtual card

```tsx
<PaymentCardTile scheme="mastercard" kind="virtual" status="active" />
```

## Full source

```tsx
import { PaymentCardTile } from '@/modules/domains/fintech/card/PaymentCardTile';
<PaymentCardTile nickname="Daily spend" scheme="visa" kind="physical" status="active" last4="4291" expiry="11/28" cardholderName="Alex Carter" />
```
