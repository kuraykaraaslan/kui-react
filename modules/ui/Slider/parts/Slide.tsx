'use client';
// modules/ui/Slider/parts/Slide.tsx
//
// Per-slide wrapper. Owns the WAI-ARIA `group` role + `aria-roledescription="slide"`
// plus the `aria-hidden` flag toggled by the parent.
//
// TODO M4: lazy mount — only render children when the slide is within the
// configured neighbour window of `current`.

import { cn } from '@/libs/utils/cn';

type SlideProps = {
  index: number;
  total: number;
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Slide({ index, total, isActive, className, children }: SlideProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${total}`}
      aria-hidden={!isActive}
      className={cn('w-full shrink-0', className)}
    >
      {children}
    </div>
  );
}
