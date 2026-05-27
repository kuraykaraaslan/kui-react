# ShareDialog

- **id:** `share-dialog`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/ShareDialog.tsx`
- **status:** stable
- **since:** 2026-05

Share modal: copyable link, email invitation with permission picker, and a list of current invitees with permission/remove controls.

## Depends on

- `modal`
- `avatar`
- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
- Keyboard:
  - `Escape` — Close dialog
  - `Tab` — Cycle focus among interactive controls

## Design tokens consumed

- `--primary`
- `--surface-base`
- `--surface-raised`
- `--border`
- `--text-primary`
- `--text-secondary`

## Variants

### With invitees

```tsx
<ShareDialog
  open
  onClose={() => {}}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={[
    { id: '1', name: 'Alice Brooks',  email: 'alice@example.com', permission: 'owner' },
    { id: '2', name: 'Marcus Reed',   email: 'marcus@example.com', permission: 'editor' },
  ]}
/>
```

### Empty / link only

```tsx
<ShareDialog
  open
  onClose={() => {}}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={[]}
/>
```

## Full source

```tsx
'use client';
import { ShareDialog } from '@/modules/app/ShareDialog';

<ShareDialog
  open={open}
  onClose={() => setOpen(false)}
  shareUrl="https://app.example.com/docs/x4y9"
  invitees={invitees}
  onInvite={(email, perm) => addInvitee(email, perm)}
  onRemove={(id) => removeInvitee(id)}
  onPermissionChange={(id, p) => updatePermission(id, p)}
/>
```
