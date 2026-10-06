import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { FlowWorkspace, type FlowWorkspaceProps, type FlowWorkspaceRef } from './FlowWorkspace';
import { catalogFromBlocks } from '../../catalog';
import { createDraftStore, draftKey, type DraftStorage, type DraftStore } from '../../graph/draft';
import { snapshotOf } from '../../graph/state';
import { TAB_ORDER_KEY } from './tab-order';
import type { RulesetGraph } from '../hooks/useGraphEditor';
import type { RuleNode } from '../../../types';

afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); });
beforeEach(() => localStorage.clear());

const CATALOG = catalogFromBlocks([[
  { type: 'trigger.link_in', title: 'Link in' },
  { type: 'action.link_out', title: 'Link out' },
  { type: 'logic.link_call', title: 'Link call' },
  { type: 'logic.step', title: 'Step' },
]]);

const node = (nodeId: string, type: string, label: string, x: number, config: Record<string, unknown> = {}): RuleNode => ({ nodeId, type, label, x, y: 0, config });
const graph = (nodes: RuleNode[] = [node('n1', 'logic.step', 'First', 0), node('n2', 'logic.step', 'Second', 300)]): RulesetGraph => ({ nodes, edges: [], groups: [], subflows: [] });

const TABS = [
  { id: 'main', kind: 'flow' as const, name: 'Main flow', isRule: true },
  { id: 'night', kind: 'flow' as const, name: 'Night' },
  { id: 'calc', kind: 'subflow' as const, name: 'Calc' },
];

function memory(): DraftStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}

function setup(props: Partial<FlowWorkspaceProps> = {}, store?: DraftStore) {
  const ref = createRef<FlowWorkspaceRef>();
  const mem = memory();
  const draftStore = store ?? createDraftStore(() => mem);
  const handlers = { onOpen: vi.fn(), onCreate: vi.fn(), onDuplicate: vi.fn(), onRename: vi.fn() };
  const full: FlowWorkspaceProps = {
    ref, tabs: TABS, flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: graph() }, catalog: CATALOG, draftStore, ...handlers, ...props,
  };
  const utils = render(<FlowWorkspace {...full} />);
  return { ref, mem, draftStore, ...handlers, ...utils, rerender: (p: Partial<FlowWorkspaceProps> = {}) => utils.rerender(<FlowWorkspace {...full} {...p} />) };
}

const tab = (id: string) => screen.getByTestId(`flow-ftab-${id}`);
const nodeEl = (label: string) => screen.getByRole('button', { name: new RegExp(`^${label} \\(`) });
const tabNames = () => within(screen.getByRole('tablist')).getAllByRole('tab').map((t) => t.getAttribute('data-tab-id'));

/** put a graph in the editor as the host would: through the ref */
function edit(ref: React.RefObject<FlowWorkspaceRef | null>, g: RulesetGraph, key = 'test') {
  act(() => ref.current!.editor!.replaceGraph(g, { key }));
}

