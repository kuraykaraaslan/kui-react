'use client';
// modules/ui/TreeView/index.tsx
//
// Public entry point for the TreeView family (M1 — core nav + selection).
//
// The legacy `modules/ui/TreeView.tsx` re-exports from this file, so every
// existing consumer continues to work unchanged. New features (DnD, lazy
// load, virtualize, context menu, full a11y polish) ship in M2-M5.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { TreeNodeRow } from './parts/Node';
import { useTreeState } from './hooks/useTreeState';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import {
  DEFAULT_TREE_MESSAGES,
  type NodeId,
  type TreeViewProps,
  type TreeViewMessages,
} from './types';

export type { NodeId, TreeNode, TreeViewProps, SelectionMode, TreeViewMessages } from './types';

export function TreeView({
  nodes,
  selectedId,
  selectedIds,
  expandedIds,
  defaultExpandedIds,
  focusId: initialFocusId,
  selectionMode = 'single',
  onSelect,
  onSelectionChange,
  onExpand,
  onActivate,
  label,
  className,
  hideToolbar = false,
  messages,
}: TreeViewProps) {
  const msgs: TreeViewMessages = useMemo(
    () => ({ ...DEFAULT_TREE_MESSAGES, ...messages }),
    [messages],
  );

  const state = useTreeState({
    nodes,
    selectionMode,
    selectedIds,
    selectedId,
    expandedIds,
    defaultExpandedIds,
    initialFocusId,
    onSelectionChange,
    onSelect,
    onExpand,
  });

  const {
    focusId,
    setFocusId,
    visibleRows,
    selected,
    toggleExpanded,
    expandAll,
    collapseAll,
    selectSingle,
    toggleSelection,
    selectRange,
  } = state;

  const { onKeyDown, anchorRef } = useKeyboardNav({ state, onActivate });

  const handleActivate = (e: React.MouseEvent, id: NodeId) => {
    const row = state.findRow(id);
    if (!row) return;

    if (e.shiftKey) {
      selectRange(anchorRef.current ?? id, id);
      return;
    }
    if (e.metaKey || e.ctrlKey) {
      toggleSelection(id);
      anchorRef.current = id;
      return;
    }

    // Plain click — legacy behaviour: clicking a parent toggles, leaf selects.
    if (row.hasChildren) {
      toggleExpanded(id);
      // Still surface a selection event so consumers that drive UI off the
      // current node (e.g. a "Reveal in editor" preview pane) keep working.
      if (selectionMode === 'single') selectSingle(id);
      else if (!selected.has(id)) toggleSelection(id);
      anchorRef.current = id;
    } else {
      selectSingle(id);
      anchorRef.current = id;
    }
  };

  const showToolbar = !hideToolbar && visibleRows.some((r) => r.hasChildren);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showToolbar && (
        <div
          data-tree-toolbar
          className="flex items-center gap-1 px-1 pb-1 text-xs text-text-secondary"
        >
          <button
            type="button"
            data-tree-action="expand-all"
            onClick={() => expandAll()}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md',
              'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'transition-colors',
            )}
          >
            <FontAwesomeIcon icon={faAngleDoubleDown} className="w-3 h-3" aria-hidden="true" />
            <span>{msgs.expandAll}</span>
          </button>
          <button
            type="button"
            data-tree-action="collapse-all"
            onClick={() => collapseAll()}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md',
              'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'transition-colors',
            )}
          >
            <FontAwesomeIcon icon={faAngleDoubleUp} className="w-3 h-3" aria-hidden="true" />
            <span>{msgs.collapseAll}</span>
          </button>
        </div>
      )}

      <ul
        role="tree"
        aria-label={label ?? msgs.tree}
        aria-multiselectable={selectionMode === 'multi' ? true : undefined}
        onKeyDown={onKeyDown}
        className={cn('space-y-0.5')}
      >
        {visibleRows.map((row) => (
          <TreeNodeRow
            key={row.node.id}
            row={row}
            isSelected={selected.has(row.node.id)}
            isFocused={focusId === row.node.id}
            onActivate={handleActivate}
            onToggle={toggleExpanded}
            onFocus={setFocusId}
          />
        ))}
      </ul>
    </div>
  );
}
