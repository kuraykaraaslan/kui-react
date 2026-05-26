'use client';
// TODO M5 — Signature pad (canvas + clear + dataURL export).
import type { Field } from '../../types';

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  onChange: (dataUrl: string) => void;
};

export function SignatureField(_props: Props) {
  // TODO M5 — implement.
  return null;
}
