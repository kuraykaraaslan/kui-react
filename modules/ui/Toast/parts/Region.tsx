'use client';
// modules/ui/Toast/parts/Region.tsx
//
// Position-aware fixed container that hosts a single stack of toasts.
// One region per slot is rendered by <Toaster>, so different toasts can
// target different corners simultaneously via per-toast `position` overrides.

import { cn } from '@/libs/utils/cn';
import type { ToastItem as ToastItemT, ToastPosition } from '../types';
import { ToastItem } from './ToastItem';

const positionMap: Record<ToastPosition, string> = {
  'top-right':     'top-4 right-4 items-end',
  'top-left':      'top-4 left-4 items-start',
  'top-center':    'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right':  'bottom-4 right-4 items-end',
  'bottom-left':   'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export type RegionProps = {
  position: ToastPosition;
  items: ToastItemT[];
  onRemove: (id: string) => void;
  /** Gap between stacked toasts (Tailwind unit, e.g. 2 = 0.5rem). */
  gap?: number;
  reducedMotion?: boolean;
  className?: string;
};

export function Region({
  position,
  items,
  onRemove,
  gap = 2,
  reducedMotion,
  className,
}: RegionProps) {
  // `bottom-*` regions reverse so newest toasts sit closest to the screen edge
  // — pushing older ones up. `top-*` regions append newest at the bottom of
  // the stack, pushing older ones down (stack animation).
  const ordered = position.startsWith('bottom') ? [...items].reverse() : items;

  return (
    <div
      className={cn(
        'fixed z-[90] flex flex-col pointer-events-none',
        positionMap[position],
        className,
      )}
      style={{ gap: `${gap * 0.25}rem` }}
    >
      {ordered.map((t) => (
        <ToastItem
          key={t.id}
          item={t}
          position={position}
          reducedMotion={reducedMotion}
          onRemove={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
}
