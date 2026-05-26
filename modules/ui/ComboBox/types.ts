// Public types for ComboBox (and shared with MultiSelect).
// Kept dependency-free so server components can import the types.

export type ComboBoxOption = {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

// M1: async search signature used by useAsync hook.
export type SearchFn = (query: string, signal?: AbortSignal) => Promise<ComboBoxOption[]>;

// M1: cursor-style pagination — host owns the cursor in closure.
export type LoadMoreFn = () => Promise<ComboBoxOption[]>;

export type ComboBoxProps = {
  id: string;
  label: string;
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  // Legacy sync signature still supported (M1 keeps backwards compat).
  // Async signature receives AbortSignal so callers can cancel fetches.
  onSearch?: (query: string, signal?: AbortSignal) => ComboBoxOption[] | Promise<ComboBoxOption[]>;
  onLoadMore?: LoadMoreFn;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  noResultsText?: string;
  className?: string;
  // M1 — debounce window for onSearch (default 300 ms).
  debounceMs?: number;
  // M1 — virtualization threshold (when options.length > this, fixed-height windowing kicks in).
  virtualize?: boolean | number;
  // TODO M3: groupBy?: (opt: ComboBoxOption) => string;
  // TODO M3: renderOption?: (opt: ComboBoxOption) => React.ReactNode;
  // TODO M3: creatable?: boolean | { onCreate: (input: string) => Promise<ComboBoxOption> };
  // TODO M5: freeSolo?: boolean;
  // TODO M4: messages?: Partial<ComboBoxMessages>;
};
