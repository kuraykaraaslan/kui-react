'use client';
import type { ReactNode } from 'react';
import type { MapTooltipData } from '../types';

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

/**
 * Marker tooltip body. Inline styles are used because Leaflet renders this
 * inside its own DOM subtree (`.leaflet-tooltip`) which is hoisted to the map
 * pane container — Tailwind utility classes still work, but inline styles
 * guarantee parity with the EJS implementation that builds the same markup
 * as a raw HTML string.
 */
export function Popup({ tooltip, renderLink }: PopupProps) {
  const href = isInternalHref(tooltip.href) ? tooltip.href : undefined;
  const hasMeta = Boolean(tooltip.description) || Boolean(tooltip.fields?.length) || Boolean(href);
  const linkText = tooltip.linkLabel || 'Open';
  return (
    <div style={{ minWidth: 130, maxWidth: 220 }}>
      <p style={{
        fontWeight: 600,
        fontSize: 13,
        color: '#111827',
        marginBottom: hasMeta ? 3 : 0,
      }}>
        {tooltip.title}
      </p>
      {tooltip.description && (
        <p style={{
          fontSize: 11,
          color: '#6b7280',
          marginBottom: tooltip.fields?.length ? 4 : 0,
          lineHeight: 1.4,
        }}>
          {tooltip.description}
        </p>
      )}
      {tooltip.fields && tooltip.fields.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 2 }}>
          <tbody>
            {tooltip.fields.map((f, i) => (
              <tr key={i}>
                <td style={{ fontSize: 11, color: '#6b7280', paddingRight: 6, paddingTop: 1, whiteSpace: 'nowrap' }}>{f.label}</td>
                <td style={{ fontSize: 11, color: '#111827', fontWeight: 500, paddingTop: 1 }}>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {href && (
        <p style={{ marginTop: 4, fontSize: 11, fontWeight: 600 }}>
          {renderLink
            ? renderLink(href, linkText, 'text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus')
            : <a href={href} className="text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">{linkText}</a>}
        </p>
      )}
    </div>
  );
}
