# OAuthFlowDiagram

- **id:** `api-doc-oauth-flow-diagram`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/OAuthFlowDiagram.tsx`
- **status:** stable
- **since:** 2026-05

Visual walkthrough of an OAuth 2.0 flow with actors, numbered steps, endpoints, and scopes.

## Variants

### Authorization Code

```tsx
<OAuthFlowDiagram flow="authorizationCode" tokenUrl="…" authorizationUrl="…" scopes={[…]} />
```

### Client Credentials (server-to-server)

```tsx
<OAuthFlowDiagram flow="clientCredentials" tokenUrl="…" />
```

## Full source

```tsx
import { OAuthFlowDiagram } from '@/modules/domains/api-doc/OAuthFlowDiagram';
<OAuthFlowDiagram flow="authorizationCode" tokenUrl="…" authorizationUrl="…" scopes={[…]} />
```
