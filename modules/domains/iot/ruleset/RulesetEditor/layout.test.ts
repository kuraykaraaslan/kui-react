import { describe, expect, it } from 'vitest';
import { BUILTIN_CATALOG, catalogFromBlocks } from '../catalog';
import {
  ERROR_H, NODE_HEADER_H, NODE_W, PORT_STEP, PORT_TOP_OFFSET, SUMMARY_H, bezier, edgePath, inputAnchor, layoutOf, outputAnchor,
} from './geometry';
import { ICONS_BY_NAME, lookOf } from './block-visual';
import { NODE_VISUALS, portColor, portEdgeLabel } from './node-meta';
import { runScript } from './runtime/runScript';
import { traceChain } from './runtime/traceChain';
import type { RuleEdge, RuleNode } from '../../types';

const node = (nodeId: string, type: string, extra: Partial<RuleNode> = {}): RuleNode => ({ nodeId, type, label: nodeId, x: 100, y: 50, ...extra });

describe('layoutOf', () => {
  it('sizes a node by its ports', () => {
    const l = layoutOf(node('a', 'FILTER', { label: 'Filter' }), BUILTIN_CATALOG);
    expect(l.inputs.map((p) => p.id)).toEqual(['in']);
    expect(l.outputs.map((p) => p.id)).toEqual(['true', 'false']);
    expect(l.summary).toBeNull();
    expect(l.hasError).toBe(false);
    expect(l.height).toBe(NODE_HEADER_H + PORT_TOP_OFFSET + 2 * PORT_STEP + 8);
  });
  it('counts one row for a node without ports', () => {
    const l = layoutOf(node('a', 'ACTION', { label: 'Action' }), BUILTIN_CATALOG);
    expect(l.height).toBe(NODE_HEADER_H + PORT_TOP_OFFSET + PORT_STEP + 8);
  });
  it('adds a line under the title for a renamed node, a summary, or a placeholder', () => {
    const renamed = layoutOf(node('a', 'FILTER', { label: 'My gate' }), BUILTIN_CATALOG);
    expect(renamed.summary).toBe('Filter');
    expect(renamed.height).toBe(NODE_HEADER_H + SUMMARY_H + PORT_TOP_OFFSET + 2 * PORT_STEP + 8);
    const placeholder = layoutOf(node('p', 'PLACEHOLDER', { original: { type: 'x', outputs: ['out'] } }), BUILTIN_CATALOG);
    expect(placeholder).toMatchObject({ placeholder: true, summary: '' });
    expect(placeholder.height).toBe(NODE_HEADER_H + SUMMARY_H + PORT_TOP_OFFSET + PORT_STEP + 8);
    const catalog = catalogFromBlocks([[{ type: 'action.log', title: 'Log', summary: '${text}', params: { text: { type: 'string' } } }]]);
    expect(layoutOf(node('l', 'action.log', { label: 'Log', config: { text: 'hi' } }), catalog).summary).toBe('hi');
  });
  it('takes the error port out of the right column and gives it room at the bottom', () => {
    const catalog = catalogFromBlocks([[{ type: 'cond.c' }]]);
    const l = layoutOf(node('c', 'cond.c', { label: 'cond.c' }), catalog);
    expect(l.outputs.map((p) => p.id)).toEqual(['yes', 'no']);
    expect(l.hasError).toBe(true);
    expect(l.height).toBe(NODE_HEADER_H + PORT_TOP_OFFSET + 2 * PORT_STEP + 8 + ERROR_H);
  });
});

describe('anchors', () => {
  const catalog = catalogFromBlocks([[{ type: 'cond.c', title: 'C' }]]);
  const n = node('c', 'cond.c', { label: 'C', x: 200, y: 100 });
  const l = layoutOf(n, catalog);
  it('puts inputs on the left and outputs on the right, one step apart', () => {
    expect(inputAnchor(n, l, 0)).toEqual({ x: 200, y: 100 + NODE_HEADER_H + PORT_TOP_OFFSET });
    expect(outputAnchor(n, l, 'yes')).toEqual({ x: 200 + NODE_W, y: 100 + NODE_HEADER_H + PORT_TOP_OFFSET });
    expect(outputAnchor(n, l, 'no')).toEqual({ x: 200 + NODE_W, y: 100 + NODE_HEADER_H + PORT_TOP_OFFSET + PORT_STEP });
  });
  it('puts the error port at the bottom centre, pointing down', () => {
    expect(outputAnchor(n, l, 'error')).toEqual({ x: 200 + NODE_W / 2, y: 100 + l.height, down: true });
  });
  it('has no anchor for a port the node lacks', () => {
    expect(outputAnchor(n, l, 'maybe')).toBeNull();
    const plain = layoutOf(node('a', 'ACTION'), BUILTIN_CATALOG);
    expect(outputAnchor(node('a', 'ACTION'), plain, 'error')).toBeNull();
  });
  it('moves ports down by the summary line', () => {
    const named = node('c', 'cond.c', { label: 'Renamed', x: 0, y: 0 });
    expect(inputAnchor(named, layoutOf(named, catalog), 0).y).toBe(NODE_HEADER_H + SUMMARY_H + PORT_TOP_OFFSET);
  });
});

