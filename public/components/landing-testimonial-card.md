# TestimonialCard

- **id:** `landing-testimonial-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/testimonial/TestimonialCard.tsx`
- **status:** stable
- **since:** 2026-05

Customer quote card with optional star rating, author initials fallback avatar, name, title, company, and company logo. All fields except quote and authorName are optional.

## Variants

### With rating & company

```tsx
<TestimonialCard testimonial={{ ...testimonial, rating: 5 }} />
```

### Minimal

```tsx
<TestimonialCard testimonial={{ testimonialId: 't1', quote: '...', authorName: 'Marcus Webb' }} />
```

## Full source

```tsx
'use client';
import { TestimonialCard } from '@/modules/domains/landing/testimonial/TestimonialCard';

<TestimonialCard testimonial={{
  testimonialId: 't1',
  quote: 'Velox cut our deploy time from 20 min to 60 s.',
  authorName: 'Sarah Chen',
  authorTitle: 'CTO',
  companyName: 'Luminary Labs',
  rating: 5,
}} />
```
