# OperationPanel

- **id:** `api-doc-operation-panel`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/OperationPanel.tsx`
- **status:** stable
- **since:** 2025-04

Tabbed panel showing all details of an API operation — parameters, request body, responses, and code samples.

## Variants

### GET with parameters and code samples

```tsx
<OperationPanel operation={{
  method: 'GET',
  summary: 'List users',
  parameters: [...],
  responses: [...],
  codeSamples: [...],
}} />
```

### POST with request body

```tsx
<OperationPanel operation={{
  method: 'POST',
  summary: 'Create user',
  requestBody: { required: true, content: { 'application/json': { schema: userSchema } } },
  responses: [...],
}} />
```

## Full source

```tsx
import { OperationPanel } from '@/modules/domains/api-doc/OperationPanel';

<OperationPanel operation={operation} />
```
