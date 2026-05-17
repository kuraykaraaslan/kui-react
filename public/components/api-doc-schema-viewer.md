# SchemaViewer

- **id:** `api-doc-schema-viewer`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/SchemaViewer.tsx`
- **status:** stable
- **since:** 2025-04

Interactive JSON Schema tree viewer with type coloring, constraint display, and collapsible nodes.

## Variants

### Object schema

```tsx
const userSchema = {
  type: 'object',
  required: ['id', 'email', 'name'],
  properties: {
    id: { type: 'string', format: 'uuid', readOnly: true },
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
    active: { type: 'boolean', default: true },
  },
};

<SchemaViewer schema={userSchema} title="User" />
```

### Nested / array schema

```tsx
const listSchema = {
  type: 'object',
  properties: {
    data: { type: 'array', items: userSchema },
    total: { type: 'integer', description: 'Total items' },
    page: { type: 'integer' },
    pageSize: { type: 'integer' },
  },
};

<SchemaViewer schema={listSchema} title="PaginatedUsers" />
```

## Full source

```tsx
import { SchemaViewer } from '@/modules/domains/api-doc/SchemaViewer';

<SchemaViewer schema={userSchema} title="User" />
```
