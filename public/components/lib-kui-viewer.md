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

## Variants

### Empty scene

```tsx
import { KUIViewer } from 'kui-viewer/react';
import 'kui-viewer/styles.css';

// Mounts an empty Three.js scene — no model, no WASM download yet.
// Useful as a placeholder while the user picks a model.
<div className="w-full h-80 rounded-md overflow-hidden border">
  <KUIViewer className="w-full h-full" />
</div>
```

### With IFC model URL

```tsx
import { KUIViewer } from 'kui-viewer/react';
import 'kui-viewer/styles.css';

// Provide a model URL — the viewer downloads + parses the IFC via web-ifc
// and converts it to @thatopen/fragments under the hood.
<div className="w-full h-80 rounded-md overflow-hidden border">
  <KUIViewer
    className="w-full h-full"
    modelUrl="http://www.ifcwiki.org/images/e/e3/AC20-FZK-Haus.ifc"
    pixelRatioCap={2}
  />
</div>
```

### Provider + headless hooks

```tsx
import {
  ViewerProvider,
  KUIViewer,
  useSelection,
  useSpatialTree,
  useLoadIfc,
} from 'kui-viewer/react';
import 'kui-viewer/styles.css';

function SelectionPanel() {
  const { selected } = useSelection();
  return (
    <aside className="p-3 text-sm">
      Selected: {selected?.expressID ?? '—'}
    </aside>
  );
}

export function BimWorkspace() {
  return (
    <ViewerProvider>
      <div className="grid grid-cols-[1fr_320px] h-[600px]">
        <KUIViewer modelUrl="/models/site.ifc" className="w-full h-full" />
        <SelectionPanel />
      </div>
    </ViewerProvider>
  );
}
```

## Full source

```tsx
'use client';
// Install:  npm install kui-viewer
// Styles:   import 'kui-viewer/styles.css';   // once, e.g. in app/layout.tsx
// React subpath: kui-viewer/react

import { KUIViewer } from 'kui-viewer/react';
import 'kui-viewer/styles.css';

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
