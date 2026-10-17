import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const seen = vi.hoisted(() => ({ props: null as null | Record<string, unknown> }));
vi.mock('@/modules/ui/MapView', () => ({
  MapCanvas: (p: Record<string, unknown>) => { seen.props = p; return <div role="region" aria-label="map" />; },
}));

import { MapWidgetView } from '../views/MapView';
import { MAP } from '../templates/map';
import { effective } from '../settings/engine';

const table = (rows: Array<Record<string, unknown>>) => ({ shape: 'table' as const, rows });
const points = table([{ lat: 41, lng: 29, label: 'A' }]);
const zones = table([{ id: 'z', positions: [[41, 29], [41, 29.1], [41.1, 29.1]] }]);
const routes = table([{ id: 'r', positions: [[41, 29], [41.1, 29.1]] }]);
const settings = (over: Record<string, unknown> = {}) => effective(MAP, over);

beforeEach(() => { seen.props = null; });

describe('map layer switch (next-boilerplate 20.3d)', () => {
  it('offers the layers the map has, all on, and hides one without dropping it from the view', () => {
    render(<MapWidgetView settings={settings()} format={{}} data={{ points, zones, routes }} />);
    const box = (name: string) => screen.getByRole('checkbox', { name }) as HTMLInputElement;
    expect([box('Markers').checked, box('Zones').checked, box('Routes').checked]).toEqual([true, true, true]);
    fireEvent.click(box('Zones'));
    expect(seen.props).toMatchObject({ showMarkers: true, showZones: false, showRoutes: true });
    // The zones are still handed over (they keep framing the view); only their drawing is off.
    expect((seen.props!.zones as unknown[]).length).toBe(1);
  });

  it('no switch with a single layer, or when the setting is off', () => {
    const { unmount } = render(<MapWidgetView settings={settings()} format={{}} data={{ points }} />);
    expect(screen.queryByRole('group', { name: 'Layers' })).toBeNull();
    unmount();
    render(<MapWidgetView settings={settings({ layerToggles: false })} format={{}} data={{ points, zones }} />);
    expect(screen.queryByRole('checkbox', { name: 'Zones' })).toBeNull();
  });

  it('only the layers present are listed, with the host\'s texts, away from the zoom buttons', () => {
    render(<MapWidgetView settings={settings({ controlsPosition: 'topright', layerTogglesPosition: 'topright' })} format={{}} data={{ points: table([]), zones, routes }}
      layerLabels={{ layers: 'Map layers', zones: 'Areas', routes: 'Paths' }} />);
    const group = screen.getByRole('group', { name: 'Map layers' });
    expect(screen.getAllByRole('checkbox').map((c) => c.parentElement?.textContent)).toEqual(['Areas', 'Paths']);
    expect(group.className).toMatch(/bottom-6 right-2/); // bottom-6 clears the tile attribution
  });
});
