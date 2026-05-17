# PricingPlanCard

- **id:** `landing-pricing-plan-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/pricing/PricingPlanCard.tsx`
- **status:** stable
- **since:** 2026-05

Marketing-oriented pricing card with formatted price, interval label, feature checklist, and a CTA link. isPopular adds a "Most Popular" badge and primary border highlight.

## Variants

### Popular plan

```tsx
<PricingPlanCard plan={{ ...plan, isPopular: true }} />
```

### All plans

```tsx
<PricingPlanCard plan={freePlan} />
<PricingPlanCard plan={{ ...proPlan, isPopular: true }} />
<PricingPlanCard plan={scalePlan} />
```

## Full source

```tsx
'use client';
import { PricingPlanCard } from '@/modules/domains/landing/pricing/PricingPlanCard';

// Popular plan (highlighted)
<PricingPlanCard plan={{ planId: 'pro', name: 'Pro', price: 29, interval: 'MONTHLY', isPopular: true, features: ['...'], cta: { label: 'Start trial', href: '#' } }} />
```
