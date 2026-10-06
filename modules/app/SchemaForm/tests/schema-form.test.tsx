import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SchemaForm } from '../SchemaForm';
import { SchemaFormProvider } from '../schema-form.context';
import { validateSchemaValues } from '../validate';
import type { FieldSchema } from '../types';

const schema: Record<string, FieldSchema> = {
  title: { label: 'Title', type: 'text', required: true },
  showIcon: { label: 'Show icon', type: 'boolean' },
  icon: { label: 'Icon name', type: 'text', showIf: { showIcon: true }, group: 'Appearance' },
  tags: { label: 'Tags', type: 'multi-select', options: ['a', 'b'] },
  items: { label: 'Items', type: 'repeater', fields: { name: { label: 'Name', type: 'text' } } },
  pic: { label: 'Picture', type: 'media' },
};

afterEach(() => vi.useRealTimers());

describe('SchemaForm', () => {
  it('hides showIf fields until the condition holds and groups the rest', () => {
    render(<SchemaForm schema={schema} values={{ title: 'x' }} onChange={() => {}} debounceMs={0} />);
    expect(screen.queryByLabelText('Icon name')).toBeNull();
    fireEvent.click(screen.getByLabelText('Enabled'));
    expect(screen.getByLabelText('Icon name')).toBeTruthy();
    expect(screen.getByText('Appearance')).toBeTruthy();
  });

  it('debounces onChange', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SchemaForm schema={schema} values={{}} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'Hi' } });
    expect(onChange).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(250); });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ title: 'Hi' }));
  });

  it('renders an injected override for an app-bound type', () => {
    const Media = ({ value }: { value: unknown }) => <div data-testid="media">{String(value)}</div>;
    render(<SchemaForm schema={schema} values={{ pic: 'u.png' }} onChange={() => {}} fieldOverrides={{ media: Media }} />);
    expect(screen.getByTestId('media').textContent).toBe('u.png');
  });

  it('takes overrides from the provider and degrades unknown types to text', () => {
    const Media = () => <div data-testid="ctx-media" />;
    render(
      <SchemaFormProvider fieldOverrides={{ media: Media }}>
        <SchemaForm schema={{ s: { label: 'Sym', type: 'symbol' }, pic: schema.pic }} values={{}} onChange={() => {}} />
      </SchemaFormProvider>,
    );
    expect(screen.getByTestId('ctx-media')).toBeTruthy();
    expect((screen.getByLabelText('Sym') as HTMLInputElement).type).toBe('text');
  });

  it('adds and edits repeater items', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SchemaForm schema={{ items: schema.items }} values={{}} onChange={onChange} debounceMs={0} />);
    fireEvent.click(screen.getByText('Add item'));
    expect(onChange).toHaveBeenLastCalledWith({ items: [{ name: '' }] });
  });

  it('shows external errors', () => {
    render(<SchemaForm schema={schema} values={{}} onChange={() => {}} errors={{ title: 'Title is required' }} />);
    expect(screen.getByRole('alert').textContent).toBe('Title is required');
  });
});

describe('validateSchemaValues', () => {
  it('reports required and zod issues, skips hidden fields', () => {
    const s: Record<string, FieldSchema> = {
      title: { label: 'Title', type: 'text', required: true },
      n: { label: 'N', type: 'number', max: 3 },
      hidden: { label: 'H', type: 'text', required: true, showIf: { on: true } },
    };
    const e = validateSchemaValues(s, { n: 9, on: false });
    expect(e.title).toBe('Title is required');
    expect(e.n).toBeTruthy();
    expect(e.hidden).toBeUndefined();
    expect(validateSchemaValues(s, { title: 'x', n: 1 })).toEqual({});
  });
});
