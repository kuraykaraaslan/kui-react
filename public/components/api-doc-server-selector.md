# ServerSelector

- **id:** `api-doc-server-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/ServerSelector.tsx`
- **status:** stable
- **since:** 2025-04

Dropdown for selecting the active API server, with environment badges (production, staging, development, sandbox).

## Variants

### Multi-environment servers

```tsx
<ServerSelector servers={[
  { serverId: 'srv1', url: 'https://api.example.com/v1', environment: 'production' },
  { serverId: 'srv2', url: 'https://staging-api.example.com/v1', environment: 'staging' },
  { serverId: 'srv3', url: 'http://localhost:3000/v1', environment: 'development' },
]} />
```

### Single server

```tsx
<ServerSelector servers={[
  { serverId: 'srv1', url: 'https://api.example.com/v1', environment: 'production' },
]} />
```

## Full source

```tsx
import { ServerSelector } from '@/modules/domains/api-doc/ServerSelector';

<ServerSelector servers={servers} />
```
