'use client';
import { useState } from 'react';
import { AddressSelector } from '@/modules/domains/common/address/AddressSelector';
import { AddressForm } from '@/modules/domains/common/address/AddressForm';
import { Button } from '@/modules/ui/Button';
import { InlineAlert } from '@/modules/app/InlineAlert';
import { SAVED_ADDRESSES } from '../../common.data';
import type { Address } from '@/modules/domains/common/AddressTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type Mode = { kind: 'list' } | { kind: 'add' } | { kind: 'edit'; index: number };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [selected, setSelected]   = useState<number>(0);
  const [mode, setMode]           = useState<Mode>({ kind: 'list' });
  const [savedMsg, setSavedMsg]   = useState('');

  function flash(msg: string) { setSavedMsg(msg); setTimeout(() => setSavedMsg(''), 3000); }

  async function handleSave(values: Address) {
    await new Promise((r) => setTimeout(r, 600));
    if (mode.kind === 'add') {
      setAddresses((prev) => [...prev, values]);
      setSelected(addresses.length);
      flash('Address added.');
    } else if (mode.kind === 'edit') {
      setAddresses((prev) => prev.map((a, i) => (i === mode.index ? values : a)));
      flash('Address updated.');
    }
    setMode({ kind: 'list' });
  }

  function handleDelete(idx: number) {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
    setSelected((s) => (s >= idx && s > 0 ? s - 1 : s));
    flash('Address removed.');
  }

  return (
    <>
      <DocumentTitle text="Addresses — Common Theme" />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Address Book</h2>
        {mode.kind === 'list' && (
          <Button size="sm" onClick={() => setMode({ kind: 'add' })}>
            + Add address
          </Button>
        )}
      </div>

      {savedMsg && <InlineAlert message={savedMsg} />}

      {mode.kind === 'list' ? (
        <AddressSelector
          addresses={addresses}
          selectedIndex={selected}
          onSelect={(idx) => setSelected(idx)}
          onEdit={(idx) => setMode({ kind: 'edit', index: idx })}
          onDelete={(idx) => handleDelete(idx)}
          onAdd={() => setMode({ kind: 'add' })}
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface-raised p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            {mode.kind === 'add' ? 'New address' : 'Edit address'}
          </h3>
          <AddressForm
            initial={mode.kind === 'edit' ? addresses[mode.index] : undefined}
            onSubmit={handleSave}
            onCancel={() => setMode({ kind: 'list' })}
            submitLabel={mode.kind === 'add' ? 'Add address' : 'Save changes'}
          />
        </div>
      )}
    </div>
    </>
  );
}
