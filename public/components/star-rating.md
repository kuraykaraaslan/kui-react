# StarRating

- **id:** `star-rating`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/StarRating.tsx`
- **status:** stable
- **since:** 2026-05

Five-star rating indicator. Read-only by default with decimal/half-star rendering; pass `readonly={false}` + `onChange` for interactive whole-star selection.

## When to use

Surface a 0–5 star score (e.g. product / hotel / restaurant ratings) or let users submit a new rating.

## When NOT to use

For non-star scales (e.g. NPS, percentages) use ContentScoreBar or a custom indicator instead.

## Used by

- `reviews-review-card`
- `reviews-review-submit-form`
- `reviews-review-summary-card`

## Accessibility

- WCAG: AA
- ARIA patterns: role="img" (readonly), role="radiogroup" / role="radio" (interactive)

## Design tokens consumed

- `--warning`
- `--text-disabled`
- `--border-focus`

## Variants

### Readonly with decimals

```tsx
<StarRating value={4.7} size="sm" caption="(312 reviews)" />
<StarRating value={3.5} size="md" />
<StarRating value={2.2} size="lg" />
```

### Interactive

```tsx
const [value, setValue] = useState(0);
<StarRating
  value={value}
  readonly={false}
  onChange={setValue}
  aria-label="Pick a rating"
/>
```

## Full source

```tsx
import { StarRating } from '@/modules/ui/StarRating';

<StarRating value={4.5} />
<StarRating value={rating} readonly={false} onChange={setRating} />
```
