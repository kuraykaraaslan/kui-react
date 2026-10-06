import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RulesetEditor, type RulesetEditorRef, type RulesetGraph } from './index';
import { catalogFromBlocks } from '../catalog';
import type { RuleEdge, RuleNode } from '../../types';

afterEach(() => cleanup());

const node = (nodeId: string, type: string, label: string, x: number, y: number, extra: Partial<RuleNode> = {}): RuleNode => ({ nodeId, type, label, x, y, ...extra });
const edge = (edgeId: string, from: string, port: string, to: string): RuleEdge => ({ edgeId, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });

const NODES = [
  node('n1', 'TRIGGER', 'Source', 0, 0),
  node('n2', 'FILTER', 'Gate', 300, 0),
  node('n3', 'ACTION', 'Sink', 600, 0),
];
const EDGES = [edge('e1', 'n1', 'out', 'n2'), edge('e2', 'n2', 'true', 'n3')];

function setup(props: Partial<React.ComponentProps<typeof RulesetEditor>> = {}) {
  const ref = createRef<RulesetEditorRef>();
  const onChange = vi.fn<(g: RulesetGraph) => void>();
  const utils = render(<RulesetEditor ref={ref} initialNodes={NODES} initialEdges={EDGES} onChange={onChange} chainName="Chain" {...props} />);
  const canvas = screen.getByLabelText('Rule chain canvas');
  const last = () => onChange.mock.calls.at(-1)?.[0];
  return { ref, onChange, canvas, last, ...utils };
}

const nodeEl = (label: string) => screen.getByRole('button', { name: new RegExp(`^${label} \\(`) });

/** a click on a node: press and release without moving */
function clickNode(label: string, init: PointerEventInit = {}) {
  const el = nodeEl(label);
  fireEvent.pointerDown(el, { button: 0, ...init });
  fireEvent.pointerUp(el, { button: 0, ...init });
}

async function key(canvas: HTMLElement, keys: string) {
  const user = userEvent.setup();
  canvas.focus();
  await user.keyboard(keys);
}

