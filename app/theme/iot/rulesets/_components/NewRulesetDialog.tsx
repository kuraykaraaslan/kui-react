'use client';
import { useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Textarea } from '@/modules/ui/Textarea';
import { Select } from '@/modules/ui/Select';
import { cn } from '@/libs/utils/cn';
import type { RuleChain } from '@/modules/domains/iot/types';
import {
  WEEKDAYS, fillTemplate, formatDuration, templateDefaults, validateTemplateValues,
  type RulesetTemplate, type TemplateInput, type TemplateValue,
} from '@/modules/domains/iot/ruleset/transfer';

const cardCls = cn(
  'flex h-full w-full flex-col items-start gap-1 rounded-xl border border-border bg-surface-base p-3 text-left transition-colors',
  'hover:border-primary hover:bg-primary-subtle',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
);

function TemplateField({ input, value, error, idBase, onChange }: {
  input: TemplateInput;
  value: TemplateValue;
  error?: string;
  idBase: string;
  onChange: (v: TemplateValue) => void;
}) {
  const id = `${idBase}-${input.key}`;
  switch (input.kind) {
    case 'select':
      return (
        <Select id={id} label={input.label} hint={input.hint} error={error}
          options={input.options ?? []} value={String(value)}
          onChange={(e) => onChange(e.target.value)} />
      );
    case 'weekdays': {
      const days = Array.isArray(value) ? value : [];
      return (
        <fieldset aria-describedby={error ? `${id}-error` : undefined}>
          <legend className="mb-1.5 text-sm font-medium text-text-primary">{input.label}</legend>
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map((d) => {
              const on = days.includes(d.value);
              return (
                <label key={d.value}
                  className={cn(
                    'inline-flex cursor-pointer select-none items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-border-focus',
                    on ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:border-border-strong',
                  )}>
                  <input type="checkbox" className="sr-only" checked={on}
                    onChange={() => onChange(on ? days.filter((x) => x !== d.value) : [...days, d.value])} />
                  {d.label}
                </label>
              );
            })}
          </div>
          {error && <p id={`${id}-error`} className="mt-1 text-xs text-error">{error}</p>}
        </fieldset>
      );
    }
    case 'duration': {
      const n = Number(value);
      const human = Number.isFinite(n) && n > 0 ? `= ${formatDuration(n)}` : '';
      return (
        <Input id={id} type="number" inputMode="numeric" min={input.min ?? 1} max={input.max} step={1}
          label={`${input.label} (seconds)`} hint={[input.hint, human].filter(Boolean).join(' ')} error={error}
          value={String(value)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
      );
    }
    case 'number':
      return (
        <Input id={id} type="number" min={input.min} max={input.max} label={input.label} hint={input.hint} error={error}
          value={String(value)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
      );
    case 'time':
      return (
        <Input id={id} type="time" label={input.label} hint={input.hint} error={error}
          value={String(value)} onChange={(e) => onChange(e.target.value)} />
      );
    default:
      return (
        <Input id={id} label={input.label} hint={input.hint} error={error}
          required={input.required !== false}
          value={String(value)} onChange={(e) => onChange(e.target.value)} />
      );
  }
}

export function NewRulesetDialog({ open, chains, templates, onClose, onCreate }: {
  open: boolean;
  chains: RuleChain[];
  templates: RulesetTemplate[];
  onClose: () => void;
  /** a blank or template ruleset, ready to store; `fromTemplate` opens the editor */
  onCreate: (chain: RuleChain, fromTemplate: boolean) => void;
}) {
  const id = useId();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [nameError, setNameError] = useState('');
  const [template, setTemplate] = useState<RulesetTemplate | null>(null);
  const [values, setValues] = useState<Record<string, TemplateValue>>({});
  const [tplName, setTplName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setName(''); setDesc(''); setNameError('');
    setTemplate(null); setValues({}); setTplName(''); setErrors({});
  }
  function close() { reset(); onClose(); }

  function nameTaken(n: string) {
    return chains.some((c) => c.name.toLowerCase() === n.trim().toLowerCase());
  }

  function createBlank() {
    const trimmed = name.trim();
    if (!trimmed) { setNameError('Name is required.'); return; }
    if (nameTaken(trimmed)) { setNameError('A ruleset with this name already exists.'); return; }
    const now = new Date();
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    onCreate({
      chainId: `chain-${Date.now()}`,
      name: trimmed,
      slug: slug || `chain-${Date.now()}`,
      description: desc.trim() || undefined,
      active: false, nodes: [], edges: [], createdAt: now, updatedAt: now,
    }, false);
    reset();
  }

  function pick(t: RulesetTemplate) {
    setTemplate(t);
    setValues(templateDefaults(t));
    setTplName('');
    setErrors({});
  }

  function createFromTemplate() {
    if (!template) return;
    const errs = validateTemplateValues(template, values);
    const chain = fillTemplate(template, values, { existing: chains, name: tplName });
    if (nameTaken(chain.name)) errs._name = 'A ruleset with this name already exists.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onCreate(chain, true);
    reset();
  }

  const previewName = template
    ? fillTemplate(template, values, { existing: chains }).name
    : '';

  return (
    <Modal
      open={open}
      onClose={close}
      title={template ? template.title : 'New ruleset'}
      description={template ? template.description : 'Start blank, or from a template.'}
      size="lg"
      scrollable
      className="max-h-[90vh] sm:max-w-2xl"
      footer={
        <div className="flex w-full flex-wrap items-center justify-end gap-2">
          {template && (
            <Button variant="ghost" size="sm" className="mr-auto" onClick={() => { setTemplate(null); setErrors({}); }}>
              <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" aria-hidden="true" /> Templates
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={close}>Cancel</Button>
          {template ? (
            <Button variant="primary" size="sm" type="submit" form={`${id}-tpl`}>Create and open</Button>
          ) : (
            <Button variant="primary" size="sm" type="submit" form={`${id}-blank`}>Create ruleset</Button>
          )}
        </div>
      }
    >
      {template ? (
        <form id={`${id}-tpl`} className="space-y-4" noValidate
          onSubmit={(e) => { e.preventDefault(); createFromTemplate(); }}>
          <Input id={`${id}-tpl-name`} label="Name" placeholder={previewName}
            hint="Leave empty to use the suggested name." error={errors._name || undefined}
            value={tplName} onChange={(e) => { setTplName(e.target.value); setErrors((x) => ({ ...x, _name: '' })); }} />
          <div className="grid gap-4 sm:grid-cols-2">
            {template.inputs.map((input) => (
              <div key={input.key} className={cn(input.kind === 'weekdays' && 'sm:col-span-2')}>
                <TemplateField input={input} idBase={`${id}-tpl`} error={errors[input.key] || undefined}
                  value={values[input.key] ?? input.default}
                  onChange={(v) => { setValues((x) => ({ ...x, [input.key]: v })); setErrors((x) => ({ ...x, [input.key]: '' })); }} />
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary">
            The ruleset is created inactive and opens in the editor, where you can change anything.
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <form id={`${id}-blank`} className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); createBlank(); }}>
            <Input id={`${id}-name`} label="Name" placeholder="e.g. Temperature Alert" required
              value={name} error={nameError || undefined}
              onChange={(e) => { setName(e.target.value); setNameError(''); }} />
            <Textarea id={`${id}-desc`} label="Description" rows={2}
              placeholder="Briefly describe what this rule chain does…"
              value={desc} onChange={(e) => setDesc(e.target.value)} />
          </form>

          <section aria-labelledby={`${id}-tpl-title`}>
            <h3 id={`${id}-tpl-title`} className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Or start from a template
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {templates.map((t) => (
                <li key={t.id}>
                  <button type="button" className={cardCls} onClick={() => pick(t)}>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{t.category}</span>
                    <span className="text-sm font-semibold text-text-primary">{t.title}</span>
                    <span className="text-xs leading-relaxed text-text-secondary">{t.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
}
