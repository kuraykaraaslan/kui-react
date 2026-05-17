# HeroSection

- **id:** `landing-hero-section`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/hero/HeroSection.tsx`
- **status:** stable
- **since:** 2026-05

Full-width landing hero with eyebrow label, headline, subheadline, dual CTAs, and an optional right-column image. Gradient blobs are applied in-component.

## Variants

### With image

```tsx
<HeroSection hero={{ headline: 'Ship better products, faster.', primaryCta: { label: 'Start for free', href: '#' }, image: '/hero.png' }} />
```

### Text only

```tsx
<HeroSection hero={{ eyebrow: 'New feature', headline: 'The fastest way to go from idea to production.', primaryCta: { label: 'Get started', href: '#' } }} />
```

## Full source

```tsx
'use client';
import { HeroSection } from '@/modules/domains/landing/hero/HeroSection';

const hero = {
  eyebrow: 'Now in public beta',
  headline: 'Ship better products, faster.',
  subheadline: 'One workspace for planning, building, and shipping.',
  primaryCta:   { label: 'Start for free', href: '/signup' },
  secondaryCta: { label: 'Watch demo',     href: '#demo'   },
  image: '/hero.png',
};

<HeroSection hero={hero} />
```
