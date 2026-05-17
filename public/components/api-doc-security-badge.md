# SecurityBadge

- **id:** `api-doc-security-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/SecurityBadge.tsx`
- **status:** stable
- **since:** 2025-04

Inline badge representing an API security scheme type with a matching icon and color.

## Variants

### All scheme types

```tsx
<SecurityBadge type="apiKey" />
<SecurityBadge type="http" />
<SecurityBadge type="oauth2" />
<SecurityBadge type="openIdConnect" />
<SecurityBadge type="mutualTLS" />
```

### Custom names

```tsx
<SecurityBadge type="apiKey" name="X-API-Key" />
<SecurityBadge type="oauth2" name="OAuth 2.0 (PKCE)" />
<SecurityBadge type="http" name="Bearer JWT" />
```

## Full source

```tsx
import { SecurityBadge } from '@/modules/domains/api-doc/SecurityBadge';

<SecurityBadge type="apiKey" />
<SecurityBadge type="oauth2" name="OAuth 2.0 (custom)" />
```
