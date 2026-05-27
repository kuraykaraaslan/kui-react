# OnboardingWizard

- **id:** `onboarding-wizard`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/OnboardingWizard.tsx`
- **status:** stable
- **since:** 2026-05

Multi-step onboarding flow with dots/bar progress, optional skip, and page or modal presentation. Each step renders its own content slot.

## Depends on

- `button`
- `modal`

## Accessibility

- WCAG: AA
- ARIA patterns: role="progressbar"
- Keyboard:
  - `Enter / Click` — Activate Next / Previous / Skip / Complete

Progress is announced via role="progressbar" with aria-valuenow updating on step change.

## Design tokens consumed

- `--primary`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--border`

## Variants

### Dots indicator (page mode)

```tsx
<OnboardingWizard
  steps={steps}
  indicator="dots"
  allowSkip
  onComplete={() => {}}
/>
```

### Progress bar indicator

```tsx
<OnboardingWizard
  steps={steps}
  indicator="bar"
  allowSkip={false}
  onComplete={() => {}}
/>
```

## Full source

```tsx
'use client';
import { OnboardingWizard, type OnboardingStep } from '@/modules/app/OnboardingWizard';

const steps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Set up your workspace.', content: <WelcomeCopy /> },
  { id: 'profile', title: 'Profile',  content: <ProfileForm /> },
  { id: 'done',    title: 'All set!', content: <DoneCopy /> },
];

<OnboardingWizard
  steps={steps}
  indicator="dots"
  allowSkip
  onComplete={() => router.push('/dashboard')}
  onSkip={() => router.push('/dashboard')}
/>
```
