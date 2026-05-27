# KUIViewer

- **id:** `lib-kui-viewer`
- **layer:** library
- **category:** Library
- **filePath:** `modules/showcase/data/sections/lib-kui-viewer.showcase.tsx`
- **status:** beta
- **since:** 2026-05

Browser-based IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments. Ships a vanilla TypeScript core plus an optional React subpath (`kui-viewer/react`) exposing the `<KUIViewer />` component, a `ViewerProvider`, and a Zustand-backed `useViewerStore` hook for selection, federation and spatial-tree state.

## When to use

When you need to render IFC/BIM models in the browser — viewing, navigating and inspecting AEC scenes — and want a framework-agnostic core with an optional React wrapper.

## When NOT to use

For lightweight, non-BIM 3D scenes — prefer a thinner Three.js wrapper or react-three-fiber. KUIViewer pulls in web-ifc WASM and @thatopen/fragments and is sized for AEC workloads.

## Full source

```tsx
'use client';
// Install:  npm install kui-viewer
// React subpath: kui-viewer/react
//
// Since 0.0.3 the published `kui-viewer/styles.css` no longer ships the
// Tailwind preflight or default theme tokens, so importing it next to your
// project-level Tailwind setup is safe — design tokens stay isolated under
// the `--color-kui-viewer-*` namespace.
import 'kui-viewer/styles.css';

import { KUIViewer } from 'kui-viewer/react';

export function BimViewer() {
  return (
    <div className="w-full h-[600px] rounded-md overflow-hidden border">
      <KUIViewer
        className="w-full h-full"
        modelUrl="/models/site.ifc"
        pixelRatioCap={2}
        onReady={(viewer) => {
          // viewer is the vanilla TS core — fit camera, register listeners, etc.
          console.log('viewer ready', viewer);
        }}
      />
    </div>
  );
}

```
