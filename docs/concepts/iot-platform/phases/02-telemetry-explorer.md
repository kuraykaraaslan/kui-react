# IoT 02: Telemetry explorer

**Goal:** a per-device telemetry page with live latest values, a history chart on a real time axis with zoom, a raw data table and CSV export, replacing the current metrics page (band-scale chart.js chart, eight hard-coded labels, `rgba(...)` colours and a "mixed" unit axis scaled by ×0.1/×0.01).
**Effort:** M–L.
**Depends on:** 00, 01 (profile key specs for units, precision and ranges); 9.1 (time axis), 9.2 (brush/zoom), 9.4 (heatmap), 9.5 (rolling window), 9.7 (`TimeRangePicker`), 9.11, 9.12, 9.14.
**Demo routes:** `/theme/iot/devices/[slug]/telemetry` (also mounted as the Telemetry tab of the device detail); `/theme/iot/devices/[slug]/metrics` redirects to it.
**NB consumer:** `docs/new-iot-platform/iot_telemetry/` (query API, latest values, websocket namespace contribution); `docs/new-iot-platform/websocket/` (IoT live topics).

## Adapter methods added

`telemetry.keys(deviceId)`, `telemetry.latest(deviceId, keys?)`, `telemetry.history(deviceId, TimeseriesQuery)` (server-side aggregation: `interval`, `agg`), `telemetry.raw(deviceId, query, page)`, `telemetry.export(deviceId, query) => { url } | { blob }`, `telemetry.deleteRange` (Could, behind a capability). Live topic: `telemetry(deviceId, keys)`.

## 2.1 Latest values

- [ ] `LatestValuesTable`: key, label and unit from the profile (01), formatted value with precision, timestamp, age, a `SparkLine` of the last N points, and a `StatusIndicator` that turns stale after `staleAfterMs` (profile setting or 3× the observed interval).
- [ ] Live through `useLiveData` on the device's telemetry topic; a changed value flashes once (off under reduced motion).
- [ ] Row actions: "add to chart", "copy value", "open in dashboard widget" (phase 07).
- [ ] **→ DECISION OD-25 (owner, 2026-10-04):** any topic a device publishes to is accepted as telemetry and carries `metadata.topic`; a non-JSON payload arrives as a single `raw` key (string, size-capped). The explorer shows both:
  - A **Topic** column in `LatestValuesTable` (a chip; empty for the default `v1/telemetry` topic) and a topic filter (multi-select of the topics seen, plus "default topic"). With the profile's "prefix keys with the topic" on (01 §1.4), the key already contains the topic and the chip repeats it only as a filter handle.
  - `raw` values render as monospace text, truncated with "show full" in a `Drawer` and a copy button; they are never charted (the key picker lists them as "text, not chartable") and appear in `TelemetryRawTable` with their topic.
  - ~~**Storage is not decided:** storing the topic (a nullable `topic_id` in a per-tenant topic dictionary) is **proposed by the NB planner, awaiting owner** (NB `docs/new-iot-platform/README.md` §"Telemetry storage, views and load").~~ **→ DECISION OD-34 (owner, 2026-10-04):** the topic is **never stored** — NB uses a ThingsBoard-style `{ data, metadata }` envelope, `metadata.topic` travels only on the live path (stream, rules, alarms, webhooks, live `/iot` stream) and the telemetry tables keep `data` only (no `topic_id`). The UI therefore works when only the **live stream** carries `metadata.topic` (this is now the permanent case): latest values and the live chart tail show the topic from the live topic payload; history, raw table and export ~~show the Topic column only when the adapter reports `capabilities.telemetryTopicStored`, and otherwise~~ hide the column and the history topic filter with a one-line note ("topic is shown for live values only"). Per-topic history comes from topic-prefixed keys (01 §1.4 toggle) or a rule that copies the topic into a telemetry key.
  > **→ DECISION OD-87 / OD-88 (owner, 2026-10-04):** only rule-engine nodes save data ("save telemetry", "save attributes"); only `data` is saved, **metadata is never stored**, and there is no raw-message archive. Every history view in this phase (history chart, raw table, export, heatmap, any history-by-topic view) therefore shows **only keys a flow has saved**: in the tenant's default root flow (save telemetry + save attributes + alarm evaluation) that is every telemetry key, but an edited flow may filter, rename or drop keys. A per-topic history exists only when a flow put the topic into `data` (a topic-prefixed key or a script block) before "save telemetry"; the one-line note above reads "topic is shown for live values only; history holds only keys your flows save".
- [ ] (OD-87) `telemetry.keys(deviceId)` returns the **saved** keys (each with `lastSavedTs`); keys that arrive on the live stream but are not in that list show in `LatestValuesTable` with a "live only — not saved by any flow" tag and a link to the default root flow (README §Cloud rule engine in the MVP); the key picker of the history chart and the export list offers only saved keys, and a live-only key's "add to chart" is disabled with the same reason.
- [ ] Adapter/types: `TimeseriesPoint` and the live telemetry payload gain optional `topic?: string`; `TelemetryKeySpec` gains `valueKind: 'number' | 'boolean' | 'string' | 'raw'`; `TimeseriesQuery` gains an optional `topics?: string[]` filter, sent only when `telemetryTopicStored` is true.
  **→ OD-34:** `TimeseriesPoint.topic` and `TimeseriesQuery.topics` are dropped (history has no topic); only the **live** telemetry payload keeps `topic?: string`. `capabilities.telemetryTopicStored` is not added (it would always be false). (OD-35: `raw` values are up to 4 KB.)

## 2.2 History chart