describe('RulesetEditor: what it shows', () => {
  it('draws the nodes and the palette of the catalog', () => {
    setup();
    expect(nodeEl('Source')).toBeInTheDocument();
    expect(nodeEl('Gate')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Routing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Filter node' })).toBeInTheDocument();
  });
  it('has no palette and no undo when read only', () => {
    setup({ readOnly: true });
    expect(screen.queryByLabelText('Node palette')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
  });
  it('offers the blocks of another catalog', () => {
    const catalog = catalogFromBlocks([[{ type: 'trigger.quota', title: 'Quota' }, { type: 'action.wifi_set', title: 'Set Wi-Fi' }]]);
    setup({ catalog, initialNodes: [], initialEdges: [] });
    expect(screen.getByRole('button', { name: 'Add Quota node' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add Filter node' })).not.toBeInTheDocument();
  });
});

describe('RulesetEditor: undo and redo', () => {
  it('starts with nothing to undo', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();
  });

  it('undoes and redoes an added node with the buttons', async () => {
    const user = userEvent.setup();
    const { last, onChange } = setup();
    await user.click(screen.getByRole('button', { name: 'Add Delay node' }));
    expect(last()?.nodes).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(last()?.nodes).toHaveLength(3);
    expect(screen.queryByRole('button', { name: /^Delay \(/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Redo' }));
    expect(last()?.nodes).toHaveLength(4);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('works from the keyboard: Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z', async () => {
    const user = userEvent.setup();
    const { canvas, last } = setup();
    await user.click(screen.getByRole('button', { name: 'Add Delay node' }));
    await key(canvas, '{Control>}z{/Control}');
    expect(last()?.nodes).toHaveLength(3);
    await key(canvas, '{Control>}y{/Control}');
    expect(last()?.nodes).toHaveLength(4);
    await key(canvas, '{Control>}z{/Control}');
    await key(canvas, '{Control>}{Shift>}z{/Shift}{/Control}');
    expect(last()?.nodes).toHaveLength(4);
  });

  it('is also on the ref', async () => {
    const user = userEvent.setup();
    const { ref, last } = setup();
    await user.click(screen.getByRole('button', { name: 'Add Delay node' }));
    expect(ref.current?.getGraph().nodes).toHaveLength(4);
    act(() => ref.current?.undo());
    expect(ref.current?.getGraph().nodes).toHaveLength(3);
    act(() => ref.current?.redo());
    expect(last()?.nodes).toHaveLength(4);
  });

  it('forgets the redo steps after a new change', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Add Delay node' }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    await user.click(screen.getByRole('button', { name: 'Add Alarm node' }));
    expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();
  });
});

describe('RulesetEditor: selection', () => {
  it('selects with a click, adds with Shift or Ctrl, and selects all with Ctrl+A', async () => {
    const { canvas } = setup();
    clickNode('Source');
    expect(nodeEl('Source')).toHaveAttribute('aria-pressed', 'true');
    clickNode('Gate', { shiftKey: true });
    expect(nodeEl('Source')).toHaveAttribute('aria-pressed', 'true');
    expect(nodeEl('Gate')).toHaveAttribute('aria-pressed', 'true');
    clickNode('Sink', { ctrlKey: true });
    expect(nodeEl('Sink')).toHaveAttribute('aria-pressed', 'true');
    clickNode('Gate', { shiftKey: true });
    expect(nodeEl('Gate')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.pointerDown(canvas, { button: 0 });
    fireEvent.pointerUp(canvas, { button: 0 });
    expect(nodeEl('Source')).toHaveAttribute('aria-pressed', 'false');
    await key(canvas, '{Control>}a{/Control}');
    for (const l of ['Source', 'Gate', 'Sink']) expect(nodeEl(l)).toHaveAttribute('aria-pressed', 'true');
  });

  it('deletes the whole selection as one step, with its connections', async () => {
    const { canvas, last } = setup();
    clickNode('Gate');
    clickNode('Sink', { shiftKey: true });
    await key(canvas, '{Delete}');
    expect(last()?.nodes.map((n) => n.nodeId)).toEqual(['n1']);
    expect(last()?.edges).toEqual([]);
    await key(canvas, '{Control>}z{/Control}');
    expect(last()?.nodes).toHaveLength(3);
    expect(last()?.edges).toHaveLength(2);
  });

  it('copies, cuts and pastes a selection with the connections between its nodes', async () => {
    const { canvas, last } = setup();
    clickNode('Source');
    clickNode('Gate', { shiftKey: true });
    await key(canvas, '{Control>}c{/Control}');
    await key(canvas, '{Control>}v{/Control}');
    expect(last()?.nodes).toHaveLength(5);
    expect(last()?.edges).toHaveLength(3);
    expect(new Set(last()?.nodes.map((n) => n.nodeId)).size).toBe(5);
    await key(canvas, '{Control>}z{/Control}');
    expect(last()?.nodes).toHaveLength(3);
  });

  it('cuts', async () => {
    const { canvas, last } = setup();
    clickNode('Sink');
    await key(canvas, '{Control>}x{/Control}');
    expect(last()?.nodes.map((n) => n.nodeId)).toEqual(['n1', 'n2']);
    await key(canvas, '{Control>}v{/Control}');
    expect(last()?.nodes).toHaveLength(3);
  });
});

describe('RulesetEditor: the node panel', () => {
  it('opens on a click and applies a new label as one history step', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    clickNode('Gate');
    const panel = screen.getByRole('complementary', { name: 'Gate settings' });
    const label = within(panel).getByLabelText('Label');
    await user.clear(label);
    await user.type(label, 'Strict gate');
    await user.click(within(panel).getByRole('button', { name: /Apply/ }));
    expect(last()?.nodes.find((n) => n.nodeId === 'n2')?.label).toBe('Strict gate');
    expect(screen.getByRole('button', { name: /^Strict gate \(Filter\)/ })).toBeInTheDocument();
  });

  it('edits the script of a built-in node in a code field, and resets it', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    clickNode('Gate');
    const panel = screen.getByRole('complementary', { name: 'Gate settings' });
    const code = within(panel).getByRole('textbox', { name: 'Script' });
    expect((code as HTMLTextAreaElement).value).toContain('return');
    await user.clear(code);
    await user.type(code, 'return false;');
    await user.click(within(panel).getByRole('button', { name: /Apply/ }));
    expect(last()?.nodes.find((n) => n.nodeId === 'n2')?.script).toBe('return false;');
    await user.click(within(panel).getByRole('button', { name: /Reset script/ }));
    expect((within(panel).getByRole('textbox', { name: 'Script' }) as HTMLTextAreaElement).value).toContain('//');
  });

  it('shows the form of a block of another catalog and stores the values as the params of the node', async () => {
    const user = userEvent.setup();
    const catalog = catalogFromBlocks([[
      { type: 'trigger.quota', title: 'Quota', params: { level: { type: 'enum', options: ['exceeded', 'warning'], default: 'exceeded' }, limit: { type: 'number', int: true, min: 1, when: { param: 'level', value: 'warning' } } } },
    ]]);
    const { last } = setup({ catalog, initialNodes: [node('a', 'trigger.quota', 'Quota', 0, 0, { config: { level: 'exceeded' } })], initialEdges: [] });
    clickNode('Quota');
    const panel = screen.getByRole('complementary', { name: 'Quota settings' });
    expect(within(panel).queryByLabelText('Limit')).not.toBeInTheDocument();
    await user.selectOptions(within(panel).getByLabelText('Level'), 'warning');
    await user.type(within(panel).getByLabelText('Limit'), '5');
    await user.click(within(panel).getByRole('button', { name: /Apply/ }));
    expect(last()?.nodes[0].config).toEqual({ level: 'warning', limit: 5 });
  });

  it('shows a placeholder as not available', () => {
    setup({ initialNodes: [node('p', 'PLACEHOLDER', 'Odd', 0, 0, { original: { type: 'mqtt in', source: 'node-red', outputs: ['out'] } })], initialEdges: [] });
    clickNode('Odd');
    expect(screen.getAllByText(/Not available/).length).toBeGreaterThan(0);
    expect(screen.getByText('mqtt in', { selector: 'span.font-mono.font-semibold' })).toBeInTheDocument();
  });
});

describe('RulesetEditor: connections', () => {
  it('shows ports from the catalog, with an error port for catalogs that have one', () => {
    const catalog = catalogFromBlocks([[{ type: 'trigger.a' }, { type: 'cond.b' }]]);
    const { container } = setup({ catalog, initialNodes: [node('a', 'trigger.a', 'A', 0, 0), node('b', 'cond.b', 'B', 300, 0)], initialEdges: [] });
    expect(container.querySelectorAll('[data-in-node]')).toHaveLength(1);
    expect(container.querySelector('title')?.textContent).toMatch(/Error path/);
  });
});

describe('RulesetEditor: context menu, groups and subflows', () => {
  async function menu(label: string) {
    fireEvent.contextMenu(nodeEl(label));
    return screen.findByRole('menu');
  }

  it('groups the selected nodes, shows the frame, renames it and ungroups', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    clickNode('Source');
    clickNode('Gate', { shiftKey: true });
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Group…' }));
    await user.type(await screen.findByLabelText('Name'), 'Front');
    await user.click(screen.getByRole('radio', { name: 'success' }));
    await user.click(screen.getByRole('button', { name: 'Group' }));
    expect(last()?.groups).toEqual([{ groupId: 'g1', name: 'Front', color: 1, nodeIds: ['n1', 'n2'] }]);
    const tab = screen.getByRole('button', { name: /Group Front, 2 nodes/ });
    expect(tab).toBeInTheDocument();

    fireEvent.doubleClick(tab);
    const name = await screen.findByLabelText('Name');
    await user.clear(name);
    await user.type(name, 'Intake');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(last()?.groups[0].name).toBe('Intake');

    fireEvent.contextMenu(screen.getByRole('button', { name: /Group Intake/ }));
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Ungroup' }));
    expect(last()?.groups).toEqual([]);
    expect(screen.queryByRole('button', { name: /Group Intake/ })).not.toBeInTheDocument();
  });

  it('selects the members of a group by its tab, and drops a node that is deleted from it', async () => {
    const { canvas, last } = setup({ initialGroups: [{ groupId: 'g1', name: 'Pair', color: 0, nodeIds: ['n2', 'n3'] }] });
    fireEvent.pointerDown(screen.getByRole('button', { name: /Group Pair/ }), { button: 0 });
    fireEvent.pointerUp(screen.getByRole('button', { name: /Group Pair/ }), { button: 0 });
    expect(nodeEl('Gate')).toHaveAttribute('aria-pressed', 'true');
    expect(nodeEl('Sink')).toHaveAttribute('aria-pressed', 'true');
    expect(nodeEl('Source')).toHaveAttribute('aria-pressed', 'false');
    clickNode('Sink');
    await key(canvas, '{Delete}');
    expect(last()?.groups).toEqual([{ groupId: 'g1', name: 'Pair', color: 0, nodeIds: ['n2'] }]);
  });

  it('skips and wakes a node', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Skip' }));
    expect(last()?.nodes.find((n) => n.nodeId === 'n2')?.disabled).toBe(true);
    expect(screen.getByText('Skipped')).toBeInTheDocument();
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Wake up' }));
    expect(last()?.nodes.find((n) => n.nodeId === 'n2')?.disabled).toBeUndefined();
  });

  it('duplicates a node', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Duplicate' }));
    expect(last()?.nodes).toHaveLength(4);
    expect(last()?.nodes.at(-1)).toMatchObject({ type: 'FILTER', x: 332, y: 32 });
  });

  it('converts the selection to a subflow, enters it, and goes back', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    clickNode('Gate');
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Convert to a subflow…' }));
    await user.type(await screen.findByLabelText('Name of the subflow'), 'My gate');
    await user.click(screen.getByRole('button', { name: 'Convert' }));
    const graph = last()!;
    expect(graph.subflows).toHaveLength(1);
    expect(graph.subflows[0]).toMatchObject({ subflowId: 'my-gate', name: 'My gate', inputs: 1 });
    expect(graph.nodes.map((n) => n.type)).toEqual(['TRIGGER', 'ACTION', 'subflow.my-gate']);
    expect(graph.edges.map((e) => [e.sourceNodeId, e.sourcePort, e.targetNodeId])).toEqual([['n1', 'out', 'n4'], ['n4', 'out', 'n3']]);
    expect(nodeEl('My gate')).toBeInTheDocument();

    fireEvent.contextMenu(nodeEl('My gate'));
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Edit the subflow' }));
    expect(screen.getByText('Subflow: My gate')).toBeInTheDocument();
    expect(nodeEl('Subflow input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Subflow output node' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back to Chain' }));
    expect(screen.queryByText('Subflow: My gate')).not.toBeInTheDocument();
    expect(nodeEl('Source')).toBeInTheDocument();
  });

  it('undoes the conversion in one step', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    clickNode('Gate');
    await user.click(within(await menu('Gate')).getByRole('menuitem', { name: 'Convert to a subflow…' }));
    await user.type(await screen.findByLabelText('Name of the subflow'), 'X');
    await user.click(screen.getByRole('button', { name: 'Convert' }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(last()?.subflows).toEqual([]);
    expect(last()?.nodes.map((n) => n.type)).toEqual(['TRIGGER', 'FILTER', 'ACTION']);
  });

  it('makes a new subflow from the palette and lands inside it', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(screen.getByRole('button', { name: /New subflow/ }));
    await user.type(await screen.findByLabelText('Name of the subflow'), 'Fresh');
    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(last()?.subflows[0]).toMatchObject({ subflowId: 'fresh', outputs: ['out'] });
    expect(screen.getByText('Subflow: Fresh')).toBeInTheDocument();
    // a subflow has one input only: the block is greyed out
    expect(screen.getByRole('button', { name: 'Add Subflow input node' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('renames an output in the settings and keeps what is wired to it', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    await user.click(screen.getByRole('button', { name: /New subflow/ }));
    await user.type(await screen.findByLabelText('Name of the subflow'), 'Fresh');
    await user.click(screen.getByRole('button', { name: 'Create' }));
    await user.click(screen.getByRole('button', { name: 'Subflow settings' }));
    const out = await screen.findByLabelText('Output 1');
    await user.clear(out);
    await user.type(out, 'done');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    const sf = last()!.subflows[0];
    expect(sf.outputs).toEqual(['done']);
    expect(sf.nodes.find((n) => n.type === 'port.out')?.config).toEqual({ port: 'done' });
  });

  it('cannot delete a subflow that is in use, and can delete one that is not', async () => {
    const user = userEvent.setup();
    const { last } = setup({
      initialNodes: [node('i', 'subflow.a', 'A inst', 0, 0)], initialEdges: [],
      initialSubflows: [
        { subflowId: 'a', name: 'A', inputs: 1, outputs: ['out'], params: {}, nodes: [], edges: [], groups: [] },
        { subflowId: 'b', name: 'B', inputs: 1, outputs: ['out'], params: {}, nodes: [], edges: [], groups: [] },
      ],
    });
    fireEvent.contextMenu(nodeEl('A inst'));
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Edit the subflow' }));
    await user.click(screen.getByRole('button', { name: 'Subflow settings' }));
    expect(screen.getByRole('button', { name: 'Delete subflow' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Back to Chain' }));
    expect(last()).toBeUndefined();
  });
});

describe('RulesetEditor: problems', () => {
  const catalog = catalogFromBlocks([[
    { type: 'trigger.a' },
    { type: 'action.log', params: { text: { type: 'string', required: true } } },
  ]]);
  const nodes = [node('a', 'trigger.a', 'A', 0, 0), node('b', 'action.log', 'Log', 300, 0, { config: {} })];

  it('counts problems, lists them and marks the node', async () => {
    const user = userEvent.setup();
    setup({ catalog, initialNodes: nodes, initialEdges: [edge('e', 'a', 'out', 'b')] });
    const button = screen.getByRole('button', { name: /Problems: 0 errors, 1 warnings/ });
    await user.click(button);
    const list = screen.getByRole('list', { name: 'Problems' });
    expect(within(list).getByText('Text is required.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Text is required.' })).toBeInTheDocument();
  });

  it('makes a missing required param an error when the chain is active', () => {
    setup({ catalog, initialNodes: nodes, initialEdges: [edge('e', 'a', 'out', 'b')], active: true });
    expect(screen.getByRole('button', { name: /Problems: 1 errors, 0 warnings/ })).toBeInTheDocument();
  });

  it('shows nothing when the graph is fine', () => {
    setup({ catalog, initialNodes: [nodes[0], { ...nodes[1], config: { text: 'x' } }], initialEdges: [edge('e', 'a', 'out', 'b')] });
    expect(screen.queryByRole('button', { name: /Problems/ })).not.toBeInTheDocument();
  });

  it('the problems are on the ref, and clear after the param is filled in', async () => {
    const user = userEvent.setup();
    const { ref } = setup({ catalog, initialNodes: nodes, initialEdges: [edge('e', 'a', 'out', 'b')] });
    expect(ref.current?.validate().warnings.map((w) => w.code)).toEqual(['required']);
    clickNode('Log');
    const panel = screen.getByRole('complementary', { name: 'Log settings' });
    await user.type(within(panel).getByLabelText(/Text/), 'hello');
    await user.click(within(panel).getByRole('button', { name: /Apply/ }));
    expect(ref.current?.validate()).toEqual({ errors: [], warnings: [] });
  });
});

describe('RulesetEditor: compatibility', () => {
  it('still gives nodes and edges on the ref, now with groups and subflows', () => {
    const { ref } = setup();
    expect(ref.current?.getGraph()).toEqual({ nodes: NODES, edges: EDGES, groups: [], subflows: [] });
  });
  it('does not call onChange before the first change', () => {
    const { onChange } = setup();
    expect(onChange).not.toHaveBeenCalled();
  });
});
