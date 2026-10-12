import { describe, expect, it } from 'vitest';
import { createHistory, stable } from './history';

describe('stable', () => {
  it('sorts keys so equal content is an equal string', () => {
    expect(stable({ b: 1, a: { d: [2, { y: 1, x: 2 }], c: null } })).toBe(stable({ a: { c: null, d: [2, { x: 2, y: 1 }] }, b: 1 }));
  });
  it('leaves out undefined values and turns an undefined root into null', () => {
    expect(stable({ a: 1, b: undefined })).toBe('{"a":1}');
    expect(stable(undefined)).toBe('null');
    expect(stable('x')).toBe('"x"');
  });
});

describe('createHistory', () => {
  it('steps back and forward over pushed snapshots', () => {
    const h = createHistory();
    h.reset('a');
    expect(h.push('b', undefined, 0)).toBe(true);
    expect(h.push('c', undefined, 5000)).toBe(true);
    expect(h.steps()).toEqual([2, 0]);
    expect(h.undo()).toBe('b');
    expect(h.undo()).toBe('a');
    expect(h.undo()).toBeNull();
    expect(h.canUndo()).toBe(false);
    expect(h.redo()).toBe('b');
    expect(h.redo()).toBe('c');
    expect(h.redo()).toBeNull();
    expect(h.canRedo()).toBe(false);
    expect(h.present()).toBe('c');
  });

  it('ignores a push of the present state', () => {
    const h = createHistory();
    h.reset('a');
    expect(h.push('a')).toBe(false);
    expect(h.canUndo()).toBe(false);
  });

  it('clears redo when a new change is pushed after an undo', () => {
    const h = createHistory();
    h.reset('a');
    h.push('b', undefined, 0);
    h.undo();
    expect(h.canRedo()).toBe(true);
    h.push('x', undefined, 9000);
    expect(h.canRedo()).toBe(false);
    expect(h.undo()).toBe('a');
  });

  it('joins pushes with the same key within one second into one step', () => {
    const h = createHistory();
    h.reset('a');
    h.push('b', 'edit:n1', 1000);
    h.push('c', 'edit:n1', 1500);
    h.push('d', 'edit:n1', 2400);
    expect(h.steps()).toEqual([1, 0]);
    expect(h.undo()).toBe('a');
    expect(h.redo()).toBe('d');
  });

  it('starts a new step after a second, for another key, or after an undo', () => {
    const h = createHistory();
    h.reset('a');
    h.push('b', 'k', 0);
    h.push('c', 'k', 1000);
    expect(h.steps()[0]).toBe(2);
    h.push('d', 'other', 1100);
    expect(h.steps()[0]).toBe(3);
    h.push('e', 'other', 1200);
    expect(h.steps()[0]).toBe(3);
    h.undo();
    h.push('f', 'other', 1300);
    expect(h.steps()[0]).toBe(3);
  });

  it('keeps at most limit steps, dropping the oldest', () => {
    const h = createHistory(3);
    h.reset('0');
    for (let i = 1; i <= 6; i++) h.push(String(i), undefined, i * 5000);
    expect(h.steps()).toEqual([3, 0]);
    h.undo(); h.undo(); h.undo();
    expect(h.present()).toBe('3');
  });

  it('keeps at most maxBytes of past snapshots but always one step', () => {
    const h = createHistory(100, 10);
    h.reset('aaaaaa');
    h.push('bbbbbb', undefined, 0);
    h.push('cccccc', undefined, 5000);
    h.push('dddddd', undefined, 9000);
    expect(h.steps()[0]).toBe(1);
    expect(h.undo()).toBe('cccccc');
  });

  it('replace changes the present state without a step', () => {
    const h = createHistory();
    h.reset('a');
    h.replace('a2');
    expect(h.canUndo()).toBe(false);
    expect(h.present()).toBe('a2');
    expect(h.push('b', undefined, 0)).toBe(true);
    expect(h.undo()).toBe('a2');
  });

  it('reset empties both directions', () => {
    const h = createHistory();
    h.reset('a');
    h.push('b', undefined, 0);
    h.undo();
    h.reset('z');
    expect(h.steps()).toEqual([0, 0]);
    expect(h.present()).toBe('z');
  });
});
