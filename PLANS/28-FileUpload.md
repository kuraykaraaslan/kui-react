# FileInput + FileUploadSection — Geliştirme Planı (EJS Pariteli)

> NextJS: [FileInput.tsx](../modules/ui/FileInput.tsx) 197, [FileUploadSection.tsx](../modules/app/FileUploadSection.tsx) — ([FileUploadSection.tsx](../modules/app/FileUploadSection.tsx)).  
> EJS: [FileInput.ejs](../../02_EJS_Components/modules/ui/FileInput.ejs) 258. (EJS'te `FileUploadSection` yok — yeni ekleme.)

## Kuzey Yıldızı
Uppy + Dropzone + tus.io seviyesi: chunked/resumable upload, image preview + crop, paste from clipboard, drag from desktop, progress + retry, accessible.

---

## Hedef yapı
```
modules/ui/FileInput/
├── index.tsx           ← named export FileInput (low-level)
└── types.ts            ← FileItem, UploadStatus

modules/app/FileUploadSection/
├── index.tsx           ← high-level: zone + list + actions
├── parts/
│   ├── DropZone.tsx
│   ├── FileRow.tsx     ← thumbnail / progress / retry / remove
│   ├── ImagePreview.tsx
│   └── CropDialog.tsx
└── hooks/
    ├── useUploader.ts  ← chunked upload (Blob.slice) + resume + retry
    ├── usePaste.ts     ← clipboard image paste
    └── useThumbnail.ts ← image/video preview decode
```

### EJS paralel
- FileInput: mevcut. Geliştirmeler `partials/` + `scripts/` (chunker, paste, thumbnail).
- FileUploadSection: **yeni eklenecek** EJS bileşeni (parite kapanır).

---

## Milestone'lar

### M1 — Drag & drop + paste
- Drop zone: hover state, geçersiz dosya rozet.
- Paste from clipboard: image bytes (`event.clipboardData.items`).
- Drag from desktop (HTML5 native).
- `accept` MIME pattern + uzantı validasyonu.
- `maxSize` + `maxFiles` enforcement.

### M2 — Image preview + crop
- Thumbnail: `createImageBitmap` veya `<img>` decode.
- Video preview (ilk frame).
- PDF preview (pdf.js lazy, opsiyonel).
- Crop dialog: aspect ratio preset (1:1, 4:5, 16:9, free).
- Rotate (90° step) + flip.
- Output: `Blob` (yeni dosya, orijinal değiştirilmez).

### M3 — Chunked + resumable upload
- `Blob.slice(start, end)` chunked POST.
- Resume after network drop (localStorage state).
- Retry with exponential backoff.
- Concurrent uploads (`maxConcurrent: 3`).
- Bandwidth throttle (opsiyonel).
- Progress per file + total.

### M4 — Premium
- tus.io protocol desteği (server agnostik resumable).
- S3 multipart direct upload (presigned URL).
- Camera input (mobile `<input capture>`).
- Audio recording (`MediaRecorder API`).
- Drag-to-reorder list.

### M5 — A11y + i18n
- Klavye nav: Tab → "Choose file" button + her dosya satırı.
- Screen reader: "report.pdf, 2.4 MB, 47% uploaded".
- Error announce (aria-live).
- `messages` prop.
- Touch target ≥ 44×44 px.

---

## Public API
```ts
type FileInputProps = {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;          // bytes
  maxFiles?: number;
  onFiles: (files: File[]) => void;
  enablePaste?: boolean;
  enableCamera?: boolean;
  messages?: Partial<FileInputMessages>;
};

type FileUploadSectionProps = {
  files?: FileItem[];
  onFilesChange?: (files: FileItem[]) => void;
  upload?: {
    url: string;
    method?: 'POST' | 'PUT';
    chunkSize?: number;       // default 5 MB
    maxConcurrent?: number;
    headers?: Record<string, string>;
    protocol?: 'multipart' | 'tus' | 's3-multipart';
  };
  imageCrop?: boolean | { aspect?: number | 'free'; presets?: number[] };
  enablePaste?: boolean;
  enableCamera?: boolean;
  reorderable?: boolean;
  onTelemetry?: (e: UploadTelemetry) => void;
};
```

## Telemetri
`select`, `validate-fail`, `upload-start`, `progress`, `retry`, `complete`, `cancel`, `paste`, `crop-apply`.

## Perf
- Core ≤ 12 kB.
- Image crop dialog lazy +8 kB.
- tus.io adapter lazy +5 kB.

## DoD
- [ ] NextJS + EJS paralel (FileUploadSection.ejs **yeni** eklenecek).
- [ ] axe-core 0 violations.
- [ ] Resume after browser tab kapatıp açma testi yeşil.
- [ ] Showcase: drop / paste / crop / chunked / camera variant'ları.
