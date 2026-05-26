'use client';
// TODO M3 — Proper multiselect (chips + search + keyboard nav). For now this
// is a stub that simply renders nothing so import sites stay typed.
import type { Field } from '../../types';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (v: string[]) => void;
};

export function MultiselectField(_props: Props) {
  // TODO M3 — implement.
  return null;
}
