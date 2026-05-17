# JobStatusBadge

- **id:** `jobs-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/job/JobStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays job listing status with semantic colour coding.

## Variants

### All statuses

```tsx
{(['DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'ARCHIVED'] as const).map((s) => (
  <JobStatusBadge key={s} status={s} />
))}
```

### Sizes

```tsx
<JobStatusBadge status="PUBLISHED" size="sm" />
<JobStatusBadge status="PUBLISHED" size="md" />
<JobStatusBadge status="PUBLISHED" size="lg" />
```

## Full source

```tsx
import { JobStatusBadge } from '@/modules/domains/jobs/job/JobStatusBadge';
<JobStatusBadge status="PUBLISHED" />
```
