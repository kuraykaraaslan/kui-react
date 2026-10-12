import { describe, expect, it } from 'vitest';
import { formatChord, hintOf, matchesChord, SHORTCUTS, shortcutOf } from './shortcuts';

const key = (k: string, o: Partial<{ ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; altKey: boolean; code: string }> = {}) => ({ key: k, ctrlKey: false, metaKey: false, shiftKey: false, ...o });

describe('shortcuts', () => {
  it('finds the binding of a key press', () => {
    expect(shortcutOf(key('z', { ctrlKey: true }))?.id).toBe('undo');
    expect(shortcutOf(key('Z', { metaKey: true }))?.id).toBe('undo');
    expect(shortcutOf(key('z', { ctrlKey: true, shiftKey: true }))?.id).toBe('redo');
    expect(shortcutOf(key('y', { ctrlKey: true }))?.id).toBe('redo');
    expect(shortcutOf(key('d', { ctrlKey: true }))?.id).toBe('duplicate');
    expect(shortcutOf(key('Delete'))?.id).toBe('delete');
    expect(shortcutOf(key('Backspace'))?.id).toBe('delete');
    expect(shortcutOf(key('?', { shiftKey: true }))?.id).toBe('help');
    expect(shortcutOf(key('F10', { shiftKey: true }))?.id).toBe('menu');
    expect(shortcutOf(key('ContextMenu'))?.id).toBe('menu');
    expect(shortcutOf(key('s', { ctrlKey: true }))?.id).toBe('save');
    expect(shortcutOf(key('f', { ctrlKey: true }))?.id).toBe('find');
    expect(shortcutOf(key('n', { altKey: true, code: 'KeyN' }))?.id).toBe('note');
    expect(shortcutOf(key('˜', { altKey: true, code: 'KeyN' }))?.id).toBe('note'); // a Mac's Option+N
  });
  it('does not take a key press that only looks like one', () => {
    expect(shortcutOf(key('z'))).toBeUndefined();
    expect(shortcutOf(key('Delete', { ctrlKey: true }))).toBeUndefined();
    expect(shortcutOf(key('Enter', { metaKey: true }))).toBeUndefined();
    expect(shortcutOf(key('F10'))).toBeUndefined();
    expect(shortcutOf(key('n', { code: 'KeyN' }))).toBeUndefined();
    expect(shortcutOf(key('n', { altKey: true, code: 'KeyN', ctrlKey: true }))).toBeUndefined();
    expect(matchesChord(key('x', { ctrlKey: true }), { key: 'x' })).toBe(true); // mod left out: either
  });
  it('writes the chords for people', () => {
    expect(formatChord({ key: 'z', mod: true, shift: true })).toBe('Ctrl+Shift+Z');
    expect(formatChord({ key: 'z', mod: true }, true)).toBe('⌘+Z');
    expect(formatChord({ key: 'Delete' })).toBe('Del');
    expect(formatChord({ key: 'Escape' })).toBe('Esc');
    expect(hintOf('note')).toBe('Alt+N');
    expect(hintOf('note', true)).toBe('⌥+N');
    expect(hintOf('duplicate')).toBe('Ctrl+D');
    expect(hintOf('duplicate', true)).toBe('⌘+D');
  });
  it('has each id once, and no two bindings that a key press could both match', () => {
    expect(new Set(SHORTCUTS.map((s) => s.id)).size).toBe(SHORTCUTS.length);
    const presses = [key('z', { ctrlKey: true }), key('z', { ctrlKey: true, shiftKey: true }), key('y', { ctrlKey: true }), key('x', { ctrlKey: true }), key('c', { ctrlKey: true }),
      key('v', { ctrlKey: true }), key('d', { ctrlKey: true }), key('s', { ctrlKey: true }), key('f', { ctrlKey: true }), key('a', { ctrlKey: true }), key('Delete'), key('Backspace'), key('Enter'),
      key('ContextMenu'), key('F10', { shiftKey: true }), key('n', { altKey: true, code: 'KeyN' }), key('Escape'), key('?', { shiftKey: true })];
    for (const p of presses) expect(SHORTCUTS.filter((s) => s.chords.some((c) => matchesChord(p, c)))).toHaveLength(1);
  });
});
