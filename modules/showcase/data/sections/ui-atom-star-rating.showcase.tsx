'use client';
import { useState } from 'react';
import { StarRating } from '@/modules/ui/StarRating';
import type { ShowcaseComponent } from '../showcase.types';

function InteractiveDemo() {
  const [value, setValue] = useState(0);
  return (
    <div className="flex flex-col items-start gap-2">
      <StarRating
        value={value}
        readonly={false}
        size="lg"
        onChange={setValue}
        aria-label="Pick a rating"
      />
      <p className="text-xs text-text-secondary">
        Selected: <span className="font-semibold text-text-primary">{value || '–'}</span>
      </p>
    </div>
  );
}

export function buildStarRatingData(): ShowcaseComponent[] {
  return [
    {
      id: 'star-rating',
      title: 'StarRating',
      category: 'Atom',
      abbr: 'SR',
      description:
        'Five-star rating indicator. Read-only by default with decimal/half-star rendering; pass `readonly={false}` + `onChange` for interactive whole-star selection.',
      filePath: 'modules/ui/StarRating.tsx',
      since: '2026-05',
      sourceCode: `import { StarRating } from '@/modules/ui/StarRating';

<StarRating value={4.5} />
<StarRating value={rating} readonly={false} onChange={setRating} />`,
      whenToUse:
        'Surface a 0–5 star score (e.g. product / hotel / restaurant ratings) or let users submit a new rating.',
      whenNotToUse:
        'For non-star scales (e.g. NPS, percentages) use ContentScoreBar or a custom indicator instead.',
      composes: [],
      designTokens: ['--warning', '--text-disabled', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="img" (readonly)', 'role="radiogroup" / role="radio" (interactive)'],
      },
      variants: [
        {
          title: 'Readonly with decimals',
          preview: (
            <div className="flex flex-col gap-2">
              <StarRating value={4.7} size="sm" caption="(312 reviews)" />
              <StarRating value={3.5} size="md" />
              <StarRating value={2.2} size="lg" />
            </div>
          ),
          code: `<StarRating value={4.7} size="sm" caption="(312 reviews)" />
<StarRating value={3.5} size="md" />
<StarRating value={2.2} size="lg" />`,
        },
        {
          title: 'Interactive',
          preview: <InteractiveDemo />,
          code: `const [value, setValue] = useState(0);
<StarRating
  value={value}
  readonly={false}
  onChange={setValue}
  aria-label="Pick a rating"
/>`,
        },
      ],
    },
  ];
}
