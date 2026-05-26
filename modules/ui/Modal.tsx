'use client';
/**
 * Backwards-compatibility shim. The Modal implementation moved to
 * `modules/ui/Overlays/Modal/`. Existing consumers (`@/modules/ui/Modal`)
 * keep working unchanged.
 */
export { Modal, type ModalProps } from './Overlays/Modal';
