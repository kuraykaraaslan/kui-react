# FaqAccordion

- **id:** `landing-faq-accordion`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/faq/FaqAccordion.tsx`
- **status:** stable
- **since:** 2026-05

Accessible accordion for FAQ items using aria-expanded + aria-controls. By default only one item is open at a time; allowMultiple enables concurrent open items. First item is pre-opened.

## Variants

### Single open

```tsx
<FaqAccordion eyebrow="FAQ" title="Common questions" items={faqItems} />
```

### Allow multiple open

```tsx
<FaqAccordion title="Common questions" items={faqItems} allowMultiple />
```

## Full source

```tsx
'use client';
import { FaqAccordion } from '@/modules/domains/landing/faq/FaqAccordion';

// Single open (default)
<FaqAccordion title="Common questions" items={faqItems} />

// Multiple open
<FaqAccordion title="Common questions" items={faqItems} allowMultiple />
```
