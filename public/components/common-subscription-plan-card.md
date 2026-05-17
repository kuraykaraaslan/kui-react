# SubscriptionPlanCard

- **id:** `common-subscription-plan-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/subscription/SubscriptionPlanCard.tsx`
- **status:** stable
- **since:** 2025-05

Subscription plan card displaying name, price with currency formatting, billing interval, and feature list with checkmarks. Highlights the popular and current plans. Accepts onSelect callback for plan switching.

## Variants

### Plan grid

```tsx
<div className="grid grid-cols-3 gap-4">
  <SubscriptionPlanCard plan={freePlan} onSelect={handleSelect} />
  <SubscriptionPlanCard plan={proPlan} isCurrent onSelect={handleSelect} />
  <SubscriptionPlanCard plan={enterprisePlan} onSelect={handleSelect} />
</div>
```

### Single card states

```tsx
<SubscriptionPlanCard plan={plan} isCurrent />
<SubscriptionPlanCard plan={{ ...plan, isPopular: true }} onSelect={handleSelect} />
```

## Full source

```tsx
'use client';
import { SubscriptionPlanCard } from '@/modules/domains/common/subscription/SubscriptionPlanCard';

<SubscriptionPlanCard
  plan={{
    planId: 'pro',
    name: 'Pro',
    price: 1900,
    currency: 'USD',
    interval: 'MONTHLY',
    features: ['Unlimited projects', '10 team members', 'Priority support'],
    isPopular: true,
  }}
  onSelect={(planId) => handleUpgrade(planId)}
/>
```
