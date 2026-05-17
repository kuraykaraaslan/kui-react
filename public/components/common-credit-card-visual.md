# CreditCardVisual

- **id:** `common-credit-card-visual`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/CreditCardVisual.tsx`
- **status:** beta
- **since:** 2025-05

Animated 3-D flip credit card. Front shows number, name, expiry; back shows CVV strip. Supports VISA, Mastercard, AMEX, Discover.

## Variants

### Brands

```tsx
<CreditCardVisual brand="VISA" cardNumber="4111111111111111" cardholderName="JANE DOE" expiryMonth="08" expiryYear="28" />
<CreditCardVisual brand="MASTERCARD" cardNumber="5500005555555559" cardholderName="JOHN SMITH" expiryMonth="12" expiryYear="27" />
```

### Flipped (CVV)

```tsx
<CreditCardVisual brand="AMEX" cardNumber="378282246310005" cardholderName="JANE DOE" expiryMonth="03" expiryYear="26" cvv="1234" flipped />
```

## Full source

```tsx
<CreditCardVisual
  brand="VISA"
  cardNumber="4111111111111111"
  cardholderName="JANE DOE"
  expiryMonth="08"
  expiryYear="28"
  flipped={cvvFocused}
/>
```
