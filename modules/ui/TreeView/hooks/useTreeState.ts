// modules/ui/TreeView/hooks/useTreeState.ts
//
// Owns expanded/selected/focus state and exposes derived `visibleRows`. Plain
// React hook, no DOM dependencies — safe for SSR.

import { useCallback, useMemo, useState } from 'react';
import type {
  NodeId,
  SelectionMode,
  TreeNode,
  VisibleRow,
} from '../types';

function collectAllIds(nodes: TreeNode[], out: Set<NodeId> = new Set()): Set<NodeId> {
  for (const n of nodes) {
    out.add(n.id);
    if (n.children && n.children.length) collectAllIds(n.children, out);
  }
  return out;
}

function collectExpandableIds(nodes: TreeNode[], out: Set<NodeId> = new Set()): Set<NodeId> {
  for (const n of nodes) {
    if (n.children && n.children.length) {
      out.add(n.id);
      collectExpandableIds(n.children, out);
    }
  }
  return out;
}

function flattenVisible(
  nodes: TreeNode[],
  expanded: Set<NodeId>,
  depth: number,
  parentId: NodeId | null,
  out: VisibleRow[],
): VisibleRow[] {
  const setSize = nodes.length;
  nodes.forEach((node, idx) => {
    const hasChildren = !!(node.children && node.children.length);
    const isExpanded = hasChildren && expanded.has(node.id);
    out.push({
      node,
      depth,
      parentId,
      hasChildren,
      expanded: isExpanded,
      level: depth + 1,
      posInSet: idx + 1,
      setSize,
    });
    if (isExpanded) {
      flattenVisible(node.children!, expanded, depth + 1, node.id, out);
    }
  });
  return out;
}

export type UseTreeStateOptions = {
  nodes: TreeNode[];
  selectionMode: SelectionMode;
  /** Controlled selection (multi). */
  selectedIds?: NodeId[];
  /** Controlled selection (single, legacy). */
  selectedId?: NodeId;
  /** Controlled expanded set. */
  expandedIds?: NodeId[];
  defaultExpandedIds?: NodeId[];
  initialFocusId?: NodeId;
  onSelectionChange?: (ids: NodeId[]) => void;
  onSelect?: (id: NodeId) => void;
  onExpand?: (id: NodeId, expanded: boolean) => void;
};

