'use client';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { FlowWorkspace, type FlowWorkspaceRef } from '@/modules/domains/iot/ruleset/RulesetEditor/workspace/FlowWorkspace';
import type { ConflictInfo, FlowKind, WorkspaceTab } from '@/modules/domains/iot/ruleset/RulesetEditor/workspace/types';
import type { RulesetGraph } from '@/modules/domains/iot/ruleset/RulesetEditor';
import { catalogFromBlocks } from '@/modules/domains/iot/ruleset/catalog';
import type { RuleNode } from '@/modules/domains/iot/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const CATALOG = catalogFromBlocks([[
  { type: 'trigger.link_in', group: 'input', icon: 'link', title: 'Link in', summary: '${name}', params: { name: { type: 'string', required: true } } },
  { type: 'action.link_out', group: 'output', icon: 'link', title: 'Link out', summary: '${targets}', outputs: [], params: { targets: { type: 'list', label: 'Link names' } } },
  { type: 'logic.link_call', group: 'function', icon: 'link', title: 'Link call', summary: '${target}', params: { target: { type: 'string', required: true } } },
  { type: 'logic.step', group: 'function', icon: 'gear', title: 'Step', summary: '${text}', params: { text: { type: 'string', default: 'Do something' } } },
]]);

const node = (nodeId: string, type: string, label: string, x: number, y: number, config: Record<string, unknown> = {}): RuleNode => ({ nodeId, type, label, x, y, config });
const wire = (id: string, a: string, b: string) => ({ edgeId: id, sourceNodeId: a, sourcePort: 'out', targetNodeId: b, targetPort: 'in' });

type Stored = { id: string; kind: FlowKind; name: string; isRule?: boolean; rev: number; graph: RulesetGraph };

const SEED: Stored[] = [
  {
    id: 'morning', kind: 'flow', name: 'Morning routine', isRule: true, rev: 1,
    graph: {
      nodes: [node('a1', 'logic.step', 'Open the blinds', 40, 60), node('a2', 'action.link_out', 'To the alarm check', 300, 60, { targets: ['alarm-check'] }), node('a3', 'trigger.link_in', 'Back from the alarm', 40, 220, { name: 'morning-again' })],
      edges: [wire('e1', 'a1', 'a2')], groups: [], subflows: [],
    },
  },
  {
    id: 'alarm', kind: 'flow', name: 'Alarm', rev: 1,
    graph: {
      nodes: [node('b1', 'trigger.link_in', 'Alarm check', 40, 60, { name: 'alarm-check' }), node('b2', 'logic.step', 'Is anyone home?', 300, 60), node('b3', 'logic.link_call', 'Ask the morning flow', 560, 60, { target: 'morning-again' })],
      edges: [wire('e1', 'b1', 'b2'), wire('e2', 'b2', 'b3')], groups: [], subflows: [],
    },
  },
  {
    id: 'helper', kind: 'subflow', name: 'Helper', rev: 1,
    graph: { nodes: [node('c1', 'logic.step', 'Helper step', 40, 60), node('c2', 'action.link_out', 'To the alarm check', 300, 60, { targets: ['alarm-check'] })], edges: [wire('e1', 'c1', 'c2')], groups: [], subflows: [] },
  },
];

const TRY: string[] = [
  'Click a tab to open another flow. Change something first: the tab shows a dot, and the change comes back as a draft banner when you return.',
  'Drag a tab, or press Alt+Left / Alt+Right on a focused tab, to reorder it. The order is kept in this browser.',
  'Right-click “To the alarm check” and choose “Go to the link in”: the “Alarm” flow opens with that block selected. On “Alarm check”, “Show the blocks that call it” lists both callers.',
  'Edit “Morning routine”, press “Someone else saves”, then “Save”: the conflict dialog opens. “Merge” keeps both sides and is one undo step.',
];

