'use client';
import { Accordion } from '@/modules/ui/Accordion';
import type { ShowcaseComponent } from '../showcase.types';

function AccordionDemo() {
  return (
    <Accordion
      className="w-full max-w-md"
      items={[
        { id: 'shipping', title: 'Shipping', content: 'Orders ship within 2 business days via standard carrier.' },
        { id: 'returns', title: 'Returns', content: 'Free returns within 30 days of delivery, unworn and with tags.' },
        { id: 'warranty', title: 'Warranty', content: 'Covered by a 1-year limited manufacturer warranty.', disabled: true },
      ]}
      defaultOpenIds={['shipping']}
    />
  );
}

function AccordionMultipleDemo() {
  return (
    <Accordion
      className="w-full max-w-md"
      allowMultiple
      items={[
        { id: 'a', title: 'Section A', content: 'Content for section A.' },
        { id: 'b', title: 'Section B', content: 'Content for section B.' },
      ]}
      defaultOpenIds={['a', 'b']}
    />
  );
}

export function buildAccordionData(): ShowcaseComponent[] {
  return [
    {
      id: 'accordion',
      title: 'Accordion',
      category: 'Molecule',
      abbr: 'Ac',
      description: 'Vertically stacked, collapsible content panels. Single-open by default, or `allowMultiple` for independent panels. Fully keyboard accessible via native `<button>` disclosure headers.',
      filePath: 'modules/ui/Accordion.tsx',
      since: '2026-09',
      composes: [],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['disclosure (accordion)'],
        keyboardInteractions: [
          { keys: 'Tab', action: 'Move focus between panel headers' },
          { keys: 'Enter / Space', action: 'Toggle the focused panel' },
        ],
      },
      sourceCode: `'use client';
import { Accordion } from '@/modules/ui/Accordion';

<Accordion
  items={[
    { id: 'shipping', title: 'Shipping', content: '...' },
    { id: 'returns', title: 'Returns', content: '...' },
  ]}
  defaultOpenIds={['shipping']}
/>`,
      variants: [
        {
          title: 'Single open (default)',
          layout: 'stack' as const,
          preview: <AccordionDemo />,
          code: `<Accordion
  items={[
    { id: 'shipping', title: 'Shipping', content: '...' },
    { id: 'returns', title: 'Returns', content: '...' },
    { id: 'warranty', title: 'Warranty', content: '...', disabled: true },
  ]}
  defaultOpenIds={['shipping']}
/>`,
        },
        {
          title: 'Allow multiple open',
          layout: 'stack' as const,
          preview: <AccordionMultipleDemo />,
          code: `<Accordion
  allowMultiple
  items={[{ id: 'a', title: 'Section A', content: '...' }, { id: 'b', title: 'Section B', content: '...' }]}
  defaultOpenIds={['a', 'b']}
/>`,
        },
      ],
    },
  ];
}
