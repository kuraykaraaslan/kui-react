'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { DeviceStatusBadge } from '@/modules/domains/iot/device/DeviceStatusBadge';
import { DeviceTypeBadge } from '@/modules/domains/iot/device/DeviceTypeBadge';
import { AlertSeverityBadge } from '@/modules/domains/iot/alert/AlertSeverityBadge';
import { DeviceCard } from '@/modules/domains/iot/device/DeviceCard';
import { CloudWorkspaceCard } from '@/modules/domains/iot/workspace/CloudWorkspaceCard';
import { RulesetEditor } from '@/modules/domains/iot/ruleset/RulesetEditor';
import { MetricSparklineCard } from '@/modules/domains/iot/telemetry/MetricSparklineCard';
import { TelemetryTimeSeriesChart } from '@/modules/domains/iot/telemetry/TelemetryTimeSeriesChart';
import { LogStreamRow } from '@/modules/domains/iot/telemetry/LogStreamRow';
import { AlertDetailHeader } from '@/modules/domains/iot/alert/AlertDetailHeader';
import { AlertEventTimeline } from '@/modules/domains/iot/alert/AlertEventTimeline';
import type { Device, CloudWorkspace, RuleNode, RuleEdge } from '@/modules/domains/iot/types';

/* ─── demo data ─── */

const DEMO_DEVICE_ONLINE: Device = {
  deviceId: 'dev-demo-001',
  name: 'Press Line Sensor A1',
  slug: 'press-line-sensor-a1',
  type: 'INTERNAL',
  role: 'DEVICE',
  status: 'ONLINE',
  cloudId: 'cloud-demo',
  model: 'Nexus S200',
  firmware: 'v2.4.1',
  tags: ['production', 'critical'],
  location: { lat: 52.52, lng: 13.405, label: 'Hall A — Bay 3' },
  lastSeenAt: new Date(Date.now() - 45_000),
};

const DEMO_DEVICE_ERROR: Device = {
  deviceId: 'dev-demo-002',
  name: 'Coolant Temp Monitor',
  slug: 'coolant-temp-monitor',
  type: 'INTERNAL',
  role: 'DEVICE',
  status: 'ERROR',
  cloudId: 'cloud-demo',
  model: 'Nexus T100',
  firmware: 'v2.3.8',
  tags: ['coolant', 'temperature'],
  location: { lat: 52.519, lng: 13.404, label: 'Hall A — Coolant Station' },
  lastSeenAt: new Date(Date.now() - 720_000),
};

const DEMO_GATEWAY: Device = {
  deviceId: 'dev-demo-003',
  name: 'Assembly Robot Gateway',
  slug: 'assembly-robot-gateway',
  type: 'INTERNAL',
  role: 'GATEWAY',
  status: 'ONLINE',
  cloudId: 'cloud-demo',
  model: 'Nexus GW500',
  firmware: 'v3.1.0',
  tags: ['assembly', 'gateway'],
  lastSeenAt: new Date(Date.now() - 12_000),
};

const DEMO_WORKSPACE_ACTIVE: CloudWorkspace = {
  cloudId: 'cloud-demo-001',
  name: 'Smart Factory Alpha',
  slug: 'smart-factory-alpha',
  status: 'ACTIVE',
  plan: 'ENTERPRISE',
  deviceCount: 142,
  onlineCount: 138,
  memberCount: 12,
  customDomain: 'iot.acme-factory.com',
  region: 'EU-West',
};

const DEMO_WORKSPACE_SUSPENDED: CloudWorkspace = {
  cloudId: 'cloud-demo-002',
  name: 'Legacy Pilot',
  slug: 'legacy-pilot',
  status: 'SUSPENDED',
  plan: 'FREE',
  deviceCount: 4,
  onlineCount: 0,
  memberCount: 1,
  region: 'US-West',
};

/* ─── rule engine demo data ─── */

const DEMO_NODES: RuleNode[] = [
  { nodeId: 'n1', type: 'TRIGGER',   label: 'MQTT Ingress',   x: 30,  y: 60  },
  { nodeId: 'n2', type: 'FILTER',    label: 'Temp > 85 °C',   x: 240, y: 60  },
  { nodeId: 'n3', type: 'ACTION',    label: 'Send Alert',     x: 460, y: 20  },
  { nodeId: 'n4', type: 'ACTION',    label: 'Log Reading',    x: 460, y: 140 },
];

