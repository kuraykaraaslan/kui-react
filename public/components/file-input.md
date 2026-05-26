# FileInput

- **id:** `file-input`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/FileInput/index.tsx`
- **status:** stable
- **since:** 2025-02

Drag-and-drop file upload with validation, file list, and individual remove actions. M1 adds paste-from-clipboard, `accept` MIME-pattern + extension validation, and `maxFiles` enforcement with i18n messages. Pixel-identical EJS sibling at modules/ui/FileInput/FileInput.ejs.

## Variants

### Single file

```tsx
<FileInput id="photo" label="Profile photo" hint="PNG or JPG, max 2 MB"
  accept="image/*" maxSizeBytes={2097152} />
```

### Multiple files

```tsx
<FileInput id="attachments" label="Attachments" multiple hint="Up to 5 MB each" maxSizeBytes={5242880} />
```

### With upload action

```tsx
<FileInput id="attachments" label="Project attachments" multiple maxSizeBytes={5242880}
  onUpload={uploadFiles} uploadLabel="Upload" />
```

### Paste from clipboard

```tsx
<FileInput id="screenshots" label="Screenshot drop" multiple enablePaste
  accept="image/*" maxFiles={4} maxSizeBytes={4 * 1024 * 1024}
  hint="Drop, browse, or paste a screenshot (Cmd/Ctrl + V)." />
```

### Disabled

```tsx
<FileInput id="upload" label="Disabled upload" disabled />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useRef, useState, useEffect } from 'react';

export function FileInput({ id, label, multiple, accept, maxSizeBytes, maxFiles, allowedTypes, disabled, enablePaste, onFiles, onUpload, messages }) {
  // drag-and-drop + browse + paste, validates size/type/count, lists files with errors
}
```
