# ApiKeyTokenCard

- **id:** `api-doc-api-key-token-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/ApiKeyTokenCard.tsx`
- **status:** stable
- **since:** 2026-05

Card for a single API key — reveal/hide, copy-to-clipboard, env badge, last-used metadata.

## Variants

### Production key

```tsx
<ApiKeyTokenCard name="Production key" token="sk_live_…" environment="production" scopes={[…]} />
```

### Staging key with revoke

```tsx
<ApiKeyTokenCard name="Staging key" token="sk_test_…" environment="staging" onRevoke={…} />
```

## Full source

```tsx
import { ApiKeyTokenCard } from '@/modules/domains/api-doc/ApiKeyTokenCard';
<ApiKeyTokenCard name="Production key" token="sk_live_…" environment="production" />
```
