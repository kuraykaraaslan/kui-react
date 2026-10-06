# IoT 09: Digital twin

**Goal:** a twin page that embeds kui-viewer for a site or building: live sensor values on the model, alarm colouring, a device ↔ element binding editor, a history scrubber with trend charts, and a site-map mode for outdoor gateways. kui-react owns the page chrome and the side panels; kui-viewer owns the 3D canvas.
**Effort:** L.
**Depends on:** 00, 02 (trend chart), 03 (alarm data), 08 (the asset the twin belongs to); **kui-viewer phase 28** (`$KUIVIEWER_ROOT/phases/phase-28-iot-platform-integration.md`), which supplies the host-fed telemetry provider, host alarm feed, binding API, history provider and the React embedding contract.
**Demo routes:** `/theme/iot/twin` (sample building) · `/theme/iot/assets/[id]/twin`.
**NB consumer:** `docs/new-iot-platform/iot_twin/`.

## What already exists

- kui-react already depends on `@kuraykaraaslan/kui-viewer` and lazy-loads `kui-viewer/react` in `modules/showcase/data/sections/lib-kui-viewer.showcase.tsx`, with the public sample IFC (`https://kui-viewer.kuray.dev/hause.ifc`). The twin page reuses that import pattern (client-only, lazy).
- kui-viewer ships sensor sprites, a coalescing ≤10 Hz throttle, threshold alarm state and React hooks for sprites/clicks (phase 6, shipped). Phase 28 makes them reachable by a host.

## 9.1 Twin view

- [ ] `DigitalTwinView({ assetId })`: loads the asset's model reference and bindings through `adapter.twin`, mounts `KUIViewer` (lazy, `ssr: false`) with the phase 28 props, and lays out: viewer canvas, a right `Drawer`/panel for the selection, a bottom trend/scrubber strip.
- [ ] Bridge the adapter's live source into the viewer's host-fed telemetry provider (phase 28, item 1): one subscription to the bound device keys, values pushed in the viewer's message shape. kui-react widgets on the same page (latest values) use the same subscription through 9.11, so one host socket serves both.
  > **→ DECISION OD-3 (owner, 2026-10-04):** host-fed provider. NB's Socket.IO client (inside NB's adapter, never in kui-react) feeds the viewer through kui-viewer's `TelemetrySourceFactory` (phase 28 `createHostTelemetrySource()`); the viewer opens no socket. This task is the kui-react half of that bridge: `IotLive` → `push(messages)` + `setConnectionState(state)`.
- [ ] Bridge alarms (phase 03 data + live topic) into the viewer's host alarm feed (phase 28, item 2); clicking an alarm marker opens the phase 03 alarm drawer.
  > **→ DECISION OD-9 (owner, 2026-10-04):** the bridge maps the five severities onto the viewer's `level: 'warn' | 'alarm'` in one function next to `alarm-severity.ts`. Proposed mapping (not decided): CRITICAL/MAJOR → `alarm`, MINOR/WARNING → `warn`, INFO → not pushed (no colour change).
- [ ] Selection panel: on sensor/element select, show device name, latest values for the bound keys, open alarms and links to device/telemetry pages (kui-react components, not viewer UI).
- [ ] Viewer theming from kui-react tokens through the phase 28 host-token mapping; dark mode follows the app.

## 9.2 Binding editor

- [ ] `TwinBindingEditor`: "bind mode" toggle; pick an element in the viewer (phase 28 element pick), then choose a device and key(s) in a kui-react panel; list of bindings with unresolved ones flagged (element missing in the current model revision); remove/rebind.
- [ ] Changes are collected from the viewer's binding-change events and saved through `adapter.twin.saveBindings(assetId, diff)`; respects `canEditTwin`.

## 9.3 History and trends

- [ ] Trend chart for the selected sensor rendered by kui-react (`TelemetryHistoryChart`, phase 02), fed by the same adapter `telemetry.history`. The viewer's own Chart.js trend (kui-viewer mvp.md §2.8) is not used inside the app, so the app has one chart look. **→ DECISION OD-15 (owner, 2026-10-04):** confirmed; the trend is the kui-react native SVG `Chart`, not chart.js.
- [ ] Scrubber: `TimeRangePicker` (9.7) + playback controls bound to the viewer's history provider/data clock (phase 28, item 4); during playback the viewer replays historical values and live values buffer; "back to live" resumes.
  > **→ DECISION OD-31 / OD-32 (owner, 2026-10-04):** the `HistoryProvider` the page passes to the viewer sets `bucket_ms` from the phase 02 resolution ladder, so replay over more than 24 h reads the `iot_ts_1m`/`1h`/`1d` rollups, never raw rows.
  > **→ DECISION OD-87 (owner, 2026-10-04):** only keys a flow saved have history (metadata is never stored). The binding editor (§9.2) marks a bound key that is live only ("not saved by any flow, no replay") using phase 02's saved-key list, and during playback such a sensor shows the viewer's no-data look instead of its last live value.

## 9.4 Site-map mode

- [ ] For assets without a building model (outdoor gateways, cabinets), the twin page opens the viewer's site-map mode (phase 28, item 6) with gateways as live status points on the basemap. When the 3D context adds nothing, `/theme/iot/assets` (phase 08) already shows the same data on the 2D `MapView`; the twin page offers both and remembers the choice.

## Showcase

New Domain entries: `DigitalTwinView` (sample model, mock feed), `TwinBindingEditor`, `TwinSelectionPanel`.

## Definition of done

- In the demo: open the sample building, see mock values on sensor sprites, an alarm turns its sensor red and the selection panel shows it; bind a new element to a device key and see it go live; scrub the last hour and return to live; switch to site-map mode.
- No Socket.IO or NB URL inside kui-react or kui-viewer: all data enters through the adapter and the phase 28 provider interfaces.
- (OD-3) The viewer on the twin page opens no WebSocket of its own (checked in the browser's network panel in the demo): values arrive only through `createHostTelemetrySource().push`.
