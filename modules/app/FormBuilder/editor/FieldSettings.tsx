'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { Field, FieldOption, FormBuilderMessages } from '../types';

type FieldSettingsProps = {
  field: Field | null;
  messages: FormBuilderMessages;
  onChange: (id: string, patch: Partial<Field>) => void;
  onOptionsChange: (id: string, options: FieldOption[]) => void;
};

const FIELDS_WITH_OPTIONS: Field['type'][] = ['select', 'multiselect', 'radio', 'checkbox'];

export function FieldSettings({ field, messages, onChange, onOptionsChange }: FieldSettingsProps) {
  return (
    <aside
      aria-label={messages.settingsHeading}
      className={cn(
        'fb-settings w-72 shrink-0 rounded-lg border border-border bg-surface-raised',
        'flex flex-col',
      )}
    >
      <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary border-b border-border">
        {messages.settingsHeading}
      </h3>

      {!field ? (
        <p className="text-sm text-text-disabled italic px-3 py-6 text-center">
          {messages.settingsEmpty}
        </p>
      ) : (
        <div className="flex flex-col gap-3 p-3 overflow-y-auto">
          <Row label={messages.fieldLabel}>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onChange(field.id, { label: e.target.value })}
              className={inputClasses}
            />
          </Row>

          <Row label={messages.fieldName}>
            <input
              type="text"
              value={field.name}
              onChange={(e) => onChange(field.id, { name: sanitizeName(e.target.value) })}
              className={inputClasses}
            />
          </Row>

          {field.type !== 'checkbox' && field.type !== 'date' && field.type !== 'file' && (
            <Row label={messages.placeholder}>
              <input
                type="text"
                value={field.placeholder ?? ''}
                onChange={(e) => onChange(field.id, { placeholder: e.target.value })}
                className={inputClasses}
              />
            </Row>
          )}

          <Row label={messages.helperText}>
            <input
              type="text"
              value={field.helperText ?? ''}
              onChange={(e) => onChange(field.id, { helperText: e.target.value })}
              className={inputClasses}
            />
          </Row>

          {field.type !== 'file' && field.type !== 'checkbox' && (
            <Row label={messages.defaultValue}>
              <input
                type="text"
                value={typeof field.defaultValue === 'string' ? field.defaultValue : ''}
                onChange={(e) => onChange(field.id, { defaultValue: e.target.value })}
                className={inputClasses}
              />
            </Row>
          )}

          <label className="inline-flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={!!field.required}
              onChange={(e) => onChange(field.id, { required: e.target.checked })}
              className="rounded border-border-strong text-primary focus-visible:ring-2 focus-visible:ring-border-focus"
            />
            <span>{messages.required}</span>
          </label>

          {FIELDS_WITH_OPTIONS.includes(field.type) && (
            <OptionEditor
              field={field}
              messages={messages}
              onChange={(opts) => onOptionsChange(field.id, opts)}
            />
          )}
        </div>
      )}
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-text-primary">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

const inputClasses = cn(
  'w-full rounded-md border border-border bg-surface-base px-2 py-1.5 text-sm text-text-primary',
  'placeholder:text-text-disabled',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
);

function sanitizeName(v: string): string {
  return v.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 64);
}

type OptionEditorProps = {
  field: Field;
  messages: FormBuilderMessages;
  onChange: (options: FieldOption[]) => void;
};

function OptionEditor({ field, messages, onChange }: OptionEditorProps) {
  const options = field.options ?? [];

  const update = (i: number, patch: Partial<FieldOption>) => {
    const next = options.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(options.filter((_, j) => j !== i));
  };

  const add = () => {
    const idx = options.length + 1;
    onChange([...options, { label: `Option ${idx}`, value: `option_${idx}` }]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{messages.options}</span>
      <ul role="list" className="flex flex-col gap-1.5">
        {options.map((opt, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <input
              type="text"
              aria-label="Option label"
              value={opt.label}
              onChange={(e) => update(i, { label: e.target.value })}
              className={cn(inputClasses, 'flex-1')}
            />
            <input
              type="text"
              aria-label="Option value"
              value={opt.value}
              onChange={(e) => update(i, { value: e.target.value })}
              className={cn(inputClasses, 'w-24')}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={messages.removeOption}
              className={cn(
                'grid place-items-center w-7 h-7 rounded',
                'text-text-secondary hover:text-error hover:bg-error-subtle',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-sm',
          'bg-surface-base border border-border text-text-primary',
          'hover:bg-surface-overlay hover:border-border-strong',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        )}
      >
        <FontAwesomeIcon icon={faPlus} className="w-3 h-3" aria-hidden="true" />
        <span>{messages.addOption}</span>
      </button>
    </div>
  );
}
