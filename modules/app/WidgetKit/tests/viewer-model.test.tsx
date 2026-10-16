import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { effective, templateDefaults, validate } from '../settings/engine';
import type { SlotData, WidgetViewProps } from '../kind';
import { VIEWER_MODEL, VIEWER_MODEL_KIND } from '../templates/viewer-model';
import { BUILTIN_VIEWS } from '../views';
import { resolveModelUrl } from '../views/content-logic';
import { buildSensors, modelSources, toWorld, VIEWER_MODEL_VIEW, MAX_MODELS } from '../views/ViewerModelView';
import { sampleData } from '../sample/sample-data';
import { PLANT_MODEL } from '../sample/sample-boards';

// ── A fake kui-viewer (jsdom has no WebGL) ────────────────────────────────────────────────────
// Just enough of the React binding: <KUIViewer> makes a viewer on mount and disposes it on unmount,
// <ModelLoader> resolves or rejects per URL, useViewer reads the context.

class Vec3 {
  constructor(public x = 0, public y = 0, public z = 0) {}
  set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vec3(this.x, this.y, this.z); }
  // An orthographic stand-in: world ±100 m → the canvas edges.
  project() { this.x /= 100; this.y /= 100; this.z = 0; return this; }
}

const fake = vi.hoisted(() => ({
  created: [] as Array<{ disposed: boolean; controls: Record<string, unknown>; camera: { position: { x: number; y: number; z: number } }; scene: { background: { isColor: boolean; set: (c: string) => void; value?: string } } }>,
  failing: new Set<string>(),
  loads: [] as string[],
}));

vi.mock('@kuraykaraaslan/kui-viewer/styles.css', () => ({}));
vi.mock('@kuraykaraaslan/kui-viewer', () => ({ addGridHelpers: vi.fn(), removeHelpers: vi.fn() }));
vi.mock('@kuraykaraaslan/kui-viewer/react', () => {
  const Ctx = createContext<unknown>(null);
  function makeViewer() {
    const canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 400 });
    Object.defineProperty(canvas, 'clientHeight', { value: 200 });
    const background: { isColor: boolean; value?: string; set: (c: string) => void } = { isColor: true, set: (c: string) => { background.value = c; } };
    const v = {
      disposed: false,
      scene: { background, children: [] },
      camera: { position: new Vec3(10, 10, 10), fov: 50, aspect: 2, updateMatrixWorld: () => {}, matrixWorld: { elements: [1, 0, 0, 0] } },
      controls: { enabled: true, enableZoom: true, target: new Vec3(), update: vi.fn() },
      renderer: { domElement: canvas },
      rtc: { global: new Vec3() },
      invalidate: vi.fn(),
    };
    fake.created.push(v as never);
    return v;
  }
  function KUIViewer({ onReady, children, className }: { onReady?: (v: unknown) => void; children?: ReactNode; className?: string }) {
    const [viewer, setViewer] = useState<ReturnType<typeof makeViewer> | null>(null);
    useEffect(() => {
      const v = makeViewer();
      setViewer(v);
      onReady?.(v);
      return () => { v.disposed = true; };
    }, [onReady]);
    return <div data-testid="kui-viewer" className={className}><Ctx.Provider value={viewer}>{viewer ? children : null}</Ctx.Provider></div>;
  }
  function ModelLoader({ source, onLoad, onError }: { source: string; onLoad?: (h: unknown) => void; onError?: (e: Error) => void }) {
    useEffect(() => {
      fake.loads.push(source);
      const t = setTimeout(() => {
        if (fake.failing.has(source)) onError?.(new Error(`404 ${source}`));
        else onLoad?.({ id: source, globalIdToCentroid: new Map([['a', new Vec3(-10, 0, -5)], ['b', new Vec3(10, 6, 5)]]), dispose: () => {} });
      }, 0);
      return () => clearTimeout(t);
    }, [source, onLoad, onError]);
    return null;
  }
  return {
    KUIViewer,
    ModelLoader,
    NavCube: () => <div data-testid="navcube" />,
    useViewer: () => useContext(Ctx),
  };
});

const TABLE: SlotData = {
  shape: 'table',
  columns: [
    { key: 'id', label: 'Tag', type: 'text' }, { key: 'label', label: 'Sensor', type: 'text' },
    { key: 'x', label: 'X', type: 'number' }, { key: 'y', label: 'Y', type: 'number' }, { key: 'z', label: 'Z', type: 'number' },
    { key: 'value', label: 'Reading', type: 'number' }, { key: 'unit', label: 'Unit', type: 'text' }, { key: 'status', label: 'Status', type: 'text' },
  ],
  rows: [
    { id: 'TT-1', label: 'Column top', x: 1, y: 2, z: 3, value: 118.4, unit: '°C', status: 'Normal' },
    { id: 'PT-2', label: 'Drum', x: 4, y: 5, z: 6, value: 9.8, unit: 'bar', status: 'Alarm' },
    { id: 'BAD', label: 'No coordinates', x: 1, y: null, z: 3, value: 1, status: 'Normal' },
  ],
};

