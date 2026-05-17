# AuthSchemeCard

- **id:** `api-doc-auth-scheme-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/AuthSchemeCard.tsx`
- **status:** stable
- **since:** 2026-05

Selectable card describing a single auth scheme (apiKey, http, oauth2, openIdConnect, mutualTLS).

## Variants

### OAuth recommended

```tsx
<AuthSchemeCard name="OAuth 2.0" type="oauth2" recommended description="…" href="/auth/oauth2" />
```

### API key

```tsx
<AuthSchemeCard name="X-API-Key" type="apiKey" description="…" />
```

## Full source

```tsx
import { AuthSchemeCard } from '@/modules/domains/api-doc/AuthSchemeCard';
<AuthSchemeCard name="Bearer JWT" type="http" />
```
