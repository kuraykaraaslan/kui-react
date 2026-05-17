# StatsBar

- **id:** `landing-stats-bar`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/stat/StatsBar.tsx`
- **status:** stable
- **since:** 2026-05

Social proof stats display in two variants. band renders a full-width <dl> grid with dividers; cards renders a grid of bordered stat cards.

## Variants

### Band variant

```tsx
<StatsBar stats={stats} variant="band" />
```

### Cards variant

```tsx
<StatsBar stats={stats} variant="cards" />
```

## Full source

```tsx
'use client';
import { StatsBar } from '@/modules/domains/landing/stat/StatsBar';

// Full-width band (default)
<StatsBar stats={stats} />

// Card grid
<StatsBar stats={stats} variant="cards" />
```
