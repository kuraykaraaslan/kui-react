# CreditCardForm

- **id:** `common-credit-card-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/CreditCardForm.tsx`
- **status:** beta
- **since:** 2025-05

Full credit card entry form with live card visual preview. Auto-detects brand, formats number, flips card on CVV focus, validates expiry.

## Variants

### Default

```tsx
<CreditCardForm onSubmit={async (card) => saveCard(card)} onCancel={handleCancel} />
```

### Server error

```tsx
<CreditCardForm onSubmit={handleSave} error="Card declined. Please try a different card." />
```

## Full source

```tsx
<CreditCardForm
  onSubmit={async (card) => saveCard(card)}
  onCancel={() => setOpen(false)}
/>
```
