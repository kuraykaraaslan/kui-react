# StepIndicator

- **id:** `step-indicator`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/StepIndicator.tsx`
- **status:** stable
- **since:** 2025-03

Ödeme akışı (Biletler → Bilgiler → Ödeme → Onay) için 4 adımlı ilerleme göstergesi.

## Variants

### Tüm adım durumları

```tsx
<StepIndicator current="tickets" />
<StepIndicator current="buyer" />
<StepIndicator current="payment" />
<StepIndicator current="confirm" />
```

## Full source

```tsx
import { StepIndicator } from '@/modules/domains/event/StepIndicator';
// 'tickets' | 'buyer' | 'payment' | 'confirm'
<StepIndicator current="payment" />
```
