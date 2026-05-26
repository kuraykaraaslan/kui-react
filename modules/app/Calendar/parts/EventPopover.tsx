'use client';
// TODO M2: full hover/click popover with description, edit + delete actions.
// For M1 we expose a stub so external imports compile; consumers that pass an
// `onEventClick` handler get the click event but no popover UI yet.

import type { Event } from '../types';

type EventPopoverProps = {
  event: Event | null;
  open: boolean;
  onClose: () => void;
};

export function EventPopover(_props: EventPopoverProps) {
  // TODO M2: render anchored popover with title, time range, description,
  // edit/delete buttons, and arrow-keyboard close.
  return null;
}