describe('FlowWorkspace: tabs', () => {
  it('shows flows, then subflows, with the Rule badge only where the host says', () => {
    setup();
    expect(tabNames()).toEqual(['main', 'night', 'calc']);
    expect(within(tab('main')).getByText('Rule')).toBeInTheDocument();
    expect(within(tab('night')).queryByText('Rule')).not.toBeInTheDocument();
    expect(tab('main')).toHaveAttribute('aria-selected', 'true');
    expect(tab('night')).toHaveAttribute('aria-selected', 'false');
  });

  it('shows a tab for a flow not saved yet, and one for a flow the host list lacks', () => {
    setup({ flow: { id: null, kind: 'flow', name: 'Fresh', graph: graph() } });
    expect(screen.getByTestId('flow-ftab-new')).toHaveTextContent('Fresh');
    cleanup();
    setup({ flow: { id: 'saved', kind: 'flow', name: 'Just saved', graph: graph() } });
    expect(tab('saved')).toHaveAttribute('aria-selected', 'true');
  });

  it('asks the host to open another tab, and does nothing for the open one', () => {
    const { onOpen } = setup();
    fireEvent.click(tab('main'));
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(tab('calc'));
    expect(onOpen).toHaveBeenCalledWith({ kind: 'subflow', id: 'calc' }, undefined);
  });

  it('"+" asks the host for a new flow, and is not there when the host cannot create', () => {
    const { onCreate } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'New flow' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    cleanup();
    setup({ canCreate: false });
    expect(screen.queryByRole('button', { name: 'New flow' })).not.toBeInTheDocument();
  });

  it('puts a dot on the open tab when it has unsaved changes', () => {
    const { ref } = setup();
    expect(screen.queryByRole('img', { name: 'Unsaved changes' })).not.toBeInTheDocument();
    edit(ref, graph([node('n1', 'logic.step', 'First', 40), node('n2', 'logic.step', 'Second', 300)]));
    expect(within(tab('main')).getByRole('img', { name: 'Unsaved changes' })).toBeInTheDocument();
    expect(ref.current!.isDirty()).toBe(true);
  });

  it('reorders with Alt + arrow keys within a kind and keeps the order in this browser', () => {
    setup();
    fireEvent.keyDown(tab('main'), { key: 'ArrowRight', altKey: true });
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
    expect(JSON.parse(localStorage.getItem(TAB_ORDER_KEY)!).flows).toEqual(['night', 'main']);
    // a subflow does not move among the flows
    fireEvent.keyDown(tab('calc'), { key: 'ArrowLeft', altKey: true });
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
  });

  it('starts from the saved order, and from the host order when there is none', () => {
    localStorage.setItem(TAB_ORDER_KEY, JSON.stringify({ flows: ['night', 'main'] }));
    setup();
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
  });

  it('reorders by drag and drop within a kind only', () => {
    setup();
    fireEvent.dragStart(tab('night'));
    fireEvent.dragOver(tab('main'));
    fireEvent.drop(tab('main'));
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
    fireEvent.dragStart(tab('calc'));
    fireEvent.dragOver(tab('main'));
    fireEvent.drop(tab('main'));
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
  });

  it('still reorders for this visit when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    setup();
    fireEvent.keyDown(tab('night'), { key: 'ArrowLeft', altKey: true });
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
    spy.mockRestore();
  });
});

