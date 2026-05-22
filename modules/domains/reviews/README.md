# modules/domains/reviews

Reviews / ratings domain — review cards, rating distributions, summary cards, and submission form.

## Files

```
RatingDistribution.tsx
ReviewCard.tsx
ReviewSubmitForm.tsx
ReviewSummaryCard.tsx
index.ts
types.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `'use client';` at top of every component file.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`; star UI via `@/modules/ui/StarRating`.
6. User/Id types reused from `@/modules/domains/common`.

See [/AGENTS.md](../../../AGENTS.md).
