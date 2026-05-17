# UserPreferencesForm

- **id:** `common-user-preferences-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserPreferencesForm.tsx`
- **status:** stable
- **since:** 2025-04

Preferences form with theme and language selects plus email/push notification and newsletter toggles.

## Variants

### Defaults

```tsx
<UserPreferencesForm onSubmit={handleSave} />
```

### Pre-filled

```tsx
<UserPreferencesForm initial={{ theme: 'DARK', language: 'tr', emailNotifications: false }} onSubmit={handleSave} />
```

## Full source

```tsx
'use client';
import { UserPreferencesForm } from '@/modules/domains/common/user/UserPreferencesForm';

<UserPreferencesForm
  initial={currentUser.userPreferences}
  onSubmit={async (prefs) => savePreferences(prefs)}
/>
```
