'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/** a decorative icon with an exact square size (the icon font's own width of 1.25 em is not wanted here); `size` is any CSS length */
export function Ic({ icon, size = '1rem' }: { icon: IconDefinition; size?: string }) {
  return <FontAwesomeIcon icon={icon} aria-hidden="true" style={{ width: size, height: size }} />;
}