/** A host with in-memory flows, to try the tab strip, drafts, link jumps and the three-way merge. */
export default function WorkspaceDemoPage() {
  const wsRef = useRef<FlowWorkspaceRef>(null);
  const [server, setServer] = useState<Stored[]>(SEED);
  const [open, setOpen] = useState<{ kind: FlowKind; id: string; nodeId?: string }>({ kind: 'flow', id: 'morning' });
  const [openedRev, setOpenedRev] = useState(1);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const seq = useRef(0);

  const current = server.find((f) => f.kind === open.kind && f.id === open.id) ?? server[0];
  const tabs: WorkspaceTab[] = useMemo(() => server.map(({ id, kind, name, isRule }) => ({ id, kind, name, isRule })), [server]);

  function show(kind: FlowKind, id: string, nodeId?: string) {
    const f = server.find((s) => s.kind === kind && s.id === id);
    if (!f) return;
    setOpen({ kind, id, nodeId });
    setOpenedRev(f.rev);
    setConflict(null);
    setMessage('');
  }

  function save() {
    const g = wsRef.current?.getGraph();
    if (!g) return;
    if (current.rev !== openedRev) { setConflict({ at: Math.floor(Date.now() / 1000), by: 'another user' }); return; }
    setServer((s) => s.map((f) => (f === current ? { ...f, graph: g, rev: f.rev + 1 } : f)));
    setOpenedRev(current.rev + 1);
    wsRef.current?.markSaved(g);
    setMessage('Saved.');
  }

  function someoneElseSaves() {
    const n = ++seq.current;
    const extra = node(`x${n}`, 'logic.step', `Added elsewhere ${n}`, 40 + n * 40, 380);
    setServer((s) => s.map((f) => (f === current ? { ...f, graph: { ...f.graph, nodes: [...f.graph.nodes, extra] }, rev: f.rev + 1 } : f)));
    setMessage('Another user saved this flow. Save yours to see the conflict.');
  }

  function create(from?: Stored, name?: string) {
    const n = ++seq.current;
    const id = `new${n}`;
    const flow: Stored = { id, kind: from?.kind ?? 'flow', name: name ?? `New flow ${n}`, rev: 1, graph: from ? structuredClone(from.graph) : { nodes: [node('n1', 'logic.step', 'First step', 40, 60)], edges: [], groups: [], subflows: [] } };
    setServer((s) => [...s, flow]);
    setOpen({ kind: flow.kind, id });
    setOpenedRev(1);
  }

  function rename() {
    let name: string | null = null;
    try { name = window.prompt('Name of the flow', current.name); } catch { /* prompt blocked */ }
    if (name && name.trim()) setServer((s) => s.map((f) => (f === current ? { ...f, name: name.trim() } : f)));
  }

  return (
    <main className="mx-auto flex h-screen max-w-7xl flex-col p-4">
      <DocumentTitle text="Flow workspace demo — IoT Theme" />
      <Link href="/theme/iot/rulesets" className="mb-2 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" aria-hidden="true" /> Rulesets
      </Link>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h1 className="mr-2 text-xl font-semibold text-text-primary">Flow workspace</h1>
        <Button size="sm" onClick={save} data-testid="ws-demo-save">Save{dirty ? ' *' : ''}</Button>
        <Button size="sm" variant="outline" onClick={someoneElseSaves}>Someone else saves</Button>
        {message && <span className="text-xs text-text-secondary" role="status">{message}</span>}
      </div>
      <ul className="mb-2 list-disc pl-5 text-xs text-text-secondary">{TRY.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
        <FlowWorkspace
          ref={wsRef}
          catalog={CATALOG}
          tabs={tabs}
          flow={{ id: current.id, kind: current.kind, name: current.name, graph: current.graph, isRule: current.isRule }}
          focusNodeId={open.nodeId}
          onOpen={(t, o) => show(t.kind, t.id, o?.nodeId)}
          onCreate={() => create()}
          onDuplicate={(t) => { const f = server.find((s) => s.kind === t.kind && s.id === t.id); if (f) create(f, `${f.name} copy`); }}
          onRename={rename}
          loadFlows={async (ids) => server.filter((f) => ids.includes(f.id)).map((f) => ({ id: f.id, kind: f.kind, name: f.name, nodes: f.graph.nodes }))}
          loadFlow={async (kind, id) => { const f = server.find((s) => s.kind === kind && s.id === id); return f ? { name: f.name, graph: f.graph } : null; }}
          conflict={conflict}
          conflictActions={<Button size="sm" variant="outline" onClick={() => { setOpenedRev(current.rev); setConflict(null); setMessage('Overwrite: the next Save replaces their version.'); }}>Overwrite</Button>}
          onConflictClose={() => setConflict(null)}
          onMerged={() => { setOpenedRev(current.rev); setMessage('Merged. Review the result, then Save.'); }}
          onDirtyChange={setDirty}
        />
      </div>
    </main>
  );
}
