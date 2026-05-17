# TestimonialGrid

- **id:** `landing-testimonial-grid`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/testimonial/TestimonialGrid.tsx`
- **status:** stable
- **since:** 2026-05

Masonry columns grid of TestimonialCard components with a centred heading block. Uses CSS columns for the masonry effect — cards automatically balance across columns.

## Variants

### Masonry grid

```tsx
<TestimonialGrid title="What teams say" testimonials={testimonials} />
```

## Full source

```tsx
'use client';
import { TestimonialGrid } from '@/modules/domains/landing/testimonial/TestimonialGrid';

<TestimonialGrid
  eyebrow="What teams say"
  title="Loved by engineers worldwide"
  testimonials={testimonials}
/>
```