const props = (settings: Record<string, unknown> = {}, data: WidgetViewProps['data'] = { sensors: TABLE }): WidgetViewProps =>
  ({ settings: effective(VIEWER_MODEL, settings), format: {}, data, locale: 'en', title: 'Plant' });

const MODELS = { models: [{ url: '/m/a.ifc', label: 'A', visible: true }, { url: '/m/b.ifc', label: 'B', visible: true }] };

function withWebgl() {
  const ctx2d = { fillStyle: '', fillRect: () => {}, getImageData: () => ({ data: [1, 2, 3, 255] }) };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(((kind: string) => (kind === '2d' ? ctx2d : {})) as never);
}

beforeEach(() => {
  fake.created.length = 0;
  fake.loads.length = 0;
  fake.failing.clear();
});
afterEach(() => vi.restoreAllMocks());

describe('builtin:viewer.model template', () => {
  it('is v1 with valid defaults, a registered view and the kind\'s geometry', () => {
    expect(VIEWER_MODEL.version).toBe(1);
    expect(VIEWER_MODEL.migrations).toEqual([]);
    expect(VIEWER_MODEL_KIND).toMatchObject({ type: 'viewer.model', label: '3D model', icon: 'fas fa-cube', defaultW: 6, defaultH: 8 });
    expect(VIEWER_MODEL_KIND.slots).toEqual([{ key: 'sensors', label: 'Sensors', shape: 'table', required: false }]);
    expect(BUILTIN_VIEWS['viewer.model']).toBe(VIEWER_MODEL_VIEW);
    expect(validate(VIEWER_MODEL, templateDefaults(VIEWER_MODEL)).issues).toEqual([]);
  });

  it('accepts internal and https models and refuses anything else', () => {
    expect(validate(VIEWER_MODEL, { models: [{ url: '/samples/x.ifc' }, { url: 'https://cdn.example.com/y.ifc' }] }).issues).toEqual([]);
    const bad = validate(VIEWER_MODEL, { models: [{ url: 'http://example.com/a.ifc' }, { url: '//evil.example/a.ifc' }] }).issues;
    expect([...new Set(bad.map((i) => i.path))].sort()).toEqual(['models.0.url', 'models.1.url']);
    expect(resolveModelUrl('javascript:alert(1)')).toBeNull();
    expect(resolveModelUrl('/a b.ifc')).toBeNull();
  });

  it('the sample plant settings and source pass unchanged', () => {
    const r = validate(VIEWER_MODEL, PLANT_MODEL);
    expect(r.issues).toEqual([]);
    expect(r.values).toEqual(PLANT_MODEL);
    const data = sampleData('sample.plant.sensors');
    expect(data?.shape).toBe('table');
    expect(buildSensors(data, effective(VIEWER_MODEL, PLANT_MODEL)).sensors).toHaveLength(9);
  });
});

describe('models and sensors', () => {
  it('loads visible, allowed models once each, rewritten by the host and checked again', () => {
    const s = effective(VIEWER_MODEL, {
      models: [
        { url: '/a.ifc', label: 'A' }, { url: '/a.ifc' }, { url: '/hidden.ifc', visible: false },
        { url: 'ftp://x/y.ifc' }, { url: 'https://h.example/models/b.ifc?v=2' },
      ],
    });
    expect(modelSources(s)).toEqual([{ url: '/a.ifc', label: 'A' }, { url: 'https://h.example/models/b.ifc?v=2', label: 'b.ifc' }]);
    expect(modelSources(s, (u) => `/t/acme${u}`)[0].url).toBe('/t/acme/a.ifc');
    expect(modelSources(s, () => '//evil.example/x')).toEqual([{ url: 'https://h.example/models/b.ifc?v=2', label: 'b.ifc' }]);
    const many = effective(VIEWER_MODEL, { models: Array.from({ length: 12 }, (_, i) => ({ url: `/m${i}.ifc` })) });
    expect(modelSources(many)).toHaveLength(MAX_MODELS);
  });

  it('maps IFC (Z up) coordinates to the viewer world (Y up)', () => {
    expect(toWorld([1, 2, 3])).toEqual([1, 3, -2]);
    expect(toWorld([1, 2, 3], 'y-up')).toEqual([1, 2, 3]);
  });

  it('turns rows into markers: coordinates, reading with unit, status colour, tooltip', () => {
    const { sensors } = buildSensors(TABLE, effective(VIEWER_MODEL, { tooltipColumns: ['label'] }), 'en');
    expect(sensors.map((m) => m.id)).toEqual(['TT-1', 'PT-2']); // the row without a y is not placed
    expect(sensors[0]).toMatchObject({ position: [1, 3, -2], label: 'Column top', color: 'var(--success)', alarm: false });
    expect(sensors[0].valueText).toContain('118.4');
    expect(sensors[0].valueText).toContain('°C');
    expect(sensors[1]).toMatchObject({ color: 'var(--error)', alarm: true });
    expect(sensors[1].tooltip.description).toBe('Alarm');
    expect(sensors[0].tooltip.fields.map((f) => f.label)).toEqual(['Reading', 'Sensor']);
  });

  it('colours by ranges on the reading, or one fixed colour', () => {
    const ranges = buildSensors(TABLE, effective(VIEWER_MODEL, { colorBy: 'ranges', ranges: [{ to: 50, color: 'var(--info)' }, { from: 50, color: 'var(--warning)' }] })).sensors;
    expect(ranges.map((m) => m.color)).toEqual(['var(--warning)', 'var(--info)']);
    const fixed = buildSensors(TABLE, effective(VIEWER_MODEL, { colorBy: 'fixed', markerColor: '#123456' })).sensors;
    expect(fixed.every((m) => m.color === '#123456')).toBe(true);
  });

  it('is empty with no model and no placed sensor; exports the sensor columns as CSV', () => {
    const s = effective(VIEWER_MODEL, {});
    expect(VIEWER_MODEL_VIEW.isEmpty!({}, s)).toBe(true);
    expect(VIEWER_MODEL_VIEW.isEmpty!({ sensors: TABLE }, s)).toBe(false);
    expect(VIEWER_MODEL_VIEW.isEmpty!({}, effective(VIEWER_MODEL, MODELS))).toBe(false);
    const csv = VIEWER_MODEL_VIEW.toCsv!({ sensors: TABLE }, s, {});
    expect(csv[0]).toEqual(['Tag', 'Sensor', 'X', 'Y', 'Z', 'Reading', 'Unit', 'Status']);
    expect(csv).toHaveLength(3);
  });
});

