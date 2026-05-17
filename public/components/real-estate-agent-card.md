# AgentCard

- **id:** `real-estate-agent-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/real-estate/agent/AgentCard.tsx`
- **status:** stable
- **since:** 2026-05

Real estate agent profile card with avatar, contact info, bio, and listing count.

## Variants

### Full profile

```tsx
<AgentCard agent={agent} />
```

### Minimal (no bio, no phone)

```tsx
<AgentCard agent={{ agentId, name, email }} />
```

## Full source

```tsx
import { AgentCard } from '@/modules/domains/real-estate/agent/AgentCard';
<AgentCard agent={agent} />
```
