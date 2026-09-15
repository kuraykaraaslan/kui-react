# Label

- **id:** `label`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Label.tsx`
- **status:** stable
- **since:** 2026-09

Standalone form label with an optional required indicator and disabled state, for pairing with custom controls that do not manage their own label.

## Design tokens consumed

- `--error`
- `--primary`
- `--text-disabled`
- `--text-primary`

## Variants

### Basic + required

```tsx
<Label htmlFor="name">Full name</Label>
<Label htmlFor="email" required>Email address</Label>
```

### Paired with a custom control

```tsx
<Label htmlFor="bio">Bio</Label>
<textarea id="bio" rows={2} />

<Label disabled htmlFor="handle">Handle (disabled)</Label>
<input id="handle" disabled placeholder="@handle" />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

type LabelProps = {
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ required, disabled, className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-text-primary select-none',
        disabled && 'text-text-disabled cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {children}
      {required && (
        <>
          <span className="text-error ml-1" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  );
}
```