describe('FlowWorkspace: tab menu', () => {
  it('opens on right click; Rename is for the open tab only', async () => {
    const { onRename, onOpen } = setup();
    fireEvent.contextMenu(tab('night'));
    let menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Rename…' })).toBeDisabled();
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Open' }));
    expect(onOpen).toHaveBeenCalledWith({ kind: 'flow', id: 'night' }, undefined);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Menu of this tab' }));
    menu = await screen.findByRole('menu');
    expect(within(menu).queryByRole('menuitem', { name: 'Open' })).not.toBeInTheDocument();
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Rename…' }));
    expect(onRename).toHaveBeenCalledWith({ kind: 'flow', id: 'main' });
  });

  it('disables Rename when read only and Duplicate when the host cannot create', async () => {
    setup({ readOnly: true, canCreate: false });
    fireEvent.click(screen.getByRole('button', { name: 'Menu of this tab' }));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Rename…' })).toBeDisabled();
    expect(within(menu).getByRole('menuitem', { name: 'Duplicate' })).toBeDisabled();
  });

  it('duplicates through the host and moves the tab', async () => {
    const { onDuplicate } = setup();
    fireEvent.contextMenu(tab('night'));
    fireEvent.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Duplicate' }));
    expect(onDuplicate).toHaveBeenCalledWith({ kind: 'flow', id: 'night' });
    fireEvent.contextMenu(tab('night'));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'Move right' })).toBeDisabled();
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Move left' }));
    expect(tabNames()).toEqual(['night', 'main', 'calc']);
  });

  it('closes on Escape', async () => {
    setup();
    fireEvent.contextMenu(tab('main'));
    fireEvent.keyDown(await screen.findByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('exports the open tab as a roltek-automation-1 file, and another tab through the host', async () => {
    const download = vi.fn();
    const created: Blob[] = [];
    URL.createObjectURL = vi.fn((b: Blob | MediaSource) => { created.push(b as Blob); return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { download(this.download); });
    const loadFlow = vi.fn(async () => ({ name: 'Night', graph: graph([node('z1', 'logic.step', 'Zed', 0)]) }));
    setup({ loadFlow });

    fireEvent.click(screen.getByRole('button', { name: 'Menu of this tab' }));
    fireEvent.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Export as a file' }));
    expect(download).toHaveBeenCalledWith(expect.stringMatching(/^automation-main-flow-.*\.json$/));
    expect(JSON.parse(await created[0].text()).format).toBe('roltek-automation-1');
    expect(loadFlow).not.toHaveBeenCalled();

    fireEvent.contextMenu(tab('night'));
    fireEvent.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Export as a file' }));
    await waitFor(() => expect(download).toHaveBeenCalledTimes(2));
    expect(loadFlow).toHaveBeenCalledWith('flow', 'night');
    expect(download).toHaveBeenLastCalledWith(expect.stringMatching(/^automation-night-/));
    click.mockRestore();
  });

  it('says so when the host cannot give the flow for an export', async () => {
    setup({ loadFlow: async () => null });
    fireEvent.contextMenu(tab('night'));
    fireEvent.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Export as a file' }));
    expect(await screen.findByText('Could not read Night from the server.')).toBeInTheDocument();
  });
});

describe('FlowWorkspace: browser draft', () => {
  const CHANGED = () => graph([node('n1', 'logic.step', 'First', 40), node('n2', 'logic.step', 'Second', 300)]);

  it('writes a draft about 0.8 s after a change, not before', () => {
    vi.useFakeTimers();
    const { ref, mem } = setup();
    edit(ref, CHANGED());
    expect(mem.data.size).toBe(0);
    act(() => { vi.advanceTimersByTime(700); });
    expect(mem.data.size).toBe(0);
    act(() => { vi.advanceTimersByTime(200); });
    expect(mem.data.has(draftKey('flow', 'main'))).toBe(true);
  });

  it('removes the draft when the change is undone back to the saved state', () => {
    vi.useFakeTimers();
    const { ref, mem } = setup();
    edit(ref, CHANGED());
    act(() => { vi.advanceTimersByTime(900); });
    expect(mem.data.size).toBe(1);
    act(() => ref.current!.editor!.undo());
    expect(mem.data.size).toBe(0);
    expect(ref.current!.isDirty()).toBe(false);
  });

  it('clears the draft when the host saved', () => {
    vi.useFakeTimers();
    const { ref, mem } = setup();
    edit(ref, CHANGED());
    act(() => { vi.advanceTimersByTime(900); });
    act(() => ref.current!.markSaved());
    expect(mem.data.size).toBe(0);
    expect(ref.current!.isDirty()).toBe(false);
    expect(screen.queryByRole('img', { name: 'Unsaved changes' })).not.toBeInTheDocument();
  });

  it('offers a kept draft; Restore puts it in as one undo step', () => {
    const mem = memory();
    const store = createDraftStore(() => mem);
    const base = graph();
    store.write(draftKey('flow', 'main'), snapshotOf(graph([node('n9', 'logic.step', 'Draft node', 0)])), snapshotOf(base));
    const { ref } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: base } }, store);
    expect(screen.getByTestId('flow-draft')).toHaveTextContent('Unsaved changes from');
    expect(screen.queryByText(/changed on the server since/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('flow-draft-restore'));
    expect(screen.queryByTestId('flow-draft')).not.toBeInTheDocument();
    expect(nodeEl('Draft node')).toBeInTheDocument();
    expect(ref.current!.isDirty()).toBe(true);
    act(() => ref.current!.editor!.undo());
    expect(nodeEl('First')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Draft node \(/ })).not.toBeInTheDocument();
  });

  it('Discard throws the draft away', () => {
    const mem = memory();
    const store = createDraftStore(() => mem);
    store.write(draftKey('flow', 'main'), snapshotOf(graph([node('n9', 'logic.step', 'Draft node', 0)])), snapshotOf(graph()));
    setup({}, store);
    fireEvent.click(screen.getByTestId('flow-draft-discard'));
    expect(screen.queryByTestId('flow-draft')).not.toBeInTheDocument();
    expect(mem.data.size).toBe(0);
  });

  it('warns that the flow changed since the draft was made', () => {
    const mem = memory();
    const store = createDraftStore(() => mem);
    store.write(draftKey('flow', 'main'), snapshotOf(graph([node('n9', 'logic.step', 'Draft node', 0)])), 'an older saved state');
    setup({}, store);
    expect(screen.getByTestId('flow-draft')).toHaveTextContent('The flow changed on the server since');
  });

  it('does not offer a draft for a read-only flow, and a draft belongs to its own flow and kind', () => {
    const mem = memory();
    const store = createDraftStore(() => mem);
    store.write(draftKey('subflow', 'main'), snapshotOf(graph([node('n9', 'logic.step', 'Draft node', 0)])), snapshotOf(graph()));
    setup({}, store);
    expect(screen.queryByTestId('flow-draft')).not.toBeInTheDocument();
    cleanup();
    store.write(draftKey('flow', 'main'), snapshotOf(graph([node('n9', 'logic.step', 'Draft node', 0)])), snapshotOf(graph()));
    setup({ readOnly: true }, store);
    expect(screen.queryByTestId('flow-draft')).not.toBeInTheDocument();
  });

  it('writes the draft before leaving for another tab', () => {
    const { ref, mem, onOpen } = setup();
    edit(ref, CHANGED());
    fireEvent.click(tab('night'));
    expect(mem.data.has(draftKey('flow', 'main'))).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('refuses to leave with a message when the draft cannot be kept', () => {
    const blocked = createDraftStore(() => null);
    const { ref, onOpen, onCreate } = setup({}, blocked);
    edit(ref, CHANGED());
    fireEvent.click(tab('night'));
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.getByTestId('flow-notice')).toHaveTextContent('Save or undo your changes first: this browser cannot keep a draft.');
    fireEvent.click(screen.getByRole('button', { name: 'New flow' }));
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('leaves freely when nothing changed, even with blocked storage', () => {
    const blocked = createDraftStore(() => null);
    const { onOpen } = setup({}, blocked);
    fireEvent.click(tab('night'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe('FlowWorkspace: link jumps', () => {
  const OWN = graph([
    node('out1', 'action.link_out', 'Send alarm', 0, { targets: ['alarm'] }),
    node('in1', 'trigger.link_in', 'Local in', 300, { name: 'local' }),
    node('lonely', 'action.link_out', 'Send nowhere', 600, { targets: ['nowhere'] }),
  ]);
  const other = (id: string, nodes: RuleNode[], kind: 'flow' | 'subflow' = 'flow') => ({ id, kind, name: `Name of ${id}`, nodes });
  async function goFrom(label: string) {
    fireEvent.contextMenu(nodeEl(label));
    return within(await screen.findByRole('menu'));
  }

  it('jumps to the link in of another flow through the host, with the block to show', async () => {
    const loadFlows = vi.fn(async () => [other('night', [node('a1', 'trigger.link_in', 'Alarm in', 0, { name: 'alarm' })])]);
    const { onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows });
    fireEvent.click(await (await goFrom('Send alarm')).findByRole('menuitem', { name: 'Go to the link in' }));
    await waitFor(() => expect(onOpen).toHaveBeenCalledWith({ kind: 'flow', id: 'night' }, { nodeId: 'a1' }));
    expect(loadFlows).toHaveBeenCalledWith(['night', 'calc']);
  });

  it('keeps the other flows for 30 s', async () => {
    const loadFlows = vi.fn(async () => [other('night', [node('a1', 'trigger.link_in', 'Alarm in', 0, { name: 'alarm' })])]);
    setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows });
    for (let i = 0; i < 2; i++) {
      fireEvent.click(await (await goFrom('Send alarm')).findByRole('menuitem', { name: 'Go to the link in' }));
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    }
    expect(loadFlows).toHaveBeenCalledTimes(1);
  });

  it('shows the block when the link in is in the open flow', async () => {
    const own = graph([node('out1', 'action.link_out', 'Send local', 0, { targets: ['local'] }), node('in1', 'trigger.link_in', 'Local in', 300, { name: 'local' })]);
    const { ref, onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: own } });
    fireEvent.click(await (await goFrom('Send local')).findByRole('menuitem', { name: 'Go to the link in' }));
    await waitFor(() => expect(ref.current!.editor!.getSelection()).toEqual(['in1']));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('reads the open flow live from the editor, not from the first graph', async () => {
    const { ref, onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: graph([node('out1', 'action.link_out', 'Send local', 0, { targets: ['local'] })]) } });
    edit(ref, graph([node('out1', 'action.link_out', 'Send local', 0, { targets: ['local'] }), node('in9', 'trigger.link_in', 'Added in', 300, { name: 'local' })]));
    fireEvent.click(await (await goFrom('Send local')).findByRole('menuitem', { name: 'Go to the link in' }));
    await waitFor(() => expect(ref.current!.editor!.getSelection()).toEqual(['in9']));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('lists several hits and goes to the one picked', async () => {
    const loadFlows = async () => [
      other('night', [node('a1', 'trigger.link_in', 'Alarm in', 0, { name: 'alarm' })]),
      other('calc', [node('a2', 'trigger.link_in', 'Alarm in too', 0, { name: 'alarm' })], 'subflow'),
    ];
    const { onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows });
    fireEvent.click(await (await goFrom('Send alarm')).findByRole('menuitem', { name: 'Go to the link in' }));
    const hits = await screen.findAllByTestId('flow-link-hit');
    expect(hits.map((h) => h.textContent)).toEqual(['Name of night › Alarm in', 'Name of calc › Alarm in too']);
    fireEvent.click(hits[1]);
    expect(onOpen).toHaveBeenCalledWith({ kind: 'subflow', id: 'calc' }, { nodeId: 'a2' });
    expect(screen.queryByTestId('flow-link-hits')).not.toBeInTheDocument();
  });

  it('a link in lists the blocks that call it', async () => {
    const loadFlows = async () => [other('night', [node('c1', 'logic.link_call', 'Call it', 0, { target: 'local' })])];
    const { onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows });
    fireEvent.click(await (await goFrom('Local in')).findByRole('menuitem', { name: 'Show the blocks that call it' }));
    await waitFor(() => expect(onOpen).toHaveBeenCalledWith({ kind: 'flow', id: 'night' }, { nodeId: 'c1' }));
  });

  it('says so when there is no hit', async () => {
    setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows: async () => [] });
    fireEvent.click(await (await goFrom('Send nowhere')).findByRole('menuitem', { name: 'Go to the link in' }));
    expect(await screen.findByTestId('flow-notice')).toHaveTextContent('No link in is called nowhere.');
  });

  it('only searches the open flow without loadFlows', async () => {
    const { onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN } });
    fireEvent.click(await (await goFrom('Send alarm')).findByRole('menuitem', { name: 'Go to the link in' }));
    expect(await screen.findByTestId('flow-notice')).toHaveTextContent('No link in is called alarm.');
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('keeps the draft before it jumps to another flow, and stays when it cannot', async () => {
    const loadFlows = async () => [other('night', [node('a1', 'trigger.link_in', 'Alarm in', 0, { name: 'alarm' })])];
    const blocked = createDraftStore(() => null);
    const { ref, onOpen } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: OWN }, loadFlows }, blocked);
    edit(ref, graph([...OWN.nodes, node('x', 'logic.step', 'Extra', 900)]));
    fireEvent.click(await (await goFrom('Send alarm')).findByRole('menuitem', { name: 'Go to the link in' }));
    expect(await screen.findByTestId('flow-notice')).toHaveTextContent('cannot keep a draft');
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('has no link entry on other blocks', async () => {
    setup();
    fireEvent.contextMenu(nodeEl('First'));
    const menu = within(await screen.findByRole('menu'));
    expect(menu.queryByRole('menuitem', { name: 'Go to the link in' })).not.toBeInTheDocument();
  });

  it('selects the block a jump from another flow named', () => {
    const { ref } = setup({ focusNodeId: 'n2' });
    expect(ref.current!.editor!.getSelection()).toEqual(['n2']);
  });
});

