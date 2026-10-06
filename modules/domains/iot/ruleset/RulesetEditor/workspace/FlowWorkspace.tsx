'use client';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { RuleChain } from '../../../types';
import type { DraftStore } from '../../graph/draft';
import type { LinkFlow } from '../../graph/links';
import type { MergeResult } from '../../graph/merge';
import { buildRoltekExport } from '../../transfer';
import { RulesetEditor, type ContextMenuItem, type NodeMenuContext, type RulesetEditorProps, type RulesetEditorRef } from '../index';
import type { RulesetGraph } from '../hooks/useGraphEditor';
import { DraftBanner, NoticeBanner, type Notice } from './DraftBanner';
import { FlowTabs } from './FlowTabs';
import { LinkHitsDialog } from './LinkHitsDialog';
import { ConflictDialog, MergedDialog } from './MergeDialog';
import { orderTabs, readTabOrder, reorder, savedFor, writeTabOrder, type TabOrder } from './tab-order';
import type { ActiveFlow, ConflictInfo, FlowKind, LoadedFlow, TabRef, WorkspaceTab } from './types';
import { useDraft } from './useDraft';
import { useFlowLinks } from './useFlowLinks';
import { useMerge } from './useMerge';

export type FlowWorkspaceRef = {
  /** the editor inside (null until it is mounted) */
  editor: RulesetEditorRef | null;
  getGraph: () => RulesetGraph | undefined;
  /** the open flow has changes that were not saved */
  isDirty: () => boolean;
  /** call after the host saved: the graph (or the one given) is the new baseline and the draft goes */
  markSaved: (graph?: RulesetGraph) => void;
  /** write the draft now; false when the browser cannot keep it */
  keepDraft: () => boolean;
};

type EditorProps = Omit<RulesetEditorProps, 'initialNodes' | 'initialEdges' | 'initialGroups' | 'initialSubflows' | 'chainName' | 'bannerSlot' | 'ref'>;

export type FlowWorkspaceProps = EditorProps & {
  /** every flow and subflow of the host (the open one may be left out until it is saved) */
  tabs: WorkspaceTab[];
  /** the flow in the editor. The workspace loads its graph once: give another flow to open another tab */
  flow: ActiveFlow;
  /** a tab was clicked (or a link jump): show that flow. `nodeId` is a block to select and bring into view */
  onOpen: (tab: TabRef, options?: { nodeId?: string }) => void;
  /** the "+" tab */
  onCreate?: () => void;
  onDuplicate?: (tab: TabRef) => void;
  /** rename the open flow (the menu offers it for the open tab only) */
  onRename?: (tab: TabRef) => void;
  /** may a new flow be made (shows "+" and enables Duplicate); default true */
  canCreate?: boolean;
  /** other flows with their blocks, for link jumps across flows (kept 30 s). Without it only the open flow is searched */
  loadFlows?: (ids: string[]) => Promise<LinkFlow[] | null | undefined>;
  /** one flow as the host has it: the other side of a merge, and the file of Export for a tab that is not open */
  loadFlow?: (kind: FlowKind, id: string) => Promise<LoadedFlow | null | undefined>;
  /** set when saving found a newer version: shows the conflict dialog with Merge */
  conflict?: ConflictInfo | null;
  /** more buttons in the conflict dialog (overwrite, reload …) */
  conflictActions?: React.ReactNode;
  /** the conflict dialog (or the merge summary) was closed */
  onConflictClose?: () => void;
  /** a merge was made: the host's version is the new baseline (take its revision) */
  onMerged?: (theirs: LoadedFlow, result: MergeResult) => void;
  /** a block to select and bring into view when the flow opens (a jump from another flow) */
  focusNodeId?: string | null;
  /** the open flow became dirty or clean */
  onDirtyChange?: (dirty: boolean) => void;
  /** called with every change of the editor, like `RulesetEditor`'s */
  onChange?: (graph: RulesetGraph) => void;
  /** for tests: where drafts are kept */
  draftStore?: DraftStore;
  className?: string;
  ref?: React.Ref<FlowWorkspaceRef>;
};