export function useTreeState({
  nodes,
  selectionMode,
  selectedIds: controlledSelectedIds,
  selectedId: controlledSelectedId,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  initialFocusId,
  onSelectionChange,
  onSelect,
  onExpand,
}: UseTreeStateOptions) {
  // ── Expanded state ─────────────────────────────────────────────────────────
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<NodeId>>(() => {
    if (defaultExpandedIds) return new Set(defaultExpandedIds);
    // Legacy behaviour: every group is expanded by default.
    return collectExpandableIds(nodes);
  });

  const expanded = useMemo(() => {
    if (controlledExpandedIds) return new Set(controlledExpandedIds);
    return uncontrolledExpanded;
  }, [controlledExpandedIds, uncontrolledExpanded]);

  // ── Selection state ────────────────────────────────────────────────────────
  const [uncontrolledSelected, setUncontrolledSelected] = useState<Set<NodeId>>(() => {
    if (controlledSelectedIds && controlledSelectedIds.length) return new Set(controlledSelectedIds);
    if (controlledSelectedId) return new Set([controlledSelectedId]);
    return new Set();
  });

  const selected = useMemo(() => {
    if (controlledSelectedIds) return new Set(controlledSelectedIds);
    if (controlledSelectedId !== undefined) return new Set([controlledSelectedId]);
    return uncontrolledSelected;
  }, [controlledSelectedIds, controlledSelectedId, uncontrolledSelected]);

  // ── Visible row list ───────────────────────────────────────────────────────
  const visibleRows = useMemo(
    () => flattenVisible(nodes, expanded, 0, null, []),
    [nodes, expanded],
  );

  // ── Focus state ────────────────────────────────────────────────────────────
  const [focusId, setFocusId] = useState<NodeId | undefined>(
    () => initialFocusId ?? visibleRows[0]?.node.id,
  );

  // ── Operations ─────────────────────────────────────────────────────────────
  const setExpanded = useCallback(
    (id: NodeId, next: boolean) => {
      onExpand?.(id, next);
      if (!controlledExpandedIds) {
        setUncontrolledExpanded((prev) => {
          const out = new Set(prev);
          if (next) out.add(id);
          else out.delete(id);
          return out;
        });
      }
    },
    [controlledExpandedIds, onExpand],
  );

  const toggleExpanded = useCallback(
    (id: NodeId) => {
      const isOpen = expanded.has(id);
      setExpanded(id, !isOpen);
    },
    [expanded, setExpanded],
  );

  const expandAll = useCallback(() => {
    const all = collectExpandableIds(nodes);
    if (!controlledExpandedIds) setUncontrolledExpanded(all);
    all.forEach((id) => {
      if (!expanded.has(id)) onExpand?.(id, true);
    });
  }, [nodes, controlledExpandedIds, expanded, onExpand]);

  const collapseAll = useCallback(() => {
    if (!controlledExpandedIds) setUncontrolledExpanded(new Set());
    expanded.forEach((id) => onExpand?.(id, false));
  }, [controlledExpandedIds, expanded, onExpand]);

  const commitSelection = useCallback(
    (next: Set<NodeId>) => {
      if (!controlledSelectedIds && controlledSelectedId === undefined) {
        setUncontrolledSelected(next);
      }
      const arr = Array.from(next);
      onSelectionChange?.(arr);
      // Legacy single-select callback fires with the most recent target.
      if (arr.length) onSelect?.(arr[arr.length - 1]);
      else if (selectionMode === 'single') onSelect?.('' as NodeId);
    },
    [controlledSelectedIds, controlledSelectedId, onSelectionChange, onSelect, selectionMode],
  );

  const selectSingle = useCallback(
    (id: NodeId) => {
      commitSelection(new Set([id]));
    },
    [commitSelection],
  );

  const toggleSelection = useCallback(
    (id: NodeId) => {
      if (selectionMode === 'single') {
        commitSelection(new Set([id]));
        return;
      }
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commitSelection(next);
    },
    [selectionMode, selected, commitSelection],
  );

  const selectRange = useCallback(
    (anchor: NodeId, target: NodeId) => {
      if (selectionMode === 'single') {
        commitSelection(new Set([target]));
        return;
      }
      const order = visibleRows.map((r) => r.node.id);
      const a = order.indexOf(anchor);
      const b = order.indexOf(target);
      if (a === -1 || b === -1) {
        commitSelection(new Set([target]));
        return;
      }
      const [lo, hi] = a < b ? [a, b] : [b, a];
      const next = new Set<NodeId>();
      for (let i = lo; i <= hi; i++) next.add(order[i]);
      commitSelection(next);
    },
    [selectionMode, visibleRows, commitSelection],
  );

  // ── Focus helpers ──────────────────────────────────────────────────────────
  const moveFocus = useCallback(
    (delta: number) => {
      if (!visibleRows.length) return;
      const idx = visibleRows.findIndex((r) => r.node.id === focusId);
      const safeIdx = idx === -1 ? 0 : idx;
      const next = Math.max(0, Math.min(visibleRows.length - 1, safeIdx + delta));
      setFocusId(visibleRows[next].node.id);
    },
    [visibleRows, focusId],
  );

  const focusFirst = useCallback(() => {
    if (visibleRows.length) setFocusId(visibleRows[0].node.id);
  }, [visibleRows]);

  const focusLast = useCallback(() => {
    if (visibleRows.length) setFocusId(visibleRows[visibleRows.length - 1].node.id);
  }, [visibleRows]);

  const findRow = useCallback(
    (id: NodeId | undefined) => visibleRows.find((r) => r.node.id === id),
    [visibleRows],
  );

  // Used by `useKeyboardNav` to support Ctrl/Cmd+A in multi-select (still M1).
  const selectAllVisible = useCallback(() => {
    if (selectionMode !== 'multi') return;
    commitSelection(new Set(visibleRows.map((r) => r.node.id)));
  }, [selectionMode, visibleRows, commitSelection]);

  // ── Public surface ─────────────────────────────────────────────────────────
  return {
    expanded,
    selected,
    focusId,
    setFocusId,
    visibleRows,
    setExpanded,
    toggleExpanded,
    expandAll,
    collapseAll,
    selectSingle,
    toggleSelection,
    selectRange,
    selectAllVisible,
    moveFocus,
    focusFirst,
    focusLast,
    findRow,
    /** Util for unrelated callers (e.g. devtools). */
    collectAllIds: () => collectAllIds(nodes),
  };
}

export type UseTreeStateReturn = ReturnType<typeof useTreeState>;
