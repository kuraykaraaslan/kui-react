# EndpointRow

- **id:** `api-doc-endpoint-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/EndpointRow.tsx`
- **status:** stable
- **since:** 2025-04

Collapsible row representing a single API endpoint — shows the method badge, path, summary, and expands to an OperationPanel.

## Variants

### GET endpoint (expanded)

```tsx
<EndpointRow
  path="/users"
  operation={{ method: 'GET', summary: 'List users', ... }}
  defaultOpen
/>
```

### Multiple endpoints

```tsx
<EndpointRow path="/users" operation={getOp} />
<EndpointRow path="/users" operation={postOp} />
<EndpointRow path="/users/{userId}" operation={deleteOp} />
```

## Full source

```tsx
import { EndpointRow } from '@/modules/domains/api-doc/EndpointRow';

<EndpointRow path="/users" operation={getOperation} defaultOpen />
<EndpointRow path="/users" operation={postOperation} />
```
