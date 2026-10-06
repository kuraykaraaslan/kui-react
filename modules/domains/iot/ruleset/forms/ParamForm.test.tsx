import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ParamForm } from './ParamForm';
import { setField } from './field-utils';
import type { ParamChoices, ParamSpec } from '../catalog/types';

/** a form that keeps its own values, the way the node panel does, and reports the latest ones */
function Harness({ schema, initial = {}, onValues, readOnly, choices, showRequired }: {
  schema: Record<string, ParamSpec>; initial?: Record<string, unknown>; onValues?: (v: Record<string, unknown>) => void;
  readOnly?: boolean; choices?: ParamChoices; showRequired?: boolean;
}) {
  const [values, setValues] = useState(initial);
  return (
    <ParamForm
      schema={schema} values={values} readOnly={readOnly} choices={choices} showRequired={showRequired}
      onChange={(key, value) => {
        const next = setField(values, key, value);
        setValues(next);
        onValues?.(next);
      }}
    />
  );
}

describe('ParamForm', () => {
  it('renders nothing for an empty schema or when every field is hidden', () => {
    const { container } = render(<Harness schema={{}} />);
    expect(container).toBeEmptyDOMElement();
    const hidden: Record<string, ParamSpec> = { a: { type: 'string', when: { param: 'mode', value: 'x' } } };
    const second = render(<Harness schema={hidden} initial={{ mode: 'y' }} />);
    expect(second.container).toBeEmptyDOMElement();
  });

  it('labels fields from the key, an own label, and a unit', () => {
    render(<Harness schema={{ offset_min: { type: 'number' }, lat: { type: 'number', label: 'Latitude' }, ttl: { type: 'number', unit: 's' } }} />);
    expect(screen.getByLabelText('Offset min')).toBeInTheDocument();
    expect(screen.getByLabelText('Latitude')).toBeInTheDocument();
    expect(screen.getByLabelText('Ttl (s)')).toBeInTheDocument();
  });

  it('shows a field only when its when condition holds, and updates as the other field changes', async () => {
    const user = userEvent.setup();
    const schema: Record<string, ParamSpec> = {
      mode: { type: 'enum', options: ['daily', 'cron'], default: 'daily' },
      time: { type: 'time', when: { param: 'mode', value: 'daily' } },
      cron: { type: 'cron', when: { param: 'mode', value: 'cron' } },
    };
    render(<Harness schema={schema} />);
    // the default of mode decides while nothing is stored
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.queryByLabelText('Cron')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Mode'), 'cron');
    expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cron')).toBeInTheDocument();
  });

  describe('fields', () => {
    it('text: sets the value, and removes the key when emptied', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ topic: { type: 'topic' } }} onValues={onValues} />);
      await user.type(screen.getByLabelText('Topic'), 'a/b');
      expect(onValues).toHaveBeenLastCalledWith({ topic: 'a/b' });
      await user.clear(screen.getByLabelText('Topic'));
      expect(onValues).toHaveBeenLastCalledWith({});
    });

    it('number: stores numbers, empties to no value, carries min max step', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ n: { type: 'number', int: true, min: 1, max: 9 } }} onValues={onValues} />);
      const input = screen.getByLabelText('N');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '9');
      expect(input).toHaveAttribute('step', '1');
      await user.type(input, '7');
      expect(onValues).toHaveBeenLastCalledWith({ n: 7 });
      await user.clear(input);
      expect(onValues).toHaveBeenLastCalledWith({});
    });

    it('bool: a switch', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ on: { type: 'bool', hint: 'Turn it on' } }} onValues={onValues} />);
      expect(screen.getByRole('switch', { name: /On/ })).toHaveAttribute('aria-checked', 'false');
      await user.click(screen.getByRole('switch'));
      expect(onValues).toHaveBeenLastCalledWith({ on: true });
      expect(screen.getByText('Turn it on')).toBeInTheDocument();
    });

    it('enum: shows option labels and stores the option itself, so numbers stay numbers', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ level: { type: 'enum', options: [1, 2, 'x'], option_labels: { 1: 'One' } } }} onValues={onValues} />);
      expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
      await user.selectOptions(screen.getByLabelText('Level'), 'One');
      expect(onValues).toHaveBeenLastCalledWith({ level: 1 });
      await user.selectOptions(screen.getByLabelText('Level'), 'x');
      expect(onValues).toHaveBeenLastCalledWith({ level: 'x' });
    });

    it('enum: selects the stored value', () => {
      render(<Harness schema={{ level: { type: 'enum', options: ['a', 'b'] } }} initial={{ level: 'b' }} />);
      expect(screen.getByLabelText('Level')).toHaveValue('1');
    });

    it('duration: converts between the unit and milliseconds', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ hold: { type: 'duration' } }} initial={{ hold: 90000 }} onValues={onValues} />);
      expect(screen.getByLabelText('Hold')).toHaveValue(90);
      expect(screen.getByLabelText('Unit')).toHaveValue('s');
      await user.selectOptions(screen.getByLabelText('Unit'), 'min');
      expect(screen.getByLabelText('Hold')).toHaveValue(1.5);
      await user.clear(screen.getByLabelText('Hold'));
      await user.type(screen.getByLabelText('Hold'), '2');
      expect(onValues).toHaveBeenLastCalledWith({ hold: 120000 });
    });

    it('weekdays: toggles days, kept in order', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ days: { type: 'weekdays' } }} onValues={onValues} />);
      await user.click(screen.getByRole('button', { name: 'Wed' }));
      await user.click(screen.getByRole('button', { name: 'Mon' }));
      expect(onValues).toHaveBeenLastCalledWith({ days: [1, 3] });
      expect(screen.getByRole('button', { name: 'Mon' })).toHaveAttribute('aria-pressed', 'true');
      await user.click(screen.getByRole('button', { name: 'Wed' }));
      expect(onValues).toHaveBeenLastCalledWith({ days: [1] });
    });

    it('secret: keeps a stored value when left empty and replaces it when typed', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ password: { type: 'secret' } }} initial={{ password: { $secret: true } }} onValues={onValues} />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('placeholder', '(unchanged)');
      await user.type(input, 'x');
      expect(onValues).toHaveBeenLastCalledWith({ password: 'x' });
      await user.clear(input);
      expect(onValues).toHaveBeenLastCalledWith({ password: undefined });
    });

    it('secret: an emptied field that held the marker keeps the marker', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ password: { type: 'secret' } }} initial={{ password: { $secret: true } }} onValues={onValues} />);
      await user.click(screen.getByLabelText('Password'));
      await user.keyboard('a{Backspace}');
      expect(onValues).toHaveBeenLastCalledWith({ password: undefined });
    });

    it('json: parses as you type and flags text that does not parse', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ body: { type: 'json' } }} onValues={onValues} />);
      const area = screen.getByLabelText('Body');
      await user.click(area);
      await user.paste('{"a":1}');
      expect(onValues).toHaveBeenLastCalledWith({ body: { a: 1 } });
      await user.clear(area);
      await user.paste('{oops');
      expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();
      expect(onValues).toHaveBeenLastCalledWith({ body: undefined });
    });

    it('code: an editor for the code, with its language', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      const { container } = render(<Harness schema={{ code: { type: 'code', lang: 'js', label: 'Script' } }} initial={{ code: 'return msg;' }} onValues={onValues} />);
      expect(container.querySelector('[data-kui-codeeditor][data-language="js"]')).not.toBeNull();
      const area = within(container).getByRole('textbox');
      expect(area).toHaveValue('return msg;');
      await user.type(area, '!');
      expect(onValues).toHaveBeenLastCalledWith({ code: 'return msg;!' });
    });

    it('text and template: a textarea', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ body: { type: 'template' } }} onValues={onValues} />);
      await user.type(screen.getByLabelText('Body'), 'x');
      expect(onValues).toHaveBeenLastCalledWith({ body: 'x' });
    });

    it('suggestions: a datalist for the field', () => {
      const { container } = render(<Harness schema={{ channel: { type: 'string', suggest: ['auto', '1'] } }} />);
      expect(screen.getByLabelText('Channel')).toHaveAttribute('list', 'param-channel-suggest');
      expect(container.querySelectorAll('datalist#param-channel-suggest option')).toHaveLength(2);
    });
  });

  describe('source, ref and list fields', () => {
    const choices: ParamChoices = {
      brokers: [{ value: 'lan', label: 'LAN broker' }, { value: 'cloud', label: 'Cloud' }],
      kinds: [{ value: 'up', label: 'Link up' }, { value: 'down', label: 'Link down' }],
    };
    it('source: a select of the host list', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ broker: { type: 'source', source: 'brokers' } }} choices={choices} onValues={onValues} />);
      await user.selectOptions(screen.getByLabelText('Broker'), 'Cloud');
      expect(onValues).toHaveBeenLastCalledWith({ broker: 'cloud' });
      await user.selectOptions(screen.getByLabelText('Broker'), '—');
      expect(onValues).toHaveBeenLastCalledWith({});
    });
    it('source: shows a saved value the list no longer has', () => {
      render(<Harness schema={{ broker: { type: 'source', source: 'brokers' } }} choices={choices} initial={{ broker: 'old' }} />);
      expect(screen.getByRole('option', { name: 'old (not available now)' })).toBeInTheDocument();
      expect(screen.getByLabelText('Broker')).toHaveValue('__missing__');
    });
    it('source with free: offers Other and a text field', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ broker: { type: 'source', source: 'brokers', free: true } }} choices={choices} onValues={onValues} />);
      await user.selectOptions(screen.getByLabelText('Broker'), 'Other…');
      await user.type(screen.getByLabelText('Other value'), 'mine');
      expect(onValues).toHaveBeenLastCalledWith({ broker: 'mine' });
    });
    it('source without a list from the host is a plain text field', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ broker: { type: 'source', source: 'brokers' } }} onValues={onValues} />);
      await user.type(screen.getByRole('textbox', { name: 'Broker' }), 'x');
      expect(onValues).toHaveBeenLastCalledWith({ broker: 'x' });
    });
    it('multiple source: checkboxes', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ brokers: { type: 'source', source: 'brokers', multiple: true } }} choices={choices} onValues={onValues} />);
      await user.click(screen.getByRole('checkbox', { name: 'Cloud' }));
      await user.click(screen.getByRole('checkbox', { name: 'LAN broker' }));
      expect(onValues).toHaveBeenLastCalledWith({ brokers: ['cloud', 'lan'] });
      await user.click(screen.getByRole('checkbox', { name: 'Cloud' }));
      expect(onValues).toHaveBeenLastCalledWith({ brokers: ['lan'] });
    });
    it('list of enum items: checkboxes with option labels', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ kinds: { type: 'list', items: { type: 'enum', options: ['up', 'down'], option_labels: { up: 'Link up' } } } }} onValues={onValues} />);
      await user.click(screen.getByRole('checkbox', { name: 'Link up' }));
      expect(onValues).toHaveBeenLastCalledWith({ kinds: ['up'] });
      expect(screen.getByRole('checkbox', { name: 'down' })).toBeInTheDocument();
    });
    it('list of anything else: comma separated text', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ from: { type: 'list', items: { type: 'string' } } }} onValues={onValues} />);
      await user.type(screen.getByLabelText('From'), 'a, b');
      expect(onValues).toHaveBeenLastCalledWith({ from: ['a', 'b'] });
    });
    it('list of numbers: parses the numbers', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={{ pins: { type: 'list', items: { type: 'number' } } }} onValues={onValues} />);
      await user.type(screen.getByLabelText('Pins'), '1, 2,x');
      expect(onValues).toHaveBeenLastCalledWith({ pins: [1, 2] });
    });
  });

  describe('value fields', () => {
    const schema: Record<string, ParamSpec> = { v: { type: 'value', label: 'Compare with' } };
    it('starts as text, switches kind with a fitting default', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={schema} onValues={onValues} />);
      expect(screen.getByLabelText('Type')).toHaveValue('str');
      await user.selectOptions(screen.getByLabelText('Type'), 'Variable');
      expect(onValues).toHaveBeenLastCalledWith({ v: { kind: 'path', v: 'msg.payload' } });
      expect(screen.getByLabelText('Value')).toHaveValue('msg.payload');
    });
    it('number kind stores a number', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={schema} initial={{ v: { kind: 'num', v: 0 } }} onValues={onValues} />);
      await user.clear(screen.getByLabelText('Value'));
      await user.type(screen.getByLabelText('Value'), '5');
      expect(onValues).toHaveBeenLastCalledWith({ v: { kind: 'num', v: 5 } });
    });
    it('bool kind is a switch, now kind needs no value', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      const { rerender } = render(<Harness schema={schema} initial={{ v: { kind: 'bool', v: true } }} onValues={onValues} />);
      await user.click(screen.getByRole('switch'));
      expect(onValues).toHaveBeenLastCalledWith({ v: { kind: 'bool', v: false } });
      rerender(<Harness key="now" schema={schema} initial={{ v: { kind: 'now' } }} />);
      expect(screen.getByText('The time the message arrives.')).toBeInTheDocument();
    });
    it('reads a plain string as text', () => {
      render(<Harness schema={schema} initial={{ v: 'plain' }} />);
      expect(screen.getByLabelText('Value')).toHaveValue('plain');
    });
  });

  describe('rules fields', () => {
    const schema: Record<string, ParamSpec> = {
      rules: {
        type: 'rules', max: 2,
        items: { op: { type: 'enum', options: ['eq', 'true'], default: 'eq' }, value: { type: 'string', when: { param: 'op', not: ['true'] } } },
      },
    };
    it('adds rows up to max, removes them, and edits the fields of a row', async () => {
      const user = userEvent.setup();
      const onValues = vi.fn();
      render(<Harness schema={schema} onValues={onValues} />);
      await user.click(screen.getByRole('button', { name: /Add rule/ }));
      await user.click(screen.getByRole('button', { name: /Add rule/ }));
      expect(onValues).toHaveBeenLastCalledWith({ rules: [{ op: 'eq' }, { op: 'eq' }] });
      expect(screen.queryByRole('button', { name: /Add rule/ })).not.toBeInTheDocument();
      await user.type(screen.getAllByLabelText('Value')[1], 'x');
      expect(onValues).toHaveBeenLastCalledWith({ rules: [{ op: 'eq' }, { op: 'eq', value: 'x' }] });
      await user.selectOptions(screen.getAllByLabelText('Op')[0], 'true');
      expect(screen.getAllByLabelText('Value')).toHaveLength(1);
      await user.click(screen.getByRole('button', { name: 'Remove rule 1' }));
      expect(onValues).toHaveBeenLastCalledWith({ rules: [{ op: 'eq', value: 'x' }] });
    });
  });

  describe('validation', () => {
    it('shows range and pattern problems at once, and required ones when asked', () => {
      const schema: Record<string, ParamSpec> = {
        n: { type: 'number', max: 5 }, code: { type: 'string', pattern: '^[a-z]+$' }, must: { type: 'string', required: true },
      };
      const { rerender } = render(<Harness schema={schema} initial={{ n: 9, code: 'AB' }} />);
      expect(screen.getByText('N must be at most 5.')).toBeInTheDocument();
      expect(screen.getByText('Code has an invalid format.')).toBeInTheDocument();
      expect(screen.queryByText('Must is required.')).not.toBeInTheDocument();
      rerender(<Harness key="r" schema={schema} initial={{ n: 9, code: 'AB' }} showRequired />);
      expect(screen.getByText('Must is required.')).toBeInTheDocument();
    });
    it('marks required fields', () => {
      render(<Harness schema={{ must: { type: 'string', required: true } }} />);
      expect(screen.getByText('(required)')).toBeInTheDocument();
    });
  });

  it('is read only when asked: nothing can change', async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<Harness readOnly schema={{ a: { type: 'string' }, b: { type: 'bool' }, c: { type: 'enum', options: ['x', 'y'] }, d: { type: 'weekdays' } }} onValues={onValues} />);
    expect(screen.getByLabelText(/^A/)).toHaveAttribute('readonly');
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByLabelText('C')).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Mon' }));
    expect(onValues).not.toHaveBeenCalled();
  });
});
