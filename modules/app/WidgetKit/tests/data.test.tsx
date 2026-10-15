import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { effective, templateDefaults, validate } from '../settings/engine';
import type { SettingsTemplate, Sparse } from '../settings/types';
import type { SlotData } from '../kind';
import { DATA_TABLE, DATA_TABLE_KIND } from '../templates/data-table';
import { DATA_FEED, DATA_FEED_KIND } from '../templates/data-feed';
import { MAP, MAP_KIND } from '../templates/map';
import { DATA_TABLE_VIEW, DataTableView, expandLinkTemplate, tableColumns } from '../views/DataTableView';
import { DATA_FEED_VIEW, DataFeedView, feedItems } from '../views/DataFeedView';
import { MAP_VIEW, MapWidgetView, buildMarkers } from '../views/MapView';

const templates: SettingsTemplate[] = [DATA_TABLE, DATA_FEED, MAP];

describe('data templates', () => {
  it.each(templates.map((t) => [t.id, t] as const))('%s validates its own defaults and every field group exists', (_id, t) => {
    expect(t.version).toBe(1);
    expect(t.migrations).toEqual([]);
    expect(validate(t, templateDefaults(t)).issues).toEqual([]);
    const groups = new Set(t.groups.map((g) => g.id));
    for (const [k, f] of Object.entries(t.fields)) expect(groups.has(f.group as string), `${t.id}.${k}`).toBe(true);
  });

  it('kinds carry their slots, templates and card defaults', () => {
    expect(DATA_TABLE_KIND.template).toBe(DATA_TABLE);
    expect(DATA_TABLE_KIND.slots[0].key).toBe('rows');
    expect(DATA_FEED_KIND.slots[0].key).toBe('events');
    expect(MAP_KIND.slots[0].key).toBe('points');
    expect(DATA_TABLE.cardDefaults).toEqual({ padding: 4, buttons: ['fullscreen', 'export'] });
    expect(MAP.cardDefaults).toEqual({ padding: 0 });
    expect([DATA_TABLE, DATA_FEED, MAP].every((t) => t.exportable)).toBe(true);
  });

  it('refuses a non-internal link template', () => {
    expect(validate(MAP, { linkTemplate: 'https://evil.example/{id}' }).issues.map((i) => i.path)).toContain('linkTemplate');
    expect(validate(MAP, { linkTemplate: '//evil.example' }).issues).toHaveLength(1);
    expect(validate(MAP, { linkTemplate: '/admin/devices/{id}' }).issues).toEqual([]);
    expect(validate(DATA_TABLE, { columns: [{ key: 'id', cell: 'link', linkTemplate: 'javascript:alert(1)' }] }).issues.map((i) => i.path))
      .toContain('columns.0.linkTemplate');
  });
});

// ── table ──────────────────────────────────────────────────────────────────────

const table: SlotData = {
  shape: 'table',
  columns: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'temp', label: 'Temperature', type: 'number' },
    { key: 'secret', label: 'Secret', type: 'text' },
    { key: 'path', label: 'Path', type: 'text' },
  ],
  rows: [
    { name: 'Boiler', status: 'warning', temp: 71.5, secret: 'x', path: '/devices/1' },
    { name: 'Pump', status: 'success', temp: 20, secret: 'y', path: 'https://evil.example' },
    { name: 'Fan', status: 'error', temp: 45, secret: 'z', path: '/devices/3' },
  ],
};

const tableSettings = (over: Sparse = {}) => effective(DATA_TABLE, over);
const renderTable = (over: Sparse = {}, extra: Record<string, unknown> = {}) =>
  render(<DataTableView settings={tableSettings(over)} format={{}} data={{ rows: table }} locale="en" {...extra} />);
const bodyRows = () => screen.getAllByRole('row').slice(1);

