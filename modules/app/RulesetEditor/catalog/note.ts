import type { BlockDecl, Catalog } from './types';
import type { RuleNode } from '../types';

/** the type of a comment on the canvas: a card with text, no ports, never run (the router has it built in) */
export const NOTE_TYPE = 'note.comment';
/** at most this many characters, as the router's `note.comment` allows */
export const NOTE_TEXT_MAX = 4096;

export const NOTE_BLOCK: BlockDecl = {
  type: NOTE_TYPE, title: 'Comment', category: 'note', group: 'function', inputs: 0, outputs: [], internal: true,
  params: { text: { type: 'text', label: 'Text', max_len: NOTE_TEXT_MAX } },
};

/** the catalog with the comment block in it, unless the host declared its own: every editor and the file formats know it */
export function withNoteBlock<C extends Pick<Catalog, 'blocks'>>(catalog: C): C {
  return catalog.blocks[NOTE_TYPE] ? catalog : { ...catalog, blocks: { ...catalog.blocks, [NOTE_TYPE]: NOTE_BLOCK } };
}

export const isNote = (node: Pick<RuleNode, 'type'>) => node.type === NOTE_TYPE;

/** the text of a comment */
export function noteText(node: Pick<RuleNode, 'config'>): string {
  const t = node.config?.text;
  return typeof t === 'string' ? t : '';
}
