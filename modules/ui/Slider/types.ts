// modules/ui/Slider/types.ts
//
// Shared types for the Slider (Carousel) module.
//
// See PLANS/29-Slider-Carousel.md for the milestone roadmap.
// TODO M2: add slidesPerView, slidesToScroll, breakpoints, orientation, aspect.
// TODO M3: add autoPlayDirection, pauseOnHover, showProgress, effect (fade/...).
// TODO M4: add showThumbnails (mini-track), lazy, parallax, effect (coverflow/cards/cube).
// TODO M5: add messages (i18n), onSlideChange, SliderRef imperative API.

import type React from 'react';

export type Slide = React.ReactNode | { id: string; content: React.ReactNode };

export type SliderProps = {
  /** Slides to render. Plain ReactNodes (key auto) or objects with explicit id. */
  slides: Slide[];

  // ── Autoplay ────────────────────────────────────────────────────────────
  autoPlay?: boolean;
  autoPlayInterval?: number;

  // ── Controls ────────────────────────────────────────────────────────────
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;

  // ── Drag (M1) ───────────────────────────────────────────────────────────
  /**
   * Minimum horizontal pointer travel (in px) required to count as a swipe.
   * Below this threshold the gesture is treated as a tap/no-op and the
   * track snaps back to the current slide. Default 50.
   */
  dragThreshold?: number;

  // ── Styling ─────────────────────────────────────────────────────────────
  className?: string;
  slideClassName?: string;

  // ── A11y ────────────────────────────────────────────────────────────────
  ariaLabel?: string;
};

/** Internal drag state passed between useDrag and the Track. */
export type DragState = {
  /**
   * Live drag offset in pixels (negative = swiping left/next).
   * `null` when no drag is in progress.
   */
  offsetPx: number | null;
  /** Width of the slider viewport, captured at pointerdown. */
  trackWidth: number;
  /** True while the user is actively dragging. */
  isDragging: boolean;
};