- [ ] `TelemetryHistoryChart` on the native `LineChart` with `xScale: 'time'` (9.1), `brush` (9.2) and LTTB down-sampling. Decision D3 (README): the chart.js `TelemetryTimeSeriesChart` is deprecated for IoT; keep it exported for one release with a `@deprecated` note pointing here.
  > **→ DECISION OD-15 (owner, 2026-10-04):** confirmed — the IoT chart is the kui-react **native SVG `Chart`** (time axis 9.1, zoom 9.2, `GaugeChart` 9.3, `HeatmapChart` 9.4), at parity with kui-ejs/KUInative; not chart.js. ~~Any chart.js-based IoT telemetry chart~~ is out: `modules/domains/iot/telemetry/TelemetryTimeSeriesChart.tsx` and the metrics page (`app/theme/iot/devices/[slug]/metrics/page.tsx`) stop using chart.js in this phase.
- [ ] (OD-15) Remove the chart.js import from every IoT file (`TelemetryTimeSeriesChart` becomes a thin `@deprecated` wrapper over `TelemetryHistoryChart` for its one release; the `domain-iot.showcase.tsx` entry switches to the native chart). chart.js stays only in non-IoT domains (fintech, media, common), outside this plan.
- [ ] Key picker (multi-select from `telemetry.keys`), at most 6 series; series of different units go on separate stacked panels sharing the x axis instead of one "mixed" axis. Colours come from the chart palette tokens.
- [ ] `TimeRangePicker` (9.7) drives the query; with aggregation `auto` the interval follows the window (`autoInterval`), so zooming in with the brush refetches at a finer interval. Zooming leaves live mode and the picker shows "paused".
  > **→ DECISION OD-31 / OD-32 (owner, 2026-10-04):** ranges over 24 h read the continuous-aggregate rollups `iot_ts_1m` / `iot_ts_1h` / `iot_ts_1d` (avg/min/max/last/count), never raw rows; the dashboard query target is p95 < 300 ms. The UI picks the resolution: `TelemetryHistoryChart` sends `interval` from a fixed ladder (proposed, tuned against the NB load test: raw ≤ 6 h, 1 min ≤ 24 h, 1 min or 1 h ≤ 7 d by point budget, 1 h ≤ 90 d, 1 d beyond) and shows the active resolution ("1 h averages") next to the picker; the user can switch the aggregate (avg/min/max/last) but cannot ask for raw over 24 h — the "raw" option is disabled with a hint until they zoom in.
- [ ] Live mode uses the rolling window (9.5): new points append from the live topic; no refetch per point.
- [ ] Expected min/max from the profile draw as a shaded band; alarm periods for the device (phase 03 data) can be overlaid as markers (Should).
- [ ] Empty range, gap and error states; a "no data in this range, last value at …" hint with a jump link.

## 2.3 Raw data and export

- [ ] `TelemetryRawTable`: paged `ServerDataTable` (timestamp, key, value) for the current window and keys. **→ DECISION OD-87 (owner, 2026-10-04):** "raw" here means the **saved** data points at full resolution, not the received messages: there is no raw-message archive, so the table's caption says "saved values" and nothing in this phase offers "show original message" for history rows. (OD-25: plus a Topic column when stored, and `raw` values as text.) **(OD-31/OD-32)** Raw rows are offered only for windows ≤ 24 h; for longer windows the table shows the rollup buckets (ts, avg, min, max, last, count) instead and says so; paging is server-side, never a full-range fetch.
- [ ] CSV export (9.14) of the current window and keys: client-side for small results, `telemetry.export` (signed URL in NB) above a row threshold the adapter reports. (OD-31) Exports over 24 h export rollup buckets unless the adapter's server-side export explicitly offers raw.

## 2.4 Patterns view (Should)

- [ ] `HeatmapChart` (9.4) of one key as hour of day × weekday over the last 4 weeks (adapter aggregation `avg`), for "is it always hot at 14:00 on Mondays" questions. (OD-15: the native SVG `HeatmapChart`, not a chart.js plugin. OD-31: reads `iot_ts_1h`.)

## 2.5 Log stream

- [ ] The existing `LogStreamRow` list becomes `DeviceLogStream`, bound to a live log topic when the adapter offers one (Roltek routers do via ~~`v1/roltek/*`~~ a device topic; OD-25/OD-33: the default `v1/*` topics or any-topic ingestion, exact topic per NB `_protocol`), with pause/follow and a level filter. Hidden when the adapter reports no log capability.

## Showcase

New Domain entries: `LatestValuesTable`, `TelemetryHistoryChart`, `TelemetryRawTable`, `DeviceLogStream`, `TelemetryExplorerView`.

## Definition of done

- On any seeded device: pick two keys of different units, see two panels on one time axis, zoom with the brush, watch the interval change, export the window as CSV, return to live mode and see points arrive.
- No hard-coded colours or unit scaling remain in IoT telemetry code.
- (OD-15) `grep -rn "chart.js\|react-chartjs" modules/domains/iot app/theme/iot` returns nothing.
- (OD-25) In the demo, a seeded device publishing on `sensors/hall-2/temp` and one sending a non-JSON payload show a Topic chip and a `raw` text value in latest values; with the demo switch "topic stored" off, history hides the Topic column and filter and latest values still show the topic.
- (OD-31/OD-32) Choosing "Last 30 days" requests 1 h or 1 d rollups (visible in the demo adapter's call log and the resolution label); no request for raw rows over a window longer than 24 h is possible from the UI.
- `/theme/iot/devices/[slug]/metrics` no longer renders its own page.
- (OD-87) A seeded device with one key its demo flow does not save shows that key in latest values tagged "live only — not saved by any flow"; the key is absent from the history key picker and the export, and no history view offers a topic or metadata column.
