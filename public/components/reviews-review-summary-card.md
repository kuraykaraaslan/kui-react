# ReviewSummaryCard

- **id:** `reviews-review-summary-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/reviews/ReviewSummaryCard.tsx`
- **status:** stable
- **since:** 2026-05

Aggregated rating summary. Combines the average score, a big star strip, and the per-bucket distribution into a single card.

## Depends on

- `star-rating`
- `reviews-rating-distribution`

## Variants

### Default — restaurant

```tsx
<ReviewSummaryCard summary={summary} />
```

### Custom title — hotel guest ratings

```tsx
<ReviewSummaryCard
  summary={summary}
  title="Guest ratings"
  reviewNoun="stay"
/>
```

## Full source

```tsx
import { ReviewSummaryCard } from '@/modules/domains/reviews';

<ReviewSummaryCard
  summary={{ subjectId, average: 4.3, total: 248, distribution }}
/>
```
