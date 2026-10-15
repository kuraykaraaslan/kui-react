'use client';
import type { ReactNode } from 'react';
import { safeMarkerColor, type MapTooltipData } from '../types';

type PopupProps = {
  tooltip: MapTooltipData;
  renderLink?: (href: string, children: ReactNode, className?: string) => ReactNode;
};

/** Only a path-absolute internal target (`/x`), never `//host`, `/\host`, a scheme or a control character. */
export function isInternalHref(href: unknown): href is string {
  if (typeof href !== 'string' || !/^\/(?![\/\\])/.test(href)) return false;

  if (/[\u0000-\u001f\u007f]/.test(href)) return false;
  return !/^\/\s*[a-z][a-z0-9+.-]*:/i.test(href);
}

const LINK_CLASS = 'inline-flex items-center gap-1 rounded-sm text-xs font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

/**
 * Marker tooltip / popup body in the kit's look: a title with an optional status dot, a muted
 * description, then label / value rows (label left, value right, tabular) and an optional link.
 * Leaflet's own frame around it is restyled with tokens (see `styles.ts`).
 */
export function Popup({ tooltip, renderLink }: PopupProps) {
  const href = isInternalHref(tooltip.href) ? tooltip.href : undefined;
  const linkText = tooltip.linkLabel || 'Open';
  const dot = safeMarkerColor(tooltip.color);
  return (
    <div className="min-w-36 max-w-60 font-sans text-text-primary">
      <p className="m-0! flex items-center gap-2 text-[13px] font-semibold leading-snug">
        {dot && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} />}
        <span className="min-w-0 truncate">{tooltip.title}</span>
      </p>
      {tooltip.description && (
        <p className="m-0! mt-0.5! text-xs leading-snug text-text-secondary">{tooltip.description}</p>
      )}
      {tooltip.fields && tooltip.fields.length > 0 && (
        <dl className="m-0! mt-1.5! flex flex-col">
          {tooltip.fields.map((f, i) => (
            <div key={i} className="flex min-h-6 items-center justify-between gap-4 border-t border-border py-0.5 text-xs">
              <dt className="truncate text-text-secondary">{f.label}</dt>
              <dd className="m-0 shrink-0 text-right font-medium tabular-nums text-text-primary">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {href && (
        <p className="m-0! mt-1.5! border-t border-border pt-1.5">
          {renderLink ? renderLink(href, linkText, LINK_CLASS) : <a href={href} className={LINK_CLASS}>{linkText}</a>}
        </p>
      )}
    </div>
  );
}
