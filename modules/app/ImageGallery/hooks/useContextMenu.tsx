'use client';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpand,
  faCopy,
  faAnglesLeft,
  faAnglesRight,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { ContextMenuItem } from '../../ContextMenu';
import type { ImageGalleryImage } from '../types';

type UseContextMenuArgs = {
  images: ImageGalleryImage[];
  openLightbox: (i: number) => void;
  moveToIndex: (from: number, to: number) => void;
  removeAt: (i: number) => void;
};

type UseContextMenuResult = {
  buildItems: (i: number) => ContextMenuItem[];
};

/**
 * Builds per-image right-click ContextMenu items: Open, Copy URL,
 * Move to first/last, Remove.
 */
export function useContextMenu({
  images,
  openLightbox,
  moveToIndex,
  removeAt,
}: UseContextMenuArgs): UseContextMenuResult {
  const copyUrl = useCallback((src: string) => {
    navigator.clipboard?.writeText(src).catch(() => {});
  }, []);

  const buildItems = useCallback(
    (i: number): ContextMenuItem[] => [
      {
        label: 'Open in lightbox',
        icon: <FontAwesomeIcon icon={faExpand} className="w-3.5 h-3.5" aria-hidden="true" />,
        onClick: () => openLightbox(i),
      },
      {
        label: 'Copy image URL',
        icon: <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" aria-hidden="true" />,
        shortcut: '⌘C',
        onClick: () => copyUrl(images[i].src),
      },
      { type: 'separator' },
      { type: 'group', label: 'Reorder' },
      {
        label: 'Move to first',
        icon: <FontAwesomeIcon icon={faAnglesLeft} className="w-3.5 h-3.5" aria-hidden="true" />,
        disabled: i === 0,
        onClick: () => moveToIndex(i, 0),
      },
      {
        label: 'Move to last',
        icon: <FontAwesomeIcon icon={faAnglesRight} className="w-3.5 h-3.5" aria-hidden="true" />,
        disabled: i === images.length - 1,
        onClick: () => moveToIndex(i, images.length - 1),
      },
      { type: 'separator' },
      {
        label: 'Remove',
        icon: <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />,
        danger: true,
        onClick: () => removeAt(i),
      },
    ],
    [images, openLightbox, moveToIndex, removeAt, copyUrl],
  );

  return { buildItems };
}
