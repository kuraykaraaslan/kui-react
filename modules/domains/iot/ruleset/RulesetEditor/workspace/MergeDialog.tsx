'use client';
import { Modal } from '@/modules/ui/Modal';
import type { MergeConflict, MergeResult } from '../../graph/merge';
import type { RulesetGraph } from '../hooks/useGraphEditor';
import { PrimaryButton, SecondaryButton } from '../dialogs/buttons';
import type { ConflictInfo } from './types';

function whoWhen(info: ConflictInfo): string {
  const at = info.at ? new Date(info.at * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '?';
  return `${at}${info.by ? ` (${info.by})` : ''}`;
}

/**
 * Someone saved this flow while it was open here. The host decides what else can be done (`actions`: overwrite,
 * reload…); Merge reads the other version and merges it with the changes made here.
 */
export function ConflictDialog({ info, canMerge, busy, error, actions, onMerge, onClose }: {
  info: ConflictInfo;
  canMerge: boolean;
  busy: boolean;
  error: string | null;
  /** more buttons of the host */
  actions?: React.ReactNode;
  onMerge: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open onClose={onClose} title="This flow was saved by someone else" size="sm"
      footer={
        <div className="flex w-full flex-wrap items-center gap-2">
          {canMerge && <PrimaryButton onClick={onMerge} disabled={busy} data-testid="flow-merge">{busy ? 'Merging…' : 'Merge'}</PrimaryButton>}
          {actions}
          <SecondaryButton onClick={onClose} disabled={busy}>Cancel</SecondaryButton>
        </div>
      }>
      <div className="space-y-2 text-sm text-text-primary">
        <p>The version of {whoWhen(info)} is newer than the one you started from.</p>
        {canMerge && <p className="text-text-secondary">Merge keeps what only one side changed. Nothing is saved yet: look through the flow, then save.</p>}
        {error && <p role="alert" className="text-error">{error}</p>}
      </div>
    </Modal>
  );
}

/** what a node, group or subflow of a conflict is called */
export function conflictName(c: MergeConflict, graph: RulesetGraph): string {
  if (c.kind === 'group') return `group ${graph.groups.find((g) => g.groupId === c.id)?.name || c.id}`;
  if (c.kind === 'subflow') return `subflow ${graph.subflows.find((s) => s.subflowId === c.id)?.name || c.id}`;
  const n = graph.nodes.find((x) => x.nodeId === c.id);
  return n ? `${n.label} (${c.id})` : c.id;
}

/** What the merge did, and the blocks both sides changed (the editor's version was kept). */
export function MergedDialog({ info, result, theirs, onClose }: { info: ConflictInfo; result: MergeResult; theirs: RulesetGraph; onClose: () => void }) {
  // a block you deleted is not in the merged graph: name it from the other side's graph
  const taken = result.fromTheirs.length;
  return (
    <Modal open onClose={onClose} title="Merged" size="sm"
      footer={<div className="flex w-full justify-end"><PrimaryButton onClick={onClose} data-testid="flow-merge-ok">OK</PrimaryButton></div>}>
      <div className="space-y-3 text-sm text-text-primary">
        <p data-testid="flow-merge-summary">The version of {whoWhen(info)} was merged into your changes: {taken} {taken === 1 ? 'change' : 'changes'} taken from it.</p>
        {result.conflicts.length > 0 ? (
          <div>
            <p>Changed on both sides; your version was kept:</p>
            <ul data-testid="flow-merge-conflicts" className="mt-1 list-disc space-y-0.5 pl-5">
              {result.conflicts.map((c) => (
                <li key={`${c.kind}:${c.id}`}>{conflictName(c, c.deleted ? theirs : result.graph)}{c.deleted ? ' (you deleted it)' : ''}</li>
              ))}
            </ul>
          </div>
        ) : <p className="text-text-secondary">Nothing was changed on both sides.</p>}
        <p className="text-xs text-text-secondary">Look through the flow, then save. Undo goes back to your version before the merge.</p>
      </div>
    </Modal>
  );
}
