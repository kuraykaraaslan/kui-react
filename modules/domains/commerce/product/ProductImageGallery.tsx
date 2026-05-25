'use client';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

export type ProductGalleryImage = {
  src: string;
  alt: string;
};

type ProductImageGalleryProps = {
  images: ProductGalleryImage[];
  /** How many thumbnails are visible before arrows appear */
  thumbsVisible?: number;
  /** Aspect ratio of the main image */
  aspect?: 'square' | 'video' | 'portrait';
  className?: string;
};

const aspectClasses = {
  square:   'aspect-square',
  video:    'aspect-video',
  portrait: 'aspect-[3/4]',
};

export function ProductImageGallery({
  images,
  thumbsVisible = 5,
  aspect = 'square',
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const needsSlider = images.length > thumbsVisible;
  const maxOffset = Math.max(0, images.length - thumbsVisible);

  const slidePrev = () => setThumbOffset((o) => Math.max(0, o - 1));
  const slideNext = () => setThumbOffset((o) => Math.min(maxOffset, o + 1));

  const activate = (index: number) => {
    setActiveIndex(index);
    // If the activated thumb would scroll out of view, shift the window
    if (index < thumbOffset) setThumbOffset(index);
    else if (index >= thumbOffset + thumbsVisible) setThumbOffset(index - thumbsVisible + 1);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* ── Main image ── */}
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden bg-surface-sunken',
          aspectClasses[aspect],
        )}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
              i === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0',
            )}
          />
        ))}

        {/* Counter badge */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white tabular-nums select-none">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="flex items-center gap-2" aria-label="Product images">
          {/* Prev arrow */}
          <button
            onClick={slidePrev}
            disabled={!needsSlider || thumbOffset === 0}
            aria-label="Previous thumbnails"
            className={cn(
              'shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary',
              'transition-colors hover:bg-surface-overlay hover:border-border-strong',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'disabled:opacity-0 disabled:pointer-events-none',
            )}
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" className="w-3 h-3" />
          </button>

          {/* Thumb track */}
          <div ref={stripRef} className="flex-1 overflow-hidden">
            <div
              className="flex gap-2 transition-transform duration-300"
              style={{ transform: `translateX(calc(-${thumbOffset} * (100% / ${thumbsVisible} + 0.5rem / ${thumbsVisible} * (${thumbsVisible} - 1))))` }}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => activate(i)}
                  onClick={() => activate(i)}
                  aria-label={`View image ${i + 1}: ${img.alt}`}
                  aria-pressed={i === activeIndex}
                  className={cn(
                    'shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    i === activeIndex
                      ? 'border-[var(--primary)] opacity-100 scale-[1.04]'
                      : 'border-transparent opacity-50 hover:opacity-80',
                  )}
                  style={{ width: `calc((100% - ${thumbsVisible - 1} * 0.5rem) / ${thumbsVisible})` }}
                >
                  <div className="aspect-square w-full">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={slideNext}
            disabled={!needsSlider || thumbOffset >= maxOffset}
            aria-label="Next thumbnails"
            className={cn(
              'shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary',
              'transition-colors hover:bg-surface-overlay hover:border-border-strong',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'disabled:opacity-0 disabled:pointer-events-none',
            )}
          >
            <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
