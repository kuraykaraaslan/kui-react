import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RulesetEditor, type RulesetGraph } from './index';
import { catalogFromBlocks, type RawBlock } from '../catalog';
import type { RuleEdge, RuleNode } from '../../types';

afterEach(() => cleanup());

/** more blocks than the canvas menu lists one by one */
const BLOCKS: RawBlock[] = [
  { type: 'trigger.boot', title: 'Boot' },
  { type: 'trigger.timer', title: 'Timer' },
  ...Array.from({ length: 12 }, (_, i): RawBlock => ({ type: `action.step${i}`, title: `Step ${i}`, description: i === 3 ? 'The special one' : undefined })),
  { type: 'cond.gate', title: 'Gate' },
];
const catalog = catalogFromBlocks([BLOCKS]);

const node = (nodeId: string, type: string, label: string, x: number, y: number): RuleNode => ({ nodeId, type, label, x, y });
const edge = (edgeId: string, from: string, port: string, to: string): RuleEdge => ({ edgeId, sourceNodeId: from, sourcePort: port, targetNodeId: to, targetPort: 'in' });

function setup(nodes: RuleNode[] = [], edges: RuleEdge[] = []) {
  const onChange = vi.fn<(g: RulesetGraph) => void>();
  const utils = render(<RulesetEditor catalog={catalog} initialNodes={nodes} initialEdges={edges} onChange={onChange} />);
  return { onChange, last: () => onChange.mock.calls.at(-1)?.[0], ...utils };
}

describe('RulesetEditor with a large catalog', () => {
  it('opens a picker from the canvas menu instead of listing every block', async () => {
    const user = userEvent.setup();
    const { last } = setup();
    fireEvent.contextMenu(screen.getByLabelText('Rule chain canvas'));
    const menu = await screen.findByRole('menu');
    expect(within(menu).queryByRole('menuitem', { name: 'Add Boot' })).not.toBeInTheDocument();
    await user.click(within(menu).getByRole('menuitem', { name: 'Add a block here…' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Boot')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /Timer/ }));
    expect(last()?.nodes).toHaveLength(1);
    expect(last()?.nodes[0]).toMatchObject({ type: 'trigger.timer', label: 'Timer' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('searches the picker by title, description and type, and starts in the search field', async () => {
    const user = userEvent.setup();
    setup();
    fireEvent.contextMenu(screen.getByLabelText('Rule chain canvas'));
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Add a block here…' }));
    const search = await screen.findByLabelText('Search blocks');
    await waitFor(() => expect(search).toHaveFocus());
    await user.type(search, 'special');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('button', { name: /Step/ })).toHaveLength(1);
    await user.clear(search);
    await user.type(search, 'action.step1');
    expect(within(dialog).getAllByRole('button', { name: /Step/ }).length).toBeGreaterThan(1);
    await user.clear(search);
    await user.type(search, 'zzz');
    expect(within(dialog).getByText('No block matches.')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('puts a block in the middle of a connection', async () => {
    const user = userEvent.setup();
    const { container, last } = setup(
      [node('a', 'trigger.boot', 'Boot', 0, 0), node('b', 'action.step0', 'Step 0', 400, 0)],
      [edge('e1', 'a', 'out', 'b')],
    );
    const path = container.querySelector('[data-edge-id="e1"]')!;
    fireEvent.contextMenu(path);
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Add a block in between…' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: /Gate/ }));
    const graph = last()!;
    expect(graph.nodes.map((n) => n.type)).toEqual(['trigger.boot', 'action.step0', 'cond.gate']);
    expect(graph.edges.map((e) => [e.sourceNodeId, e.sourcePort, e.targetNodeId])).toEqual([['a', 'out', 'n3'], ['n3', 'yes', 'b']]);
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(last()?.edges.map((e) => e.edgeId)).toEqual(['e1']);
  });

  it('deletes a selected connection from its menu', async () => {
    const user = userEvent.setup();
    const { container, last } = setup(
      [node('a', 'trigger.boot', 'Boot', 0, 0), node('b', 'action.step0', 'Step 0', 400, 0)],
      [edge('e1', 'a', 'out', 'b')],
    );
    fireEvent.contextMenu(container.querySelector('[data-edge-id="e1"]')!);
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Delete connection' }));
    expect(last()?.edges).toEqual([]);
  });

  it('offers the subflow ports only inside a subflow, and only one input', async () => {
    const user = userEvent.setup();
    setup([node('a', 'trigger.boot', 'Boot', 0, 0)]);
    expect(screen.queryByRole('button', { name: 'Add Subflow input node' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /New subflow/ }));
    await user.type(await screen.findByLabelText('Name of the subflow'), 'S');
    await waitFor(() => expect(screen.getByLabelText('Name of the subflow')).toHaveFocus());
    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByRole('button', { name: 'Add Subflow output node' })).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole('button', { name: 'Add Subflow input node' })).toHaveAttribute('aria-disabled', 'true');
    // the blocks of the chain stay available inside, but not the subflow itself
    expect(screen.getByRole('button', { name: 'Add Boot node' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add S node' })).not.toBeInTheDocument();
  });

  it('greys out a subflow that would hold itself, with the reason', async () => {
    const user = userEvent.setup();
    setup([node('a', 'trigger.boot', 'Boot', 0, 0)]);
    const make = async (name: string) => {
      await user.click(screen.getByRole('button', { name: /New subflow/ }));
      await user.type(await screen.findByLabelText('Name of the subflow'), name);
      await user.click(screen.getByRole('button', { name: 'Create' }));
    };
    const enter = async (name: string) => {
      await user.click(screen.getByRole('button', { name: `Add ${name} node` }));
      fireEvent.contextMenu(screen.getByRole('button', { name: new RegExp(`^${name} \\(`) }));
      await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Edit the subflow' }));
    };
    await make('S');
    await user.click(screen.getByRole('button', { name: /Back to/ }));
    await make('T');
    // inside T: S may go in, T itself is not offered
    expect(screen.queryByRole('button', { name: 'Add T node' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add S node' }));
    await user.click(screen.getByRole('button', { name: /Back to/ }));
    // inside S: T would make a loop, so it is greyed out and says why
    await enter('S');
    const t = screen.getByRole('button', { name: 'Add T node' });
    expect(t).toHaveAttribute('aria-disabled', 'true');
    expect(t).toHaveAttribute('title', expect.stringMatching(/cannot hold itself/));
    await user.click(t);
    expect(screen.queryByRole('button', { name: /^T \(/ })).not.toBeInTheDocument();
  });
});
