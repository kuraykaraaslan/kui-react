'use client';

/* ─── Public types ─────────────────────────────────────────────────────────── */

export type ImageGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type GalleryColumns = 2 | 3 | 4;
export type GalleryAspect = 'square' | 'video' | 'portrait' | 'auto';
export type GalleryGap = 'sm' | 'md' | 'lg';

export type ImageGalleryProps = {
  images: ImageGalleryImage[];
  columns?: GalleryColumns;
  aspect?: GalleryAspect;
  gap?: GalleryGap;
  lightbox?: boolean;
  showCaptions?: boolean;
  /** Enable drag-to-reorder and right-click context menu */
  reorderable?: boolean;
  /** Called with the new image array whenever order changes */
  onReorder?: (images: ImageGalleryImage[]) => void;
  /** Called when a user removes an image via the context menu */
  onRemove?: (index: number, image: ImageGalleryImage) => void;
  className?: string;
};

/* ─── Internal shared types ────────────────────────────────────────────────── */

export type ReorderDragHandlers = {
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDragLeave: () => void;
  onDrop: (i: number) => void;
  onDragEnd: () => void;
};
