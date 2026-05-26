'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { useLightboxKeyboard } from '../hooks/useLightboxKeyboard';
import type { ImageGalleryImage } from '../types';

type LightboxProps = {
  images: ImageGalleryImage[];
  activeIndex: number;
  zoomed: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (i: number) => void;
  onToggleZoom: () => void;
};

export function Lightbox({
  images,
  activeIndex,
  zoomed,
  onClose,
  onPrev,
  onNext,
  onSelectIndex,
  onToggleZoom,
}: LightboxProps) {
  useLightboxKeyboard({ open: true, onClose, onPrev, onNext });

  const activeImage = images[activeIndex];
  if (!activeImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white/70 text-sm tabular-nums select-none">
          {activeIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleZoom}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FontAwesomeIcon
              icon={zoomed ? faMagnifyingGlassMinus : faMagnifyingGlassPlus}
              aria-hidden="true"
            />
          </button>
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-14">
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          className={cn(
            'max-h-full max-w-full object-contain transition-transform duration-300 select-none',
            zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in',
          )}
          onClick={onToggleZoom}
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {activeImage.caption && (
        <p className="shrink-0 text-center text-white/80 text-sm px-6 py-2">{activeImage.caption}</p>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="shrink-0 flex gap-2 overflow-x-auto px-4 py-3 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelectIndex(i)}
              aria-label={`View ${img.alt}`}
              aria-pressed={i === activeIndex}
              className={cn(
                'shrink-0 w-12 h-12 rounded overflow-hidden transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                i === activeIndex
                  ? 'ring-2 ring-white opacity-100 scale-105'
                  : 'opacity-40 hover:opacity-70',
              )}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Backdrop click */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute inset-0 -z-10 cursor-default focus-visible:outline-none"
        tabIndex={-1}
      />
    </div>
  );
}
