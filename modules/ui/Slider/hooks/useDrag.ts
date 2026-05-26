// modules/ui/Slider/hooks/useDrag.ts
//
// M1 — Pointer-based drag with velocity momentum and edge resistance.
//
// Single PointerEvent-based handler covers touch + mouse + pen. We track
// the offset live so the Track can render mid-drag, then on pointerup we
// decide how many slides to advance based on:
//   1. distance traveled (must exceed `dragThreshold`)
//   2. flick velocity (deltaX / deltaT) at release time — every 0.5 px/ms
//      of velocity adds one extra slide to the navigation step.
//
// When `loop === false` and the user drags past the first/last slide, the
// reported offset is multiplied by EDGE_RESISTANCE so the track visibly
// "rubber-bands" but never escapes its bounds.
//
// TODO M2: vertical orientation (swap deltaX↔deltaY).
// TODO M3: pointer-cancel handling for autoplay loops.
// TODO M5: respect `prefers-reduced-motion` (skip momentum, snap instantly).

import { useCallback, useRef, useState } from 'react';
import type { DragState } from '../types';

/** Each 0.5 px/ms of release velocity adds one extra slide to the step. */
const VELOCITY_PER_EXTRA_SLIDE = 0.5;
/** Multiplier applied to the live offset when dragging past a hard edge. */
const EDGE_RESISTANCE = 0.4;
/** Ignore pointer samples older than this many ms when computing velocity. */
const VELOCITY_SAMPLE_WINDOW_MS = 100;

type UseDragArgs = {
  current: number;
  total: number;
  loop: boolean;
  dragThreshold: number;
  goTo: (index: number) => void;
};

type PointerSample = { x: number; t: number };

export function useDrag({
  current,
  total,
  loop,
  dragThreshold,
  goTo,
}: UseDragArgs) {
  const [dragState, setDragState] = useState<DragState>({
    offsetPx: null,
    trackWidth: 0,
    isDragging: false,
  });

  // Mutable drag-scoped refs (so handlers see latest values without rerenders).
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);
  const trackWidthRef = useRef(0);
  const samplesRef = useRef<PointerSample[]>([]);
  const activePointerRef = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Ignore secondary mouse buttons (right-click / middle-click).
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (total <= 1) return;

      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      trackWidthRef.current = rect.width;
      startXRef.current = e.clientX;
      startTimeRef.current = e.timeStamp;
      samplesRef.current = [{ x: e.clientX, t: e.timeStamp }];
      activePointerRef.current = e.pointerId;

      // Capture so we keep getting move/up events even if the pointer
      // leaves the element.
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        /* Some test envs don't implement setPointerCapture. */
      }

      setDragState({
        offsetPx: 0,
        trackWidth: rect.width,
        isDragging: true,
      });
    },
    [total]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerRef.current !== e.pointerId) return;

      let delta = e.clientX - startXRef.current;

      // Edge resistance: dampen drag past the first/last slide in non-loop mode.
      if (!loop) {
        const atFirst = current === 0 && delta > 0;
        const atLast = current === total - 1 && delta < 0;
        if (atFirst || atLast) delta *= EDGE_RESISTANCE;
      }

      // Trim old samples outside the velocity window.
      const now = e.timeStamp;
      samplesRef.current.push({ x: e.clientX, t: now });
      while (
        samplesRef.current.length > 1 &&
        now - samplesRef.current[0].t > VELOCITY_SAMPLE_WINDOW_MS
      ) {
        samplesRef.current.shift();
      }

      setDragState((s) => ({ ...s, offsetPx: delta }));
    },
    [current, loop, total]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointerRef.current !== e.pointerId) return;
      activePointerRef.current = null;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignored */
      }

      const samples = samplesRef.current;
      const last = samples[samples.length - 1] ?? { x: e.clientX, t: e.timeStamp };
      const first = samples[0] ?? last;

      const totalDelta = e.clientX - startXRef.current;
      const dt = Math.max(1, last.t - first.t);
      const velocity = (last.x - first.x) / dt; // px per ms, signed

      const distance = Math.abs(totalDelta);
      const direction = totalDelta < 0 ? 1 : -1; // 1 = next, -1 = prev

      // Reset visual drag state first so the snap animation runs cleanly.
      setDragState({ offsetPx: null, trackWidth: 0, isDragging: false });
      samplesRef.current = [];

      if (distance < dragThreshold && Math.abs(velocity) < VELOCITY_PER_EXTRA_SLIDE) {
        // Below threshold and no flick → snap back.
        return;
      }

      // Base step = 1 slide if threshold passed; otherwise rely on velocity below.
      let step = distance >= dragThreshold ? 1 : 0;

      // Momentum: every VELOCITY_PER_EXTRA_SLIDE px/ms of release velocity
      // adds another slide of travel in the flick direction.
      const flickDir = velocity < 0 ? 1 : -1;
      const flickStep = Math.floor(Math.abs(velocity) / VELOCITY_PER_EXTRA_SLIDE);

      let signedStep = direction * step;
      if (flickStep > 0 && flickDir === direction) {
        signedStep = direction * (step + flickStep);
      } else if (flickStep > 0 && step === 0) {
        // Threshold not met but flick is strong enough on its own.
        signedStep = flickDir * flickStep;
      }

      if (signedStep === 0) return;
      goTo(current + signedStep);
    },
    [current, dragThreshold, goTo]
  );

  return {
    dragState,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