describe('ViewerModelView', () => {
  const View = VIEWER_MODEL_VIEW.View;

  it('shows an error state, not a blank card, without WebGL', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    render(<View {...props(MODELS)} />);
    expect(screen.getByRole('alert').textContent).toMatch(/WebGL/);
    expect(screen.queryByTestId('kui-viewer')).toBeNull();
  });

  it('loads the viewer lazily, loads every model, fits the camera and places the sensors', async () => {
    withWebgl();
    render(<View {...props(MODELS)} />);
    expect(await screen.findByTestId('kui-viewer')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText(/Loading models/)).toBeNull());
    expect(fake.loads).toEqual(['/m/a.ifc', '/m/b.ifc']);
    const v = fake.created[0];
    // fitted on the centre of the element centroids, from the iso direction
    expect((v.controls.target as Vec3)).toMatchObject({ x: 0, y: 3, z: 0 });
    expect(v.camera.position.x).toBeGreaterThan(0);
    expect(v.scene.background.value).toBe('#010203');
    expect(screen.getByTestId('navcube')).toBeTruthy();
    const markers = document.querySelectorAll('[data-sensor]');
    expect(markers).toHaveLength(2);
    expect(screen.getByText('Column top · 118.4 °C')).toBeTruthy();
    await waitFor(() => expect((markers[0] as HTMLElement).style.visibility).toBe('visible'));
    expect((markers[0] as HTMLElement).style.transform).toMatch(/translate\(/);
    expect(screen.getByRole('list', { name: 'Legend' }).textContent).toContain('Alarm');
  });

  it('opens a tooltip with the reading and the status on hover', async () => {
    withWebgl();
    render(<View {...props()} />);
    const button = await screen.findByRole('button', { name: /Drum/ });
    fireEvent.mouseEnter(button);
    const tip = screen.getByRole('tooltip');
    expect(tip.textContent).toContain('Drum');
    expect(tip.textContent).toContain('Alarm');
    expect(tip.textContent).toContain('9.8');
    fireEvent.mouseLeave(button);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('locks the camera and hides the view cube when not interactive', async () => {
    withWebgl();
    render(<View {...props({ ...MODELS, interactive: false })} />);
    await screen.findByTestId('kui-viewer');
    await waitFor(() => expect(fake.created[0]?.controls.enabled).toBe(false));
    expect(screen.queryByTestId('navcube')).toBeNull();
  });

  it('reports a model that failed, and an error state when every model failed', async () => {
    withWebgl();
    fake.failing.add('/m/b.ifc');
    const { unmount } = render(<View {...props(MODELS)} />);
    expect(await screen.findByText('Not loaded: B')).toBeTruthy();
    unmount();
    fake.failing.add('/m/a.ifc');
    render(<View {...props(MODELS)} />);
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not be loaded.*404/);
  });

  it('disposes the viewer when the card goes away', async () => {
    withWebgl();
    const { unmount } = render(<View {...props(MODELS)} />);
    await screen.findByTestId('kui-viewer');
    await act(async () => { unmount(); });
    expect(fake.created.every((v) => v.disposed)).toBe(true);
  });
});
