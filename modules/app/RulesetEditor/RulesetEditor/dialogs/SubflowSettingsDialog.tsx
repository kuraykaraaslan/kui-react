'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Input } from '@/modules/ui/Input';
import { Select } from '@/modules/ui/Select';
import { Textarea } from '@/modules/ui/Textarea';
import { draftsToParams, paramsToDrafts, subflowSettingsProblems, type SubflowParamDraft, type SubflowSettings } from '../../graph/state';
import { nextOutput } from '../../graph/subflows';
import { PORT_RE, type RuleSubflow } from '../../graph/types';
import { useMessages } from '../messages';
import { DangerButton, PrimaryButton, SecondaryButton } from './buttons';

const iconButton = 'shrink-0 rounded p-1.5 text-text-secondary transition-colors hover:bg-error-subtle hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
const addButton = 'inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border-strong px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

/**
 * Settings of a subflow: name, description, whether it has an input, its outputs and the params an instance
 * takes (inside the subflow they are read as `env.<name>`). Renaming an output keeps what is wired to it.
 */
export function SubflowSettingsDialog({ subflow, usedBy, onSave, onDelete, onClose }: {
  subflow: RuleSubflow;
  /** names of the places that use the subflow; it cannot be deleted while there are any */
  usedBy: string[];
  onSave: (settings: SubflowSettings) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const m = useMessages();
  const paramTypes: { value: SubflowParamDraft['type']; label: string }[] = [
    { value: 'string', label: m.sfTypeText }, { value: 'number', label: m.sfTypeNumber }, { value: 'bool', label: m.sfTypeBool },
    { value: 'duration', label: m.sfTypeDuration }, { value: 'enum', label: m.sfTypeChoice }, { value: 'text', label: m.sfTypeLongText },
  ];
  const [name, setName] = useState(subflow.name);
  const [description, setDescription] = useState(subflow.description ?? '');
  const [inputs, setInputs] = useState<0 | 1>(subflow.inputs);
  const [outputs, setOutputs] = useState(() => subflow.outputs.map((o) => ({ orig: o as string | undefined, name: o })));
  const [params, setParams] = useState(() => paramsToDrafts(subflow.params));
  const problems = subflowSettingsProblems({ outputs: outputs.map((o) => o.name), params }, PORT_RE, m.sfProblems);
  const valid = !problems.outputs && !problems.params && name.trim().length > 0;

  function save() {
    if (!valid) return;
    onSave({ name, description, inputs, outputs, params: draftsToParams(params) });
  }

  const setParam = (i: number, patch: Partial<SubflowParamDraft>) => setParams((rows) => rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));

  return (
    <Modal open onClose={onClose} title={m.sfTitle} description={m.sfIntro} size="lg" scrollable
      footer={
        <div className="flex w-full items-center gap-2">
          <PrimaryButton onClick={save} disabled={!valid}>{m.sfSave}</PrimaryButton>
          <SecondaryButton onClick={onClose}>{m.dialogCancel}</SecondaryButton>
          <span className="flex-1" />
          <DangerButton onClick={onDelete} disabled={usedBy.length > 0} title={usedBy.length ? m.sfUsedBy(usedBy) : undefined}>
            {m.sfDelete}
          </DangerButton>
        </div>
      }>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <Input id="sf-name" label={m.sfNameLabel} value={name} required maxLength={60} onChange={(e) => setName(e.target.value)} />
        <Textarea id="sf-description" label={m.sfDescriptionLabel} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select id="sf-inputs" label={m.sfInputLabel} value={String(inputs)} options={[{ value: '1', label: m.sfOneInput }, { value: '0', label: m.sfNoInput }]}
          hint={inputs === 0 && subflow.inputs === 1 ? m.sfInputRemoved : undefined}
          onChange={(e) => setInputs(e.target.value === '0' ? 0 : 1)} />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-text-primary">{m.sfOutputs}</legend>
          {outputs.map((o, i) => (
            <div key={i} className="flex items-end gap-2">
              <Input id={`sf-out-${i}`} label={m.sfOutputN(i + 1)} value={o.name} className="flex-1 font-mono" onChange={(e) => setOutputs((rows) => rows.map((r, k) => (k === i ? { ...r, name: e.target.value } : r)))} />
              <button type="button" aria-label={m.sfRemoveOutput(i + 1)} className={iconButton} onClick={() => setOutputs((rows) => rows.filter((_, k) => k !== i))}>
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
          {problems.outputs && <p role="alert" className="text-xs text-error">{problems.outputs}</p>}
          <button type="button" className={addButton} onClick={() => setOutputs((rows) => [...rows, { orig: undefined, name: nextOutput({ outputs: rows.map((r) => r.name) }) }])}>
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" /> {m.sfAddOutput}
          </button>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-text-primary">{m.sfParams}</legend>
          {params.map((p, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border bg-surface-base p-2.5">
              <div className="grid grid-cols-2 gap-2">
                <Input id={`sf-p-${i}-name`} label={m.sfParamName} value={p.name} className="font-mono" onChange={(e) => setParam(i, { name: e.target.value })} />
                <Input id={`sf-p-${i}-label`} label={m.sfParamLabel} value={p.label} onChange={(e) => setParam(i, { label: e.target.value })} />
                <Select id={`sf-p-${i}-type`} label={m.sfParamType} value={p.type} options={paramTypes} onChange={(e) => setParam(i, { type: e.target.value as SubflowParamDraft['type'] })} />
                <Input id={`sf-p-${i}-default`} label={m.sfParamDefault} value={p.default} onChange={(e) => setParam(i, { default: e.target.value })} />
              </div>
              {p.type === 'enum' && (
                <Input id={`sf-p-${i}-options`} label={m.sfParamChoices} hint={m.sfCommaSeparated} value={p.options} onChange={(e) => setParam(i, { options: e.target.value })} />
              )}
              <div className="flex justify-end">
                <button type="button" aria-label={m.sfRemoveParam(p.name || i + 1)} className={iconButton} onClick={() => setParams((rows) => rows.filter((_, k) => k !== i))}>
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
          {problems.params && <p role="alert" className="text-xs text-error">{problems.params}</p>}
          <button type="button" className={addButton} onClick={() => setParams((rows) => [...rows, { name: '', label: '', type: 'string', options: '', default: '' }])}>
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" /> {m.sfAddParam}
          </button>
        </fieldset>
      </form>
    </Modal>
  );
}
