# ImageGallery

- **id:** `image-gallery`
- **layer:** app
- **category:** Organism
- **filePath:** `modules/app/ImageGallery.tsx`
- **status:** stable
- **since:** 2026-05

Responsive image grid with a full-screen lightbox, right-click context menu (open, copy URL, move to first/last, remove), and drag-to-reorder. Supports 2–4 columns, square / video / portrait / auto aspect ratios, optional captions, zoom toggle, thumbnail strip, and full keyboard navigation (← → Escape).

## Variants

### Reorderable — drag + right-click menu

```tsx
<ImageGallery
  images={images}
  columns={3}
  aspect="square"
  gap="md"
  reorderable
  onReorder={(next) => setImages(next)}
  onRemove={(idx, img) => console.log('removed', img.alt)}
/>
```

### 3-column grid — lightbox only

```tsx
<ImageGallery
  images={images}
  columns={3}
  aspect="square"
  gap="md"
  lightbox
/>
```

### 2-column with captions

```tsx
<ImageGallery
  images={images}
  columns={2}
  aspect="video"
  gap="lg"
  showCaptions
  lightbox
/>
```

### 4-column compact

```tsx
<ImageGallery
  images={images}
  columns={4}
  aspect="square"
  gap="sm"
  lightbox
/>
```

## Full source

```tsx
'use client';
import { ImageGallery } from '@/modules/app/ImageGallery';

const images = [
  { src: '/photo-1.jpg', alt: 'Mountain', caption: 'Sunrise over the Alps' },
  { src: '/photo-2.jpg', alt: 'Ocean',    caption: 'Golden hour' },
  { src: '/photo-3.jpg', alt: 'Forest',   caption: 'Morning mist' },
];

// Basic — lightbox only
<ImageGallery images={images} columns={3} aspect="square" />

// Editable — right-click menu + drag reorder
<ImageGallery
  images={images}
  columns={3}
  reorderable
  onReorder={(next) => setImages(next)}
  onRemove={(idx, img) => console.log('removed', img.alt)}
/>
```