const DEMO_EDGES: RuleEdge[] = [
  { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out',   targetNodeId: 'n2', targetPort: 'in' },
  { edgeId: 'e2', sourceNodeId: 'n2', sourcePort: 'true',  targetNodeId: 'n3', targetPort: 'in' },
  { edgeId: 'e3', sourceNodeId: 'n2', sourcePort: 'false', targetNodeId: 'n4', targetPort: 'in' },
];

/* ─── showcase builder ─── */

export function buildIoTDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'iot-device-status-badge',
      title: 'DeviceStatusBadge',
      category: 'Domain',
      abbr: 'DS',
      description: 'Displays device connectivity state — Online, Offline, Error, or Maintenance.',
      filePath: 'modules/domains/iot/device/DeviceStatusBadge.tsx',
      sourceCode: `'use client';
import { Badge } from '@/modules/ui/Badge';
import type { DeviceStatus } from '../types';

export function DeviceStatusBadge({ status, size = 'md', className }) {
  // ...
}`,
      variants: [
        {
          title: 'All states',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <DeviceStatusBadge status="ONLINE" />
              <DeviceStatusBadge status="OFFLINE" />
              <DeviceStatusBadge status="ERROR" />
              <DeviceStatusBadge status="MAINTENANCE" />
            </div>
          ),
          code: `<DeviceStatusBadge status="ONLINE" />
<DeviceStatusBadge status="OFFLINE" />
<DeviceStatusBadge status="ERROR" />
<DeviceStatusBadge status="MAINTENANCE" />`,
        },
        {
          title: 'Small size',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <DeviceStatusBadge status="ONLINE" size="sm" />
              <DeviceStatusBadge status="ERROR" size="sm" />
            </div>
          ),
          code: `<DeviceStatusBadge status="ONLINE" size="sm" />
<DeviceStatusBadge status="ERROR" size="sm" />`,
        },
      ],
    },
    {
      id: 'iot-device-type-badge',
      title: 'DeviceTypeBadge',
      category: 'Domain',
      abbr: 'DT',
      description: 'Indicates device origin — Internal first-party hardware, third-party Integration, or External feed.',
      filePath: 'modules/domains/iot/device/DeviceTypeBadge.tsx',
      sourceCode: `'use client';
import { Badge } from '@/modules/ui/Badge';
import type { DeviceType } from '../types';

export function DeviceTypeBadge({ type, size = 'md', className }) {
  // ...
}`,
      variants: [
        {
          title: 'All types',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <DeviceTypeBadge type="INTERNAL" />
              <DeviceTypeBadge type="INTEGRATION" />
              <DeviceTypeBadge type="EXTERNAL" />
            </div>
          ),
          code: `<DeviceTypeBadge type="INTERNAL" />
<DeviceTypeBadge type="INTEGRATION" />
<DeviceTypeBadge type="EXTERNAL" />`,
        },
        {
          title: 'Small size',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <DeviceTypeBadge type="INTERNAL" size="sm" />
              <DeviceTypeBadge type="INTEGRATION" size="sm" />
            </div>
          ),
          code: `<DeviceTypeBadge type="INTERNAL" size="sm" />
<DeviceTypeBadge type="INTEGRATION" size="sm" />`,
        },
      ],
    },
    {
      id: 'iot-alert-severity-badge',
      title: 'AlertSeverityBadge',
      category: 'Domain',
      abbr: 'AS',
      description: 'Alert severity indicator — Info, Warning, or Critical.',
      filePath: 'modules/domains/iot/alert/AlertSeverityBadge.tsx',
      sourceCode: `'use client';
import { Badge } from '@/modules/ui/Badge';
import type { AlertSeverity } from '../types';

export function AlertSeverityBadge({ severity, size = 'md', className }) {
  // ...
}`,
      variants: [
        {
          title: 'All severities',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <AlertSeverityBadge severity="INFO" />
              <AlertSeverityBadge severity="WARNING" />
              <AlertSeverityBadge severity="CRITICAL" />
            </div>
          ),
          code: `<AlertSeverityBadge severity="INFO" />
<AlertSeverityBadge severity="WARNING" />
<AlertSeverityBadge severity="CRITICAL" />`,
        },
        {
          title: 'Small',
          layout: 'side',
          preview: (
            <div className="flex flex-wrap gap-2">
              <AlertSeverityBadge severity="WARNING" size="sm" />
              <AlertSeverityBadge severity="CRITICAL" size="sm" />
            </div>
          ),
          code: `<AlertSeverityBadge severity="WARNING" size="sm" />
<AlertSeverityBadge severity="CRITICAL" size="sm" />`,
        },
      ],
    },
    {
      id: 'iot-device-card',
      title: 'DeviceCard',
      category: 'Domain',
      abbr: 'DC',
      description: 'Compact device summary card showing status, type, location, last-seen time and tags.',
      filePath: 'modules/domains/iot/device/DeviceCard.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';
import { DeviceStatusBadge } from './DeviceStatusBadge';
import { DeviceTypeBadge } from './DeviceTypeBadge';
import type { Device } from '../types';

export function DeviceCard({ device, className, onClick }) {
  // ...
}`,
      variants: [
        {
          title: 'Online device',
          layout: 'side',
          preview: (
            <div className="max-w-xs">
              <DeviceCard device={DEMO_DEVICE_ONLINE} />
            </div>
          ),
          code: `<DeviceCard device={device} />`,
        },
        {
          title: 'Error + Gateway',
          layout: 'side',
          preview: (
            <div className="flex flex-col gap-3 max-w-xs">
              <DeviceCard device={DEMO_DEVICE_ERROR} />
              <DeviceCard device={DEMO_GATEWAY} />
            </div>
          ),
          code: `<DeviceCard device={errorDevice} />
<DeviceCard device={gatewayDevice} />`,
        },
      ],
    },
    {
      id: 'iot-cloud-workspace-card',
      title: 'CloudWorkspaceCard',
      category: 'Domain',
      abbr: 'CW',
      description: 'Cloud workspace overview card — status, plan, device counts with online progress bar.',
      filePath: 'modules/domains/iot/workspace/CloudWorkspaceCard.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import type { CloudWorkspace } from '../types';

export function CloudWorkspaceCard({ workspace, className, onClick }) {
  // ...
}`,
      variants: [
        {
          title: 'Active workspace',
          layout: 'side',
          preview: (
            <div className="max-w-sm">
              <CloudWorkspaceCard workspace={DEMO_WORKSPACE_ACTIVE} />
            </div>
          ),
          code: `<CloudWorkspaceCard workspace={workspace} />`,
        },
        {
          title: 'Suspended workspace',
          layout: 'side',
          preview: (
            <div className="max-w-sm">
              <CloudWorkspaceCard workspace={DEMO_WORKSPACE_SUSPENDED} />
            </div>
          ),
          code: `<CloudWorkspaceCard workspace={suspendedWorkspace} />`,
        },
      ],
    },
    {
      id: 'iot-ruleset-editor',
      title: 'RulesetEditor',
      category: 'Domain',
      abbr: 'RE',
      description: 'Drag-and-drop visual rule chain editor — build telemetry pipelines with Trigger, Filter, Switch, Transform, and Action nodes.',
      filePath: 'modules/domains/iot/ruleset/RulesetEditor.tsx',
      sourceCode: `'use client';
// Drag nodes from palette onto the canvas.
// Click output ports (filled) → input ports (hollow) to wire them.
// Click an edge to delete it. Select a node to reveal the delete button.

export function RulesetEditor({ initialNodes, initialEdges, readOnly, className }) {
  // ...
}`,
      variants: [
        {
          title: 'With pre-loaded chain',
          layout: 'stack',
          preview: (
            <div className="h-72 w-full rounded-xl overflow-hidden border border-border">
              <RulesetEditor
                initialNodes={DEMO_NODES}
                initialEdges={DEMO_EDGES}
              />
            </div>
          ),
          code: `<RulesetEditor
  initialNodes={nodes}
  initialEdges={edges}
/>`,
        },
        {
          title: 'Empty canvas (editable)',
          layout: 'stack',
          preview: (
            <div className="h-64 w-full rounded-xl overflow-hidden border border-border">
              <RulesetEditor />
            </div>
          ),
          code: `<RulesetEditor />`,
        },
      ],
    },
    {
      id: 'iot-metric-sparkline-card',
      title: 'MetricSparklineCard',
      category: 'Domain',
      abbr: 'MS',
      description: 'KPI tile with current value, unit, delta-vs-prev, and an inline SVG sparkline. No deps.',
      filePath: 'modules/domains/iot/telemetry/MetricSparklineCard.tsx',
      sourceCode: `import { MetricSparklineCard } from '@/modules/domains/iot/telemetry/MetricSparklineCard';
<MetricSparklineCard label="CPU" value={36} unit="%" series={[28,30,33,...]} deltaPct={5.2} goodWhen="down" />`,
      variants: [
        {
          title: 'Four KPIs',
          layout: 'stack',
          preview: (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricSparklineCard label="CPU"        value={36}  unit="%"   series={[28, 30, 33, 31, 36, 38, 35, 34, 37, 36]} deltaPct={5.2}  goodWhen="down" />
              <MetricSparklineCard label="Memory"     value={63}  unit="%"   series={[58, 60, 61, 62, 60, 63, 64, 62, 61, 63]} deltaPct={1.8}  goodWhen="down" />
              <MetricSparklineCard label="Network"    value={148} unit="kb/s" series={[120, 130, 110, 140, 138, 142, 150, 144, 150, 148]} deltaPct={-3.1} goodWhen="up" />
              <MetricSparklineCard label="Temp"       value={66}  unit="°C"  series={[62, 63, 64, 66, 68, 67, 69, 66]} deltaPct={4.4} goodWhen="down" />
            </div>
          ),
          code: `<MetricSparklineCard label="CPU" value={36} unit="%" series={[...]} deltaPct={5.2} goodWhen="down" />`,
        },
        {
          title: 'No delta',
          layout: 'stack',
          preview: (
            <div className="max-w-xs">
              <MetricSparklineCard label="Idle metric" value="—" series={[1, 1, 1, 1]} />
            </div>
          ),
          code: `<MetricSparklineCard label="Idle metric" value="—" series={[1,1,1,1]} />`,
        },
      ],
    },
    {
      id: 'iot-telemetry-time-series-chart',
      title: 'TelemetryTimeSeriesChart',
      category: 'Domain',
      abbr: 'TS',
      description: 'Multi-line time-series chart built on chart.js. Supports any number of series with custom colors.',
      filePath: 'modules/domains/iot/telemetry/TelemetryTimeSeriesChart.tsx',
      sourceCode: `import { TelemetryTimeSeriesChart } from '@/modules/domains/iot/telemetry/TelemetryTimeSeriesChart';
<TelemetryTimeSeriesChart title="..." labels={['12:00', ...]} series={[{ label, color, data }]} />`,
      variants: [
        {
          title: 'Vibration / Temp / RPM',
          layout: 'stack',
          preview: (
            <TelemetryTimeSeriesChart
              title="Vibration, temperature, RPM"
              subtitle="Last 35 minutes · 5-minute resolution"
              labels={['12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35']}
              series={[
                { label: 'Vibration (G)',  color: 'rgba(239, 68, 68, 1)',  data: [0.9, 1.1, 1.0, 1.2, 1.4, 1.3, 1.5, 1.2] },
                { label: 'Temperature (°C × 0.1)', color: 'rgba(245, 158, 11, 1)', data: [6.2, 6.3, 6.4, 6.6, 6.8, 6.7, 6.9, 6.6] },
                { label: 'RPM (× 0.01)',   color: 'rgba(59, 130, 246, 1)', data: [14.1, 14.3, 14.5, 14.7, 14.9, 14.8, 15, 14.6] },
              ]}
            />
          ),
          code: `<TelemetryTimeSeriesChart title="..." labels={[...]} series={[{ label, color, data }, ...]} />`,
        },
      ],
    },
    {
      id: 'iot-log-stream-row',
      title: 'LogStreamRow',
      category: 'Domain',
      abbr: 'LS',
      description: 'Monospace log entry: timestamp, level tag (DBG/INF/WRN/ERR/FTL), source, and message body.',
      filePath: 'modules/domains/iot/telemetry/LogStreamRow.tsx',
      sourceCode: `import { LogStreamRow } from '@/modules/domains/iot/telemetry/LogStreamRow';
<LogStreamRow timestamp={date} level="info" source="mqtt.client" message="..." />`,
      variants: [
        {
          title: 'All five levels',
          layout: 'stack',
          preview: (
            <ol className="rounded-xl border border-border overflow-hidden bg-surface-base max-w-3xl">
              <LogStreamRow timestamp={new Date()} level="debug" source="sensor.driver" message="Read cycle 0x9F1 — within tolerance" />
              <LogStreamRow timestamp={new Date()} level="info"  source="mqtt.client"   message="Published telemetry payload (4 fields, 218 bytes)" />
              <LogStreamRow timestamp={new Date()} level="warn"  source="rule.engine"   message='Vibration trending up — re-check at next sample' />
              <LogStreamRow timestamp={new Date()} level="error" source="firmware.watch" message="Calibration timer reset due to missed tick" />
              <LogStreamRow timestamp={new Date()} level="fatal" source="kernel"        message="Subsystem panic — restarting in 5s" />
            </ol>
          ),
          code: `<LogStreamRow timestamp={date} level="warn" source="..." message="..." />`,
        },
      ],
    },
    {
      id: 'iot-alert-detail-header',
      title: 'AlertDetailHeader',
      category: 'Domain',
      abbr: 'AH',
      description: 'Header for an alert detail page: severity + status badges, device link, opened timestamp, action buttons.',
      filePath: 'modules/domains/iot/alert/AlertDetailHeader.tsx',
      sourceCode: `import { AlertDetailHeader } from '@/modules/domains/iot/alert/AlertDetailHeader';
<AlertDetailHeader title="..." severity="CRITICAL" status="OPEN" deviceName="..." openedAt={date} onAcknowledge={...} />`,
      variants: [
        {
          title: 'Critical / open',
          layout: 'stack',
          preview: (
            <AlertDetailHeader
              title="Temperature threshold exceeded"
              message="Coolant temperature reached 94°C — above the critical threshold of 85°C. Immediate inspection required."
              severity="CRITICAL"
              status="OPEN"
              deviceName="Coolant Temp Monitor"
              deviceHref="#"
              openedAt={new Date(Date.now() - 720_000)}
              onAcknowledge={() => undefined}
              onResolve={() => undefined}
              onOpenRunbook={() => undefined}
            />
          ),
          code: `<AlertDetailHeader title="…" severity="CRITICAL" status="OPEN" deviceName="…" openedAt={date} />`,
        },
        {
          title: 'Warning / acknowledged',
          layout: 'stack',
          preview: (
            <AlertDetailHeader
              title="Vibration spike detected"
              message="Vibration reading exceeded 8.2 G on axis Z. Sensor A1 may require recalibration."
              severity="WARNING"
              status="ACKNOWLEDGED"
              deviceName="Press Line Sensor A1"
              openedAt={new Date(Date.now() - 3_600_000)}
              onResolve={() => undefined}
              onOpenRunbook={() => undefined}
            />
          ),
          code: `<AlertDetailHeader severity="WARNING" status="ACKNOWLEDGED" />`,
        },
      ],
    },
    {
      id: 'iot-alert-event-timeline',
      title: 'AlertEventTimeline',
      category: 'Domain',
      abbr: 'AE',
      description: 'Chronological event log for an alert: opened → acknowledged → resolved, with operator notes.',
      filePath: 'modules/domains/iot/alert/AlertEventTimeline.tsx',
      sourceCode: `import { AlertEventTimeline } from '@/modules/domains/iot/alert/AlertEventTimeline';
<AlertEventTimeline events={[{ eventId, kind: 'opened', by, at, note }]} />`,
      variants: [
        {
          title: 'Five event kinds',
          layout: 'stack',
          preview: (
            <AlertEventTimeline
              events={[
                { eventId: 'e1', kind: 'opened',       by: 'rule-engine', at: new Date(Date.now() - 720_000), note: 'Triggered by rule "Coolant > 85°C".' },
                { eventId: 'e2', kind: 'automation',   by: 'paging-bot',  at: new Date(Date.now() - 700_000), note: 'On-call paged via SMS + Slack.' },
                { eventId: 'e3', kind: 'note',         by: 'jane.k',      at: new Date(Date.now() - 540_000), note: 'Investigating — coolant pump pressure normal.' },
                { eventId: 'e4', kind: 'acknowledged', by: 'mike.t',      at: new Date(Date.now() - 300_000) },
                { eventId: 'e5', kind: 'resolved',     by: 'mike.t',      at: new Date(Date.now() - 60_000),  note: 'Faulty sensor replaced.' },
              ]}
            />
          ),
          code: `<AlertEventTimeline events={[{ kind: 'opened', ... }, { kind: 'resolved', ... }]} />`,
        },
      ],
    },
  ];
}
