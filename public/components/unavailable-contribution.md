# UnavailableContribution

- **id:** `unavailable-contribution`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/UnavailableContribution.tsx`
- **status:** stable
- **since:** 2026-10

Placeholder for a contribution that cannot be shown, for admins and editors (end users see nothing). Nine reasons (disabled, unentitled, blocked, retired, banned, quarantined, failed, missing, no-access), each with a default icon, tone and short text; four sizes (inline, card, tab, node); optional title, detail and action. Texts are overridable for i18n.

## Used by

- `widget-kit`

## Variants

### Card (dashboard widget, panel)

```tsx
<UnavailableContribution reason="disabled" action={{ label: 'Enable', onClick: enable }} />
<UnavailableContribution reason="unentitled" action={{ label: 'Upgrade', href: '/billing' }} />
```

### Inline (top bar, menu, every reason)

```tsx
<UnavailableContribution reason="blocked" size="inline" />
```

### Node (page-builder block, automation node)

```tsx
<UnavailableContribution reason="quarantined" size="node" title="Product carousel" action={{ label: 'Retry', onClick: retry }} />
```

### Tab panel

```tsx
<UnavailableContribution reason="no-access" size="tab" />
```

## Full source

```tsx
import { UnavailableContribution } from '@/modules/ui/UnavailableContribution';

<UnavailableContribution
  reason="disabled"            // disabled | unentitled | blocked | retired | banned | quarantined | failed | missing | no-access
  size="card"                  // inline | card | tab | node
  title="Call log"             // optional: what is unavailable
  label={t('ext.disabled')}    // optional: overrides the reason text
  detail={t('ext.disabled.detail')}
  action={{ label: t('ext.enable'), onClick: enable }}
/>
```
