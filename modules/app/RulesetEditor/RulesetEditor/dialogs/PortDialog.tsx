'use client';
import { useState } from 'react';
import { Modal } from '@/modules/ui/Modal';
import { Select } from '@/modules/ui/Select';
import { useMessages } from '../messages';
import { PrimaryButton, SecondaryButton } from './buttons';

/** Which output of its block a connection leaves from: pick another one (one the block already has to the same target is named so, and cannot be chosen). */
export function PortDialog({ blockLabel, ports, onSubmit, onClose }: {
  blockLabel: string;
  ports: { id: string; label: string; current: boolean; taken: boolean }[];
  onSubmit: (portId: string) => void;
  onClose: () => void;
}) {
  const m = useMessages();
  const current = ports.find((p) => p.current)?.id ?? '';
  const [port, setPort] = useState(current);
  const chosen = ports.find((p) => p.id === port);
  const valid = !!chosen && !chosen.current && !chosen.taken;
  const submit = () => valid && onSubmit(port);
  return (
    <Modal open onClose={onClose} title={m.portDialogTitle} description={m.portDialogIntro(blockLabel)} size="sm"
      footer={
        <div className="flex w-full items-center gap-2">
          <PrimaryButton onClick={submit} disabled={!valid}>{m.portDialogSave}</PrimaryButton>
          <SecondaryButton onClick={onClose}>{m.dialogCancel}</SecondaryButton>
        </div>
      }>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Select id="port-dialog" label={m.portDialogLabel} value={port} onChange={(e) => setPort(e.target.value)}
          options={ports.map((p) => ({ value: p.id, label: p.taken ? m.portAlreadyConnected(p.label) : p.label }))} />
      </form>
    </Modal>
  );
}
