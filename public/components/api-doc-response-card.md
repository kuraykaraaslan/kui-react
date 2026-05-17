# ResponseCard

- **id:** `api-doc-response-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/ResponseCard.tsx`
- **status:** stable
- **since:** 2025-04

Collapsible card for a single API response showing the status code, description, and response body schema.

## Variants

### Success response (expanded)

```tsx
<ResponseCard
  response={{
    statusCode: '200',
    description: 'Successful response',
    content: { 'application/json': { schema: userSchema } },
  }}
  defaultOpen
/>
```

### Multiple response cards

```tsx
{responses.map((r) => (
  <ResponseCard key={r.responseId} response={r} defaultOpen={r.statusCode.startsWith('2')} />
))}
```

## Full source

```tsx
import { ResponseCard } from '@/modules/domains/api-doc/ResponseCard';

<ResponseCard response={response} defaultOpen />
```
