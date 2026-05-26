// modules/ui/DatePicker/hooks/useKeyboardNav.ts
//
// Keyboard map (WAI-ARIA APG Date Picker dialog pattern):
//   ArrowLeft  → previous day
//   ArrowRight → next day
//   ArrowUp    → previous week
//   ArrowDown  → next week
//   PageUp     → previous month
//   PageDown   → next month
//   Shift+PageUp   → previous year
//   Shift+PageDown → next year
//   Home       → start of the visible week (respects locale weekStartsOn)
//   End        → end of the visible week
//   Enter / Space → select focused day
//   Escape     → close the popover
//
// TODO M5: announce navigation in an `aria-live` region for screen readers.

import { addDays, addMonths, addYears, clampToBounds, isDisabled } from './useDateFns';
import type { DisabledDates } from '../types';

export type CalendarKeyResult = {
  /** New focus date after the key event (already clamped to [min,max]). */
  focus: Date;
  /** True when the focus day moved into a different month. */
  monthChanged: boolean;
  /** True when the user pressed Enter/Space and the date is selectable. */
  shouldSelect: boolean;
  /** True when the user pressed Escape. */
  shouldClose: boolean;
};

export type CalendarKeyOpts = {
  current: Date;
  weekStartsOn: 0 | 1;
  min?: Date;
  max?: Date;
  disabledDates?: DisabledDates;
};

/**
 * Pure function — handles a single keyboard event against the currently
 * focused calendar day. Returns the next state; the caller decides what to
 * do with `shouldSelect` / `shouldClose`.
 */
export function handleCalendarKey(
  e: { key: string; shiftKey?: boolean; preventDefault?: () => void },
  opts: CalendarKeyOpts,
): CalendarKeyResult | null {
  const { current, weekStartsOn, min, max, disabledDates } = opts;
  let next: Date | null = null;
  let shouldSelect = false;
  let shouldClose = false;

  switch (e.key) {
    case 'ArrowLeft':
      next = addDays(current, -1);
      break;
    case 'ArrowRight':
      next = addDays(current, 1);
      break;
    case 'ArrowUp':
      next = addDays(current, -7);
      break;
    case 'ArrowDown':
      next = addDays(current, 7);
      break;
    case 'PageUp':
      next = e.shiftKey ? addYears(current, -1) : addMonths(current, -1);
      break;
    case 'PageDown':
      next = e.shiftKey ? addYears(current, 1) : addMonths(current, 1);
      break;
    case 'Home': {
      const dow = current.getDay();
      const offset = (dow - weekStartsOn + 7) % 7;
      next = addDays(current, -offset);
      break;
    }
    case 'End': {
      const dow = current.getDay();
      const offset = 6 - ((dow - weekStartsOn + 7) % 7);
      next = addDays(current, offset);
      break;
    }
    case 'Enter':
    case ' ':
    case 'Spacebar': // legacy
      next = current;
      shouldSelect = !isDisabled(current, disabledDates, min, max);
      break;
    case 'Escape':
    case 'Esc':
      next = current;
      shouldClose = true;
      break;
    default:
      return null;
  }

  if (e.preventDefault) e.preventDefault();
  const clamped = clampToBounds(next, min, max);
  return {
    focus: clamped,
    monthChanged:
      clamped.getMonth() !== current.getMonth() ||
      clamped.getFullYear() !== current.getFullYear(),
    shouldSelect,
    shouldClose,
  };
}
