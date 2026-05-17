# ReviewSubmitForm

- **id:** `reviews-review-submit-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/reviews/ReviewSubmitForm.tsx`
- **status:** stable
- **since:** 2026-05

Composable submit form: interactive StarRating, optional title input, textarea with min-length validation, submit button.

## Depends on

- `star-rating`
- `input`
- `textarea`
- `button`

## Variants

### Default

```tsx
<ReviewSubmitForm onSubmit={(d) => save(d)} />
```

### Custom labels — hotel review

```tsx
<ReviewSubmitForm
  title="Share your stay"
  submitLabel="Post review"
/>
```

## Full source

```tsx
import { ReviewSubmitForm } from '@/modules/domains/reviews';

<ReviewSubmitForm onSubmit={(draft) => api.createReview(draft)} />
```
