'use client';
import React from 'react';
import { Checkbox } from '@/modules/ui/Checkbox';
import { RadioGroup } from '@/modules/ui/RadioGroup';
import { Toggle } from '@/modules/ui/Toggle';
import { CheckboxGroup } from '@/modules/ui/CheckboxGroup';
import { Select } from '@/modules/ui/Select';
import { countries } from 'countries-list';
import * as Flags from 'country-flag-icons/react/3x2';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

const COUNTRY_OPTIONS = Object.entries(countries)
  .map(([code, data]) => {
    const Flag = Flags[code as keyof typeof Flags] as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;
    return {
      value: code,
      label: data.name,
      icon: Flag ? <Flag style={{ width: 20, height: 14, borderRadius: 2 }} /> : null,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

function CheckboxIndeterminateDemo() {
  const [items, setItems] = useState([
    { id: 'a', label: 'Option A', checked: true },
    { id: 'b', label: 'Option B', checked: false },
    { id: 'c', label: 'Option C', checked: true },
  ]);
  const allChecked = items.every((i) => i.checked);
  const someChecked = items.some((i) => i.checked) && !allChecked;

  function toggleAll() {
    setItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })));
  }
  function toggleOne(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  }

  return (
    <div className="space-y-2">
      <Checkbox id="all" label="Select all" checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
      <div className="ml-6 space-y-1">
        {items.map((item) => (
          <Checkbox key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={() => toggleOne(item.id)} />
        ))}
      </div>
    </div>
  );
}

