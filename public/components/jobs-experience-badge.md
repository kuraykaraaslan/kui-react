# JobExperienceBadge

- **id:** `jobs-experience-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/job/JobExperienceBadge.tsx`
- **status:** stable
- **since:** 2026-05

Experience level badge mapping seniority to a semantic colour.

## Variants

### All levels

```tsx
{(['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'DIRECTOR'] as const).map((l) => (
  <JobExperienceBadge key={l} level={l} />
))}
```

## Full source

```tsx
import { JobExperienceBadge } from '@/modules/domains/jobs/job/JobExperienceBadge';
<JobExperienceBadge level="SENIOR" />
```
