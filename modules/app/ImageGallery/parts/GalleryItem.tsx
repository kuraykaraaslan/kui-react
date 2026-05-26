'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { ImageGalleryImage, ReorderDragHandlers } from '../types';

type GalleryItemProps = {
  image: ImageGalleryImage;
  index: number;
  aspectClass: string;
  aspectIsAuto: boolean;
  reorderable: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  lightbox: boolean;
  showCaptions: boolean;
  onOpenLightbox: (i: number) => void;
  dragHandlers: ReorderDragHandlers;
};

export function GalleryItem({
  image,
  index,
  aspectClass,
  aspectIsAuto,
  reorderable,
  isDragging,
  isDropTarget,
  lightbox,
  showCaptions,
  onOpenLightbox,
  dragHandlers,
}: GalleryItemProps) {
  return (
    <div
      role="listitem"
      draggable={reorderable}
      onDragStart={reorderable ? () => dragHandlers.onDragStart(index) : undefined}
      onDragOver={reorderable ? (e) => dragHandlers.onDragOver(e, index) : undefined}
      onDragLeave={reorderable ? dragHandlers.onDragLeave : undefined}
      onDrop={reorderable ? () => dragHandlers.onDrop(index) : undefined}
      onDragEnd={reorderable ? dragHandlers.onDragEnd : undefined}
      className={cn(
        'group relative overflow-hidden rounded-lg bg-surface-sunken transition-all duration-200',
        !aspectIsAuto && aspectClass,
        reorderable && 'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40 scale-95 ring-2 ring-[var(--primary)] ring-inset',
        isDropTarget && 'ring-2 ring-[var(--primary)] shadow-lg scale-[1.02]',
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        draggable={false}
        className={cn(
          'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
          aspectIsAuto && 'aspect-square',
          isDragging && 'pointer-events-none',
        )}
      />

      {/* Drag handle badge */}
      {reorderable && (
        <div
          aria-hidden="true"
          className="absolute top-1.5 left-1.5 z-10 w-6 h-6 flex items-center justify-center rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <FontAwesomeIcon icon={faGripVertical} className="w-3 h-3" />
        </div>
      )}

      {/* Hover overlay → open lightbox */}
      {lightbox && (
        <button
          onClick={() => onOpenLightbox(index)}
          aria-label={`Open ${image.alt} in lightbox`}
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-2',
            'bg-black/0 group-hover:bg-black/40 transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset',
          )}
        >
          <FontAwesomeIcon
            icon={faExpand}
            aria-hidden="true"
            className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
          />
          {image.caption && (
            <span className="text-white text-xs font-medium px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 drop-shadow-md">
              {image.caption}
            </span>
          )}
        </button>
      )}

      {/* Static caption */}
      {showCaptions && image.caption && (
        <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1 line-clamp-1 pointer-events-none">
          {image.caption}
        </p>
      )}
    </div>
  );
}
