'use client';
import { useState } from 'react';
import { FormBuilder, FormRenderer, type FormSchema, type FormValues } from '@/modules/app/FormBuilder';
import type { ShowcaseComponent } from '../showcase.types';

const STARTER_SCHEMA: FormSchema = {
  id: 'starter',
  title: 'Contact form',
  description: 'Drag fields from the palette to extend this form.',
  fields: [
    { id: 'f1', type: 'text',  name: 'name',    label: 'Your name',    placeholder: 'Ada Lovelace', required: true },
    { id: 'f2', type: 'email', name: 'email',   label: 'Email',        placeholder: 'name@example.com', required: true },
    { id: 'f3', type: 'select',name: 'topic',   label: 'Topic',        required: true,
      options: [
        { label: 'Sales',    value: 'sales' },
        { label: 'Support',  value: 'support' },
        { label: 'Feedback', value: 'feedback' },
      ] },
    { id: 'f4', type: 'textarea', name: 'message', label: 'Message', helperText: 'Up to 500 characters.', required: true },
    { id: 'f5', type: 'checkbox', name: 'consent', label: 'I agree to the privacy policy', required: true },
  ],
};

function BuilderDemo() {
  const [schema, setSchema] = useState<FormSchema>(STARTER_SCHEMA);
  return (
    <div className="w-full">
      <FormBuilder schema={schema} onChange={setSchema} />
    </div>
  );
}

function BuilderAndRendererDemo() {
  const [schema, setSchema] = useState<FormSchema>(STARTER_SCHEMA);
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
      <FormBuilder schema={schema} onChange={setSchema} />
      <div className="flex flex-col gap-2">
        <FormRenderer
          schema={schema}
          onSubmit={async (values) => {
            setSubmitted(values);
          }}
        />
        {submitted && (
          <pre className="text-xs p-3 rounded-md border border-border bg-surface-raised text-text-primary overflow-x-auto">
{JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function StandaloneRendererDemo() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  return (
    <div className="w-full flex flex-col gap-2 max-w-xl">
      <FormRenderer
        schema={STARTER_SCHEMA}
        onSubmit={async (values) => setSubmitted(values)}
      />
      {submitted && (
        <pre className="text-xs p-3 rounded-md border border-border bg-surface-raised text-text-primary overflow-x-auto">
{JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
}

export function buildAppFormBuilderData(): ShowcaseComponent[] {
  return [
    {
      id: 'form-builder',
      title: 'FormBuilder',
      category: 'App',
      abbr: 'FB',
      description:
        'Typeform / JotForm-style drag-to-build form designer. M1 ships the field palette (text / email / number / textarea / select / radio / checkbox / date / file — multiselect / signature / rating are palette stubs), a draggable canvas with reorder + duplicate + delete, a right-hand settings panel (label, name, placeholder, helper text, required, default value, options), JSON schema export / import, and a paired FormRenderer with required + email-format validation. Future milestones: full validation engine + custom validators (M2), conditional logic editor + runtime AST eval (M3), multi-page + save & resume (M4), schema I/O + webhooks + signature / rating (M5), full WAI-ARIA / keyboard parity + i18n + theming (M6). Pixel-identical EJS sibling at modules/app/FormBuilder/FormBuilder.ejs.',
      filePath: 'modules/app/FormBuilder/index.tsx',
      sourceCode: `import { useState } from 'react';
import { FormBuilder, FormRenderer, type FormSchema } from '@/modules/app/FormBuilder';

const seed: FormSchema = {
  id: 'contact',
  title: 'Contact form',
  fields: [
    { id: 'f1', type: 'text',  name: 'name',  label: 'Your name', required: true },
    { id: 'f2', type: 'email', name: 'email', label: 'Email',     required: true },
  ],
};

function ContactBuilder() {
  const [schema, setSchema] = useState<FormSchema>(seed);
  return (
    <>
      <FormBuilder schema={schema} onChange={setSchema} />
      <FormRenderer schema={schema} onSubmit={async (values) => console.log(values)} />
    </>
  );
}`,
      since: '2026-05',
      status: 'beta',
      composes: ['button', 'input', 'checkbox', 'select', 'textarea'],
      designTokens: [
        '--surface-base',
        '--surface-raised',
        '--surface-overlay',
        '--text-primary',
        '--text-secondary',
        '--text-disabled',
        '--border',
        '--border-strong',
        '--border-focus',
        '--primary',
        '--primary-hover',
        '--primary-active',
        '--primary-fg',
        '--error',
        '--error-subtle',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['application', 'list', 'listitem', 'radiogroup', 'alert'],
        keyboardInteractions: [
          { keys: 'Tab',  action: 'Move focus across palette / canvas / settings' },
          { keys: 'Enter / Space', action: 'Activate palette item to append a field' },
          { keys: 'Drag (mouse)',  action: 'Drag from palette → drop into canvas; reorder by dragging the grip handle' },
          // TODO M5/M6: Cmd/Ctrl + Arrow keys for keyboard reorder.
        ],
        notes:
          'Builder root is role="application" with aria-label. Canvas list is role="list"; each draggable card is role="listitem" with aria-current when selected. FormRenderer adds aria-required + aria-invalid + aria-describedby per field, and surfaces validation messages with role="alert". Full keyboard reorder + LiveRegion announcements land in M6.',
      },
      variants: [
        {
          title: 'Builder (drag + edit)',
          layout: 'stack' as const,
          preview: <BuilderDemo />,
          code: `const [schema, setSchema] = useState<FormSchema>(seed);
<FormBuilder schema={schema} onChange={setSchema} />`,
        },
        {
          title: 'Builder + live FormRenderer',
          layout: 'stack' as const,
          preview: <BuilderAndRendererDemo />,
          code: `const [schema, setSchema] = useState<FormSchema>(seed);
<>
  <FormBuilder schema={schema} onChange={setSchema} />
  <FormRenderer schema={schema} onSubmit={async (values) => persist(values)} />
</>`,
        },
        {
          title: 'Standalone renderer (required + email validation)',
          layout: 'stack' as const,
          preview: <StandaloneRendererDemo />,
          code: `<FormRenderer
  schema={STARTER_SCHEMA}
  onSubmit={async (values) => persist(values)}
/>`,
        },
      ],
    },
  ];
}
