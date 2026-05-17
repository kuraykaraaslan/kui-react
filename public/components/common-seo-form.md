# SeoForm

- **id:** `common-seo-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/seo/SeoForm.tsx`
- **status:** stable
- **since:** 2025-04

SEO metadata form: title (60 char limit), meta description (160 char limit), and keyword tag input with character counters.

## Variants

### Empty

```tsx
<SeoForm onSubmit={handleSave} />
```

### Pre-filled

```tsx
<SeoForm initial={{ seoTitle: 'My Page', seoDescription: 'Short desc', keywords: ['next', 'react'] }} onSubmit={handleSave} onCancel={handleCancel} />
```

## Full source

```tsx
<SeoForm
  initial={{ seoTitle: 'My Page', seoDescription: 'Description…', keywords: ['next', 'react'] }}
  onSubmit={async (seo) => saveSeo(seo)}
  onCancel={() => setEditing(false)}
/>
```
