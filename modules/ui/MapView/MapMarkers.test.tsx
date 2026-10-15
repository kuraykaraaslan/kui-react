import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { markerIcon } from './parts/Marker';
import { clusterMarkers } from './parts/Cluster';
import { Popup, isInternalHref } from './parts/Popup';
import { safeMarkerColor, safeMarkerIcon } from './types';

describe('marker drawing', () => {
  it('accepts plain colours and tokens, refuses anything that could break out of the HTML', () => {
    expect(safeMarkerColor('#ff0000')).toBe('#ff0000');
    expect(safeMarkerColor('var(--primary)')).toBe('var(--primary)');
    expect(safeMarkerColor('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
    expect(safeMarkerColor('red" onload="x')).toBeUndefined();
    expect(safeMarkerColor('url(x)')).toBeUndefined();
    expect(safeMarkerIcon('fas fa-truck')).toBe('fas fa-truck');
    expect(safeMarkerIcon('fas fa-truck"><img')).toBeUndefined();
  });

  it('draws a pin, a dot or an icon at the requested size and colour', () => {
    const pin = markerIcon({ id: '1', position: [0, 0], color: '#ff0000', size: 32 });
    expect(pin.iconSize).toEqual([32, 48]);
    expect(pin.html).toContain('fill:#ff0000');
    const dot = markerIcon({ id: '1', position: [0, 0], shape: 'dot', color: 'var(--success)' });
    expect(dot.iconSize).toEqual([24, 24]);
    expect(dot.html).toContain('background:var(--success)');
    expect(markerIcon({ id: '1', position: [0, 0], shape: 'icon', icon: 'fas fa-truck' }).html).toContain('class="fas fa-truck"');
    // A bad icon falls back to a dot; a bad colour falls back to the variant.
    expect(markerIcon({ id: '1', position: [0, 0], shape: 'icon', icon: '<script>' }).html).not.toContain('script');
    expect(markerIcon({ id: '1', position: [0, 0], color: '"><x', variant: 'error' }).html).toContain('#ef4444');
  });

  it('clusters markers that overlap in pixels', () => {
    const ms = [
      { id: 'a', position: [0, 0] as [number, number] },
      { id: 'b', position: [0, 10] as [number, number] },
      { id: 'c', position: [0, 500] as [number, number] },
    ];
    const groups = clusterMarkers(ms, ([, lng]) => ({ x: lng, y: 0 }), 40);
    expect(groups.map((g) => g.markers.map((m) => m.id))).toEqual([['a', 'b'], ['c']]);
    expect(groups[0].position).toEqual([0, 5]);
  });

  it('tooltip links only internal paths', () => {
    expect(isInternalHref('/devices/1')).toBe(true);
    expect(isInternalHref('//evil')).toBe(false);
    expect(isInternalHref('https://evil')).toBe(false);
    const { rerender } = render(<Popup tooltip={{ title: 'A', href: '/devices/1', linkLabel: 'Details' }} />);
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', '/devices/1');
    rerender(<Popup tooltip={{ title: 'A', href: 'javascript:alert(1)' }} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});
