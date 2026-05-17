# FeatureCard

- **id:** `landing-feature-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/feature/FeatureCard.tsx`
- **status:** stable
- **since:** 2026-05

Single feature item with Font Awesome icon, title, and description. layout="card" renders a raised card with hover border; layout="inline" renders a compact horizontal row.

## Variants

### Card layout

```tsx
<FeatureCard feature={{ featureId: 'f1', icon: 'bolt', title: 'Fast deploys', description: 'Push in under 60s.' }} />
```

### Inline layout

```tsx
<FeatureCard feature={feature} layout="inline" />
```

## Full source

```tsx
'use client';
import { FeatureCard } from '@/modules/domains/landing/feature/FeatureCard';

// Card layout (default)
<FeatureCard feature={{ featureId: 'f1', icon: 'bolt', title: 'Fast deploys', description: 'Push in under 60s.' }} />

// Inline layout
<FeatureCard feature={feature} layout="inline" />
```
