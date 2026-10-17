# ContributionBoundary

- **id:** `contribution-boundary`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/ContributionBoundary.tsx`
- **status:** stable
- **since:** 2026-10

Error boundary for one contribution (a slot item, tab, widget or block): when it throws, only it is replaced by `fallback` (a node or `({ error, reset }) => node`, nothing by default) and its host keeps working. `onError(error, info)` reports; `resetKeys` resets when any value changes.

## Variants

### Admin: placeholder with retry

```tsx
<ContributionBoundary
  onError={(error) => report(error)}
  fallback={({ reset }) => (
    <UnavailableContribution reason="failed" size="node" title="Call log" action={{ label: 'Retry', onClick: reset }} />
  )}
>
  <CallLog contactId={id} />
</ContributionBoundary>
```

### End user: nothing

```tsx
// No fallback: a broken contribution simply disappears for end users.
<ContributionBoundary onError={(error) => report(error)}>
  <CallLog contactId={id} />
</ContributionBoundary>
```

## Full source

```tsx
import { ContributionBoundary } from '@/modules/ui/ContributionBoundary';
import { UnavailableContribution } from '@/modules/ui/UnavailableContribution';

<ContributionBoundary
  resetKeys={[contribution.id, contribution.version]}
  onError={(error, info) => report({ point, contributor, error, info })}
  fallback={isAdmin ? ({ reset }) => (
    <UnavailableContribution reason="failed" action={{ label: 'Retry', onClick: reset }} />
  ) : null}
>
  <Contribution {...props} />
</ContributionBoundary>
```
