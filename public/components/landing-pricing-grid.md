# PricingGrid

- **id:** `landing-pricing-grid`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/pricing/PricingGrid.tsx`
- **status:** stable
- **since:** 2026-05

Pricing section that wraps PricingPlanCard in a responsive grid. showIntervalToggle renders a Monthly/Yearly switch and filters plans by the selected interval.

## Variants

### Monthly only

```tsx
<PricingGrid title="Pricing" plans={monthlyPlans} showIntervalToggle={false} />
```

### With interval toggle

```tsx
<PricingGrid title="Pricing" plans={[...monthlyPlans, ...yearlyPlans]} showIntervalToggle />
```

## Full source

```tsx
'use client';
import { PricingGrid } from '@/modules/domains/landing/pricing/PricingGrid';

// With interval toggle — provide monthly AND yearly plan variants
<PricingGrid
  title="Start free, scale when ready"
  plans={[...monthlyPlans, ...yearlyPlans]}
  showIntervalToggle
/>
```
