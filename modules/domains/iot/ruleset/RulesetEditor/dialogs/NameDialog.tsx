'use client';
import { useState } from 'react';
import { Modal } from '@/modules/ui/Modal';
import { Input } from '@/modules/ui/Input';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useFocusOnMount } from './useFocusOnMount';

/** Asks for one name (a new subflow, the subflow a selection becomes). */
export function NameDialog({ title, description, label, initial = '', hint, confirmLabel, onSubmit, onClose }: {
  title: string;
  description?: string;
  label: string;
  initial?: string;
  hint?: string;
  confirmLabel: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial);
  const nameRef = useFocusOnMount<HTMLInputElement>();
  const valid = name.trim().length > 0;
  const submit = () => valid && onSubmit(name.trim());
  return (
    <Modal open onClose={onClose} title={title} description={description} size="sm"
      footer={
        <div className="flex w-full items-center gap-2">
          <PrimaryButton onClick={submit} disabled={!valid}>{confirmLabel}</PrimaryButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      }>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Input id="name-dialog" label={label} value={name} hint={hint} maxLength={60} ref={nameRef} onChange={(e) => setName(e.target.value)} />
      </form>
    </Modal>
  );
}