function downloadText(fileName: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * `RulesetEditor` with the pieces a host that has many flows needs: a strip of flow tabs, a browser draft per flow,
 * jumps through link blocks and a three-way merge for a save conflict. The editor stays one flow at a time; a tab is
 * navigation, done through the host's callbacks. Use it instead of the bare editor, with the same props.
 */
export function FlowWorkspace(props: FlowWorkspaceProps) {
  // one editor, one draft and one set of dialogs per flow
  return <WorkspaceBody key={`${props.flow.kind}:${props.flow.id ?? 'new'}`} {...props} />;
}

function WorkspaceBody({
  tabs, flow, onOpen, onCreate, onDuplicate, onRename, canCreate = true, loadFlows, loadFlow, conflict, conflictActions, onConflictClose,
  onMerged, focusNodeId, onDirtyChange, onChange, draftStore, className, nodeMenuItems, ref, ...editorProps
}: FlowWorkspaceProps) {
  const readOnly = !!editorProps.readOnly;
  const editorRef = useRef<RulesetEditorRef>(null);
  const getGraph = useCallback(() => editorRef.current?.getGraph(), []);
  const replaceGraph = useCallback((g: RulesetGraph, o?: { key?: string; fit?: boolean }) => editorRef.current?.replaceGraph(g, o), []);
  const [notice, setNotice] = useState<Notice | null>(null);
  const say = useCallback((text: string, tone: Notice['tone'] = 'info') => setNotice({ text, tone }), []);

  const draft = useDraft({ kind: flow.kind, id: flow.id, initial: flow.graph, readOnly, getGraph, replaceGraph, store: draftStore, onDirtyChange });

  /* ── tabs ── */
  const [order, setOrder] = useState<TabOrder>({});
  // reads localStorage after hydration, so the server and first client render agree
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOrder(readTabOrder()), []);
  const shown = useMemo(() => {
    const list = (kind: FlowKind) => {
      const a = tabs.filter((t) => t.kind === kind);
      // the open flow has a tab even when the host's list does not have it yet (just saved)
      if (flow.id && flow.kind === kind && !a.some((t) => t.id === flow.id)) a.push({ id: flow.id, kind, name: flow.name });
      return orderTabs(a, savedFor(order, kind));
    };
    return { flows: list('flow'), subflows: list('subflow') };
  }, [tabs, flow.id, flow.kind, flow.name, order]);

  function moveTab(kind: FlowKind, id: string, to: number) {
    const ids = (kind === 'subflow' ? shown.subflows : shown.flows).map((t) => t.id);
    const next = reorder(order, kind, ids, id, to);
    setOrder(next);
    writeTabOrder(next);
  }

  /** leaving this flow: the draft keeps what is unsaved; if the browser cannot keep it, stay and say so */
  function leave(): boolean {
    if (draft.keep()) return true;
    say('Save or undo your changes first: this browser cannot keep a draft.', 'warning');
    return false;
  }

  function open(tab: TabRef, options?: { nodeId?: string }) {
    if (leave()) onOpen(tab, options);
  }

  async function exportTab(ref: TabRef) {
    const tab = [...shown.flows, ...shown.subflows].find((t) => t.id === ref.id && t.kind === ref.kind);
    const cur = ref.id === flow.id && ref.kind === flow.kind;
    let graph: RulesetGraph | undefined;
    let name = tab?.name || ref.id;
    if (cur) { graph = getGraph(); name = flow.name || name; }
    else {
      const got = await loadFlow?.(ref.kind, ref.id).catch(() => null);
      graph = got?.graph;
      name = got?.name || name;
    }
    if (!graph) { say(`Could not read ${name} from the server.`, 'error'); return; }
    const chain: RuleChain = { chainId: ref.id, name, slug: ref.id, active: false, nodes: graph.nodes, edges: graph.edges, groups: graph.groups, subflows: graph.subflows };
    const result = buildRoltekExport([chain], { catalog: editorProps.catalog });
    try {
      downloadText(result.fileName, result.json);
      if (result.omitted.length) say(`Saved ${result.fileName}. ${result.omitted.length} secret ${result.omitted.length === 1 ? 'setting was' : 'settings were'} left out.`);
    } catch {
      try { await navigator.clipboard.writeText(result.json); say('The flow was copied as JSON.'); } catch { say('The browser did not allow the download.', 'error'); }
    }
  }

  /* ── link jumps ── */
  const revealNode = useCallback((nodeId: string) => {
    editorRef.current?.select([nodeId]);
    editorRef.current?.reveal(nodeId);
  }, []);
  const here = useMemo(() => ({ id: flow.id, kind: flow.kind, name: flow.name }), [flow.id, flow.kind, flow.name]);
  const otherIds = useMemo(() => tabs.filter((t) => !(t.id === flow.id && t.kind === flow.kind)).map((t) => t.id), [tabs, flow.id, flow.kind]);
  const links = useFlowLinks({
    here, getGraph, otherIds, loadFlows, reveal: revealNode, notify: say,
    jump: (hit) => { if (leave()) onOpen({ kind: hit.kind, id: hit.flow }, { nodeId: hit.node }); },
  });
  const menuItems = useCallback((ctx: NodeMenuContext): ContextMenuItem[] => [...links.menuItems(ctx), ...(nodeMenuItems?.(ctx) ?? [])], [links, nodeMenuItems]);

  /* opened by a jump from another flow: show the block */
  useEffect(() => {
    if (focusNodeId && getGraph()?.nodes.some((n) => n.nodeId === focusNodeId)) revealNode(focusNodeId);
  }, [focusNodeId, getGraph, revealNode]);

  /* ── merge ── */
  const merge = useMerge({
    kind: flow.kind, id: flow.id, loadFlow, getGraph, baseline: draft.baseline, replaceGraph, rebase: draft.rebase, onMerged,
  });

  useImperativeHandle(ref, () => ({
    get editor() { return editorRef.current; },
    getGraph,
    isDirty: () => draft.dirty,
    markSaved: draft.markSaved,
    keepDraft: draft.keep,
  }), [getGraph, draft.dirty, draft.markSaved, draft.keep]);

  const banner = (draft.offer || notice) ? (
    <>
      {draft.offer && <DraftBanner draft={draft.offer.draft} stale={draft.offer.stale} onRestore={draft.restore} onDiscard={draft.discard} />}
      {notice && <NoticeBanner notice={notice} onClose={() => setNotice(null)} />}
    </>
  ) : null;

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <FlowTabs
        flows={shown.flows} subflows={shown.subflows} active={flow} dirty={draft.dirty} readOnly={readOnly} canCreate={canCreate}
        onOpen={open} onCreate={onCreate ? () => { if (leave()) onCreate(); } : undefined} onDuplicate={onDuplicate} onRename={onRename}
        onExport={(t) => { void exportTab(t); }} onMove={moveTab}
      />
      <div className="min-h-0 flex-1">
        <RulesetEditor
          {...editorProps}
          ref={editorRef}
          initialNodes={flow.graph.nodes}
          initialEdges={flow.graph.edges}
          initialGroups={flow.graph.groups}
          initialSubflows={flow.graph.subflows}
          chainName={flow.name}
          nodeMenuItems={menuItems}
          bannerSlot={banner}
          onChange={(g) => { draft.onGraphChange(g); onChange?.(g); }}
          className="h-full"
        />
      </div>

      {links.list && <LinkHitsDialog title={links.list.title} hits={links.list.hits} here={here} onPick={links.pick} onClose={links.closeList} />}
      {conflict && !merge.outcome && (
        <ConflictDialog info={conflict} canMerge={merge.canMerge} busy={merge.busy} error={merge.error} actions={conflictActions}
          onMerge={() => { void merge.merge(conflict); }} onClose={() => { merge.clearError(); onConflictClose?.(); }} />
      )}
      {merge.outcome && (
        <MergedDialog info={merge.outcome.info} result={merge.outcome.result} theirs={merge.outcome.theirs.graph}
          onClose={() => { merge.closeOutcome(); onConflictClose?.(); }} />
      )}
    </div>
  );
}
