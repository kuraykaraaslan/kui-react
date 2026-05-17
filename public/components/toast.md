# Toast

- **id:** `toast`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Toast.tsx`
- **status:** stable
- **since:** 2025-02

Zustand store üzerinden yönetilen bildirim sistemi. Hover'da dondurma, progress bar, title, actions, loading ve promise desteği.

## Variants

### Variants

```tsx
toast.success('Kaydedildi.');
toast.info('Güncelleme mevcut.');
toast.warning('Oturum sona eriyor.');
toast.error('Sunucu hatası.'); // persistent
```

### Title + Message

```tsx
toast.success('Dosya yüklendi.', { title: 'Yükleme tamamlandı' });
toast.error('Sunucuya bağlanılamadı.', { title: 'Bağlantı hatası' });
```

### Actions

```tsx
toast.info('Öğe silindi.', {
  title: 'Silindi',
  actions: [
    { label: 'Geri Al', onClick: (dismiss) => { undo(); dismiss(); } },
    { label: 'Kalıcı sil', onClick: (d) => { purge(); d(); }, variant: 'danger' },
  ],
});
```

### Loading & Promise

```tsx
// Loading state (persistent until updated)
toast.loading('İşleniyor...');

// Promise: auto-transitions loading → success/error
toast.promise(fetchData(), {
  loading: 'Yükleniyor...',
  success: (data) => `${data.name} hazır.`,
  error: 'Yüklenemedi.',
});
```

## Full source

```tsx
// Mount once at app root
<ToastProvider position="top-right" />

// Fire from anywhere
import { toast } from '@/modules/ui/Toast';

toast.success('Kaydedildi.');
toast.error('Hata oluştu.', { title: 'Bağlantı hatası' });
toast.loading('İşleniyor...');
toast.promise(fetchData(), {
  loading: 'Yükleniyor...',
  success: (d) => `${d.name} yüklendi.`,
  error:   'Yüklenemedi.',
});

// With actions
toast.info('Öğe silindi.', {
  actions: [
    { label: 'Geri Al', onClick: (dismiss) => { undo(); dismiss(); } },
    { label: 'Kalıcı sil', onClick: (d) => { purge(); d(); }, variant: 'danger' },
  ],
});

// Programmatic control
toast.update(id, { message: 'Güncellendi.' });
toast.dismiss(id);
const { clear } = useToastStore();
```
