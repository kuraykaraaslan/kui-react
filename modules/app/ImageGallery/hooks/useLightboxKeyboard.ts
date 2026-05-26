'use client';
import { useEffect } from 'react';

type UseLightboxKeyboardArgs = {
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Wires the lightbox keyboard map (←, →, Escape) and toggles
 * `document.body.style.overflow` to lock the page scroll while open.
 */
export function useLightboxKeyboard({ open, onClose, onPrev, onNext }: UseLightboxKeyboardArgs) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
}
