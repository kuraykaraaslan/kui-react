'use client';
/**
 * Backwards-compatibility shim. The Popover implementation moved to
 * `modules/ui/Overlays/Popover/`. Existing consumers (`@/modules/ui/Popover`)
 * keep working unchanged.
 */
export { Popover, type PopoverProps } from './Overlays/Popover';
