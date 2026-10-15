'use client';
import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { EMBED_REFERRER_POLICY, EMBED_SANDBOX, resolveEmbedUrl } from './content-logic';

type S = { url?: string; aspect?: 'fill' | '16:9' | '4:3' | '1:1'; allowFullscreen?: boolean };

const RATIOS: Record<string, string> = { '16:9': '16 / 9', '4:3': '4 / 3', '1:1': '1 / 1' };

/**
 * `content.embed`: an external page in a hardened frame. The URL passes `resolveEmbedUrl` (https only,
 * no credentials, default port, no private / loopback / single-label host); the frame is sandboxed
 * without `allow-same-origin` (opaque origin), sends no referrer and loads lazily. A refused URL
 * renders an explanation, never a frame.
 */
export function ContentEmbedView({ settings, title }: WidgetViewProps) {
  const s = settings as S;
  const result = useMemo(() => resolveEmbedUrl(s.url), [s.url]);
  if (!result.ok) {
    return (
      <p className="flex h-full items-center justify-center p-4 text-center text-sm text-text-secondary">
        {result.reason === 'empty'
          ? 'Set a page address in this widget’s settings.'
          : 'This address cannot be embedded. Use a public https address.'}
      </p>
    );
  }
  const ratio = s.aspect ? RATIOS[s.aspect] : undefined;
  return (
    <div className={cn('flex h-full min-h-0 w-full items-center justify-center')}>
      <iframe
        src={result.url}
        title={title?.trim() ? title : `Embedded page: ${result.host}`}
        sandbox={EMBED_SANDBOX}
        allow={s.allowFullscreen === false ? undefined : 'fullscreen'}
        allowFullScreen={s.allowFullscreen !== false}
        referrerPolicy={EMBED_REFERRER_POLICY}
        loading="lazy"
        className={cn('block border-0', ratio ? 'max-h-full w-full' : 'h-full w-full')}
        style={ratio ? { aspectRatio: ratio } : undefined}
      />
    </div>
  );
}

export const CONTENT_EMBED_VIEW: WidgetKindView = {
  View: ContentEmbedView,
  isEmpty: (_data, settings) => typeof settings.url !== 'string' || settings.url.trim() === '',
};
