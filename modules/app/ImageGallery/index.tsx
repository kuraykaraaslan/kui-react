'use client';
import { useState, useEffect, useCallback } from 'react';
import { GalleryGrid } from './parts/GalleryGrid';
import { Lightbox } from './parts/Lightbox';
import { useReorder } from './hooks/useReorder';
import { useContextMenu } from './hooks/useContextMenu';
import type { ImageGalleryImage, ImageGalleryProps } from './types';

export type { ImageGalleryImage, ImageGalleryProps } from './types';

export function ImageGallery({
  images: imagesProp,
  columns = 3,
  aspect = 'square',
  gap = 'md',
  lightbox = true,
  showCaptions = false,
  reorderable = false,
  onReorder,
  onRemove,
  className,
}: ImageGalleryProps) {
  /* — Image order state — */
  const [images, setImages] = useState<ImageGalleryImage[]>(imagesProp);
  useEffect(() => {
    setImages(imagesProp);
  }, [imagesProp]);

  /* — Lightbox state — */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const isOpen = activeIndex !== null;

  const openLightbox = useCallback((i: number) => {
    setActiveIndex(i);
    setZoomed(false);
  }, []);
  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setZoomed(false);
  }, []);
  const prevImage = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    setZoomed(false);
  }, [images.length]);
  const nextImage = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
    setZoomed(false);
  }, [images.length]);
  const selectIndex = useCallback((i: number) => {
    setActiveIndex(i);
    setZoomed(false);
  }, []);
  const toggleZoom = useCallback(() => setZoomed((z) => !z), []);

  /* — Drag-and-drop reorder + helpers — */
  const { dragFrom, dragOver, handlers, moveToIndex, removeAt } = useReorder({
    images,
    setImages,
    onReorder,
  });

  /* — Context menu — */
  const { buildItems } = useContextMenu({
    images,
    openLightbox,
    moveToIndex,
    removeAt: (i: number) => removeAt(i, onRemove),
  });

  return (
    <>
      <GalleryGrid
        images={images}
        columns={columns}
        aspect={aspect}
        gap={gap}
        reorderable={reorderable}
        lightbox={lightbox}
        showCaptions={showCaptions}
        dragFrom={dragFrom}
        dragOver={dragOver}
        dragHandlers={handlers}
        onOpenLightbox={openLightbox}
        buildMenuItems={buildItems}
        className={className}
      />

      {lightbox && isOpen && (
        <Lightbox
          images={images}
          activeIndex={activeIndex}
          zoomed={zoomed}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          onSelectIndex={selectIndex}
          onToggleZoom={toggleZoom}
        />
      )}
    </>
  );
}
