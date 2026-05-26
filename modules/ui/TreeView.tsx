'use client';
// modules/ui/TreeView.tsx
//
// Backwards-compatible shim — the implementation now lives in
// `modules/ui/TreeView/`. Existing imports such as
//   import { TreeView, TreeNode } from '@/modules/ui/TreeView';
// continue to resolve through this barrel.

export { TreeView } from './TreeView/index';
export type {
  TreeNode,
  TreeViewProps,
  NodeId,
  SelectionMode,
  TreeViewMessages,
} from './TreeView/index';
