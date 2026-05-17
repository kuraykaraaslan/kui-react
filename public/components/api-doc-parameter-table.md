# ParameterTable

- **id:** `api-doc-parameter-table`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/ParameterTable.tsx`
- **status:** stable
- **since:** 2025-04

Table displaying API parameters with location (path/query/header/cookie), type, required flag, and description.

## Variants

### Mixed parameter locations

```tsx
<ParameterTable parameters={[
  { parameterId: 'p1', name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
  { parameterId: 'p2', name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { parameterId: 'p3', name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
  { parameterId: 'p4', name: 'role', in: 'query', schema: { type: 'string', enum: ['admin','editor','viewer'] }, deprecated: true },
]} />
```

### Path params only

```tsx
<ParameterTable parameters={[
  { parameterId: 'pp1', name: 'orgId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
  { parameterId: 'pp2', name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
]} />
```

## Full source

```tsx
import { ParameterTable } from '@/modules/domains/api-doc/ParameterTable';

<ParameterTable parameters={parameters} />
```
