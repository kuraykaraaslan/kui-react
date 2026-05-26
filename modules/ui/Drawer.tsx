'use client';
/**
 * Backwards-compatibility shim. The Drawer implementation moved to
 * `modules/ui/Overlays/Drawer/`. Existing consumers (`@/modules/ui/Drawer`)
 * keep working unchanged.
 */
export { Drawer, type DrawerProps } from './Overlays/Drawer';
