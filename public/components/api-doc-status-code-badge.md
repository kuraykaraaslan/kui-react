# StatusCodeBadge

- **id:** `api-doc-status-code-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/StatusCodeBadge.tsx`
- **status:** stable
- **since:** 2025-04

Displays an HTTP status code with a semantic color and an optional human-readable label.

## Variants

### All status families

```tsx
<StatusCodeBadge code={200} />
<StatusCodeBadge code={201} />
<StatusCodeBadge code={204} />
<StatusCodeBadge code={301} />
<StatusCodeBadge code={400} />
<StatusCodeBadge code={404} />
<StatusCodeBadge code={500} />
```

### Without label

```tsx
<StatusCodeBadge code={200} showLabel={false} />
<StatusCodeBadge code={404} showLabel={false} />
<StatusCodeBadge code={500} showLabel={false} />
```

## Full source

```tsx
import { StatusCodeBadge } from '@/modules/domains/api-doc/StatusCodeBadge';

<StatusCodeBadge code={200} />
<StatusCodeBadge code={201} />
<StatusCodeBadge code={404} />
<StatusCodeBadge code={500} showLabel={false} />
```
