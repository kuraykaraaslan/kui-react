'use client';
// modules/ui/Slider/index.tsx
//
// Slider (Carousel) — M1.
//
// Pixel-identical EJS sibling at modules/ui/Slider/Slider.ejs.
//
// M1 scope (this file + parts/Track + hooks/useDrag + hooks/useAutoPlay):
//   - PointerEvent-based drag → works for touch, mouse, pen.
//   - `dragThreshold` prop (default 50 px).
//   - Velocity-based momentum (every 0.5 px/ms of release velocity adds an
//     extra slide of travel).
//   - Edge resistance (×0.4) at first/last when loop = false.
//
// TODO M2: slidesPerView / slidesToScroll / responsive / vertical / aspect lock.
// TODO M3: virtual loop, autoplay pause-on-hover, progress, fade transition.
// TODO M4: thumbnails, two-slider sync, parallax, lazy, 3D effects.
// TODO M5: full WAI-ARIA, keyboard nav, aria-live, messages, reduced motion.

import { useCallback, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Track } from './parts/Track';
import { Slide } from './parts/Slide';
import { Arrows } from './parts/Arrows';
import { Dots } from './parts/Dots';
import { useDrag } from './hooks/useDrag';
import { useAutoPlay } from './hooks/useAutoPlay';
import type { SliderProps } from './types';

const TRANSITION_MS = 350;

export function Slider({
  slides,
  autoPlay = false,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  loop = true,
  dragThreshold = 50,
  className,
  slideClassName,
  ariaLabel = 'Content slider',
}: SliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      const target = loop
        ? ((index % total) + total) % total
        : Math.max(0, Math.min(index, total - 1));
      if (target === current) return;
      setIsTransitioning(true);
      setCurrent(target);
      setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    },
    [current, isTransitioning, loop, total]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // M1 — pointer drag with momentum / edge resistance.
  const { dragState, handlers: dragHandlers } = useDrag({
    current,
    total,
    loop,
    dragThreshold,
    goTo,
  });

  // Autoplay (interval-based). Pause polish lives in M3.
  useAutoPlay({
    enabled: autoPlay,
    interval: autoPlayInterval,
    total,
    onTick: useCallback(() => {
      // Skip ticks while the user is actively dragging.
      if (dragState.isDragging) return;
      setCurrent((c) => (c + 1) % total);
    }, [dragState.isDragging, total]),
  });

  if (total === 0) return null;

  const canPrev = loop || current > 0;
  const canNext = loop || current < total - 1;

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl', className)}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      <Track
        current={current}
        isDragging={dragState.isDragging}
        offsetPx={dragState.offsetPx}
        pointerHandlers={dragHandlers}
      >
        {slides.map((slide, i) => {
          // Support both `ReactNode[]` and `{ id; content }[]`.
          const isObject =
            slide !== null &&
            typeof slide === 'object' &&
            'content' in (slide as { content?: unknown });
          const key = isObject ? (slide as { id: string }).id : i;
          const content = isObject ? (slide as { content: React.ReactNode }).content : slide;
          return (
            <Slide
              key={key}
              index={i}
              total={total}
              isActive={i === current}
              className={slideClassName}
            >
              {content as React.ReactNode}
            </Slide>
          );
        })}
      </Track>

      {showArrows && total > 1 && (
        <Arrows canPrev={canPrev} canNext={canNext} onPrev={prev} onNext={next} />
      )}

      {showDots && total > 1 && (
        <Dots total={total} current={current} onSelect={goTo} />
      )}
    </div>
  );
}

export type { SliderProps } from './types';
