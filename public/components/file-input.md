# FileInput

- **id:** `file-input`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/FileInput.tsx`
- **status:** stable
- **since:** 2025-02

Drag-and-drop file upload with validation, file list, and individual remove actions.

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

### Disabled

```tsx
<FileInput id="upload" label="Disabled upload" disabled />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useRef, useState } from 'react';

export function FileInput({ id, label, multiple, accept, maxSizeBytes, allowedTypes, disabled }) {
  // drag-and-drop + browse, validates size/type, lists files with errors
}
```
