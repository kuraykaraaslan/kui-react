import { describe, expect, it } from 'vitest';
import type { RuleChain } from '../types';
import {
  EXPORT_FORMAT, addVersion, applyImport, buildExport, exportFileName, fillTemplate, formatDuration,
  isSecretKey, looksLikeSecret, parseImport, recentlyDeleted, restoreDeleted, restoreVersion,
  summarizeChange, templateDefaults, validateTemplateValues,
  type ImportPreview, type RulesetTemplate,
} from './transfer';

const NOW = new Date('2026-09-26T10:00:00Z');

function chain(over: Partial<RuleChain> = {}): RuleChain {
  return {
    chainId: 'chain-001', name: 'Temperature Alert', slug: 'temperature-alert', active: true,
    nodes: [
      { nodeId: 'n1', type: 'TRIGGER', label: 'MQTT Ingress', x: 0, y: 0 },
      { nodeId: 'n2', type: 'REST_API', label: 'Webhook', x: 200, y: 0,
        config: { url: 'https://hooks.example.com', authToken: 'abc123', nested: { password: 'pw' } } },
    ],
    edges: [{ edgeId: 'e1', sourceNodeId: 'n1', sourcePort: 'out', targetNodeId: 'n2', targetPort: 'in' }],
    createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-02-01'),
    ...over,
  };
}

