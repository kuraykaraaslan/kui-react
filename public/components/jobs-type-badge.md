# JobTypeBadge

- **id:** `jobs-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/job/JobTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge for employment type (full-time, contract, etc.).

## Variants

### All types

```tsx
{(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'] as const).map((t) => (
  <JobTypeBadge key={t} type={t} />
))}
```

## Full source

```tsx
import { JobTypeBadge } from '@/modules/domains/jobs/job/JobTypeBadge';
<JobTypeBadge type="FULL_TIME" />
```
