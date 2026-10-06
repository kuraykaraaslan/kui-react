'use client';
import { useCallback, useState } from 'react';
import { mergeGraphs, type MergeResult } from '../../graph/merge';
import type { RulesetGraph } from '../hooks/useGraphEditor';
import type { ConflictInfo, FlowKind, LoadedFlow } from './types';

type Options = {
  kind: FlowKind;
  id: string | null;
  /** the host's current version of this flow (what `theirs` is) */
  loadFlow?: (kind: FlowKind, id: string) => Promise<LoadedFlow | null | undefined>;
  getGraph: () => RulesetGraph | undefined;
  /** what the flow was when it was opened or last saved */
  baseline: () => RulesetGraph;
  replaceGraph: (graph: RulesetGraph, options?: { key?: string; fit?: boolean }) => void;
  /** the host's version is the new baseline */
  rebase: (graph: RulesetGraph) => void;
  onMerged?: (theirs: LoadedFlow, result: MergeResult) => void;
};

export type MergeOutcome = { result: MergeResult; theirs: LoadedFlow; info: ConflictInfo };

/**
 * The "Merge" of the conflict dialog: someone saved this flow while it was open here. The host's version is read
 * (`loadFlow`), merged with the changes made here, and put in the editor as one undo step. Nothing is sent: the
 * merged flow is saved with the host's own save, on the new revision.
 */
export function useMerge({ kind, id, loadFlow, getGraph, baseline, replaceGraph, rebase, onMerged }: Options) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<MergeOutcome | null>(null);
  const canMerge = !!loadFlow && !!id;

  const merge = useCallback(async (info: ConflictInfo) => {
    if (!loadFlow || !id) return;
    setBusy(true);
    setError(null);
    try {
      const theirs = await loadFlow(kind, id);
      const mine = getGraph();
      if (!theirs || !mine) { setError('Could not read the version on the server.'); return; }
      const result = mergeGraphs(baseline(), mine, theirs.graph);
      replaceGraph(result.graph, { key: 'merge' });
      // the host's version is the new "saved" state; the merged flow is a change on top of it
      rebase(theirs.graph);
      setOutcome({ result, theirs, info });
      onMerged?.(theirs, result);
    } catch {
      setError('Could not read the version on the server.');
    } finally {
      setBusy(false);
    }
  }, [loadFlow, id, kind, getGraph, baseline, replaceGraph, rebase, onMerged]);

  return { canMerge, busy, error, outcome, merge, closeOutcome: () => setOutcome(null), clearError: () => setError(null) };
}
