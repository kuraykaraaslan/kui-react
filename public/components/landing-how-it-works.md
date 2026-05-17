# HowItWorksSection

- **id:** `landing-how-it-works`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/how-it-works/HowItWorksSection.tsx`
- **status:** stable
- **since:** 2026-05

Process steps section in two layouts. horizontal shows numbered/icon circles in a row connected by a dashed line. vertical stacks them with a timeline connector.

## Variants

### Horizontal layout

```tsx
<HowItWorksSection title="3 simple steps" steps={steps} layout="horizontal" />
```

### Vertical timeline

```tsx
<HowItWorksSection title="How it works" steps={steps} layout="vertical" />
```

## Full source

```tsx
'use client';
import { HowItWorksSection } from '@/modules/domains/landing/how-it-works/HowItWorksSection';

// Horizontal (default)
<HowItWorksSection
  eyebrow="Getting started"
  title="From repo to production in 3 steps"
  steps={steps}
  layout="horizontal"
/>

// Vertical timeline
<HowItWorksSection title="How it works" steps={steps} layout="vertical" />
```
