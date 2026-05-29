'use client';
// modules/showcase/data/sections/lib-kui-viewer.showcase.tsx
//
// Showcase entry for the remote npm package `kui-viewer` — a browser-based
// IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments.
// Unlike first-party showcase entries, this references an external library;
// the upstream homepage / npm / GitHub links are surfaced via the
// `external` metadata block.

import dynamic from 'next/dynamic';
import { useEffect, useRef, type ComponentType, type ReactNode } from 'react';
// kui-viewer ≥ 0.0.3 strips its Tailwind preflight and base theme tokens
// (--font-sans, --spacing, --text-*, etc.) from the published bundle, so it
// no longer fights the host Tailwind v4 build for the global cascade. Only
// the namespaced `--color-kui-viewer-*` design tokens and the viewer's own
// utility classes are emitted — safe to import globally.
import 'kui-viewer/styles.css';
// React subpath. `NavCube` is the one React wrapper the package ships for an
// in-viewport overlay (the rest of the surface is hooks + headless behaviour
// components). `useViewer` hands a child the live `Viewer` from context, and
// the `useFitTo*` hooks return imperative camera-fit callbacks we wire to
// toolbar buttons.
// `ModelLoader` is the headless child that actually loads an IFC into the
// live viewer. Since 0.0.7 the `<KUIViewer modelUrl=…>` prop is dead — the
// component no longer reads it — so the model URL must be passed here instead.
import {
  NavCube,
  ModelLoader,
  useViewer,
  useFitToScene,
  useFitToSelection,
} from 'kui-viewer/react';
// `ZoomSlider` has no React wrapper, so we mount the vanilla factory's element
// ourselves (same pattern the package's own `<NavCube/>` uses internally).
import { ZoomSlider } from 'kui-viewer';
import type { ShowcaseComponent } from '../showcase.types';

type KUIViewerProps = {
  modelUrl?: string;
  className?: string;
  pixelRatioCap?: number;
  authToken?: string;
  children?: ReactNode;
};

const KUIViewer: ComponentType<KUIViewerProps> = dynamic(
  () => import('kui-viewer/react').then((m) => m.KUIViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-text-secondary">
        Loading 3D viewer…
      </div>
    ),
  },
);

// --- In-viewport overlays --------------------------------------------------
// These render as children of <KUIViewer/>, which only mounts them once the
// underlying Viewer exists — so `useViewer()` always resolves and the vanilla
// factories get a live camera + controls. The positioned wrappers pin the
// cluster to the top-right corner exactly like the standalone demo.

const ICON_FIT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 8V3h5"/><path d="M21 8V3h-5"/><path d="M3 16v5h5"/><path d="M21 16v5h-5"/></svg>';
const ICON_VIEWS =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><line x1="12" y1="11" x2="12" y2="21"/></svg>';


 const SAMPLE_IFC =
    'https://kui-viewer.kuray.dev/hause.ifc'; // Public sample IFC hosted by the upstream project.

/** Interactive CSS-3D ViewCube pinned top-right; clicking a face snaps the
 *  camera to that orthographic preset, dragging orbits the scene. */
function NavCubeOverlay() {
  return (
    <div className="absolute right-3 top-3 h-24 w-24">
      <NavCube />
    </div>
  );
}

/** Horizontal dolly slider mounted directly under the NavCube. The vanilla
 *  factory returns `{ el, dispose }`; we append the element and tear it down
 *  on unmount so it never outlives the viewer. */
function ZoomSliderOverlay() {
  const viewer = useViewer();
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Wider than the 200 m default — the sample model is a multi-storey
    // building and users like to pull back for site context.
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
  // top = navcube top (12) + navcube height (96) + 20 gap.
  return <div ref={hostRef} className="absolute right-3 top-[128px] h-7 w-24" />;
}

/** Adds a couple of controls to the viewer's pre-created default toolbar (a
 *  floating pill). Each control returns a remove() handle so React effect
 *  cleanup keeps the toolbar in sync across remounts / StrictMode. */
