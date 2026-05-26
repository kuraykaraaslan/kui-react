'use client';
import type { MapTooltipData } from '../types';

type PopupProps = { tooltip: MapTooltipData };

/**
 * Marker tooltip body. Inline styles are used because Leaflet renders this
 * inside its own DOM subtree (`.leaflet-tooltip`) which is hoisted to the map
 * pane container — Tailwind utility classes still work, but inline styles
 * guarantee parity with the EJS implementation that builds the same markup
 * as a raw HTML string.
 */
export function Popup({ tooltip }: PopupProps) {
  const hasMeta = Boolean(tooltip.description) || Boolean(tooltip.fields?.length);
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
    </div>
  );
}
