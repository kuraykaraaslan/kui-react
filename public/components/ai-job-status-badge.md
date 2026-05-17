# AIJobStatusBadge

- **id:** `ai-job-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/job/AIJobStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Dot + label badge tracking the lifecycle of an async AI job.

## Variants

### All statuses

```tsx
{(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const).map((s) => (
  <AIJobStatusBadge key={s} status={s} />
))}
```

### Small size

```tsx
<AIJobStatusBadge status="COMPLETED" size="sm" />
```

## Full source

```tsx
import { AIJobStatusBadge } from '@/modules/domains/ai/job/AIJobStatusBadge';
<AIJobStatusBadge status="RUNNING" />
```
