'use client';
import { Progress } from '@/modules/ui/Progress';
import type { ShowcaseComponent } from '../showcase.types';

export function buildProgressData(): ShowcaseComponent[] {
  return [
    {
      id: 'progress',
      title: 'Progress',
      category: 'Atom',
      abbr: 'Pr',
      description: 'Determinate progress indicator as a bar or a circle, with variant colors and an optional percentage label.',
      filePath: 'modules/ui/Progress.tsx',
      since: '2026-09',
      sourceCode: `'use client';
import { Progress } from '@/modules/ui/Progress';

<Progress value={62} />
<Progress value={90} variant="success" showLabel />
<Progress value={40} shape="circle" showLabel />`,
      variants: [
        {
          title: 'Bar',
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <Progress value={30} />
              <Progress value={62} variant="warning" showLabel />
              <Progress value={90} variant="success" size="lg" showLabel />
            </div>
          ),
          code: `<Progress value={30} />\n<Progress value={62} variant="warning" showLabel />\n<Progress value={90} variant="success" size="lg" showLabel />`,
        },
        {
          title: 'Circle',
          preview: (
            <div className="flex items-center gap-6">
              <Progress value={40} shape="circle" showLabel />
              <Progress value={75} shape="circle" variant="success" size="lg" showLabel />
              <Progress value={15} shape="circle" variant="error" size="sm" />
            </div>
          ),
          code: `<Progress value={40} shape="circle" showLabel />\n<Progress value={75} shape="circle" variant="success" size="lg" showLabel />`,
        },
      ],
    },
  ];
}
