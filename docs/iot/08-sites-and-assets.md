# IoT 08: Sites and assets

**Goal:** model where devices are: a site → building → floor/line → asset hierarchy, with device placement, health roll-up per node and a site map.
**Effort:** M.
**Depends on:** 00, 01; 9.8 (live `MapView`), 9.9 (`KeyValueEditor`), 9.12.
**Demo routes:** `/theme/iot/assets` (tree + site map) · `/theme/iot/assets/[id]` (asset detail with placed devices).
**NB consumer:** `docs/new-iot-platform/iot_asset/` (hierarchy, device links, relation graph). NB's existing `asset` module (custody register) is unrelated and stays separate; the UI says "Sites & assets", never just "Assets", to avoid the clash.

## Adapter methods added

`assets.tree(rootId?)`, `assets.get/create/update/delete/move(id, newParentId)`, `assets.devices(id, { recursive })`, `assets.placeDevice(assetId, deviceId)`, `assets.unplaceDevice`, `assets.rollup(id)` (device count, online count, worst open alarm severity; **→ DECISION OD-9 (owner, 2026-10-04):** "worst" follows the five-level order CRITICAL > MAJOR > MINOR > WARNING > INFO from phase 03's `alarm-severity.ts`). Live: reuses `deviceState` and `alarms` topics; the roll-up recomputes client-side from them. (**→ DECISION OD-31 (owner, 2026-10-04):** the initial roll-up in NB comes from `iot_device_status` and `iot_open_alarms`, one query per tree level, never per device. These are live-stream topic names of the adapter, not device MQTT topics.)

## 8.1 Hierarchy tree

- [ ] `AssetTree` on `TreeView`: node types (site, building, floor, line, asset) with icons, a badge for device count, and a roll-up `StatusIndicator` (worst open alarm wins) per node; lazy-loads children.
- [ ] Create, rename, delete (with a "move children to parent" option), drag-and-drop reparent with keyboard alternative ("Move to…" dialog).
- [ ] Search in the tree with path highlighting.

## 8.2 Asset detail and device placement

- [ ] `AssetDetailView`: header with type and path breadcrumb, attributes through `KeyValueEditor` (9.9), location (lat/lng picked on a `MapView`, optional for indoor nodes), placed devices table (phase 01 device table, filtered), "place device" picker (search unplaced devices, multi-select), unplace.
- [ ] Child nodes summary cards with their roll-ups.
- [ ] Link to the twin view when the asset has a model (phase 09).

## 8.3 Site map

- [ ] `SiteMapView`: `MapView` (9.8) with one marker per site/asset that has a location; marker variant = roll-up status; clustering on; live; click selects the node in the tree.
- [ ] Outdoor gateways with their own location appear as device markers on the same map (this is the 2D counterpart of kui-viewer phase 28's site-map mode).

## Showcase

New Domain entries: `AssetTree`, `AssetDetailView`, `DevicePlacementPicker`, `SiteMapView`, `AssetRollupBadge`.

## Definition of done

- In the demo: build a site → building → line path, place two devices on the line, see the line, building and site turn red when a mock alarm opens on one of them and recover when it clears; drag the line to another building.
