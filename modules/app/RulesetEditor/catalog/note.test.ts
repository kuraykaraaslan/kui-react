import { describe, expect, it } from 'vitest';
import { catalogFromBlocks } from './index';
import { isNote, NOTE_BLOCK, NOTE_TYPE, noteText, withNoteBlock } from './note';
import { layoutOf, noteHeight, NOTE_LINE_H, NOTE_MAX_LINES } from '../RulesetEditor/geometry';
import { validateGraph } from '../graph/validate';

describe('the comment block', () => {
  it('is added to a catalog that lacks it, and kept when the host declared its own', () => {
    const base = catalogFromBlocks([[{ type: 'logic.change' }]]);
    expect(withNoteBlock(base).blocks[NOTE_TYPE]).toBe(NOTE_BLOCK);
    expect(base.blocks[NOTE_TYPE]).toBeUndefined();
    const own = catalogFromBlocks([[{ type: NOTE_TYPE, title: 'Note' }]]);
    expect(withNoteBlock(own)).toBe(own);
  });
  it('has no ports and one text param, and is not in the palette', () => {
    expect(NOTE_BLOCK).toMatchObject({ inputs: 0, outputs: [], internal: true });
    expect(NOTE_BLOCK.params?.text).toMatchObject({ type: 'text', max_len: 4096 });
  });
  it('reads the text and says what a note is', () => {
    expect(noteText({ config: { text: 'hello' } })).toBe('hello');
    expect(noteText({ config: { text: 3 } })).toBe('');
    expect(noteText({})).toBe('');
    expect(isNote({ type: 'note.comment' })).toBe(true);
    expect(isNote({ type: 'logic.change' })).toBe(false);
  });
  it('gets a card with no ports whose height follows its lines, between two and twelve', () => {
    const cat = withNoteBlock(catalogFromBlocks([[{ type: 'logic.change' }]]));
    const layout = layoutOf({ type: NOTE_TYPE, label: 'Comment', config: { text: 'a\nb\nc' } }, cat);
    expect(layout).toMatchObject({ inputs: [], outputs: [], hasError: false, summary: null, placeholder: false, height: noteHeight('a\nb\nc') });
    expect(noteHeight('')).toBe(20 + 2 * NOTE_LINE_H);
    expect(noteHeight('one line')).toBe(20 + 2 * NOTE_LINE_H);
    expect(noteHeight('a\nb\nc\nd')).toBe(20 + 4 * NOTE_LINE_H);
    expect(noteHeight('x'.repeat(60))).toBe(20 + 3 * NOTE_LINE_H); // wraps to three lines
    expect(noteHeight('x\n'.repeat(40))).toBe(20 + NOTE_MAX_LINES * NOTE_LINE_H);
  });
  it('is not a problem for the validator when nothing is connected to it', () => {
    const cat = withNoteBlock(catalogFromBlocks([[{ type: 'logic.change' }]]));
    const r = validateGraph({ nodes: [{ nodeId: 'c', type: NOTE_TYPE, label: 'Comment', x: 0, y: 0, config: { text: 'hi' } }], edges: [] }, cat);
    expect(r).toEqual({ errors: [], warnings: [] });
  });
});