function ToolbarWidgets() {
  const viewer = useViewer();
  const fitToScene = useFitToScene();
  const fitToSelection = useFitToSelection();
  useEffect(() => {
    const fit = viewer.toolbar.addButton({
      id: 'demo.fit',
      label: 'Fit',
      tooltip: 'Fit model to view',
      icon: ICON_FIT,
      onClick: () => fitToScene(400),
    });
    const views = viewer.toolbar.addMenu({
      id: 'demo.views',
      label: 'Views',
      tooltip: 'Camera presets',
      icon: ICON_VIEWS,
      // The toolbar sits near the right edge, so grow the dropdown leftward.
      menuAlign: 'right',
    });
    views.addItem({
      id: 'demo.views.scene',
      label: 'Fit to scene',
      onClick: () => fitToScene(400),
    });
    views.addItem({
      id: 'demo.views.selection',
      label: 'Fit to selection',
      onClick: () => fitToSelection(400),
    });
    return () => {
      views.remove();
      fit.remove();
    };
  }, [viewer, fitToScene, fitToSelection]);
  return null;
}

function WithWidgetsDemo() {
  // Public sample IFC hosted by the upstream project. Swap with your own
  // model URL or an authenticated endpoint via the `authToken` prop.
  return (
    <div className="w-full h-80 rounded-md overflow-hidden border border-border bg-surface-sunken">
      {/* `relative` makes the container the positioning context for the
          absolutely-pinned overlay children below. */}
      <KUIViewer className="relative w-full h-full" pixelRatioCap={2}>
        {/* Since 0.0.7 the model is loaded by this headless child, not the
            (now-ignored) `modelUrl` prop. */}
        <ModelLoader source={SAMPLE_IFC} />
        <ToolbarWidgets />
        <NavCubeOverlay />
        <ZoomSliderOverlay />
      </KUIViewer>
    </div>
  );
}


export function buildLibKuiViewerData(): ShowcaseComponent[] {
  return [
    {
      id: 'lib-kui-viewer',
      title: 'KUIViewer',
      category: 'Library',
      abbr: 'KV',
      description:
        'Browser-based IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments. Ships a vanilla TypeScript core plus an optional React subpath (`kui-viewer/react`) exposing the `<KUIViewer />` component, a `ViewerProvider`, and a Zustand-backed `useViewerStore` hook for selection, federation and spatial-tree state. In-viewport widgets — an interactive NavCube, a pill toolbar (`viewer.toolbar`) and a dolly ZoomSlider — mount as children of `<KUIViewer />` and wire themselves to the live camera via `useViewer`.',
      filePath: 'modules/showcase/data/sections/lib-kui-viewer.showcase.tsx',
      status: 'beta',
      since: '2026-05',
      external: {
        packageName: 'kui-viewer',
        version: '0.0.7',
        homepage: 'https://kui-viewer.kuray.dev',
        npm: 'https://www.npmjs.com/package/kui-viewer',
        github: 'https://github.com/kuraykaraaslan/kui-viewer',
      },
      whenToUse:
        'When you need to render IFC/BIM models in the browser — viewing, navigating and inspecting AEC scenes — and want a framework-agnostic core with an optional React wrapper.',
      whenNotToUse:
        'For lightweight, non-BIM 3D scenes — prefer a thinner Three.js wrapper or react-three-fiber. KUIViewer pulls in web-ifc WASM and @thatopen/fragments and is sized for AEC workloads.',
      dependencies: ['kui-viewer', 'three', 'web-ifc', '@thatopen/fragments', 'zustand'],
      sourceCode: `'use client';
// Install:  npm install kui-viewer
// React subpath: kui-viewer/react
//
// Since 0.0.3 the published \`kui-viewer/styles.css\` no longer ships the
// Tailwind preflight or default theme tokens, so importing it next to your
// project-level Tailwind setup is safe — design tokens stay isolated under
// the \`--color-kui-viewer-*\` namespace.
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
        // \`relative\` anchors the absolutely-positioned overlay children.
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
`,
      variants: [
        {
          title: 'With NavCube, toolbar & zoom slider',
          layout: 'stack',
          preview: <WithWidgetsDemo />,
        }
      ],
    },
  ];
}
