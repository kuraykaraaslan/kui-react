# JobMeta

- **id:** `jobs-job-meta`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/job/JobMeta.tsx`
- **status:** stable
- **since:** 2026-05

Inline metadata row: location, salary range, open positions, and posted date.

## Variants

### With salary

```tsx
<JobMeta job={job} />
```

### Salary hidden

```tsx
<JobMeta job={{ ...job, salaryVisible: false }} />
```

## Full source

```tsx
import { JobMeta } from '@/modules/domains/jobs/job/JobMeta';
<JobMeta job={job} />
```
