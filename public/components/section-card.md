# SectionCard

- **id:** `section-card`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/SectionCard.tsx`
- **status:** stable
- **since:** 2026-05

Başlıklı form bölüm kartı; alt çizgili başlık ve içerik alanı. Hesap sayfalarındaki ayarlar / şifre değiştirme gibi bölümler için.

## Variants

### Tek bölüm

```tsx
<SectionCard title="Preferences">
  <Input id="name" label="Display name" value={name} onChange={...} />
  <Toggle id="notify" label="Email notifications" checked={notify} onChange={setNotify} />
</SectionCard>
```

### Birden fazla bölüm

```tsx
<SectionCard title="Profile">
  <UserProfileForm ... />
</SectionCard>
<SectionCard title="Security">
  <ChangePasswordForm ... />
</SectionCard>
```

## Full source

```tsx
import { SectionCard } from '@/modules/app/SectionCard';

<SectionCard title="Preferences">
  <UserPreferencesForm ... />
</SectionCard>

<SectionCard title="Change Password">
  <ChangePasswordForm ... />
</SectionCard>
```
