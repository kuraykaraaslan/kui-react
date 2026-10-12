/**
 * What a block is called on the canvas, in the lists and for a screen reader: its label, or when the label is empty
 * the title of its block (a label is optional), or at last its type.
 */
export function nodeName(node: { label: string; type: string }, decl?: { title?: string } | null): string {
  return node.label.trim() || decl?.title || node.type;
}