describe('DataTableView', () => {
  it('shows every declared column by default', () => {
    renderTable();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Name', 'Status', 'Temperature', 'Secret', 'Path']);
    expect(bodyRows()).toHaveLength(3);
  });

  it('configured columns: order, rename, hidden, undeclared skipped', () => {
    renderTable({ columns: [{ key: 'temp', label: 'Temp' }, { key: 'name' }, { key: 'secret', visible: 'hidden' }, { key: 'gone' }] });
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Temp', 'Name']);
    expect(screen.queryByText('Secret')).toBeNull();
  });

  it('renders a badge cell for a badge column and a bar cell on request', () => {
    renderTable({ columns: [{ key: 'name' }, { key: 'status' }, { key: 'temp', cell: 'bar', ranges: [{ from: 50, color: '#ff0000' }] }] });
    expect(screen.getByText('warning').className).toMatch(/bg-warning-subtle/);
    const meters = screen.getAllByRole('meter');
    expect(meters).toHaveLength(3);
    expect((meters[0].firstChild as HTMLElement).style.background).toBe('rgb(255, 0, 0)');
    expect((meters[0].firstChild as HTMLElement).style.width).toBe('100%');
  });

  it('sorts by the default sort and lets the viewer re-sort', () => {
    renderTable({ defaultSort: 'temp', defaultSortDir: 'asc' });
    expect(within(bodyRows()[0]).getByText('Pump')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Temperature/ }));
    expect(within(bodyRows()[0]).getByText('Boiler')).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Temperature/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('caps rows, pages and searches client-side', () => {
    const { unmount } = renderTable({ maxRows: 2 });
    expect(bodyRows()).toHaveLength(2);
    expect(screen.getByText('Showing 2 of 3 rows')).toBeTruthy();
    unmount();
    renderTable({ maxRows: 2, paging: 'pages' });
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(bodyRows()).toHaveLength(1);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search' }), { target: { value: 'pum' } });
    expect(bodyRows()).toHaveLength(1);
    expect(within(bodyRows()[0]).getByText('Pump')).toBeTruthy();
  });

  it('link cells: only internal paths become links; the template is URL-encoded', () => {
    renderTable({ columns: [{ key: 'name' }, { key: 'path', cell: 'link' }] });
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/devices/1', '/devices/3']);
    expect(screen.getByText('https://evil.example').closest('a')).toBeNull();
    expect(expandLinkTemplate('/d/{name}', { name: 'a/../b' })).toBe('/d/a%2F..%2Fb');
    expect(expandLinkTemplate('https://evil/{name}', { name: 'x' })).toBeNull();
  });

  it('a non-internal column link template is not rendered as a link', () => {
    renderTable({ columns: [{ key: 'name', cell: 'link', linkTemplate: 'https://evil.example/{name}' }] });
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Boiler')).toBeTruthy();
  });

  it('uses renderLink for internal links', () => {
    const renderLink = vi.fn((href: string, children: React.ReactNode) => <a href={`/t${href}`}>{children}</a>);
    renderTable({ columns: [{ key: 'name', cell: 'link', linkTemplate: '/devices/{name}' }] }, { renderLink });
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/t/devices/Boiler');
  });

  it('look: density, striped, row colour, header colour, desktop-only columns', () => {
    renderTable({ density: 'comfortable', striped: true, rowColorColumn: 'status', headerColor: '#123456', columns: [{ key: 'name' }, { key: 'temp', visible: 'desktop' }] });
    const header = screen.getByRole('columnheader', { name: /Name/ });
    expect(header.className).toMatch(/py-3/);
    expect(header.style.color).toBe('rgb(18, 52, 86)');
    expect(screen.getByRole('columnheader', { name: /Temperature/ }).className).toMatch(/hidden md:table-cell/);
    expect(bodyRows()[0].style.background).toContain('color-mix');
  });

  it('server paging: echoes page/sort and asks the host for the next page', () => {
    const set = vi.fn();
    const paged = { ...table, total: 30, paging: { page: 1, pageSize: 3, sortable: ['temp'], searchable: true } } as SlotData;
    render(<DataTableView settings={tableSettings()} format={{}} data={{ rows: paged }} paging={{ set }} />);
    expect(screen.getByText(/Page 1 of 10/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(set).toHaveBeenCalledWith({ page: 2 });
    fireEvent.click(screen.getByRole('button', { name: /Temperature/ }));
    expect(set).toHaveBeenCalledWith({ sort: { key: 'temp', dir: 'asc' } });
    expect(screen.queryByRole('button', { name: /Name/ })).toBeNull();
  });

  it('isEmpty and toCsv follow the effective columns with raw values', () => {
    const s = tableSettings({ columns: [{ key: 'name', label: 'Device' }, { key: 'temp' }, { key: 'secret', visible: 'hidden' }] });
    expect(DATA_TABLE_VIEW.isEmpty!({ rows: table }, s)).toBe(false);
    expect(DATA_TABLE_VIEW.isEmpty!({ rows: { shape: 'table', columns: table.columns, rows: [] } }, s)).toBe(true);
    expect(DATA_TABLE_VIEW.isEmpty!({}, s)).toBe(true);
    expect(DATA_TABLE_VIEW.toCsv!({ rows: table }, s, {})).toEqual([
      ['Device', 'Temperature'], ['Boiler', '71.5'], ['Pump', '20'], ['Fan', '45'],
    ]);
    expect(tableColumns(table, tableSettings()).length).toBe(5);
  });
});

// ── feed ───────────────────────────────────────────────────────────────────────

const NOW = Date.parse('2026-10-15T12:00:00Z');
const events: SlotData = {
  shape: 'table',
  columns: [{ key: 'time', label: 'When', type: 'date' }, { key: 'title', label: 'What', type: 'text' }, { key: 'tone', label: 'Tone', type: 'text' }],
  rows: [
    { time: '2026-10-15T11:00:00Z', title: 'Middle', tone: 'warning' },
    { time: '2026-10-15T11:55:00Z', title: 'Newest', tone: 'error' },
    { time: 'garbage', title: 'Unknown time' },
    { time: '2026-10-14T09:00:00Z', title: 'Oldest' },
    { time: '2026-10-15T11:58:00Z', title: '' },
  ],
};
const feedSettings = (over: Sparse = {}) => effective(DATA_FEED, over);
const titles = () => [...document.querySelectorAll('[data-feed-item]')].map((li) => li.querySelector('p, span.truncate')?.textContent);

describe('DataFeedView', () => {
  it('newest first by default; untitled rows skipped; unknown time last', () => {
    render(<DataFeedView settings={feedSettings()} format={{}} data={{ events }} now={NOW} locale="en" />);
    expect(titles()).toEqual(['Newest', 'Middle', 'Oldest', 'Unknown time']);
    expect(screen.getByText('5 minutes ago')).toBeTruthy();
  });

  it('order oldest, max items, colour column, time display and layout change the output', () => {
    render(<DataFeedView settings={feedSettings({ order: 'oldest', maxItems: 2, colorColumn: 'tone', layout: 'compact', timeDisplay: 'date' })} format={{}} data={{ events }} now={NOW} locale="en" />);
    expect(titles()).toEqual(['Oldest', 'Middle']);
    const middle = [...document.querySelectorAll('[data-feed-item]')][1];
    expect((middle.firstChild as HTMLElement).style.background).toBe('var(--warning)');
    expect(screen.queryByText(/ago/)).toBeNull();
  });

  it('groups by day', () => {
    render(<DataFeedView settings={feedSettings({ groupByDay: true })} format={{}} data={{ events }} now={NOW} locale="en" />);
    expect(screen.getAllByRole('heading').length).toBe(3);
  });

  it('isEmpty and toCsv', () => {
    const s = feedSettings();
    expect(DATA_FEED_VIEW.isEmpty!({ events }, s)).toBe(false);
    expect(DATA_FEED_VIEW.isEmpty!({ events: { shape: 'table', rows: [{ title: '' }] } }, s)).toBe(true);
    const csv = DATA_FEED_VIEW.toCsv!({ events }, s, {});
    expect(csv[0]).toEqual(['When', 'What']);
    expect(csv[1]).toEqual(['2026-10-15T11:55:00Z', 'Newest']);
    expect(csv).toHaveLength(5);
    expect(feedItems(events, s).length).toBe(4);
  });
});

// ── map ────────────────────────────────────────────────────────────────────────

const points: SlotData = {
  shape: 'table',
  columns: [
    { key: 'lat', label: 'Lat', type: 'number' }, { key: 'lng', label: 'Lng', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' }, { key: 'id', label: 'Id', type: 'text' },
    { key: 'status', label: 'Status', type: 'badge' }, { key: 'load', label: 'Load', type: 'number' },
  ],
  rows: [
    { lat: 41, lng: 29, name: 'Istanbul', id: 'ist', status: 'success', load: 10 },
    { lat: 39.9, lng: 32.8, name: 'Ankara', id: 'ank', status: 'error', load: 90 },
    { lat: 'x', lng: 1, name: 'Bad', id: 'bad' },
    { lat: 95, lng: 1, name: 'Out of range', id: 'oor' },
  ],
};
const mapSettings = (over: Sparse = {}) => effective(MAP, over);

describe('map', () => {
  it('builds markers from valid rows only, with style, size and tooltip fields', () => {
    const { markers } = buildMarkers(points, mapSettings({ labelColumn: 'name', idColumn: 'id', tooltipColumns: ['status', 'load'], markerStyle: 'dot', markerSize: 30 }));
    expect(markers.map((m) => m.id)).toEqual(['ist', 'ank']);
    expect(markers[0]).toMatchObject({ shape: 'dot', size: 30, color: 'var(--primary)', label: 'Istanbul' });
    expect(markers[0].tooltip?.fields).toEqual([{ label: 'Status', value: 'success' }, { label: 'Load', value: '10' }]);
  });

  it('colours markers from a column or from ranges on a value', () => {
    expect(buildMarkers(points, mapSettings({ colorBy: 'column', colorColumn: 'status' })).markers.map((m) => m.color))
      .toEqual(['var(--success)', 'var(--error)']);
    expect(buildMarkers(points, mapSettings({ colorBy: 'ranges', valueColumn: 'load', ranges: [{ from: 50, color: '#ff0000' }] })).markers.map((m) => m.color))
      .toEqual(['var(--primary)', '#ff0000']);
  });

  it('a link template becomes a tooltip link only when it is internal', () => {
    const ok = buildMarkers(points, mapSettings({ idColumn: 'id', linkTemplate: '/devices/{id}' })).markers;
    expect(ok[0].tooltip?.href).toBe('/devices/ist');
    const bad = buildMarkers(points, mapSettings({ idColumn: 'id', linkTemplate: 'https://evil.example/{id}' })).markers;
    expect(bad[0].tooltip?.href).toBeUndefined();
  });

  it('renders a labelled map region', () => {
    render(<MapWidgetView settings={mapSettings()} format={{}} data={{ points }} ariaLabel="Sites" />);
    expect(screen.getByRole('region', { name: 'Sites' })).toBeTruthy();
  });

  it('isEmpty and toCsv', () => {
    const s = mapSettings({ labelColumn: 'name', tooltipColumns: ['load'] });
    expect(MAP_VIEW.isEmpty!({ points }, s)).toBe(false);
    expect(MAP_VIEW.isEmpty!({ points: { shape: 'table', rows: [{ lat: 'x', lng: 'y' }] } }, s)).toBe(true);
    expect(MAP_VIEW.toCsv!({ points }, s, {})).toEqual([['Lat', 'Lng', 'Name', 'Load'], ['41', '29', 'Istanbul', '10'], ['39.9', '32.8', 'Ankara', '90']]);
  });
});
