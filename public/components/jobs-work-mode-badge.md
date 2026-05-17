# JobWorkModeBadge

- **id:** `jobs-work-mode-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/job/JobWorkModeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Icon + label badge for work location mode (remote, hybrid, on-site).

## Variants

### All modes

```tsx
{(['REMOTE', 'HYBRID', 'ONSITE'] as const).map((m) => (
  <JobWorkModeBadge key={m} workMode={m} />
))}
```

## Full source

```tsx
import { JobWorkModeBadge } from '@/modules/domains/jobs/job/JobWorkModeBadge';
<JobWorkModeBadge workMode="REMOTE" />
```
