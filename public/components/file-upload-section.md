# FileUploadSection

- **id:** `file-upload-section`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FileUploadSection/index.tsx`
- **status:** stable
- **since:** 2026-05

High-level upload organism: drop zone + file list + remove. M1 implements drag/drop, paste-from-clipboard, accept-pattern + maxSize + maxFiles validation. M2 will add image thumbnails + crop dialog; M3 chunked + resumable uploads. Pixel-identical EJS sibling at modules/app/FileUploadSection/FileUploadSection.ejs.

## Variants

### Basic drop zone

```tsx
<FileUploadSection title="Project attachments" hint="PDF, images up to 5 MB each"
  multiple accept="image/*,.pdf" maxSizeBytes={5242880} />
```

### Paste from clipboard

```tsx
<FileUploadSection title="Bug report screenshots" multiple enablePaste
  accept="image/*" maxFiles={5} maxSizeBytes={4 * 1024 * 1024}
  hint="Drop, browse, or paste (Cmd/Ctrl + V while focused)" />
```

## Full source

```tsx
'use client';
import { FileUploadSection } from '@/modules/app/FileUploadSection';

export function Demo() {
  return (
    <FileUploadSection
      title="Project attachments"
      hint="Drop files or paste a screenshot"
      multiple
      enablePaste
      accept="image/*,.pdf"
      maxFiles={6}
      maxSizeBytes={5 * 1024 * 1024}
    />
  );
}
```
