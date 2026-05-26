'use client';
// modules/ui/Slider/parts/Arrows.tsx
//
// Prev/next navigation buttons. Pixel-identical to the EJS sibling
// — same Tailwind tokens, same FontAwesome icons.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

type ArrowsProps = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const ARROW_BTN = cn(
  'absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full',
  'bg-black/40 hover:bg-black/60 text-white',
  'flex items-center justify-center transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
);

export function Arrows({ canPrev, canNext, onPrev, onNext }: ArrowsProps) {
  return (
    <>
      {canPrev && (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous slide"
          className={cn(ARROW_BTN, 'left-3')}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next slide"
          className={cn(ARROW_BTN, 'right-3')}
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
    </>
  );
}
