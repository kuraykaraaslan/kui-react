'use client';
import { useCallback } from 'react';
import type { CalendarTelemetry, Event } from '../types';
import { dateAtMinute, minutesIntoDay } from '../date-utils';
import { useCalStore, useCalStoreApi } from '../store';
import { snapMinutes, yToMinutes } from './dragMath';

type Options = {
  slotMinutes: number;
  onEventUpdate?: (e: Event) => void | Promise<void>;
  onTelemetry?: (e: CalendarTelemetry) => void;
};

/**
 * Drag the bottom edge of a timed event to extend / shrink it.
 * Returns a factory that produces the handle's `onPointerDown` handler.
 */
export function useResize({ slotMinutes, onEventUpdate, onTelemetry }: Options) {
  const setDrag = useCalStore((s) => s.setDrag);
  const storeApi = useCalStoreApi();

  return useCallback(
    (event: Event) => (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      const col = e.currentTarget.closest<HTMLElement>('[data-cal-day-index]');
      if (!col) return;

      const day = new Date(event.start);
      const minStartMin = minutesIntoDay(event.start);

      function update(clientY: number) {
        if (!col) return;
        const rect = col.getBoundingClientRect();
        const rawMin = yToMinutes(clientY - rect.top, rect.height);
        // Snap then clamp to at least one slot beyond start.
        let endMin = snapMinutes(rawMin, slotMinutes) + slotMinutes;
        endMin = Math.max(minStartMin + slotMinutes, Math.min(24 * 60, endMin));
        setDrag({ kind: 'resize', eventId: event.id, ghostEnd: dateAtMinute(day, endMin) });
      }

      function onMove(ev: PointerEvent) {
        update(ev.clientY);
      }

      function onUp(ev: PointerEvent) {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('keydown', onKey, true);

        const drag = storeApi.getState().drag;
        setDrag({ kind: 'idle' });
        if (drag.kind !== 'resize' || drag.eventId !== event.id) return;
        if (drag.ghostEnd.getTime() === event.end.getTime()) return;
        ev.preventDefault();
        onEventUpdate?.({ ...event, end: drag.ghostEnd });
        onTelemetry?.({ type: 'event-update', eventId: event.id });
      }

      function onKey(ev: KeyboardEvent) {
        if (ev.key !== 'Escape') return;
        ev.preventDefault();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('keydown', onKey, true);
        setDrag({ kind: 'idle' });
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('keydown', onKey, true);
    },
    [slotMinutes, onEventUpdate, onTelemetry, setDrag, storeApi],
  );
}
