# RatingDistribution

- **id:** `reviews-rating-distribution`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/reviews/RatingDistribution.tsx`
- **status:** stable
- **since:** 2026-05

Horizontal bar chart of 1–5 star buckets. SVG-free, accessible via per-row progressbar roles.

## Used by

- `reviews-review-summary-card`

## Design tokens consumed

- `--warning`
- `--surface-sunken`
- `--text-secondary`

## Variants

### Typical (4-star skew)

```tsx
<RatingDistribution
  distribution={{ 1: 6, 2: 12, 3: 24, 4: 86, 5: 120 }}
  total={248}
/>
```

### Low-rated, counts hidden

```tsx
<RatingDistribution
  distribution={low.distribution}
  total={low.total}
  showCounts={false}
/>
```

## Full source

```tsx
import { RatingDistribution } from '@/modules/domains/reviews';

<RatingDistribution
  distribution={{ 1: 6, 2: 12, 3: 24, 4: 86, 5: 120 }}
  total={248}
/>
```
