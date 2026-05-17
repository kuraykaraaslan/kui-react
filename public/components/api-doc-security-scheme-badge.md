# SecuritySchemeBadge

- **id:** `api-doc-security-scheme-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/SecuritySchemeBadge.tsx`
- **status:** stable
- **since:** 2025-04

Badge variant of SecurityBadge that uses the design-system Badge component for consistent styling.

## Variants

### All scheme types

```tsx
<SecuritySchemeBadge type="apiKey" />
<SecuritySchemeBadge type="http" />
<SecuritySchemeBadge type="oauth2" />
<SecuritySchemeBadge type="openIdConnect" />
<SecuritySchemeBadge type="mutualTLS" />
```

### Small size with custom names

```tsx
<SecuritySchemeBadge type="apiKey" name="X-API-Key" size="sm" />
<SecuritySchemeBadge type="http" name="Bearer JWT" size="sm" />
<SecuritySchemeBadge type="oauth2" name="Google OAuth" size="sm" />
```

## Full source

```tsx
import { SecuritySchemeBadge } from '@/modules/domains/api-doc/SecuritySchemeBadge';

<SecuritySchemeBadge type="oauth2" />
<SecuritySchemeBadge type="apiKey" name="X-API-Key" size="sm" />
```
