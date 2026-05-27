# MaintenancePage

- **id:** `maintenance-page`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/MaintenancePage.tsx`
- **status:** stable
- **since:** 2026-05

Full-page maintenance screen. Optional ETA countdown badge and external status-page link. Use for planned downtime or unplanned outages.

## Depends on

- `badge`

## Accessibility

- WCAG: AA
- ARIA patterns: role="status", aria-live="polite"

Screen reader announces the maintenance state via the live region; countdown updates without re-announcing.

## Design tokens consumed

- `--warning`
- `--primary`
- `--surface-base`
- `--text-primary`
- `--text-secondary`

## Variants

### Plain (no ETA)

```tsx
<MaintenancePage
  title="System Maintenance"
  description="We're performing a short maintenance."
/>
```

### With ETA + status link

```tsx
<MaintenancePage
  title="System Maintenance"
  description="We're shipping new features."
  eta={new Date(Date.now() + 45 * 60 * 1000)}
  statusUrl="https://status.example.com"
  statusLabel="Status Page"
/>
```

## Full source

```tsx
'use client';
import { MaintenancePage } from '@/modules/app/MaintenancePage';

<MaintenancePage
  title="System Maintenance"
  description="We're performing a short maintenance to improve service quality. We'll be back shortly."
  eta={new Date(Date.now() + 30 * 60 * 1000)}
  statusUrl="https://status.example.com"
/>
```
