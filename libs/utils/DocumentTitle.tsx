'use client';
import { useEffect } from 'react';
import { SHOWCASE_BRAND } from '@/libs/config/showcase.config';

type DocumentTitleProps = {
  text: string;
  /** When true, `document.title` is set to `text` verbatim (no ` | Brand` suffix). */
  absolute?: boolean;
};

export function DocumentTitle({ text, absolute = false }: DocumentTitleProps) {
  useEffect(() => {
    document.title = absolute ? text : `${text} | ${SHOWCASE_BRAND.name}`;
  }, [text, absolute]);
  return null;
}
