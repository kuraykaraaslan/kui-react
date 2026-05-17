# CardLimitMeter

- **id:** `fintech-card-limit-meter`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/card/CardLimitMeter.tsx`
- **status:** stable
- **since:** 2026-05

Progress bar showing spend vs. limit. Color shifts at warning + over-limit thresholds.

## Variants

### Three thresholds

```tsx
<CardLimitMeter spent={920} limit={3000} currency="USD" />
```

## Full source

```tsx
import { CardLimitMeter } from '@/modules/domains/fintech/card/CardLimitMeter';
<CardLimitMeter spent={1820} limit={3000} currency="USD" />
```
