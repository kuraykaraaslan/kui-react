'use client';
import { SkipLink, LiveRegion } from '@/modules/ui/SkipLink';
import { Button } from '@/modules/ui/Button';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function LiveRegionDemo() {
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(0);
  function announce() {
    const n = count + 1;
    setCount(n);
    setMsg('');
    setTimeout(() => setMsg(`Announcement #${n} sent`), 50);
  }
  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={announce}>Send announcement</Button>
      {msg && <p className="text-xs text-text-secondary">(screen reader hears: &quot;{msg}&quot;)</p>}
      <LiveRegion message={msg} />
    </div>
  );
}

export function buildSkipLinkData(): ShowcaseComponent[] {
  return [
    {
      id: 'skip-link',
      title: 'SkipLink + LiveRegion',
      category: 'Atom',
      abbr: 'Sl',
      description: 'SkipLink is visually hidden until focused, enabling keyboard users to bypass navigation. LiveRegion announces dynamic content to screen readers.',
      filePath: 'modules/ui/SkipLink.tsx',
      sourceCode: `'use client';\nimport { cn } from '@/libs/utils/cn';\n\nexport function SkipLink({ href = '#main-content', label = 'Skip to main content' }) {}\nexport function LiveRegion({ message, politeness = 'polite' }) {}`,
      variants: [
        {
          title: 'SkipLink (focus to reveal)',
          layout: 'stack' as const,
          preview: (
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">Tab into the area below to reveal the skip link:</p>
              <div className="border border-dashed border-border rounded-md p-4 space-y-2">
                <SkipLink href="#demo-main" />
                <p className="text-sm text-text-primary" id="demo-main">Main content area</p>
              </div>
            </div>
          ),
          code: `// Place at top of layout:\n<SkipLink href="#main-content" />\n\n// Linked target:\n<main id="main-content">...</main>`,
        },
        {
          title: 'LiveRegion',
          layout: 'stack' as const,
          preview: <LiveRegionDemo />,
          code: `function Demo() {\n  const [msg, setMsg] = useState('');\n  return (\n    <>\n      <button onClick={() => setMsg('Action completed')}>Act</button>\n      <LiveRegion message={msg} />\n    </>\n  );\n}`,
        },
      ],
    },
  ];
}
