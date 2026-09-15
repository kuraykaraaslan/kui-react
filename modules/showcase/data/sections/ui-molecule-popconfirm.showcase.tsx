'use client';
import { Popconfirm } from '@/modules/ui/Popconfirm';
import { Button } from '@/modules/ui/Button';
import type { ShowcaseComponent } from '../showcase.types';

export function buildPopconfirmData(): ShowcaseComponent[] {
  return [
    {
      id: 'popconfirm',
      title: 'Popconfirm',
      category: 'Molecule',
      abbr: 'Pc',
      description: 'Inline "are you sure?" confirmation popover for destructive or consequential actions — lighter-weight than a full Modal. Built on the same dismiss/focus-trap primitives as Popover.',
      filePath: 'modules/ui/Popconfirm.tsx',
      since: '2026-09',
      composes: ['button'],
      relatedTo: ['modal'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['alertdialog'],
        keyboardInteractions: [
          { keys: 'Enter / Space', action: 'Open the trigger' },
          { keys: 'Tab', action: 'Move between Cancel / Confirm' },
          { keys: 'Escape', action: 'Dismiss without confirming' },
        ],
      },
      sourceCode: `'use client';
import { Popconfirm } from '@/modules/ui/Popconfirm';
import { Button } from '@/modules/ui/Button';

<Popconfirm
  trigger={<Button variant="danger">Delete</Button>}
  title="Delete this item?"
  description="This action cannot be undone."
  danger
  confirmLabel="Delete"
  onConfirm={() => remove(id)}
/>`,
      variants: [
        {
          title: 'Default',
          preview: (
            <Popconfirm
              trigger={<Button variant="outline">Log out</Button>}
              title="Log out of your account?"
              onConfirm={() => {}}
            />
          ),
          code: `<Popconfirm trigger={<Button variant="outline">Log out</Button>} title="Log out of your account?" onConfirm={handleLogout} />`,
        },
        {
          title: 'Danger + description',
          preview: (
            <Popconfirm
              trigger={<Button variant="danger">Delete project</Button>}
              title="Delete this project?"
              description="This action cannot be undone. All data will be permanently removed."
              danger
              confirmLabel="Delete"
              onConfirm={() => {}}
            />
          ),
          code: `<Popconfirm
  trigger={<Button variant="danger">Delete project</Button>}
  title="Delete this project?"
  description="This action cannot be undone."
  danger
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>`,
        },
      ],
    },
  ];
}