describe('FlowWorkspace: merge', () => {
  const BASE = graph([node('n1', 'logic.step', 'First', 0), node('n2', 'logic.step', 'Second', 300)]);
  /** mine: First moved; theirs: Second renamed, a node added */
  const MINE = graph([node('n1', 'logic.step', 'First', 40), node('n2', 'logic.step', 'Second', 300)]);
  const THEIRS = graph([node('n1', 'logic.step', 'First', 0), node('n2', 'logic.step', 'Second renamed', 300), node('n3', 'logic.step', 'Theirs new', 600)]);

  it('does not show the conflict dialog without a conflict, and has Merge only when the host can load', () => {
    setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    cleanup();
    setup({ conflict: { at: 1_700_000_000, by: 'Ada' } });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByTestId('flow-merge')).not.toBeInTheDocument();
  });

  it('merges the host version with the changes here as one undo step', async () => {
    const loadFlow = vi.fn(async () => ({ graph: THEIRS }));
    const onMerged = vi.fn();
    const onConflictClose = vi.fn();
    const { ref } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: BASE }, conflict: { at: 1_700_000_000, by: 'Ada' }, loadFlow, onMerged, onConflictClose });
    edit(ref, MINE);
    fireEvent.click(screen.getByTestId('flow-merge'));
    expect(await screen.findByTestId('flow-merge-summary')).toHaveTextContent('(Ada)');
    expect(loadFlow).toHaveBeenCalledWith('flow', 'main');
    const merged = ref.current!.getGraph()!;
    expect(merged.nodes.map((n) => [n.nodeId, n.label, n.x])).toEqual([['n1', 'First', 40], ['n2', 'Second renamed', 300], ['n3', 'Theirs new', 600]]);
    expect(screen.getByTestId('flow-merge-summary')).toHaveTextContent('2 changes taken');
    expect(screen.getByText('Nothing was changed on both sides.')).toBeInTheDocument();
    expect(onMerged).toHaveBeenCalledTimes(1);
    expect(ref.current!.isDirty()).toBe(true);

    // one undo step back to the version before the merge
    act(() => ref.current!.editor!.undo());
    expect(ref.current!.getGraph()!.nodes.map((n) => [n.nodeId, n.x])).toEqual([['n1', 40], ['n2', 300]]);

    fireEvent.click(screen.getByTestId('flow-merge-ok'));
    expect(onConflictClose).toHaveBeenCalledTimes(1);
  });

  it('keeps mine for a block both sides changed and lists it', async () => {
    const theirs = graph([node('n1', 'logic.step', 'First', 80), node('n2', 'logic.step', 'Second', 300)]);
    const { ref } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: BASE }, conflict: {}, loadFlow: async () => ({ graph: theirs }) });
    edit(ref, MINE);
    fireEvent.click(screen.getByTestId('flow-merge'));
    const list = await screen.findByTestId('flow-merge-conflicts');
    expect(list).toHaveTextContent('First (n1)');
    expect(ref.current!.getGraph()!.nodes.find((n) => n.nodeId === 'n1')?.x).toBe(40);
  });

  it('names a block you deleted that the other side changed', async () => {
    const mine = graph([node('n2', 'logic.step', 'Second', 300)]);
    const theirs = graph([node('n1', 'logic.step', 'First', 80), node('n2', 'logic.step', 'Second', 300)]);
    const { ref } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: BASE }, conflict: {}, loadFlow: async () => ({ graph: theirs }) });
    edit(ref, mine);
    fireEvent.click(screen.getByTestId('flow-merge'));
    expect(await screen.findByTestId('flow-merge-conflicts')).toHaveTextContent('First (n1) (you deleted it)');
  });

  it('says so when the host version cannot be read, and changes nothing', async () => {
    const { ref } = setup({ flow: { id: 'main', kind: 'flow', name: 'Main flow', graph: BASE }, conflict: {}, loadFlow: async () => null });
    edit(ref, MINE);
    fireEvent.click(screen.getByTestId('flow-merge'));
    expect(await screen.findByText('Could not read the version on the server.')).toBeInTheDocument();
    expect(ref.current!.getGraph()!.nodes.map((n) => n.x)).toEqual([40, 300]);
  });

  it('shows the host\'s own buttons and closes with Cancel', () => {
    const onConflictClose = vi.fn();
    setup({ conflict: {}, conflictActions: <button type="button">Overwrite</button>, onConflictClose });
    expect(screen.getByRole('button', { name: 'Overwrite' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConflictClose).toHaveBeenCalled();
  });
});