describe('export', () => {
  it('nulls secret fields and lists them under omitted', () => {
    const r = buildExport([chain()], { now: NOW });
    expect(r.file.format).toBe(EXPORT_FORMAT);
    expect(r.file.exported_at).toBe(NOW.toISOString());
    const cfg = r.file.rulesets[0].nodes[1].config!;
    expect(cfg.authToken).toBeNull();
    expect((cfg.nested as Record<string, unknown>).password).toBeNull();
    expect(cfg.url).toBe('https://hooks.example.com');
    expect(r.omitted).toEqual(['Temperature Alert / Webhook / config.authToken', 'Temperature Alert / Webhook / config.nested.password']);
    expect(r.file.omitted).toEqual(r.omitted);
    expect(JSON.parse(r.json).rulesets[0].createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('does not change the source ruleset', () => {
    const c = chain();
    buildExport([c], { now: NOW });
    expect(c.nodes[1].config!.authToken).toBe('abc123');
  });

  it('names files after the ruleset or "all"', () => {
    expect(buildExport([chain()], { now: NOW }).fileName).toBe(`rulesets-temperature-alert-${exportFileName('x', NOW).slice(-15, -5)}.json`);
    expect(buildExport([chain(), chain({ chainId: 'b' })], { all: true, now: NOW }).fileName).toMatch(/^rulesets-all-\d{4}-\d{2}-\d{2}\.json$/);
    expect(buildExport([chain()], { now: NOW, suffix: 'v3' }).fileName).toMatch(/^rulesets-temperature-alert-v3-/);
  });

  it('reports free text that looks like a password', () => {
    expect(looksLikeSecret('password=hunter22')).toBe(true);
    expect(looksLikeSecret('token: abcdef')).toBe(true);
    expect(looksLikeSecret('Authorization: Bearer eyJhbGciOi.xyz')).toBe(true);
    expect(looksLikeSecret('https://user:pw@example.com/x')).toBe(true);
    expect(looksLikeSecret('https://example.com/x')).toBe(false);
    expect(looksLikeSecret('return msg.temperature > 85;')).toBe(false);
    const c = chain({ nodes: [{ nodeId: 'n1', type: 'TRANSFORM', label: 'T', x: 0, y: 0, script: "var h = 'Bearer abcdefgh12345';",
      config: { endpoint: 'https://u:secretpw@host/api' } }], edges: [] });
    expect(buildExport([c], { now: NOW }).suspicious).toEqual(['Temperature Alert / T / config.endpoint', 'Temperature Alert / T / script']);
  });

  it('knows secret keys', () => {
    for (const k of ['password', 'apiKey', 'api_key', 'authToken', 'client_secret', 'Authorization', 'pwd']) expect(isSecretKey(k)).toBe(true);
    for (const k of ['url', 'method', 'topic']) expect(isSecretKey(k)).toBe(false);
  });
});

describe('import', () => {
  const existing = [chain()];

  it('rejects bad input with a clear error', () => {
    expect(parseImport('', existing)).toMatchObject({ ok: false, code: 'empty' });
    expect(parseImport('not json', existing)).toMatchObject({ ok: false, code: 'not-json' });
    expect(parseImport('{"format":"other","rulesets":[]}', existing)).toMatchObject({ ok: false, code: 'wrong-format' });
    expect(parseImport('[1,2]', existing)).toMatchObject({ ok: false, code: 'wrong-format' });
    expect(parseImport(JSON.stringify({ format: EXPORT_FORMAT, rulesets: [] }), existing)).toMatchObject({ ok: false, code: 'empty' });
    expect(parseImport(`"${'x'.repeat(2 * 1024 * 1024 + 1)}"`, existing)).toMatchObject({ ok: false, code: 'too-big' });
  });

  it('round-trips an export and flags existing ids', () => {
    const text = buildExport([chain()], { now: NOW }).json;
    const r = parseImport(text, existing, { now: NOW }) as ImportPreview;
    expect(r.ok).toBe(true);
    expect(r.items).toHaveLength(1);
    expect(r.items[0].existing).toEqual({ chainId: 'chain-001', name: 'Temperature Alert' });
    expect(r.items[0].chain.active).toBe(false);
    expect(r.items[0].chain.edges).toHaveLength(1);
  });

  it('turns unknown node types into placeholders that keep their wires', () => {
    const text = JSON.stringify({ format: EXPORT_FORMAT, exported_at: '', rulesets: [{
      chainId: 'x1', name: 'Modbus', nodes: [
        { nodeId: 'a', type: 'TRIGGER', label: 'Tick', x: 0, y: 0 },
        { nodeId: 'b', type: 'MODBUS_READ', label: 'Read', x: 200, y: 0, register: 40001 },
        { nodeId: 'c', type: 'ACTION', label: 'Log', x: 400, y: 0 },
      ],
      edges: [
        { edgeId: 'e1', sourceNodeId: 'a', sourcePort: 'out', targetNodeId: 'b', targetPort: 'in' },
        { edgeId: 'e2', sourceNodeId: 'b', sourcePort: 'ok', targetNodeId: 'c', targetPort: 'in' },
        { edgeId: 'e3', sourceNodeId: 'a', sourcePort: 'nope', targetNodeId: 'c', targetPort: 'in' },
      ],
    }] });
    const r = parseImport(text, existing) as ImportPreview;
    const item = r.items[0];
    const ph = item.chain.nodes[1];
    expect(ph.type).toBe('PLACEHOLDER');
    expect(ph.original).toMatchObject({ type: 'MODBUS_READ', source: 'kui', inputs: ['in'], outputs: ['ok'], settings: { register: 40001 } });
    expect(item.chain.edges.map((e) => e.edgeId)).toEqual(['e1', 'e2']);
    expect(item.placeholders).toBe(1);
    expect(item.notes).toContain('1 connection dropped');
  });

  it('applies copy / replace / skip and imports inactive', () => {
    const text = buildExport([chain({ name: 'Temperature Alert' }), chain({ chainId: 'new-1', name: 'Fresh' })], { now: NOW }).json;
    const p = parseImport(text, existing, { now: NOW }) as ImportPreview;
    const key = p.items[0].key;

    const copy = applyImport(existing, p.items, { [key]: 'copy' }, NOW);
    expect(copy.added).toBe(2);
    expect(copy.chains).toHaveLength(3);
    expect(copy.chains[1]).toMatchObject({ chainId: 'chain-001-copy', name: 'Temperature Alert (copy)', slug: 'temperature-alert-copy', active: false });

    const replace = applyImport(existing, p.items, { [key]: 'replace' }, NOW);
    expect(replace.replaced).toBe(1);
    expect(replace.chains[0]).toMatchObject({ chainId: 'chain-001', active: false });
    expect(replace.chains[0].createdAt).toEqual(new Date('2026-01-01'));

    const skip = applyImport(existing, p.items, { [key]: 'skip' }, NOW);
    expect(skip).toMatchObject({ added: 1, skipped: 1 });
  });
});

describe('Node-RED import', () => {
  const flow = [
    { id: 't1', type: 'tab', label: 'Boiler' },
    { id: 'i1', type: 'inject', z: 't1', name: 'every minute', repeat: '60', x: 100, y: 80, wires: [['s1']] },
    { id: 's1', type: 'switch', z: 't1', property: 'payload.temp', propertyType: 'msg',
      rules: [{ t: 'gt', v: '80', vt: 'num' }, { t: 'else' }], x: 260, y: 80, wires: [['c1'], ['d1']] },
    { id: 'c1', type: 'change', z: 't1', rules: [{ t: 'set', p: 'payload.alarm', pt: 'msg', to: 'true', tot: 'bool' }], x: 420, y: 60, wires: [['m1']] },
    { id: 'm1', type: 'mqtt out', z: 't1', topic: 'alarms', broker: 'b1', x: 580, y: 60, wires: [] },
    { id: 'd1', type: 'debug', z: 't1', x: 420, y: 120, wires: [] },
    { id: 'b1', type: 'mqtt-broker', broker: 'localhost' },
  ];

  it('converts core nodes, keeps others as placeholders and reports it', () => {
    const r = parseImport(JSON.stringify(flow), [], { now: NOW }) as ImportPreview;
    expect(r.ok).toBe(true);
    expect(r.source).toBe('node-red');
    expect(r.report).toEqual({ exact: 3, changed: 1, placeholders: 1, skipped: 1 });
    const c = r.items[0].chain;
    expect(c.name).toBe('Boiler');
    expect(c.active).toBe(false);
    expect(c.nodes.map((n) => n.type)).toEqual(['TRIGGER', 'FILTER', 'TRANSFORM', 'PLACEHOLDER', 'ACTION']);
    expect(c.nodes[1].script).toContain('var v = msg.temp;');
    expect(c.nodes[1].script).toContain('v > 80');
    expect(c.nodes[2].script).toContain('msg.alarm = true;');
    expect(c.nodes[3].original).toMatchObject({ type: 'mqtt out', source: 'node-red', settings: { topic: 'alarms' } });
    const ports = c.edges.map((e) => `${e.sourceNodeId}:${e.sourcePort}>${e.targetNodeId}`);
    expect(ports).toEqual(['n1:out>n2', 'n2:true>n3', 'n2:false>n5', 'n3:out>n4']);
  });

  it('maps multi-rule switches to switch cases', () => {
    const f = [
      { id: 's', type: 'switch', z: 'z', property: 'payload', rules: [{ t: 'eq', v: 'a', vt: 'str' }, { t: 'eq', v: 'b', vt: 'str' }, { t: 'else' }], checkall: 'false', wires: [['x'], ['x'], ['x']] },
      { id: 'x', type: 'debug', z: 'z', wires: [] },
    ];
    const r = parseImport(JSON.stringify(f), []) as ImportPreview;
    const c = r.items[0].chain;
    expect(c.nodes[0].type).toBe('SWITCH');
    expect(c.edges.map((e) => e.sourcePort)).toEqual(['c1', 'c2', 'def']);
    expect(r.report?.exact).toBe(2);
  });
});

describe('versions', () => {
  it('summarizes changes', () => {
    const a = chain();
    const b = chain({ name: 'Renamed', nodes: [...a.nodes, { nodeId: 'n3', type: 'ACTION', label: 'X', x: 0, y: 0 }] });
    expect(summarizeChange(null, a)).toBe('Created');
    expect(summarizeChange(a, a)).toBe('No changes');
    expect(summarizeChange(a, b)).toBe('+1 node, renamed');
  });

  it('restores an old version as a new version', () => {
    const v1 = chain({ nodes: chain().nodes.slice(0, 1), edges: [] });
    let versions = addVersion([], v1, { by: 'a', now: NOW });
    const current = chain();
    versions = addVersion(versions, current, { by: 'b', now: NOW });
    expect(versions.map((v) => v.summary)).toEqual(['Created', '+1 node, +1 connection']);
    const r = restoreVersion({ ...current, active: false }, versions, 1, { by: 'c', now: NOW })!;
    expect(r.chain.nodes).toHaveLength(1);
    expect(r.chain.active).toBe(false);
    expect(r.versions).toHaveLength(3);
    expect(r.versions[2]).toMatchObject({ version: 3, by: 'c', summary: 'Restored version 1' });
    expect(restoreVersion(current, versions, 9, { by: 'c' })).toBeNull();
  });
});

describe('recently deleted', () => {
  it('lists the last 7 days and restores inactive', () => {
    const day = 86_400_000;
    const list = [
      { chain: chain({ chainId: 'old' }), deletedAt: new Date(NOW.getTime() - 8 * day).toISOString() },
      { chain: chain(), deletedAt: new Date(NOW.getTime() - 2 * day).toISOString() },
    ];
    const recent = recentlyDeleted(list, NOW);
    expect(recent.map((d) => d.chain.chainId)).toEqual(['chain-001']);
    const back = restoreDeleted([chain()], recent[0], NOW);
    expect(back).toMatchObject({ active: false, chainId: 'chain-001-2', slug: 'temperature-alert-2' });
  });
});

describe('templates', () => {
  const t: RulesetTemplate = {
    id: 'sched', category: 'Schedules', title: 'Daily', description: 'At {{time}}',
    name: 'Run at {{time}} ({{days}})',
    inputs: [
      { key: 'time', label: 'Time', kind: 'time', default: '07:30' },
      { key: 'days', label: 'Days', kind: 'weekdays', default: ['mon', 'fri'] },
      { key: 'hold', label: 'Hold', kind: 'duration', default: 90, min: 1 },
      { key: 'limit', label: 'Limit', kind: 'number', default: 5, max: 10 },
      { key: 'mode', label: 'Mode', kind: 'select', default: 'on', options: [{ value: 'on', label: 'Turn on' }] },
      { key: 'who', label: 'Who', kind: 'text', default: 'ops' },
    ],
    nodes: [{ nodeId: 'n1', type: 'DELAY', label: 'Wait {{hold}} ({{mode}})', x: 0, y: 0, script: 'return {{json:hold}} * 1000; // {{json:days}}',
      config: { to: '{{who}}' } }],
    edges: [],
  };

  it('fills values into name, labels, scripts and config', () => {
    const c = fillTemplate(t, templateDefaults(t), { existing: [], now: NOW });
    expect(c.name).toBe('Run at 07:30 (Mon, Fri)');
    expect(c.nodes[0].label).toBe('Wait 1 min 30 s (Turn on)');
    expect(c.nodes[0].script).toBe('return 90 * 1000; // ["mon","fri"]');
    expect(c.nodes[0].config).toEqual({ to: 'ops' });
    expect(c.active).toBe(false);
    expect(fillTemplate(t, templateDefaults(t), { existing: [c], name: 'Mine' }).slug).toBe('mine');
  });

  it('validates values', () => {
    expect(validateTemplateValues(t, templateDefaults(t))).toEqual({});
    expect(validateTemplateValues(t, { time: '25:00', days: [], hold: 1.5, limit: 11, mode: 'x', who: ' ' })).toEqual({
      time: 'Enter a time as HH:MM.', days: 'Choose at least one day.', hold: 'Enter whole seconds (1 or more).',
      limit: 'Must be 10 or less.', mode: 'Choose an option.', who: 'Required.',
    });
  });

  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0 s');
    expect(formatDuration(45)).toBe('45 s');
    expect(formatDuration(300)).toBe('5 min');
    expect(formatDuration(3660)).toBe('1 h 1 min');
  });
});
