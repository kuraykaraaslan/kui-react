'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Modal } from '@/modules/ui/Modal';
import { Input } from '@/modules/ui/Input';
import { GROUP_COLORS } from '../../graph/types';
import { groupColorVar } from '../canvas/GroupFrame';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useFocusOnMount } from './useFocusOnMount';

/** Name and colour of a group: for a new group made of the selection, or for an existing one. */
export function GroupDialog({ title, initial, confirmLabel, onSubmit, onClose }: {
  title: string;
  initial: { name: string; color: number };
  confirmLabel: string;
  onSubmit: (name: string, color: number) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [color, setColor] = useState(initial.color);
  const nameRef = useFocusOnMount<HTMLInputElement>();
  const submit = () => onSubmit(name.trim(), color);
  return (
    <Modal open onClose={onClose} title={title} size="sm"
      footer={
        <div className="flex w-full items-center gap-2">
          <PrimaryButton onClick={submit}>{confirmLabel}</PrimaryButton>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        </div>
      }>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Input id="group-name" label="Name" value={name} maxLength={40} ref={nameRef} onChange={(e) => setName(e.target.value)} />
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-text-primary">Colour</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Group colour">
            {GROUP_COLORS.map((c, i) => (
              <button
                key={c} type="button" role="radio" aria-checked={color === i} aria-label={c.replace('-', ' ')}
                onClick={() => setColor(i)}
                className={cn('h-7 w-7 rounded-full border-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  color === i ? 'border-text-primary ring-2 ring-border-focus' : 'border-transparent')}
                style={{ background: groupColorVar(i) }}
              />
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
