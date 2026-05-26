'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  Field,
  FormErrors,
  FormRendererMessages,
  FormSchema,
  FormValues,
} from '../types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function seedValues(schema: FormSchema): FormValues {
  const v: FormValues = {};
  schema.fields.forEach((f) => {
    if (f.defaultValue !== undefined && f.defaultValue !== null) {
      v[f.name] = f.defaultValue;
    } else if (f.type === 'checkbox') {
      v[f.name] = false;
    } else if (f.type === 'multiselect') {
      v[f.name] = [];
    } else {
      v[f.name] = '';
    }
  });
  return v;
}

export function validateField(
  field: Field,
  value: unknown,
  messages: FormRendererMessages,
): string | undefined {
  // Required
  if (field.required) {
    const empty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (field.type === 'checkbox' && value === false);
    if (empty) return messages.required;
  }
  // Email format
  if (field.type === 'email' && typeof value === 'string' && value.length > 0) {
    if (!EMAIL_RE.test(value)) return messages.invalidEmail;
  }
  // TODO M2: min / max length, regex, file size / type checks live here.
  return undefined;
}

export function validateAll(
  schema: FormSchema,
  values: FormValues,
  messages: FormRendererMessages,
): FormErrors {
  const errors: FormErrors = {};
  schema.fields.forEach((f) => {
    const e = validateField(f, values[f.name], messages);
    if (e) errors[f.name] = e;
  });
  return errors;
}

type UseFormStateArgs = {
  schema: FormSchema;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
  messages: FormRendererMessages;
};

export function useFormState({ schema, values, onChange, messages }: UseFormStateArgs) {
  const controlled = values !== undefined && typeof onChange === 'function';
  const [internal, setInternal] = useState<FormValues>(() => seedValues(schema));
  const current = controlled ? (values as FormValues) : internal;
  const currentRef = useRef(current);
  currentRef.current = current;

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const setValue = useCallback(
    (name: string, value: unknown) => {
      const next = { ...currentRef.current, [name]: value };
      if (controlled) {
        onChange?.(next);
      } else {
        setInternal(next);
      }
      // Clear field error once user starts editing — keep the rest.
      if (submitted) {
        setErrors((prev) => {
          if (!prev[name]) return prev;
          const { [name]: _drop, ...rest } = prev;
          return rest;
        });
      }
    },
    [controlled, onChange, submitted],
  );

  const runValidation = useCallback(
    (): { ok: boolean; errors: FormErrors } => {
      const errs = validateAll(schema, currentRef.current, messages);
      setErrors(errs);
      setSubmitted(true);
      return { ok: Object.keys(errs).length === 0, errors: errs };
    },
    [schema, messages],
  );

  // Re-seed defaults if schema changes structurally — keep existing user input.
  const fieldsKey = useMemo(
    () => schema.fields.map((f) => f.id + ':' + f.name + ':' + f.type).join('|'),
    [schema.fields],
  );

  return {
    values: current,
    errors,
    submitted,
    setValue,
    runValidation,
    fieldsKey,
  };
}
