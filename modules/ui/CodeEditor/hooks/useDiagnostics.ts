'use client';
// modules/ui/CodeEditor/hooks/useDiagnostics.ts
//
// Diagnostics (lint / syntax marker) hook — M3 STUB.
//
// TODO M3: accept Marker[] + engine ref. For CM6 build a @codemirror/lint
//          Diagnostic[] and dispatch a setDiagnostics effect. For Monaco call
//          monaco.editor.setModelMarkers(model, 'kui', markers).

import type { Marker } from '../types';

export function useDiagnostics(_markers: Marker[] | undefined): void {
  // TODO M3: actual implementation.
}
