# CardActionMenu

- **id:** `fintech-card-action-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/card/CardActionMenu.tsx`
- **status:** stable
- **since:** 2026-05

Three-dot menu with status-aware actions (freeze / unfreeze / show / limits / delete).

## Variants

### Active card menu

```tsx
<CardActionMenu status="active" onFreeze={...} onShowDetails={...} onUpdateLimits={...} onDelete={...} />
```

### Frozen card menu

```tsx
<CardActionMenu status="frozen" onUnfreeze={...} onShowDetails={...} />
```

## Full source

```tsx
import { CardActionMenu } from '@/modules/domains/fintech/card/CardActionMenu';
<CardActionMenu status="active" onFreeze={...} onShowDetails={...} onUpdateLimits={...} onDelete={...} />
```
