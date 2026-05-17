# HttpMethodBadge

- **id:** `api-doc-http-method-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/HttpMethodBadge.tsx`
- **status:** stable
- **since:** 2025-04

Color-coded badge for HTTP methods — GET, POST, PUT, PATCH, DELETE, and more.

## Variants

### All methods — medium (default)

```tsx
{(['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','TRACE'] as const).map((m) => (
  <HttpMethodBadge key={m} method={m} />
))}
```

### Sizes

```tsx
<HttpMethodBadge method="GET" size="sm" />
<HttpMethodBadge method="GET" size="md" />
<HttpMethodBadge method="GET" size="lg" />
```

## Full source

```tsx
import { HttpMethodBadge } from '@/modules/domains/api-doc/HttpMethodBadge';

<HttpMethodBadge method="GET" />
<HttpMethodBadge method="POST" size="lg" />
```
