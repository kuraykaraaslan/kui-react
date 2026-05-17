# EtaCountdownCard

- **id:** `food-eta-countdown-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/food/order/EtaCountdownCard.tsx`
- **status:** stable
- **since:** 2026-05

Live ETA tile: shows minutes remaining and arrival clock time. Auto-refreshes every 30s.

## Variants

### Default

```tsx
<EtaCountdownCard estimatedArrival={isoString} destinationLabel="..." />
```

### Urgent (≤ 5 min)

```tsx
<EtaCountdownCard estimatedArrival={near} variant="urgent" />
```

## Full source

```tsx
import { EtaCountdownCard } from '@/modules/domains/food/order/EtaCountdownCard';
<EtaCountdownCard estimatedArrival={date} destinationLabel="..." />
```
