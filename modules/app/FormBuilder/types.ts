// ── FormBuilder shared types (M1) ─────────────────────────────────────
// Pixel-identical to modules/app/FormBuilder/* in 02_EJS_Components.
//
// TODO M2: extend Field with `validation?: { minLength?: number; maxLength?: number;
//          regex?: string; fileMaxSizeKb?: number; fileTypes?: string[] }`.
// TODO M3: add `Logic` type — { id; targetFieldId; op: 'show'|'hide'|'skip-page'; when }.
// TODO M4: add `pages?: FormPage[]` to FormSchema. For M1, all fields live on a single page.
// TODO M5: add `theme?: { primary?: string; font?: string }` + integrations.

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'   // TODO M3 — runtime stub today
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file'
  | 'signature'     // TODO M5 — runtime stub today
  | 'rating';       // TODO M5 — runtime stub today

export type FieldOption = {
  label: string;
  value: string;
};

export type Field = {
  id: string;
  type: FieldType;
  name: string;            // form key
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | string[] | null;
  options?: FieldOption[]; // select / radio / checkbox
  // TODO M2: validation extensions live here.
  // TODO M3: visibility logic refs live here.
};

export type FormSchema = {
  id: string;
  title?: string;
  description?: string;
  fields: Field[];
  // TODO M4: pages?: FormPage[];
  // TODO M3: logic?: Logic[];
};

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string | undefined>;

/* ── Field type catalog (palette) ──────────────────────────────────── */

export type FieldTypeMeta = {
  type: FieldType;
  label: string;
  abbr: string;       // 2-letter for compact UI
  iconName: string;   // FontAwesome icon name (resolved at usage site)
  disabled?: boolean; // M3/M5 stubs disabled in M1 palette
  defaults: () => Omit<Field, 'id'>;
};

let _seq = 0;
export function nextFieldId(prefix = 'fld'): string {
  _seq += 1;
  // Stable-ish suffix for SSR vs. hydration; consumers can override.
  return `${prefix}-${Date.now().toString(36)}-${_seq.toString(36)}`;
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { type: 'text',      label: 'Text',        abbr: 'Tx', iconName: 'faFont',
    defaults: () => ({ type: 'text',     name: 'text',     label: 'Text field',     placeholder: '', helperText: '', required: false }) },
  { type: 'email',     label: 'Email',       abbr: 'Em', iconName: 'faAt',
    defaults: () => ({ type: 'email',    name: 'email',    label: 'Email',          placeholder: 'name@example.com', helperText: '', required: false }) },
  { type: 'number',    label: 'Number',      abbr: 'Nu', iconName: 'faHashtag',
    defaults: () => ({ type: 'number',   name: 'number',   label: 'Number',         placeholder: '0', helperText: '', required: false }) },
  { type: 'textarea',  label: 'Textarea',    abbr: 'Ta', iconName: 'faAlignLeft',
    defaults: () => ({ type: 'textarea', name: 'message',  label: 'Message',        placeholder: '', helperText: '', required: false }) },
  { type: 'select',    label: 'Select',      abbr: 'Se', iconName: 'faCaretDown',
    defaults: () => ({ type: 'select',   name: 'select',   label: 'Select option',  helperText: '', required: false,
                       options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] }) },
  { type: 'multiselect', label: 'Multiselect', abbr: 'Ms', iconName: 'faSquareCheck', disabled: true,
    defaults: () => ({ type: 'multiselect', name: 'multi', label: 'Multiselect',    helperText: '', required: false,
                       options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] }) },
  { type: 'radio',     label: 'Radio',       abbr: 'Rd', iconName: 'faCircleDot',
    defaults: () => ({ type: 'radio',    name: 'radio',    label: 'Choose one',     helperText: '', required: false,
                       options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] }) },
  { type: 'checkbox',  label: 'Checkbox',    abbr: 'Cb', iconName: 'faSquareCheck',
    defaults: () => ({ type: 'checkbox', name: 'checkbox', label: 'I agree',        helperText: '', required: false }) },
  { type: 'date',      label: 'Date',        abbr: 'Dt', iconName: 'faCalendar',
    defaults: () => ({ type: 'date',     name: 'date',     label: 'Date',           helperText: '', required: false }) },
  { type: 'file',      label: 'File',        abbr: 'Fl', iconName: 'faPaperclip',
    defaults: () => ({ type: 'file',     name: 'file',     label: 'Attachment',     helperText: '', required: false }) },
  { type: 'signature', label: 'Signature',   abbr: 'Sg', iconName: 'faPaperclip', disabled: true,
    defaults: () => ({ type: 'signature', name: 'signature', label: 'Signature',    helperText: '', required: false }) },
  { type: 'rating',    label: 'Rating',      abbr: 'Rt', iconName: 'faCircleDot', disabled: true,
    defaults: () => ({ type: 'rating',   name: 'rating',   label: 'Rating',         helperText: '', required: false }) },
];

export function getFieldTypeMeta(type: FieldType): FieldTypeMeta | undefined {
  return FIELD_TYPES.find((f) => f.type === type);
}

export type FormBuilderMessages = {
  paletteHeading: string;
  canvasHeading: string;
  canvasEmpty: string;
  settingsHeading: string;
  settingsEmpty: string;
  exportJson: string;
  importJson: string;
  duplicate: string;
  delete: string;
  fieldLabel: string;
  fieldName: string;
  placeholder: string;
  helperText: string;
  required: string;
  defaultValue: string;
  options: string;
  addOption: string;
  removeOption: string;
  // TODO M6: more keys for full i18n parity.
};

export const DEFAULT_BUILDER_MESSAGES: FormBuilderMessages = {
  paletteHeading: 'Fields',
  canvasHeading:  'Form',
  canvasEmpty:    'Drag a field from the palette to start building.',
  settingsHeading:'Settings',
  settingsEmpty:  'Select a field to edit its settings.',
  exportJson:     'Export JSON',
  importJson:     'Import JSON',
  duplicate:      'Duplicate',
  delete:         'Delete',
  fieldLabel:     'Label',
  fieldName:      'Name (form key)',
  placeholder:    'Placeholder',
  helperText:     'Helper text',
  required:       'Required',
  defaultValue:   'Default value',
  options:        'Options',
  addOption:      'Add option',
  removeOption:   'Remove',
};

export type FormRendererMessages = {
  submit: string;
  required: string;
  invalidEmail: string;
  tooShort: string;
  tooLong: string;
  // TODO M2: regex, fileTooLarge, etc.
};

export const DEFAULT_RENDERER_MESSAGES: FormRendererMessages = {
  submit:       'Submit',
  required:     'This field is required.',
  invalidEmail: 'Enter a valid email address.',
  tooShort:     'Value is too short.',
  tooLong:      'Value is too long.',
};

export type FormBuilderProps = {
  schema?: FormSchema;                          // controlled
  defaultSchema?: FormSchema;                   // uncontrolled
  onChange?: (schema: FormSchema) => void;
  fieldTypes?: FieldType[];                     // limit available types
  messages?: Partial<FormBuilderMessages>;
  className?: string;
};

export type FormRendererProps = {
  schema: FormSchema;
  values?: FormValues;
  onChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => void | Promise<void>;
  messages?: Partial<FormRendererMessages>;
  className?: string;
  // TODO M3: theme?: { primary?: string; font?: string };
  // TODO M4: saveResume?: { key: string };
};
