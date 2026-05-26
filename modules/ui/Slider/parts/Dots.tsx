'use client';
// modules/ui/Slider/parts/Dots.tsx
//
// Slide indicator strip. Active dot is wider (w-5) than the inactive ones (w-2)
// — matches the EJS sibling exactly.

import { cn } from '@/libs/utils/cn';

type DotsProps = {
  total: number;
  current: number;
  onSelect: (index: number) => void;
};

export function Dots({ total, current, onSelect }: DotsProps) {
  return (
    <div
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
      role="tablist"
      aria-label="Slide indicators"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
            i === current ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
          )}
        />
      ))}
    </div>
  );
}
