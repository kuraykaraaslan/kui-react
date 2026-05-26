'use client';
import { useCallback, useRef, useState } from 'react';
import type { FieldType } from '../types';

/**
 * Tiny HTML5-native drag-drop helper.
 *
 * - Palette → canvas drops use MIME `application/x-fb-palette-type`.
 * - Canvas reorder drags use MIME `application/x-fb-canvas-index`.
 *
 * TODO M2: pointer / touch backend for mobile.
 * TODO M5: keyboard reorder (Ctrl+ArrowUp / Down) — emit announce events.
 */
export const MIME_PALETTE = 'application/x-fb-palette-type';
export const MIME_CANVAS  = 'application/x-fb-canvas-index';

export function useDragDrop() {
  const [dragSource, setDragSource] = useState<
    | { kind: 'palette'; type: FieldType }
    | { kind: 'canvas';  fromIndex: number }
    | null
  >(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // Mirror in a ref for safety inside drag handlers.
  const sourceRef = useRef(dragSource);
  sourceRef.current = dragSource;

  const onPaletteDragStart = useCallback(
    (e: React.DragEvent, type: FieldType) => {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData(MIME_PALETTE, type);
      setDragSource({ kind: 'palette', type });
    },
    [],
  );

  const onCardDragStart = useCallback(
    (e: React.DragEvent, fromIndex: number) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData(MIME_CANVAS, String(fromIndex));
      setDragSource({ kind: 'canvas', fromIndex });
    },
    [],
  );

  const onDragEnd = useCallback(() => {
    setDragSource(null);
    setDropIndex(null);
  }, []);

  const onSlotDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      const hasPalette = e.dataTransfer.types.includes(MIME_PALETTE);
      const hasCanvas  = e.dataTransfer.types.includes(MIME_CANVAS);
      if (!hasPalette && !hasCanvas) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = hasPalette ? 'copy' : 'move';
      setDropIndex(index);
    },
    [],
  );

  const onSlotDragLeave = useCallback(() => {
    setDropIndex(null);
  }, []);

  return {
    dragSource,
    dropIndex,
    onPaletteDragStart,
    onCardDragStart,
    onDragEnd,
    onSlotDragOver,
    onSlotDragLeave,
    setDropIndex,
  };
}
