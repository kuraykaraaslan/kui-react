'use client';
// modules/ui/TreeView/parts/Node.tsx
//
// Single tree row. Renders the chevron / leaf spacer + label and forwards
// mouse / keyboard intents to the parent via callbacks. Stateless — all state
// lives in `useTreeState`.

import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { NodeId, VisibleRow } from '../types';

export type TreeNodeRowProps = {
  row: VisibleRow;
  isSelected: boolean;
  isFocused: boolean;
  onActivate: (e: React.MouseEvent, id: NodeId) => void;
  onToggle: (id: NodeId) => void;
  onFocus: (id: NodeId) => void;
};

export function TreeNodeRow({
  row,
  isSelected,
  isFocused,
  onActivate,
  onToggle,
  onFocus,
}: TreeNodeRowProps) {
  const { node, depth, hasChildren, expanded, level, posInSet, setSize } = row;

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={isSelected}
      aria-level={level}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      data-tree-node-id={node.id}
      data-has-children={hasChildren ? 'true' : 'false'}
    >
      <div
        tabIndex={isFocused ? 0 : -1}
        data-tree-row
        onClick={(e) => {
          onFocus(node.id);
          onActivate(e, node.id);
        }}
        onFocus={() => onFocus(node.id)}
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'hover:bg-surface-overlay transition-colors',
          isSelected && 'bg-primary-subtle text-primary font-medium',
        )}
      >
        {hasChildren ? (
          <span
            aria-hidden="true"
            data-tree-chevron
            onClick={(e) => {
              // Chevron only toggles expand — never selects.
              e.stopPropagation();
              onFocus(node.id);
              onToggle(node.id);
            }}
            className="text-text-disabled w-3 shrink-0 flex items-center justify-center"
          >
            <FontAwesomeIcon
              icon={expanded ? faChevronDown : faChevronRight}
              className="w-2.5 h-2.5"
            />
          </span>
        ) : (
          <span className="w-3 shrink-0" aria-hidden="true" />
        )}
        <span>{node.label}</span>
      </div>
    </li>
  );
}
