import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WidgetSettingsEditor } from '../WidgetSettingsEditor';
import { CORE_CARD, CORE_FORMAT, CORE_BOARD } from '../settings/core';
import { STAT_VALUE } from '../templates/stat-value';

const caps = { hasData: true, exportable: false, formatsNumbers: true };

beforeEach(() => { vi.useFakeTimers(); window.localStorage.clear(); });

describe('WidgetSettingsEditor', () => {
  it('shows the title and the tabs of the templates and the host', () => {
    render(<WidgetSettingsEditor templates={[STAT_VALUE, CORE_CARD, CORE_FORMAT]} settings={{}} onChange={() => {}} caps={caps}
      title="Rooms" onTitleChange={() => {}} extraTabs={{ Actions: <p>actions here</p> }} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Rooms');
    for (const t of ['Display', 'Data', 'Card', 'Actions']) expect(screen.getByRole('tab', { name: t })).toBeInTheDocument();
  });

  it('Basic mode hides advanced fields; Advanced shows them', () => {
    render(<WidgetSettingsEditor templates={[STAT_VALUE, CORE_CARD, CORE_FORMAT]} settings={{}} onChange={() => {}} caps={caps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Card' }));
    expect(screen.queryByText('Corner radius (px)')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Advanced settings/ }));
    fireEvent.click(screen.getByRole('tab', { name: 'Card' }));
    expect(screen.getByText('Corner radius (px)')).toBeInTheDocument();
  });

  it('writes a sparse value into the right namespace', () => {
    const onChange = vi.fn();
    render(<WidgetSettingsEditor templates={[STAT_VALUE, CORE_CARD, CORE_FORMAT]} settings={{}} onChange={onChange} caps={caps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Card' }));
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Inner spacing (px)' }), { target: { value: '4' } });
    act(() => { vi.runAllTimers(); });
    expect(onChange).toHaveBeenLastCalledWith({ $card: { padding: 4 } });
  });

  it('opens a part written by a newer version read-only', () => {
    render(<WidgetSettingsEditor templates={[STAT_VALUE, CORE_CARD, CORE_FORMAT]} settings={{ $v: { 'core:card': 5 } }} onChange={() => {}} caps={caps} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Card' }));
    expect(screen.getByRole('status')).toHaveTextContent('newer version');
  });

  it('edits board settings with the board template alone', () => {
    const onChange = vi.fn();
    render(<WidgetSettingsEditor templates={[CORE_BOARD]} settings={{}} onChange={onChange} caps={caps} />);
    expect(screen.getByRole('tab', { name: 'Look' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Row height (px)' }), { target: { value: '56' } });
    act(() => { vi.runAllTimers(); });
    expect(onChange).toHaveBeenLastCalledWith({ rowHeight: 56 });
  });
});
