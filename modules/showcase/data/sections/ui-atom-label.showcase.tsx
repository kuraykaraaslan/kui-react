'use client';
import { Label } from '@/modules/ui/Label';
import type { ShowcaseComponent } from '../showcase.types';

export function buildLabelData(): ShowcaseComponent[] {
  return [
    {
      id: 'label',
      title: 'Label',
      category: 'Atom',
      abbr: 'Lb',
      description: 'Standalone form label with an optional required indicator and disabled state, for pairing with custom controls that do not manage their own label.',
      filePath: 'modules/ui/Label.tsx',
      sourceCode: `'use client';
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
}`,
      variants: [
        {
          title: 'Basic + required',
          preview: (
            <div className="space-y-3">
              <Label htmlFor="label-demo-name">Full name</Label>
              <Label htmlFor="label-demo-email" required>Email address</Label>
            </div>
          ),
          code: `<Label htmlFor="name">Full name</Label>\n<Label htmlFor="email" required>Email address</Label>`,
        },
        {
          title: 'Paired with a custom control',
          preview: (
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="label-demo-bio">Bio</Label>
              <textarea
                id="label-demo-bio"
                rows={2}
                className="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                placeholder="Tell us about yourself"
              />
              <Label disabled htmlFor="label-demo-handle">Handle (disabled)</Label>
              <input
                id="label-demo-handle"
                disabled
                placeholder="@handle"
                className="w-full rounded-md border border-border bg-surface-sunken px-3 py-2 text-sm text-text-disabled disabled:cursor-not-allowed"
              />
            </div>
          ),
          code: `<Label htmlFor="bio">Bio</Label>\n<textarea id="bio" rows={2} />\n\n<Label disabled htmlFor="handle">Handle (disabled)</Label>\n<input id="handle" disabled placeholder="@handle" />`,
        },
      ],
    },
  ];
}
