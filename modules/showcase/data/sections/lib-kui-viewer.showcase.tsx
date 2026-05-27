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
// kui-viewer ≥ 0.0.3 strips its Tailwind preflight and base theme tokens
// (--font-sans, --spacing, --text-*, etc.) from the published bundle, so it
// no longer fights the host Tailwind v4 build for the global cascade. Only
// the namespaced `--color-kui-viewer-*` design tokens and the viewer's own
// utility classes are emitted — safe to import globally.
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
        version: '0.0.1',
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
`,
      variants: [
        {
          title: 'With IFC model URL',
          layout: 'stack',
          preview: <WithModelDemo />,
        },
      ],
    },
  ];
}
