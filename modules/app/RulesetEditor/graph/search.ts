import type { Catalog } from '../catalog/types';
import { isNote, noteText } from '../catalog/note';
import type { GraphNode } from './types';

/**
 * Text for comparing, so a search is not fussy: lower case, accents and the dot of the Turkish İ and the dotless ı
 * gone, and a dash, underscore or run of spaces counts as one space ("Wi-Fi" finds "wifi set" and "wi fi").
 */
export function foldText(text: string): string {
  return text
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .trim();
}

/** what a search looks at for a block: label, type, the title of its block, its description and its id; for a comment, its text */
export function searchTextOf(node: GraphNode, catalog: Pick<Catalog, 'blocks'>): string {
  return foldText([node.label, node.type, catalog.blocks[node.type]?.title, node.description, isNote(node) ? noteText(node) : undefined, node.nodeId].filter(Boolean).join(' '));
}

/**
 * The ids of the blocks that match, in the order of the graph. Every word of the query must be found somewhere in the
 * block's text (so "wifi night" finds a block called "Night" of the type `action.wifi_set`). An empty query matches
 * nothing.
 */
export function findNodes(nodes: GraphNode[], query: string, catalog: Pick<Catalog, 'blocks'>): string[] {
  const words = foldText(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  return nodes.filter((n) => {
    const text = searchTextOf(n, catalog);
    const flat = text.replace(/ /g, '');
    // a word is found as written, or with the spaces taken out ("wi fi" against "wifi")
    return words.every((w) => text.includes(w) || flat.includes(w));
  }).map((n) => n.nodeId);
}
