# ApplicationStatusBadge

- **id:** `jobs-application-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/application/ApplicationStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Tracks an application's lifecycle from Pending through Offered or Rejected.

## Variants

### All statuses

```tsx
{(['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN'] as const).map((s) => (
  <ApplicationStatusBadge key={s} status={s} />
))}
```

## Full source

```tsx
import { ApplicationStatusBadge } from '@/modules/domains/jobs/application/ApplicationStatusBadge';
<ApplicationStatusBadge status="SHORTLISTED" />
```
