# FeatureGrid

- **id:** `landing-feature-grid`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/feature/FeatureGrid.tsx`
- **status:** stable
- **since:** 2026-05

Section wrapper that renders a heading block and a responsive grid of FeatureCard components. columns prop controls breakpoints; layout prop is passed down to each card.

## Variants

### 3-column cards

```tsx
<FeatureGrid title="Built for teams" features={features} columns={3} />
```

### 2-column inline

```tsx
<FeatureGrid title="Core capabilities" features={features} layout="inline" columns={2} />
```

## Full source

```tsx
'use client';
import { FeatureGrid } from '@/modules/domains/landing/feature/FeatureGrid';

<FeatureGrid
  eyebrow="Everything you need"
  title="Built for teams that move fast"
  subtitle="One platform for the entire workflow."
  features={features}
  columns={3}
/>
```
