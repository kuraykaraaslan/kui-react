# ApiTagSection

- **id:** `api-doc-api-tag-section`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/ApiTagSection.tsx`
- **status:** stable
- **since:** 2025-04

Collapsible section grouping endpoints under a named tag — the primary navigation unit in API documentation.

## Variants

### Users tag (expanded)

```tsx
<ApiTagSection
  tag={{ tagId: 'tag-users', name: 'Users', description: 'User management endpoints' }}
  paths={[
    { pathItem: { path: '/users', operations: [getOp, postOp] } },
    { pathItem: { path: '/users/{userId}', operations: [deleteOp] } },
  ]}
  defaultOpen
/>
```

### Collapsed by default

```tsx
<ApiTagSection
  tag={{ name: 'Auth', description: 'Authentication endpoints' }}
  paths={[{ pathItem: { path: '/auth/token', operations: [postOp] } }]}
  defaultOpen={false}
/>
```

## Full source

```tsx
import { ApiTagSection } from '@/modules/domains/api-doc/ApiTagSection';

<ApiTagSection tag={tag} paths={paths} defaultOpen />
```
