'use client';
import { cn } from '@/libs/utils/cn';
import { ContextMenu } from '../../ContextMenu';
import type { ContextMenuItem } from '../../ContextMenu';
import { columnClasses, gapClasses, aspectClasses } from '../constants';
import type {
  GalleryAspect,
  GalleryColumns,
  GalleryGap,
  ImageGalleryImage,
  ReorderDragHandlers,
} from '../types';
import { GalleryItem } from './GalleryItem';

type GalleryGridProps = {
  images: ImageGalleryImage[];
  columns: GalleryColumns;
  aspect: GalleryAspect;
  gap: GalleryGap;
  reorderable: boolean;
  lightbox: boolean;
  showCaptions: boolean;
  dragFrom: number | null;
  dragOver: number | null;
  dragHandlers: ReorderDragHandlers;
  onOpenLightbox: (i: number) => void;
  buildMenuItems: (i: number) => ContextMenuItem[];
  className?: string;
};

export function GalleryGrid({
  images,
  columns,
  aspect,
  gap,
  reorderable,
  lightbox,
  showCaptions,
  dragFrom,
  dragOver,
  dragHandlers,
  onOpenLightbox,
  buildMenuItems,
  className,
}: GalleryGridProps) {
  const aspectIsAuto = aspect === 'auto';

  return (
    <div
      className={cn('grid', columnClasses[columns], gapClasses[gap], className)}
      role="list"
      aria-label="Image gallery"
    >
      {images.map((img, i) => {
        const isDragging = dragFrom === i;
        const isDropTarget = dragOver === i && dragFrom !== null && dragFrom !== i;

        const tile = (
          <GalleryItem
            image={img}
            index={i}
            aspectClass={aspectClasses[aspect]}
            aspectIsAuto={aspectIsAuto}
            reorderable={reorderable}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            lightbox={lightbox}
            showCaptions={showCaptions}
            onOpenLightbox={onOpenLightbox}
            dragHandlers={dragHandlers}
          />
        );

        return reorderable ? (
          <ContextMenu key={`${img.src}-${i}`} items={buildMenuItems(i)}>
            {tile}
          </ContextMenu>
        ) : (
          <div key={`${img.src}-${i}`}>{tile}</div>
        );
      })}
    </div>
  );
}
