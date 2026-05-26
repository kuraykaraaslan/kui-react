'use client';
// modules/ui/Slider/parts/Track.tsx
//
// The transform-based scroller. Wraps the slide list and is the
// pointer-event target (so the user can grab anywhere on the visible
// area to drag).
//
// During an active drag the inline transform is composed from:
//   `translateX(-current * 100%)` + `translateX(${offsetPx}px)`
// and the CSS transition is disabled so the track follows the finger
// 1:1. On pointerup the inline offset is cleared and the transition
// is re-enabled so the snap animation runs.

import { cn } from '@/libs/utils/cn';

type TrackProps = {
  current: number;
  isDragging: boolean;
  offsetPx: number | null;
  pointerHandlers: {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  };
  children: React.ReactNode;
};

export function Track({
  current,
  isDragging,
  offsetPx,
  pointerHandlers,
  children,
}: TrackProps) {
  const baseTransform = `translateX(-${current * 100}%)`;
  const transform =
    offsetPx != null ? `${baseTransform} translateX(${offsetPx}px)` : baseTransform;

  return (
    <div
      className={cn(
        'flex ease-in-out will-change-transform',
        // While dragging we want zero animation; otherwise use the standard 350 ms snap.
        isDragging ? 'transition-none' : 'transition-transform duration-350',
        // `touch-pan-y` lets vertical page scrolls pass through but reserves
        // horizontal gestures for the slider drag handler.
        'touch-pan-y select-none',
        isDragging && 'cursor-grabbing'
      )}
      style={{ transform }}
      {...pointerHandlers}
    >
      {children}
    </div>
  );
}