export function buildMoleculeSelectionData(): ShowcaseComponent[] {
  return [
    {
      id: 'checkbox',
      title: 'Checkbox',
      category: 'Molecule',
      abbr: 'Cb',
      description: 'Label + checkbox + optional hint / error message. aria-describedby is wired up and border-error is applied on the error state.',
      filePath: 'modules/ui/Checkbox.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

export function Checkbox({ id, label, hint, error, disabled, className, ...props }) {
  const hintId = hint ? \`\${id}-hint\` : undefined;
  const errorId = error ? \`\${id}-error\` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input id={id} type="checkbox" disabled={disabled} aria-describedby={describedBy} aria-invalid={!!error}
        className={cn('mt-0.5 h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed', error && 'border-error')} {...props} />
      <div>
        <label htmlFor={id} className={cn('text-sm font-medium', disabled ? 'text-text-disabled' : 'text-text-primary')}>{label}</label>
        {hint && !error && <p id={hintId} className="text-xs text-text-secondary mt-0.5">{hint}</p>}
        {error && <p id={errorId} className="text-xs text-error mt-0.5" role="alert">{error}</p>}
      </div>
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'label',    label: 'Label',    type: 'text',    default: 'I agree to the Terms of Service' },
          { key: 'checked',  label: 'Checked',  type: 'boolean', default: false },
          { key: 'hint',     label: 'Hint',     type: 'text',    default: '' },
          { key: 'error',    label: 'Error',    type: 'text',    default: '' },
          { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
        ],
        render: (p) => (
          <Checkbox
            id="pg-checkbox"
            label={p.label as string}
            checked={p.checked as boolean}
            hint={p.hint as string || undefined}
            error={p.error as string || undefined}
            disabled={p.disabled as boolean}
            onChange={() => {}}
          />
        ),
        generateCode: (p) => {
          const attrs: string[] = [`label="${p.label}"`];
          if (p.checked)  attrs.push('checked');
          if (p.hint)     attrs.push(`hint="${p.hint}"`);
          if (p.error)    attrs.push(`error="${p.error}"`);
          if (p.disabled) attrs.push('disabled');
          return `<Checkbox id="accept" ${attrs.join(' ')} onChange={handleChange} />`;
        },
      },
      variants: [
        { title: 'Default', preview: <Checkbox id="sc-cb-default" label="I agree to the Terms of Service" />, code: `<Checkbox id="accept" label="I agree to the Terms of Service" />` },
        { title: 'With hint', preview: <Checkbox id="sc-cb-hint" label="Subscribe to newsletter" hint="We send weekly updates, no spam." />, code: `<Checkbox id="newsletter" label="Subscribe to newsletter" hint="We send weekly updates, no spam." />` },
        { title: 'Error', preview: <Checkbox id="sc-cb-error" label="I agree to the Terms of Service" error="You must accept the terms." />, code: `<Checkbox id="accept" label="I agree to the Terms of Service" error="You must accept the terms." />` },
        { title: 'Disabled', preview: <Checkbox id="sc-cb-disabled" label="Checked and disabled" defaultChecked disabled />, code: `<Checkbox id="accept" label="Checked and disabled" defaultChecked disabled />` },
        {
          title: 'Indeterminate (select all)',
          preview: <CheckboxIndeterminateDemo />,
          code: `// Set indeterminate prop to show mixed state:\n<Checkbox id="all" label="Select all" checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />`,
          layout: 'stack' as const,
        },
      ],
    },
    {
      id: 'radio-group',
      title: 'RadioGroup',
      category: 'Molecule',
      abbr: 'Rg',
      description: 'fieldset + legend based radio group. WCAG-compliant keyboard navigation with an optional card-style variant.',
      filePath: 'modules/ui/RadioGroup.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

export function RadioGroup({ name, legend, options, value, onChange, error, disabled, className }) {
  return (
    <fieldset className={cn('space-y-1', className)}>
      <legend className="text-sm font-medium text-text-primary mb-2">{legend}</legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className={cn('flex items-start gap-2', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} disabled={disabled}
              onChange={() => onChange?.(opt.value)} className="mt-0.5 h-4 w-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus" />
            <div>
              <span className="text-sm text-text-primary">{opt.label}</span>
              {opt.hint && <p className="text-xs text-text-secondary">{opt.hint}</p>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-error mt-1" role="alert">{error}</p>}
    </fieldset>
  );
}`,
      variants: [
        {
          title: 'Default',
          preview: (
            <RadioGroup
              name="sc-rg-notify"
              legend="Notification preference"
              options={[
                { value: 'email', label: 'Email', hint: 'Sent to your primary email' },
                { value: 'sms', label: 'SMS' },
                { value: 'none', label: 'None' },
              ]}
            />
          ),
          code: `<RadioGroup\n  name="notify"\n  legend="Notification preference"\n  options={[\n    { value: 'email', label: 'Email' },\n    { value: 'sms', label: 'SMS' },\n    { value: 'none', label: 'None' },\n  ]}\n/>`,
        },
        {
          title: 'Disabled',
          preview: (
            <RadioGroup
              name="sc-rg-disabled"
              legend="Notification preference"
              options={[{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }]}
              value="email"
              disabled
            />
          ),
          code: `<RadioGroup name="notify" legend="Notification preference" options={[...]} value="email" disabled />`,
        },
        {
          title: 'Card style',
          layout: 'stack' as const,
          preview: (() => {
            function CardRadioDemo() {
              const [v, setV] = useState('pro');
              const plans = [
                { value: 'free', label: 'Free',  hint: '$0/mo · 3 projects, 1 seat' },
                { value: 'pro',  label: 'Pro',   hint: '$12/mo · Unlimited projects' },
                { value: 'team', label: 'Team',  hint: '$49/mo · 10 seats included' },
              ];
              return (
                <fieldset className="space-y-2 w-full max-w-xs">
                  <legend className="text-sm font-medium text-text-primary mb-3">Choose plan</legend>
                  {plans.map(plan => (
                    <label key={plan.value} className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${v === plan.value ? 'border-primary bg-primary-subtle' : 'border-border bg-surface-base hover:bg-surface-overlay'}`}>
                      <input type="radio" name="sc-plan" value={plan.value} checked={v === plan.value}
                        onChange={() => setV(plan.value)}
                        className="mt-0.5 h-4 w-4 text-primary border-border focus-visible:ring-2 focus-visible:ring-border-focus" />
                      <div>
                        <span className={`text-sm font-medium ${v === plan.value ? 'text-primary' : 'text-text-primary'}`}>{plan.label}</span>
                        <p className="text-xs text-text-secondary mt-0.5">{plan.hint}</p>
                      </div>
                    </label>
                  ))}
                </fieldset>
              );
            }
            return <CardRadioDemo />;
          })(),
          code: `function Demo() {\n  const [v, setV] = useState('pro');\n  const plans = [\n    { value: 'free', label: 'Free',  hint: '$0/mo · 3 projects' },\n    { value: 'pro',  label: 'Pro',   hint: '$12/mo · Unlimited' },\n    { value: 'team', label: 'Team',  hint: '$49/mo · 10 seats'  },\n  ];\n  return (\n    <fieldset className="space-y-2">\n      <legend>Choose plan</legend>\n      {plans.map(plan => (\n        <label key={plan.value} className={cn(\n          'flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer',\n          v === plan.value ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-surface-overlay'\n        )}>\n          <input type="radio" name="plan" value={plan.value}\n            checked={v === plan.value} onChange={() => setV(plan.value)} />\n          <div>\n            <span className={v === plan.value ? 'text-primary font-medium' : ''}>{plan.label}</span>\n            <p className="text-xs text-text-secondary">{plan.hint}</p>\n          </div>\n        </label>\n      ))}\n    </fieldset>\n  );\n}`,
        },
      ],
    },
    {
      id: 'toggle',
      title: 'Toggle',
      category: 'Molecule',
      abbr: 'Tg',
      description: 'role="switch" toggle/switch with three sizes, description slot, and disabled support. Fully accessible via CSS transform without a native input.',
      filePath: 'modules/ui/Toggle.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

const sizeMap = {
  sm: { track: 'h-4 w-7',  thumb: 'h-3 w-3',     on: 'translate-x-3.5' },
  md: { track: 'h-5 w-9',  thumb: 'h-3.5 w-3.5', on: 'translate-x-4'   },
  lg: { track: 'h-6 w-11', thumb: 'h-4 w-4',     on: 'translate-x-5'   },
};

export function Toggle({ id, label, description, checked, onChange, disabled, size = 'md', className }) {
  const { track, thumb, on } = sizeMap[size];
  return (
    <label htmlFor={id} className={cn('flex items-start gap-3', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)}>
      <div className="relative shrink-0 mt-0.5">
        <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} aria-checked={checked} className="sr-only" />
        <div className={cn('rounded-full transition-colors duration-200', track, checked ? 'bg-primary' : 'bg-surface-sunken border border-border')} />
        <div className={cn('absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm transition-transform duration-200', thumb, checked ? on : 'translate-x-0')} />
      </div>
      <div>
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
    </label>
  );
}`,
      playground: {
        controls: [
          { key: 'label',       label: 'Label',       type: 'text',    default: 'Enable notifications' },
          { key: 'checked',     label: 'Checked',     type: 'boolean', default: false },
          { key: 'size',        label: 'Size',        type: 'select',  options: ['sm', 'md', 'lg'] as const, default: 'md' },
          { key: 'description', label: 'Description', type: 'text',    default: '' },
          { key: 'disabled',    label: 'Disabled',    type: 'boolean', default: false },
        ],
        render: (p) => (
          <Toggle
            id="pg-toggle"
            label={p.label as string}
            checked={p.checked as boolean}
            size={p.size as any}
            description={p.description as string || undefined}
            disabled={p.disabled as boolean}
            onChange={() => {}}
          />
        ),
        generateCode: (p) => {
          const attrs: string[] = [`label="${p.label}"`];
          if (p.size !== 'md')  attrs.push(`size="${p.size}"`);
          if (p.checked)        attrs.push('checked');
          if (p.description)    attrs.push(`description="${p.description}"`);
          if (p.disabled)       attrs.push('disabled');
          return `<Toggle id="toggle" ${attrs.join(' ')} onChange={setChecked} />`;
        },
      },
      variants: [
        {
          title: 'Sizes',
          preview: (
            <div className="space-y-3">
              {(['sm','md','lg'] as const).map((s) => (
                <Toggle key={s} id={`sc-toggle-${s}`} label={`Toggle ${s.toUpperCase()}`} checked size={s} onChange={() => {}} />
              ))}
            </div>
          ),
          code: `<Toggle id="notifications" label="Enable notifications" checked={enabled} onChange={setEnabled} size="md" />`,
        },
        {
          title: 'With description',
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <Toggle id="sc-toggle-desc1" label="Marketing emails" description="Receive weekly updates and promotions." checked onChange={() => {}} />
              <Toggle id="sc-toggle-desc2" label="Security alerts" description="Get notified about account activity." checked={false} onChange={() => {}} />
            </div>
          ),
          code: `<Toggle id="marketing" label="Marketing emails" description="Receive weekly updates." checked={value} onChange={setValue} />`,
        },
        {
          title: 'Disabled',
          preview: (
            <div className="space-y-2">
              <Toggle id="sc-toggle-dis1" label="Disabled on" checked disabled onChange={() => {}} />
              <Toggle id="sc-toggle-dis2" label="Disabled off" checked={false} disabled onChange={() => {}} />
            </div>
          ),
          code: `<Toggle id="toggle" label="Disabled" checked disabled onChange={() => {}} />`,
        },
        {
          title: 'Settings list (controlled)',
          layout: 'stack' as const,
          preview: (() => {
            function ToggleSettingsDemo() {
              const [s, setS] = useState({ notifications: true, marketing: false, darkMode: false });
              function toggle(k: keyof typeof s) { setS(p => ({ ...p, [k]: !p[k] })); }
              const items = [
                { key: 'notifications' as const, label: 'Push notifications', desc: 'Alerts for new activity' },
                { key: 'marketing' as const,     label: 'Marketing emails',   desc: 'Weekly updates and offers' },
                { key: 'darkMode' as const,       label: 'Dark mode',          desc: 'Switch to dark theme' },
              ];
              return (
                <div className="w-full max-w-xs divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {items.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between px-4 py-3 bg-surface-base">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{label}</p>
                        <p className="text-xs text-text-secondary">{desc}</p>
                      </div>
                      <Toggle id={`ctrl-${key}`} label="" checked={s[key]} onChange={() => toggle(key)} />
                    </div>
                  ))}
                </div>
              );
            }
            return <ToggleSettingsDemo />;
          })(),
          code: `function Demo() {\n  const [s, setS] = useState({ notifications: true, marketing: false });\n  return (\n    <div className="divide-y border rounded-lg">\n      {[{ key: 'notifications', label: 'Push notifications', desc: 'Alerts for new activity' }, ...].map(({ key, label, desc }) => (\n        <div key={key} className="flex items-center justify-between px-4 py-3">\n          <div>\n            <p className="text-sm font-medium">{label}</p>\n            <p className="text-xs text-text-secondary">{desc}</p>\n          </div>\n          <Toggle id={key} label="" checked={s[key]} onChange={() => setS(p => ({ ...p, [key]: !p[key] }))} />\n        </div>\n      ))}\n    </div>\n  );\n}`,
        },
      ],
    },
    {
      id: 'checkbox-group',
      title: 'CheckboxGroup',
      category: 'Molecule',
      abbr: 'Cg',
      description: 'Chip-style multi-select group. Selected chips use bg-primary-subtle / border-primary tokens. Keyboard accessible.',
      filePath: 'modules/ui/CheckboxGroup.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

export function CheckboxGroup({ legend, options, selected, onChange, disabled, error, className }) {
  function toggle(opt, checked) {
    onChange(checked ? [...selected, opt] : selected.filter((s) => s !== opt));
  }
  return (
    <fieldset className={cn('space-y-2', className)}>
      <legend className="text-sm font-medium text-text-primary mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <label key={opt} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors focus-within:ring-2 focus-within:ring-border-focus', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', isSelected ? 'bg-primary-subtle border-primary text-primary' : 'bg-surface-base border-border text-text-primary hover:bg-surface-overlay')}>
              <input type="checkbox" checked={isSelected} disabled={disabled} onChange={(e) => toggle(opt, e.target.checked)} className="sr-only" />
              {isSelected && <span aria-hidden="true" className="text-xs font-bold">✓</span>}
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-error mt-1" role="alert">{error}</p>}
    </fieldset>
  );
}`,
      variants: [
        {
          title: 'Default',
          preview: (() => {
            function CheckboxGroupDemo() {
              const [sel, setSel] = useState<string[]>(['react', 'typescript']);
              return <CheckboxGroup legend="Tech stack" options={[{value:'react',label:'React'},{value:'vue',label:'Vue'},{value:'angular',label:'Angular'},{value:'typescript',label:'TypeScript'},{value:'javascript',label:'JavaScript'},{value:'nodejs',label:'Node.js'}]} selected={sel} onChange={setSel} />;
            }
            return <CheckboxGroupDemo />;
          })(),
          code: `const [selected, setSelected] = useState(['react', 'typescript']);\n<CheckboxGroup\n  legend="Tech stack"\n  options={[\n    { value: 'react', label: 'React' },\n    { value: 'vue', label: 'Vue' },\n    { value: 'typescript', label: 'TypeScript' },\n  ]}\n  selected={selected}\n  onChange={setSelected}\n/>`,
        },
        {
          title: 'Disabled',
          preview: <CheckboxGroup legend="Permissions" options={[{value:'read',label:'Read'},{value:'write',label:'Write'},{value:'delete',label:'Delete'}]} selected={['read']} onChange={() => {}} disabled />,
          code: `<CheckboxGroup\n  legend="Permissions"\n  options={[\n    { value: 'read', label: 'Read' },\n    { value: 'write', label: 'Write' },\n    { value: 'delete', label: 'Delete' },\n  ]}\n  selected={['read']}\n  onChange={() => {}}\n  disabled\n/>`,
        },
      ],
    },
    {
      id: 'select',
      title: 'Select',
      category: 'Molecule',
      abbr: 'Sl',
      description: 'Label + select + hint + error anatomy. appearance-none overrides the native dropdown style and renders a chevron icon.',
      filePath: 'modules/ui/Select.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';

export function Select({ id, label, options, placeholder, hint, error, disabled, required, className, ...props }) {
  const hintId = hint ? \`\${id}-hint\` : undefined;
  const errorId = error ? \`\${id}-error\` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
      <select id={id} disabled={disabled} required={required} aria-describedby={describedBy} aria-invalid={!!error}
        className={cn('block w-full rounded-md border px-3 py-2 text-sm transition-colors appearance-none bg-surface-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken', error ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border')} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {hint && !error && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'label',    label: 'Label',    type: 'text',    default: 'Role' },
          { key: 'hint',     label: 'Hint',     type: 'text',    default: '' },
          { key: 'error',    label: 'Error',    type: 'text',    default: '' },
          { key: 'required', label: 'Required', type: 'boolean', default: false },
          { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
        ],
        render: (p) => (
          <div className="w-full max-w-xs">
            <Select
              id="pg-select"
              label={p.label as string}
              hint={p.hint as string || undefined}
              error={p.error as string || undefined}
              required={p.required as boolean}
              disabled={p.disabled as boolean}
              options={[
                { value: 'admin',  label: 'Admin'  },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
                { value: 'guest',  label: 'Guest'  },
              ]}
            />
          </div>
        ),
        generateCode: (p) => {
          const attrs: string[] = [`label="${p.label}"`];
          if (p.hint)     attrs.push(`hint="${p.hint}"`);
          if (p.error)    attrs.push(`error="${p.error}"`);
          if (p.required) attrs.push('required');
          if (p.disabled) attrs.push('disabled');
          return `<Select id="role" ${attrs.join(' ')}\n  options={[{ value: 'admin', label: 'Admin' }, ...]}\n/>`;
        },
      },
      variants: [
        {
          title: 'Controlled',
          preview: (() => {
            const ROLES = [
              { value: 'admin',  label: 'Admin'  },
              { value: 'editor', label: 'Editor' },
              { value: 'viewer', label: 'Viewer' },
              { value: 'guest',  label: 'Guest'  },
            ];
            function ControlledSelectDemo() {
              const [role, setRole] = useState('editor');
              return (
                <div className="w-full max-w-xs">
                  <Select id="sc-sl-role" label="Role" options={ROLES} value={role}
                    hint={`Selected: ${ROLES.find(r => r.value === role)?.label}`}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)} />
                </div>
              );
            }
            return <ControlledSelectDemo />;
          })(),
          code: `const ROLES = [\n  { value: 'admin', label: 'Admin' },\n  { value: 'editor', label: 'Editor' },\n  { value: 'viewer', label: 'Viewer' },\n];\n\nconst [role, setRole] = useState('editor');\n<Select id="role" label="Role" options={ROLES} value={role}\n  onChange={(e) => setRole(e.target.value)} />`,
        },
        {
          title: 'With icons',
          preview: (() => {
            const STATUSES = [
              { value: 'active',   label: 'Active',   icon: <span className="text-success text-xs">●</span> },
              { value: 'inactive', label: 'Inactive', icon: <span className="text-text-disabled text-xs">●</span> },
              { value: 'pending',  label: 'Pending',  icon: <span className="text-warning text-xs">●</span> },
              { value: 'banned',   label: 'Banned',   icon: <span className="text-error text-xs">●</span> },
            ];
            function IconSelectDemo() {
              const [status, setStatus] = useState('active');
              return (
                <div className="w-full max-w-xs">
                  <Select id="sc-sl-status" label="Status" options={STATUSES} value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)} />
                </div>
              );
            }
            return <IconSelectDemo />;
          })(),
          code: `const STATUSES = [\n  { value: 'active',   label: 'Active',   icon: <span className="text-success">●</span> },\n  { value: 'inactive', label: 'Inactive', icon: <span className="text-text-disabled">●</span> },\n  { value: 'pending',  label: 'Pending',  icon: <span className="text-warning">●</span> },\n];\n\n<Select id="status" label="Status" options={STATUSES} value={status} onChange={setStatus} />`,
        },
        {
          title: 'Validation states',
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <Select id="sc-sl-error" label="Plan" placeholder="Select a plan" required
                error="Please select a plan."
                options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]} />
              <Select id="sc-sl-disabled" label="Plan" disabled
                options={[{ value: 'pro', label: 'Pro' }]} value="pro" />
            </div>
          ),
          code: `<Select id="plan" label="Plan" placeholder="Select a plan" required\n  error="Please select a plan." options={[...]} />\n\n<Select id="plan" label="Plan" disabled options={[...]} value="pro" />`,
        },
        {
          title: 'With countries',
          preview: (
            <div className="w-full max-w-xs">
              <Select id="sc-sl-countries" label="Country" placeholder="Select a country…"
                hint="Powered by countries-list + country-flag-icons."
                options={COUNTRY_OPTIONS} />
            </div>
          ),
          code: `import { countries, getEmojiFlag } from 'countries-list';\n\nconst COUNTRY_OPTIONS = Object.entries(countries)\n  .map(([code, data]) => ({ value: code, label: \`\${getEmojiFlag(code)} \${data.name}\` }))\n  .sort((a, b) => a.label.localeCompare(b.label));\n\n<Select id="country" label="Country" placeholder="Select a country…"\n  options={COUNTRY_OPTIONS} hint="Powered by countries-list." />`,
        },
        {
          title: 'Searchable',
          preview: (() => {
            function SearchableSelectDemo() {
              const [val, setVal] = useState('');
              return (
                <div className="w-full max-w-xs">
                  <Select id="sc-sl-search" label="Country" placeholder="Select a country…" searchable
                    hint="Type to filter the list."
                    options={COUNTRY_OPTIONS} value={val}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVal(e.target.value)} />
                </div>
              );
            }
            return <SearchableSelectDemo />;
          })(),
          code: `<Select id="country" label="Country" placeholder="Select a country…" searchable\n  options={COUNTRY_OPTIONS} value={val} onChange={(e) => setVal(e.target.value)}\n  hint="Type to filter the list." />`,
        },
      ],
    },
  ];
}
