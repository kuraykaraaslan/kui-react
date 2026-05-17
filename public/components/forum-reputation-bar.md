# ReputationBar

- **id:** `forum-reputation-bar`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/forum/user/ReputationBar.tsx`
- **status:** stable
- **since:** 2026-05

Progress bar with tiered milestones showing the user's reputation and distance to the next tier.

## Variants

### Mid-tier (Veteran)

```tsx
<ReputationBar reputation={4280} />
```

### Max tier reached

```tsx
<ReputationBar reputation={9200} />
```

## Full source

```tsx
import { ReputationBar } from '@/modules/domains/forum/user/ReputationBar';
<ReputationBar reputation={4280} />
```
