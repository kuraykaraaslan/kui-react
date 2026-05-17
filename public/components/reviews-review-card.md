# ReviewCard

- **id:** `reviews-review-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/reviews/ReviewCard.tsx`
- **status:** stable
- **since:** 2026-05

Single user review with avatar, star rating, optional verified badge, body, and an optimistic helpful counter.

## Depends on

- `avatar`
- `badge`
- `star-rating`

## Variants

### Verified · 5 stars · with title

```tsx
<ReviewCard review={review} />
```

### Anonymous · 3 stars · no title

```tsx
<ReviewCard review={review} />
```

## Full source

```tsx
import { ReviewCard } from '@/modules/domains/reviews';

<ReviewCard review={review} onHelpful={(id) => markHelpful(id)} />
```