describe('curves', () => {
  it('leaves to the right for a normal port and downward for the error port', () => {
    expect(bezier(0, 0, 100, 100)).toBe('M0,0 C70,0 30,100 100,100');
    expect(bezier(0, 0, 10, 0)).toBe('M0,0 C70,0 -60,0 10,0');
    expect(edgePath({ x: 0, y: 0 }, { x: 200, y: 100 })).toBe(bezier(0, 0, 200, 100));
    expect(edgePath({ x: 50, y: 20, down: true }, { x: 150, y: 120 })).toBe('M50,20 C50,90 80,120 150,120');
  });
});

describe('look of a block', () => {
  it('uses the icon of the block, its icon name, or its category', () => {
    expect(lookOf(BUILTIN_CATALOG.blocks.ALARM).icon).toBe(NODE_VISUALS.ALARM.icon);
    const catalog = catalogFromBlocks([[{ type: 'action.x', icon: 'bell' }, { type: 'cond.y', icon: 'no-such-icon' }, { type: 'weird.z' }]]);
    expect(lookOf(catalog.blocks['action.x']).icon).toBe(ICONS_BY_NAME.bell);
    expect(lookOf(catalog.blocks['cond.y']).icon).toBe(ICONS_BY_NAME.filter);
    expect(lookOf(catalog.blocks['weird.z']).icon).toBe(ICONS_BY_NAME.cube);
  });
  it('takes colours from the block, and the placeholder look for an unknown block', () => {
    const catalog = catalogFromBlocks([[{ type: 'action.x' }]]);
    expect(lookOf(catalog.blocks['action.x'])).toMatchObject({ iconColor: 'text-success-fg', headerBg: 'bg-success-subtle' });
    expect(lookOf(undefined)).toMatchObject({ icon: NODE_VISUALS.PLACEHOLDER.icon, headerBg: NODE_VISUALS.PLACEHOLDER.headerBg });
  });
});

describe('port colours', () => {
  it('colours known ports, generated ports and unknown ports', () => {
    expect(portColor('yes')).toBe('var(--success)');
    expect(portColor('error')).toBe('var(--error)');
    expect(portColor('o3')).toBe('var(--info)');
    expect(portColor('whatever')).toBe('var(--primary)');
    expect(portEdgeLabel('else')).toBe('Otherwise');
    expect(portEdgeLabel('o3')).toBe('o3');
  });
});

describe('browser demo runner', () => {
  it('runs the script of a built-in node and picks the port', () => {
    const t = node('t', 'TRANSFORM', { script: 'msg.x = 1; return msg;' });
    expect(runScript(t, { a: 0 }, {}, 'T')).toMatchObject({ output: { a: 0, x: 1 }, portTaken: 'out' });
    expect(runScript(node('f', 'FILTER', { script: 'return msg.ok;' }), { ok: true }, {}, 'T').portTaken).toBe('true');
    expect(runScript(node('f', 'FILTER', { script: 'return msg.ok;' }), { ok: false }, {}, 'T').portTaken).toBe('false');
  });
  it('reports a script that throws', () => {
    expect(runScript(node('t', 'TRANSFORM', { script: 'throw new Error("boom");' }), {}, {}, 'T').error).toMatch(/boom/);
  });
  it('refuses a placeholder and a block of another catalog', () => {
    expect(runScript(node('p', 'PLACEHOLDER', { original: { type: 'mqtt in' } }), {}, {}, 'T').error).toMatch(/mqtt in/);
    expect(runScript(node('q', 'trigger.quota'), {}, {}, 'T').error).toMatch(/cannot run "trigger.quota" blocks/);
  });
  it('traces a chain along the ports it takes and stops at the end', () => {
    const nodes = [node('a', 'TRIGGER', { script: 'return msg;' }), node('b', 'FILTER', { script: 'return msg.ok;' }), node('c', 'ACTION', { script: 'return 1;' })];
    const edges: RuleEdge[] = [
      { edgeId: 'e1', sourceNodeId: 'a', sourcePort: 'out', targetNodeId: 'b', targetPort: 'in' },
      { edgeId: 'e2', sourceNodeId: 'b', sourcePort: 'true', targetNodeId: 'c', targetPort: 'in' },
    ];
    expect(traceChain(nodes, edges, { ok: true }, {}, 'T').map((s) => s.node.nodeId)).toEqual(['a', 'b', 'c']);
    expect(traceChain(nodes, edges, { ok: false }, {}, 'T').map((s) => s.node.nodeId)).toEqual(['a', 'b']);
    expect(traceChain([], [], {}, {}, 'T')).toEqual([]);
  });
});
