# KUIViewer

- **id:** `lib-kui-viewer`
- **layer:** library
- **category:** Library
- **filePath:** `modules/showcase/data/sections/lib-kui-viewer.showcase.tsx`
- **status:** beta
- **since:** 2026-05

Browser-based IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments. Ships a vanilla TypeScript core plus an optional React subpath (`kui-viewer/react`) exposing the `<KUIViewer />` component, a `ViewerProvider`, and a Zustand-backed `useViewerStore` hook for selection, federation and spatial-tree state. In-viewport widgets — an interactive NavCube, a pill toolbar (`viewer.toolbar`) and a dolly ZoomSlider — mount as children of `<KUIViewer />` and wire themselves to the live camera via `useViewer`.

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
import { useEffect, useRef } from 'react';
import 'kui-viewer/styles.css';
import {
  KUIViewer,
  ModelLoader,
  NavCube,
  useViewer,
  useFitToScene,
} from 'kui-viewer/react';
import { ZoomSlider } from 'kui-viewer';

// ZoomSlider ships no React wrapper — mount the vanilla element by hand and
// dispose it on unmount (the same pattern <NavCube/> uses internally).
function ZoomSliderOverlay() {
  const viewer = useViewer();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const { el, dispose } = ZoomSlider(viewer.camera, viewer.controls, {
      minDistance: 1,
      maxDistance: 300,
    });
    host.appendChild(el);
    return () => {
      dispose();
      el.remove();
    };
  }, [viewer]);
  return <div ref={ref} className="absolute right-3 top-[128px] h-7 w-24" />;
}

// Add controls to the viewer's pre-created default toolbar pill.
function ToolbarWidgets() {
  const viewer = useViewer();
  const fitToScene = useFitToScene();
  useEffect(() => {
    const fit = viewer.toolbar.addButton({
      id: 'fit',
      label: 'Fit',
      tooltip: 'Fit model to view',
      onClick: () => fitToScene(400),
    });
    return () => fit.remove();
  }, [viewer, fitToScene]);
  return null;
}

export function BimViewer() {
  return (
    <div className="w-full h-[600px] rounded-md overflow-hidden border">
      <KUIViewer
        // `relative` anchors the absolutely-positioned overlay children.
        className="relative w-full h-full"
        pixelRatioCap={2}
        onReady={(viewer) => {
          // viewer is the vanilla TS core — fit camera, register listeners, etc.
          console.log('viewer ready', viewer);
        }}
      >
        {/* Since 0.0.7 the model loads via this headless child, not a prop. */}
        <ModelLoader source="/models/site.ifc" />
        <ToolbarWidgets />
        {/* NavCube fills its positioned wrapper. */}
        <div className="absolute right-3 top-3 h-24 w-24">
          <NavCube />
        </div>
        <ZoomSliderOverlay />
      </KUIViewer>
    </div>
  );
}

```
