# Form

- **id:** `form`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Form.tsx`
- **status:** stable
- **since:** 2025-03

Form layout wrapper with title, description, error and actions slots. `columns` prop renders fields in a 1 or 2 column grid.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Single column

```tsx
<Form
  title="Create project"
  description="Fill in the details to create a new project."
  onSubmit={handleSubmit}
  actions={
    <>
      <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
      <Button variant="primary" type="submit">Save project</Button>
    </>
  }
>
  <Input id="name" label="Project name" required value={name} onChange={...} error={nameError} />
  <Input id="email" label="Owner email" type="email" required value={email} onChange={...} />
  <Select id="visibility" label="Visibility" value={visibility} onChange={...} options={options} />
  <Toggle id="notify" label="Send notifications" checked={notify} onChange={setNotify} />
</Form>
```

### Two column

```tsx
<Form title="Create project" columns={2} onSubmit={handleSubmit} actions={<Button type="submit">Save</Button>}>
  <Input id="name" label="Project name" required value={name} onChange={...} />
  <Input id="email" label="Owner email" type="email" value={email} onChange={...} />
  <Select id="visibility" label="Visibility" value={visibility} onChange={...} options={options} />
  <MultiSelect id="stack" label="Tech stack" value={stack} onChange={setStack} options={options} />
  <div className="sm:col-span-2">
    <Textarea id="description" label="Description" value={description} onChange={...} />
  </div>
</Form>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { AlertBanner } from '@/modules/ui/AlertBanner';

export function Form({ title, description, error, columns = 1, actions, children, onSubmit, className }) {
  return (
    <form onSubmit={onSubmit} noValidate className={cn('space-y-6', className)}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
          {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
        </div>
      )}
      {error && <AlertBanner variant="error" message={error} />}
      <div className={cn('grid gap-4', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {children}
      </div>
      {actions && (
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          {actions}
        </div>
      )}
    </form>
  );
}
```
