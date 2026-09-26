/* Sample data for the rulesets pages: templates for "New ruleset", recently
   deleted rulesets and the user that saves versions. No backend. */
import type { RuleChain } from '@/modules/domains/iot/types';
import type { DeletedRuleset, RulesetTemplate } from '@/modules/domains/iot/ruleset/transfer';

/** who saves versions in this demo */
export const CURRENT_USER = 'jane.k';

/* ─── Templates ─── */

export const RULESET_TEMPLATES: RulesetTemplate[] = [
  {
    id: 'button-press-log',
    category: 'Inputs',
    title: 'Button press log',
    description: 'Write a log entry every time a panel button is pressed.',
    name: '{{button}} press log',
    inputs: [
      { key: 'button', label: 'Button name', kind: 'text', default: 'Panel button 1' },
      { key: 'topic', label: 'MQTT topic', kind: 'text', default: 'site/panel/button1', hint: 'The topic the button publishes to.' },
      { key: 'level', label: 'Log level', kind: 'select', default: 'info',
        options: [{ value: 'info', label: 'Info' }, { value: 'warning', label: 'Warning' }] },
    ],
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: 'MQTT {{topic}}', x: 60, y: 80,
        script: '// Messages published on {{topic}}\nreturn msg;' },
      { nodeId: 'n2', type: 'FILTER', label: 'Pressed?', x: 290, y: 80,
        script: "return msg.state === 'pressed';" },
      { nodeId: 'n3', type: 'ACTION', label: 'Log press ({{level}})', x: 520, y: 40,
        script: "send({\n  level: {{json:level}},\n  message: {{json:button}} + ' pressed',\n  at: new Date().toISOString(),\n});" },
    ],
    edges: [
      { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' },
      { edgeId: 'e2', sourceNodeId: 'n2', sourcePort: 'true', targetNodeId: 'n3', targetPort: 'in' },
    ],
  },
  {
    id: 'digital-input-change',
    category: 'Inputs',
    title: 'Digital input change',
    description: 'Raise an alarm when a digital input changes, after a short debounce.',
    name: '{{input}} change',
    inputs: [
      { key: 'input', label: 'Input', kind: 'select', default: 'DI1',
        options: ['DI1', 'DI2', 'DI3', 'DI4'].map((v) => ({ value: v, label: v })) },
      { key: 'edge', label: 'Change', kind: 'select', default: 'both',
        options: [{ value: 'rising', label: 'Off → on' }, { value: 'falling', label: 'On → off' }, { value: 'both', label: 'Any change' }] },
      { key: 'debounce', label: 'Debounce', kind: 'duration', default: 2, min: 1, max: 3600, hint: 'Seconds the new state must hold.' },
    ],
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: '{{input}} state', x: 60, y: 80 },
      { nodeId: 'n2', type: 'DELAY', label: 'Debounce {{debounce}}', x: 280, y: 80,
        script: 'return {{json:debounce}} * 1000;' },
      { nodeId: 'n3', type: 'FILTER', label: 'Changed ({{edge}})?', x: 500, y: 80,
        script: "var edge = {{json:edge}};\nif (edge === 'both') return msg.value !== msg.previous;\nreturn edge === 'rising'\n  ? msg.previous === 0 && msg.value === 1\n  : msg.previous === 1 && msg.value === 0;" },
      { nodeId: 'n4', type: 'ALARM', label: '{{input}} changed', x: 720, y: 40 },
    ],
    edges: [
      { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' },
      { edgeId: 'e2', sourceNodeId: 'n2', sourcePort: 'out', targetNodeId: 'n3', targetPort: 'in' },
      { edgeId: 'e3', sourceNodeId: 'n3', sourcePort: 'true', targetNodeId: 'n4', targetPort: 'in' },
    ],
  },
  {
    id: 'analog-above-limit',
    category: 'Monitoring',
    title: 'Analog value above limit',
    description: 'Raise an alarm when a reading stays above a limit.',
    name: '{{channel}} above {{limit}} {{unit}}',
    inputs: [
      { key: 'channel', label: 'Channel', kind: 'select', default: 'AI1',
        options: [{ value: 'AI1', label: 'AI1' }, { value: 'AI2', label: 'AI2' }, { value: 'temperature', label: 'Temperature' }] },
      { key: 'limit', label: 'Limit', kind: 'number', default: 80, min: -1000, max: 100000 },
      { key: 'unit', label: 'Unit', kind: 'text', default: '°C', required: false },
      { key: 'hold', label: 'Must stay above for', kind: 'duration', default: 30, min: 1, max: 86400 },
    ],
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: '{{channel}} reading', x: 60, y: 100 },
      { nodeId: 'n2', type: 'FILTER', label: 'Above {{limit}} {{unit}}?', x: 280, y: 100,
        script: 'return msg.value > {{json:limit}};' },
      { nodeId: 'n3', type: 'DELAY', label: 'Hold {{hold}}', x: 500, y: 40,
        script: 'return {{json:hold}} * 1000;' },
      { nodeId: 'n4', type: 'ALARM', label: 'Raise {{channel}} alarm', x: 720, y: 40,
        script: "return {\n  name: {{json:channel}} + ' above limit',\n  severity: 'MAJOR',\n  details: { value: msg.value, limit: {{json:limit}} },\n};" },
      { nodeId: 'n5', type: 'ACTION', label: 'Log normal reading', x: 500, y: 200 },
    ],
    edges: [
      { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' },
      { edgeId: 'e2', sourceNodeId: 'n2', sourcePort: 'true', targetNodeId: 'n3', targetPort: 'in' },
      { edgeId: 'e3', sourceNodeId: 'n3', sourcePort: 'out', targetNodeId: 'n4', targetPort: 'in' },
      { edgeId: 'e4', sourceNodeId: 'n2', sourcePort: 'false', targetNodeId: 'n5', targetPort: 'in' },
    ],
  },
  {
    id: 'daily-schedule',
    category: 'Schedules',
    title: 'Daily schedule',
    description: 'Run an action at a set time on chosen days.',
    name: '{{action}} at {{time}}',
    inputs: [
      { key: 'time', label: 'Time', kind: 'time', default: '07:30' },
      { key: 'days', label: 'Days', kind: 'weekdays', default: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      { key: 'action', label: 'Action', kind: 'select', default: 'relay-on',
        options: [{ value: 'relay-on', label: 'Turn relay on' }, { value: 'relay-off', label: 'Turn relay off' }, { value: 'report', label: 'Send daily report' }] },
    ],
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: 'At {{time}}, {{days}}', x: 60, y: 80,
        script: '// Schedule: runs at {{time}} on {{days}}\nreturn { at: {{json:time}}, days: {{json:days}} };' },
      { nodeId: 'n2', type: 'ACTION', label: '{{action}}', x: 290, y: 80,
        script: 'send({ command: {{json:action}}, deviceId: metadata.deviceId });' },
    ],
    edges: [
      { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' },
    ],
  },
  {
    id: 'heartbeat-watchdog',
    category: 'Monitoring',
    title: 'Heartbeat watchdog',
    description: 'Raise an alarm and call a webhook when a device stops sending heartbeats.',
    name: '{{device}} heartbeat watchdog',
    inputs: [
      { key: 'device', label: 'Device', kind: 'text', default: 'Gateway 01' },
      { key: 'timeout', label: 'Missing after', kind: 'duration', default: 300, min: 10, max: 86400 },
      { key: 'webhook', label: 'Webhook URL', kind: 'text', default: 'https://hooks.example.com/iot' },
    ],
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: '{{device}} heartbeat', x: 60, y: 80 },
      { nodeId: 'n2', type: 'DELAY', label: 'Wait {{timeout}}', x: 280, y: 80,
        script: '// Restarts on every heartbeat; Timeout fires when none arrives in time.\nreturn {{json:timeout}} * 1000;' },
      { nodeId: 'n3', type: 'ALARM', label: 'Heartbeat missing', x: 500, y: 140 },
      { nodeId: 'n4', type: 'REST_API', label: 'Notify webhook', x: 720, y: 140,
        config: { url: '{{webhook}}', method: 'POST' } },
    ],
    edges: [
      { edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' },
      { edgeId: 'e2', sourceNodeId: 'n2', sourcePort: 'timeout', targetNodeId: 'n3', targetPort: 'in' },
      { edgeId: 'e3', sourceNodeId: 'n3', sourcePort: 'created', targetNodeId: 'n4', targetPort: 'in' },
    ],
  },
];

/* ─── Recently deleted (one is older than 7 days, so it is not listed) ─── */

const DAY = 86_400_000;

function deletedChain(chainId: string, name: string, slug: string, description: string): RuleChain {
  return {
    chainId, name, slug, description, active: true,
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: 'Sensor Telemetry', x: 60, y: 80 },
      { nodeId: 'n2', type: 'SAVE_TS', label: 'Store Reading', x: 290, y: 80 },
    ],
    edges: [{ edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' }],
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-03-02'),
  };
}

export function initialDeletedRulesets(now = Date.now()): DeletedRuleset[] {
  return [
    { chain: deletedChain('chain-090', 'Legacy Humidity Logger', 'legacy-humidity-logger', 'Stores humidity readings from the old sensor bus.'),
      deletedAt: new Date(now - 2 * DAY).toISOString() },
    { chain: deletedChain('chain-091', 'Door Sensor Test', 'door-sensor-test', 'Temporary test chain for the loading-bay door sensor.'),
      deletedAt: new Date(now - 12 * DAY).toISOString() },
  ];
}
