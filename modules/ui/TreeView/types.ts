// modules/ui/TreeView/types.ts
//
// Public type definitions for the TreeView family. Kept implementation-free so
// it can be safely re-exported from the back-compat shim at
// `modules/ui/TreeView.tsx`.

export type NodeId = string;

export type TreeNode<T = unknown> = {
  id: NodeId;
  label: string;
  children?: TreeNode<T>[];
  /** Optional user payload — preserved by the tree but never inspected. */
  data?: T;
  /** Reserved for M3 lazy load. Treated as `false` until then. */
  // TODO M3: hasChildrenAsync?: boolean;
};

export type SelectionMode = 'single' | 'multi';

export type TreeViewMessages = {
  /** aria-label fallback when no `label` prop is supplied. */
  tree: string;
  expandAll: string;
  collapseAll: string;
};

export const DEFAULT_TREE_MESSAGES: TreeViewMessages = {
  tree: 'Tree',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
};

export type TreeViewProps = {
  nodes: TreeNode[];
  /** Single-selection (legacy). When `selectionMode === 'multi'`, prefer `selectedIds`. */
  selectedId?: NodeId;
  selectedIds?: NodeId[];
  /** Controlled expanded set. Uncontrolled defaults to "all expanded" (legacy behaviour). */
  expandedIds?: NodeId[];
  defaultExpandedIds?: NodeId[];
  /** Initially focused row. Defaults to the first visible node. */
  focusId?: NodeId;
  selectionMode?: SelectionMode;

  onSelect?: (id: NodeId) => void;
  onSelectionChange?: (ids: NodeId[]) => void;
  onExpand?: (id: NodeId, expanded: boolean) => void;
  /** Fired on Enter — distinct from `onSelect` which fires on every selection change. */
  onActivate?: (id: NodeId) => void;

  label?: string;
  className?: string;
  /** Hide the "Expand all / Collapse all" toolbar. */
  hideToolbar?: boolean;
  messages?: Partial<TreeViewMessages>;

  // TODO M2: onMove?: (ids: NodeId[], target: { parentId: NodeId | null; index: number }) => void;
  // TODO M2: canDrop?: (drag: NodeId[], drop: { parentId: NodeId | null; index: number }) => boolean;
  // TODO M3: onLoadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  // TODO M3: virtualize?: boolean;
  // TODO M4: contextMenuItems?: (node: TreeNode) => unknown[];
  // TODO M4: onRename?: (id: NodeId, name: string) => Promise<void>;
  // TODO M5: renderNode?: (node: TreeNode) => React.ReactNode;
};

/** A node decorated with traversal metadata produced by `flattenVisible`. */
export type VisibleRow = {
  node: TreeNode;
  depth: number;
  parentId: NodeId | null;
  hasChildren: boolean;
  expanded: boolean;
  /** 1-based, matches WAI-ARIA `aria-level`. */
  level: number;
  /** 1-based position among visible siblings — feeds `aria-posinset`. */
  posInSet: number;
  /** Total visible siblings — feeds `aria-setsize`. */
  setSize: number;
};
