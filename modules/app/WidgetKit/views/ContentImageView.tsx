'use client';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { hostImageSrc, hostLink, resolveLink } from './content-logic';

type S = {
  src?: string;
  alt?: string;
  fit?: 'cover' | 'contain' | 'fill';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  radius?: number;
  overlayColor?: string;
  caption?: string;
  captionPlacement?: 'below' | 'overlay';
  captionFont?: FontValue;
  captionColor?: string;
  href?: string;
  openInNewTab?: boolean;
};

const FITS = new Set(['cover', 'contain', 'fill']);
const POSITIONS = new Set(['center', 'top', 'bottom', 'left', 'right']);

/** `content.image`: an image from an allow-listed address (internal path, https, http; never data:). */
export function ContentImageView({ settings, renderLink, resolveUrl }: WidgetViewProps) {
  const s = settings as S;
  const src = hostImageSrc(s.src, resolveUrl);
  const raw = resolveLink(s.href);
  // Internal navigation goes through the host's renderLink as is; a plain anchor gets the host-rewritten path.
  const link = raw && !raw.external && renderLink ? raw : hostLink(raw, resolveUrl);
  if (!src) {
    return (
      <p className="flex h-full items-center justify-center p-4 text-center text-sm text-text-secondary">
        Set a valid image address in this widget’s settings.
      </p>
    );
  }
  const radius = typeof s.radius === 'number' && s.radius > 0 ? s.radius : undefined;
  const overlay = cssColor(s.overlayColor);
  const caption = typeof s.caption === 'string' && s.caption.trim() ? s.caption : null;
  const overCaption = caption && s.captionPlacement === 'overlay';
  const imgStyle: CSSProperties = {
    objectFit: FITS.has(s.fit ?? '') ? s.fit : 'cover',
    objectPosition: POSITIONS.has(s.position ?? '') ? s.position : 'center',
  };

  const picture = (
    <span className="relative block h-full w-full overflow-hidden" style={radius ? { borderRadius: radius } : undefined}>
      {/* A plain <img>: the source is an author-supplied address on any host. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={s.alt ?? ''} loading="lazy" referrerPolicy="no-referrer" className="block h-full w-full" style={imgStyle} />
      {overlay && <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: overlay }} />}
      {overCaption && (
        <span className="absolute inset-x-0 bottom-0 p-2 text-sm text-text-inverse" style={fontStyle(s.captionFont, s.captionColor)}>
          {caption}
        </span>
      )}
    </span>
  );

  const cls = 'block h-full w-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  let body: ReactNode = picture;
  if (link) {
    if (!link.external && renderLink) body = renderLink(link.href, picture, cls);
    else {
      body = (
        <a
          href={link.href}
          className={cls}
          {...(link.external && s.openInNewTab !== false ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {})}
          {...(link.external && s.openInNewTab === false ? { rel: 'noopener noreferrer nofollow' } : {})}
        >
          {picture}
        </a>
      );
    }
  }

  return (
    <figure className={cn('flex h-full min-h-0 flex-col')}>
      <div className="min-h-0 flex-1">{body}</div>
      {caption && !overCaption && (
        <figcaption className="px-2 py-1 text-xs text-text-secondary" style={fontStyle(s.captionFont, s.captionColor)}>{caption}</figcaption>
      )}
    </figure>
  );
}

export const CONTENT_IMAGE_VIEW: WidgetKindView = {
  View: ContentImageView,
  isEmpty: (_data, settings) => typeof settings.src !== 'string' || settings.src.trim() === '',
};
