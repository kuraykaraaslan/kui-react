'use client';
// modules/showcase/data/sections/lib-kui-viewer.showcase.tsx
//
// Showcase entry for the remote npm package `kui-viewer` — a browser-based
// IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments.
// Unlike first-party showcase entries, this references an external library;
// the upstream homepage / npm / GitHub links are surfaced via the
// `external` metadata block.

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ShowcaseComponent } from '../showcase.types';
// kui-viewer ≥ 0.0.2 publishes every design token under the `--color-kui-viewer-*`
// namespace, so importing its stylesheet here no longer collides with the
// host's Tailwind v4 `@theme` (the v0.0.1 build was clobbering --color-border
// and turning every border in the showcase white). Safe to load globally.
import 'kui-viewer/styles.css';

type KUIViewerProps = {
  modelUrl?: string;
  className?: string;
  pixelRatioCap?: number;
  authToken?: string;
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

function EmptySceneDemo() {
  return (
    <div className="w-full h-80 rounded-md overflow-hidden border border-border bg-surface-sunken">
      <KUIViewer className="w-full h-full" />
    </div>
  );
}

function WithModelDemo() {
  // Public sample IFC hosted by the upstream project. Swap with your own
  // model URL or an authenticated endpoint via the `authToken` prop.
  const SAMPLE_IFC =
    'https://raw.githubusercontent.com/IFCjs/test-ifc-files/main/Others/rac_basic_sample_project.ifc';
  return (
    <div className="w-full h-80 rounded-md overflow-hidden border border-border bg-surface-sunken">
      <KUIViewer className="w-full h-full" modelUrl={SAMPLE_IFC} pixelRatioCap={2} />
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
        'Browser-based IFC/BIM 3D viewer built on Three.js, web-ifc and @thatopen/fragments. Ships a vanilla TypeScript core plus an optional React subpath (`kui-viewer/react`) exposing the `<KUIViewer />` component, a `ViewerProvider`, and a Zustand-backed `useViewerStore` hook for selection, federation and spatial-tree state.',
      filePath: 'modules/showcase/data/sections/lib-kui-viewer.showcase.tsx',
      status: 'beta',
      since: '2026-05',
      external: {
        packageName: 'kui-viewer',
        version: '0.0.2',
        homepage: 'https://github.com/kuraykaraaslan/kui-viewer#readme',
        npm: 'https://www.npmjs.com/package/kui-viewer',
        github: 'https://github.com/kuraykaraaslan/kui-viewer',
      },
      whenToUse:
        'When you need to render IFC/BIM models in the browser — viewing, navigating and inspecting AEC scenes — and want a framework-agnostic core with an optional React wrapper.',
      whenNotToUse:
        'For lightweight, non-BIM 3D scenes — prefer a thinner Three.js wrapper or react-three-fiber. KUIViewer pulls in web-ifc WASM and @thatopen/fragments and is sized for AEC workloads.',
      dependencies: ['kui-viewer', 'three', 'web-ifc', '@thatopen/fragments', 'zustand'],
      sourceCode: `'use client';
// Install:    npm install kui-viewer
// Subpaths:   kui-viewer/react   /   kui-viewer/styles.css
//
// Since v0.0.2 every design token is namespaced (\`--color-kui-viewer-*\`),
// so importing the stylesheet is safe alongside a host Tailwind v4 theme.

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
`,
      variants: [
        {
          title: 'Empty scene',
          layout: 'stack',
          preview: <EmptySceneDemo />,
          code: `import { KUIViewer } from 'kui-viewer/react';

// Mounts an empty Three.js scene — no model, no WASM download yet.
// Useful as a placeholder while the user picks a model.
<div className="w-full h-80 rounded-md overflow-hidden border">
  <KUIViewer className="w-full h-full" />
</div>`,
        },
        {
          title: 'With IFC model URL',
          layout: 'stack',
          preview: <WithModelDemo />,
          code: `import { KUIViewer } from 'kui-viewer/react';

// Provide a model URL — the viewer downloads + parses the IFC via web-ifc
// and converts it to @thatopen/fragments under the hood.
<div className="w-full h-80 rounded-md overflow-hidden border">
  <KUIViewer
    className="w-full h-full"
    modelUrl="http://www.ifcwiki.org/images/e/e3/AC20-FZK-Haus.ifc"
    pixelRatioCap={2}
  />
</div>`,
        },
        {
          title: 'Provider + headless hooks',
          layout: 'stack',
          preview: (
            <div className="w-full p-4 rounded-md border border-border bg-surface-overlay text-sm text-text-secondary">
              <p className="mb-2 font-medium text-text-primary">Provider pattern</p>
              <p>
                Wrap your tree in <code className="font-mono text-xs">ViewerProvider</code> and read
                viewer state with <code className="font-mono text-xs">useViewerStore</code> /{' '}
                <code className="font-mono text-xs">useSelection</code> /{' '}
                <code className="font-mono text-xs">useSpatialTree</code>. See the Code panel for a
                full example.
              </p>
            </div>
          ),
          code: `import {
  ViewerProvider,
  KUIViewer,
  useSelection,
  useSpatialTree,
  useLoadIfc,
} from 'kui-viewer/react';

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
}`,
        },
      ],
    },
  ];
}
