'use client';
import { useState, useCallback } from 'react';
import type { ImageGalleryImage, ReorderDragHandlers } from '../types';

type UseReorderArgs = {
  images: ImageGalleryImage[];
  setImages: (images: ImageGalleryImage[]) => void;
  onReorder?: (images: ImageGalleryImage[]) => void;
};

type UseReorderResult = {
  dragFrom: number | null;
  dragOver: number | null;
  handlers: ReorderDragHandlers;
  moveToIndex: (from: number, to: number) => void;
  removeAt: (i: number, onRemove?: (index: number, image: ImageGalleryImage) => void) => void;
};

export function useReorder({ images, setImages, onReorder }: UseReorderArgs): UseReorderResult {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const onDragStart = useCallback((i: number) => setDragFrom(i), []);

  const onDragOver = useCallback(
    (e: React.DragEvent, i: number) => {
      e.preventDefault();
      if (i !== dragFrom) setDragOver(i);
    },
    [dragFrom],
  );

  const onDragLeave = useCallback(() => setDragOver(null), []);

  const onDrop = useCallback(
    (dropIdx: number) => {
      if (dragFrom === null || dragFrom === dropIdx) {
        setDragFrom(null);
        setDragOver(null);
        return;
      }
      const next = [...images];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(dropIdx, 0, moved);
      setImages(next);
      onReorder?.(next);
      setDragFrom(null);
      setDragOver(null);
    },
    [dragFrom, images, onReorder, setImages],
  );

  const onDragEnd = useCallback(() => {
    setDragFrom(null);
    setDragOver(null);
  }, []);

  const moveToIndex = useCallback(
    (from: number, to: number) => {
      const next = [...images];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      setImages(next);
      onReorder?.(next);
    },
    [images, onReorder, setImages],
  );

  const removeAt = useCallback(
    (i: number, onRemove?: (index: number, image: ImageGalleryImage) => void) => {
      onRemove?.(i, images[i]);
      const next = images.filter((_, idx) => idx !== i);
      setImages(next);
      onReorder?.(next);
    },
    [images, onReorder, setImages],
  );

  return {
    dragFrom,
    dragOver,
    handlers: { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd },
    moveToIndex,
    removeAt,
  };
}
