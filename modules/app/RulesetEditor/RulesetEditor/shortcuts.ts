/**
 * The keyboard bindings of the editor, in one table: the key handler reads it, the shortcuts sheet lists it and the
 * menus take their hints from it, so the three cannot disagree. The router editor has the same keys (O6).
 */

export type ShortcutId =
  | 'note' | 'undo' | 'redo' | 'selectAll' | 'copy' | 'cut' | 'paste' | 'duplicate' | 'delete' | 'edit' | 'menu' | 'cancel' | 'save' | 'help' | 'find';
export type ShortcutGroup = 'edit' | 'select' | 'view';

/** one key press: `mod` is Ctrl (⌘ on a Mac); `shift` and `alt` left out mean "either"; `code` (the physical key) is used instead of `key` where Alt changes the character (a Mac's Option) */
export type Chord = { key: string; mod?: boolean; shift?: boolean; alt?: boolean; code?: string };

type Press = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'shiftKey'> & Partial<Pick<KeyboardEvent, 'altKey' | 'code'>>;

export type Shortcut = {
  id: ShortcutId;
  group: ShortcutGroup;
  /** the first one is the one shown in menus; the others are alternatives */
  chords: Chord[];
  /** the key press is taken (the browser does not act on it) */
  prevent: boolean;
  /** changes the flow, so a read-only editor neither does it nor lists it */
  writes: boolean;
};

export const SHORTCUTS: Shortcut[] = [
  { id: 'note', group: 'edit', chords: [{ key: 'n', alt: true, mod: false, code: 'KeyN' }], prevent: true, writes: true },
  { id: 'undo', group: 'edit', chords: [{ key: 'z', mod: true, shift: false }], prevent: true, writes: true },
  { id: 'redo', group: 'edit', chords: [{ key: 'y', mod: true }, { key: 'z', mod: true, shift: true }], prevent: true, writes: true },
  { id: 'cut', group: 'edit', chords: [{ key: 'x', mod: true }], prevent: true, writes: true },
  { id: 'copy', group: 'edit', chords: [{ key: 'c', mod: true }], prevent: false, writes: false },
  { id: 'paste', group: 'edit', chords: [{ key: 'v', mod: true }], prevent: true, writes: true },
  { id: 'duplicate', group: 'edit', chords: [{ key: 'd', mod: true }], prevent: true, writes: true },
  { id: 'delete', group: 'edit', chords: [{ key: 'Delete', mod: false }, { key: 'Backspace', mod: false }], prevent: true, writes: true },
  { id: 'save', group: 'edit', chords: [{ key: 's', mod: true }], prevent: true, writes: true },
  { id: 'selectAll', group: 'select', chords: [{ key: 'a', mod: true }], prevent: true, writes: false },
  { id: 'find', group: 'select', chords: [{ key: 'f', mod: true }], prevent: true, writes: false },
  { id: 'edit', group: 'select', chords: [{ key: 'Enter', mod: false }], prevent: false, writes: false },
  { id: 'menu', group: 'select', chords: [{ key: 'ContextMenu' }, { key: 'F10', shift: true }], prevent: true, writes: false },
  { id: 'cancel', group: 'view', chords: [{ key: 'Escape' }], prevent: false, writes: false },
  { id: 'help', group: 'view', chords: [{ key: '?' }], prevent: false, writes: false },
];

export const SHORTCUT_GROUPS: ShortcutGroup[] = ['edit', 'select', 'view'];

/** does this key press match the chord (letters in either case) */
export function matchesChord(e: Press, chord: Chord): boolean {
  if (chord.code ? e.code !== chord.code : e.key.toLowerCase() !== chord.key.toLowerCase()) return false;
  if (chord.alt !== undefined && !!e.altKey !== chord.alt) return false;
  if (chord.mod !== undefined && (e.ctrlKey || e.metaKey) !== chord.mod) return false;
  if (chord.shift !== undefined && e.shiftKey !== chord.shift) return false;
  return true;
}

/** the binding a key press runs, if any */
export function shortcutOf(e: Press): Shortcut | undefined {
  return SHORTCUTS.find((s) => s.chords.some((c) => matchesChord(e, c)));
}

const KEY_NAMES: Record<string, string> = { Delete: 'Del', Backspace: '⌫', Enter: 'Enter', Escape: 'Esc', ContextMenu: 'Menu', ' ': 'Space' };

/** "Ctrl+Shift+Z", "⌘+Z", "Del" */
export function formatChord(chord: Chord, mac = false): string {
  const parts: string[] = [];
  if (chord.mod) parts.push(mac ? '⌘' : 'Ctrl');
  if (chord.alt) parts.push(mac ? '⌥' : 'Alt');
  if (chord.shift) parts.push('Shift');
  parts.push(KEY_NAMES[chord.key] ?? (chord.key.length === 1 ? chord.key.toUpperCase() : chord.key));
  return parts.join('+');
}

/** the hint of a menu entry: the first chord of the binding */
export function hintOf(id: ShortcutId, mac = false): string {
  const s = SHORTCUTS.find((x) => x.id === id);
  return s ? formatChord(s.chords[0], mac) : '';
}

/** whether the browser is on a Mac (hints show ⌘ there); false on the server */
export function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
}
