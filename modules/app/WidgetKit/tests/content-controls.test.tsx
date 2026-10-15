import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { effective, templateDefaults, validate } from '../settings/engine';
import type { SettingsTemplate } from '../settings/types';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { CONTENT_MARKDOWN, CONTENT_MARKDOWN_KIND } from '../templates/content-markdown';
import { CONTENT_IMAGE, CONTENT_IMAGE_KIND } from '../templates/content-image';
import { CONTENT_LINKS, CONTENT_LINKS_KIND } from '../templates/content-links';
import { CONTENT_EMBED, CONTENT_EMBED_KIND } from '../templates/content-embed';
import { CONTROL_BUTTON, CONTROL_BUTTON_KIND } from '../templates/control-button';
import { CONTROL_SWITCH, CONTROL_SWITCH_KIND } from '../templates/control-switch';
import { CONTROL_SLIDER, CONTROL_SLIDER_KIND } from '../templates/control-slider';
import { CONTROL_SETPOINT, CONTROL_SETPOINT_KIND } from '../templates/control-setpoint';
import { CONTENT_MARKDOWN_VIEW } from '../views/ContentMarkdownView';
import { CONTENT_IMAGE_VIEW } from '../views/ContentImageView';
import { CONTENT_LINKS_VIEW } from '../views/ContentLinksView';
import { CONTENT_EMBED_VIEW } from '../views/ContentEmbedView';
import { CONTROL_BUTTON_VIEW } from '../views/ControlButtonView';
import { CONTROL_SWITCH_VIEW } from '../views/ControlSwitchView';
import { CONTROL_SLIDER_VIEW } from '../views/ControlSliderView';
import { CONTROL_SETPOINT_VIEW } from '../views/ControlSetpointView';
import { resolveEmbedUrl, resolveLink } from '../views/content-logic';
import { parseMarkdown } from '../views/markdown';

const CASES: Array<[SettingsTemplate, { type: string; template: SettingsTemplate }, WidgetKindView]> = [
  [CONTENT_MARKDOWN, CONTENT_MARKDOWN_KIND, CONTENT_MARKDOWN_VIEW],
  [CONTENT_IMAGE, CONTENT_IMAGE_KIND, CONTENT_IMAGE_VIEW],
  [CONTENT_LINKS, CONTENT_LINKS_KIND, CONTENT_LINKS_VIEW],
  [CONTENT_EMBED, CONTENT_EMBED_KIND, CONTENT_EMBED_VIEW],
  [CONTROL_BUTTON, CONTROL_BUTTON_KIND, CONTROL_BUTTON_VIEW],
  [CONTROL_SWITCH, CONTROL_SWITCH_KIND, CONTROL_SWITCH_VIEW],
  [CONTROL_SLIDER, CONTROL_SLIDER_KIND, CONTROL_SLIDER_VIEW],
  [CONTROL_SETPOINT, CONTROL_SETPOINT_KIND, CONTROL_SETPOINT_VIEW],
];

function props(template: SettingsTemplate, over: Partial<WidgetViewProps> & { settings?: Record<string, unknown> } = {}): WidgetViewProps {
  return {
    format: {},
    data: {},
    locale: 'en',
    ...over,
    settings: effective(template, over.settings),
  };
}

describe('templates', () => {
  it.each(CASES.map(([t, k, v]) => [t.id, t, k, v] as const))('%s: v1, valid defaults, groups and kind', (_id, t, k, v) => {
    expect(t.version).toBe(1);
    expect(t.migrations).toEqual([]);
    expect(t.id).toBe(`builtin:${k.type}`);
    expect(k.template).toBe(t);
    expect(t.cardDefaults?.buttons).toEqual([]);
    const r = validate(t, templateDefaults(t));
    expect(r.issues).toEqual([]);
    const groups = new Set(t.groups.map((g) => g.id));
    for (const [key, f] of Object.entries(t.fields)) expect(groups.has(f.group ?? ''), `${key} -> ${f.group}`).toBe(true);
    expect(v.View).toBeTypeOf('function');
  });
  it('image and embed have no card padding; markdown has an optional record slot', () => {
    expect(CONTENT_IMAGE.cardDefaults).toEqual({ buttons: [], padding: 0 });
    expect(CONTENT_EMBED.cardDefaults).toEqual({ buttons: [], padding: 0 });
    expect(CONTENT_MARKDOWN_KIND.slots).toEqual([expect.objectContaining({ key: 'record', shape: 'record', required: false })]);
  });
  it('save-time rules refuse unsafe links, images and embeds, and bad ranges', () => {
    expect(validate(CONTENT_IMAGE, { href: 'javascript:alert(1)' }).issues.map((i) => i.path)).toContain('href');
    expect(validate(CONTENT_LINKS, { links: [{ label: 'x', href: 'javascript:alert(1)' }] }).issues.map((i) => i.path)).toContain('links.0.href');
    expect(validate(CONTENT_EMBED, { url: 'https://localhost/x' }).issues).toHaveLength(1);
    expect(validate(CONTROL_SLIDER, { min: 10, max: 5 }).issues.map((i) => i.path)).toContain('max');
    expect(validate(CONTROL_SETPOINT, { step: 0 }).issues.map((i) => i.path)).toContain('step');
  });
  it('content is empty without content; controls never are', () => {
    expect(CONTENT_MARKDOWN_VIEW.isEmpty!({}, { content: ' ' })).toBe(true);
    expect(CONTENT_MARKDOWN_VIEW.isEmpty!({}, { content: 'Hi' })).toBe(false);
    expect(CONTENT_IMAGE_VIEW.isEmpty!({}, {})).toBe(true);
    expect(CONTENT_LINKS_VIEW.isEmpty!({}, { links: [] })).toBe(true);
    expect(CONTENT_EMBED_VIEW.isEmpty!({}, {})).toBe(true);
    for (const v of [CONTROL_BUTTON_VIEW, CONTROL_SWITCH_VIEW, CONTROL_SLIDER_VIEW, CONTROL_SETPOINT_VIEW]) expect(v.isEmpty!({}, {})).toBe(false);
  });
});

describe('views render with defaults', () => {
  it.each(CASES.map(([t, , v]) => [t.id, t, v] as const))('%s', (_id, t, v) => {
    const { container } = render(<v.View {...props(t, { onControl: vi.fn().mockResolvedValue(undefined) })} />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe('content security', () => {
  it('link allow-list', () => {
    expect(resolveLink('/admin')).toEqual({ href: '/admin', external: false });
    expect(resolveLink('//evil.com')).toBeNull();
    expect(resolveLink('java\tscript:alert(1)')).toBeNull();
    expect(resolveLink('javascript:alert(1)')).toBeNull();
    expect(resolveLink('mailto:a@b.co')?.external).toBe(true);
  });
  it('embed gate: https and public hosts only', () => {
    expect(resolveEmbedUrl('http://example.org/')).toEqual({ ok: false, reason: 'scheme' });
    expect(resolveEmbedUrl('https://10.0.0.1/')).toEqual({ ok: false, reason: 'host' });
    expect(resolveEmbedUrl('https://[::1]/')).toEqual({ ok: false, reason: 'host' });
    expect(resolveEmbedUrl('https://intranet/')).toEqual({ ok: false, reason: 'host' });
    expect(resolveEmbedUrl('https://u:p@grafana.com/')).toEqual({ ok: false, reason: 'credentials' });
    expect(resolveEmbedUrl('https://grafana.com:8443/')).toEqual({ ok: false, reason: 'port' });
    expect(resolveEmbedUrl('https://grafana.com/d/1').ok).toBe(true);
  });
  it('markdown shows raw HTML as text and never builds markup', () => {
    const { container } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings: { content: '<img src=x onerror=alert(1)> **bold** <script>alert(1)</script>' } })} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });
  it('markdown inserts {{field}} values as escaped, formatted text, never as markdown', () => {
    const { container } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, {
      settings: { content: 'Temp: {{temp}} · Name: {{name}} · Missing: {{nope}}' },
      format: { unit: '°C', decimals: 1 },
      data: { record: { shape: 'record', record: { temp: 21.456, name: '**<b>x</b>** [y](javascript:alert(1))' } } },
    })} />);
    expect(container.textContent).toContain('Temp: 21.5 °C');
    expect(container.textContent).toContain('Name: **<b>x</b>** [y](javascript:alert(1))');
    expect(container.textContent).toContain('Missing: —');
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('strong')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
  });
  it('markdown leaves {{field}} literal when no record is bound, and inside code', () => {
    expect(parseMarkdown('`{{a}}`')[0]).toEqual({ t: 'paragraph', children: [{ t: 'code', text: '{{a}}' }] });
    const { container } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings: { content: 'v={{a}}' } })} />);
    expect(container.textContent).toBe('v={{a}}');
  });
  it('a javascript: markdown link keeps its label as text; a safe one gets the link colour', () => {
    const { container } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, {
      settings: { content: '[bad](javascript:alert(1)) [good](https://kui.dev)', linkColor: '#ff0000' },
    })} />);
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('https://kui.dev/');
    expect(links[0].getAttribute('rel')).toContain('noopener');
    expect(links[0].style.color).toBe('rgb(255, 0, 0)');
    expect(container.textContent).toContain('bad');
  });
  it('quick links drop a javascript: target; image refuses one', () => {
    render(<CONTENT_LINKS_VIEW.View {...props(CONTENT_LINKS, {
      settings: { links: [{ label: 'Evil', href: 'javascript:alert(1)' }, { label: 'Users', href: '/admin/users' }] },
    })} />);
    expect(screen.queryByText('Evil')).toBeNull();
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/admin/users');
    const { container } = render(<CONTENT_IMAGE_VIEW.View {...props(CONTENT_IMAGE, { settings: { src: 'javascript:alert(1)' } })} />);
    expect(container.querySelector('img')).toBeNull();
  });
  it('a non-https embed is refused; an https one is sandboxed without same-origin', () => {
    const { container, rerender } = render(<CONTENT_EMBED_VIEW.View {...props(CONTENT_EMBED, { settings: { url: 'http://example.org/' } })} />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.textContent).toContain('cannot be embedded');
    rerender(<CONTENT_EMBED_VIEW.View {...props(CONTENT_EMBED, { settings: { url: 'https://grafana.com/d/1', aspect: '16:9' } })} />);
    const frame = container.querySelector('iframe')!;
    expect(frame.getAttribute('sandbox')).not.toContain('allow-same-origin');
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
  });
  it('image applies fit, position and overlay', () => {
    const { container } = render(<CONTENT_IMAGE_VIEW.View {...props(CONTENT_IMAGE, {
      settings: { src: 'https://x.dev/a.png', fit: 'contain', position: 'top', overlayColor: 'rgba(0,0,0,0.4)', caption: 'Plant' },
    })} />);
    const img = container.querySelector('img')!;
    expect(img.style.objectFit).toBe('contain');
    expect(img.style.objectPosition).toBe('top');
    expect(screen.getByText('Plant')).toBeInTheDocument();
  });
});

describe('controls', () => {
  it('a switch asks the host to set the toggled value and shows success', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, { data: { value: { shape: 'scalar', value: false } }, onControl })} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: true });
    await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument());
  });
  it('a switch reads onMatch exactly', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, { settings: { onMatch: 'RUNNING' }, data: { value: { shape: 'scalar', value: 'RUNNING' } }, onControl })} />);
    expect(screen.getByRole('switch')).toBeChecked();
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: false });
  });
  it('a switch is disabled with the host reason', () => {
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, {
      data: { value: { shape: 'scalar', value: true } }, onControl: vi.fn(), controlDisabledReason: 'No permission',
    })} />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByRole('tooltip')).toHaveTextContent('No permission');
  });
  it('a switch is disabled when stale with disableWhen [stale], and enabled when not', () => {
    const value = { value: { shape: 'scalar' as const, value: true } };
    const { rerender } = render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, { data: value, onControl: vi.fn(), stale: true, settings: { disableWhen: ['stale'] } })} />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByRole('tooltip')).toHaveTextContent(/old/);
    rerender(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, { data: value, onControl: vi.fn(), stale: true, settings: { disableWhen: [] } })} />);
    expect(screen.getByRole('switch')).not.toBeDisabled();
  });
  it('a switch with an unknown state is disabled by disableWhen [unknown]', () => {
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, { onControl: vi.fn(), settings: { disableWhen: ['unknown'] } })} />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getAllByText('State unknown').length).toBeGreaterThan(0);
  });
  it('a control with no onControl is disabled as not connected', () => {
    render(<CONTROL_BUTTON_VIEW.View {...props(CONTROL_BUTTON)} />);
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled();
  });
  it('a button runs and applies its colours', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    render(<CONTROL_BUTTON_VIEW.View {...props(CONTROL_BUTTON, { settings: { label: 'Start', mainColor: '#00ff00' }, onControl })} />);
    const btn = screen.getByRole('button', { name: 'Start' });
    expect(btn.style.background).toContain('rgb(0, 255, 0)');
    await userEvent.setup().click(btn);
    expect(onControl).toHaveBeenCalledWith({ kind: 'run' });
  });
  it('a setpoint applies a typed value; a stepper sets value + step', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const { unmount } = render(<CONTROL_SETPOINT_VIEW.View {...props(CONTROL_SETPOINT, { data: { value: { shape: 'scalar', value: 20 } }, onControl })} />);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '22{Enter}');
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: 22 });
    unmount();
    onControl.mockClear();
    render(<CONTROL_SETPOINT_VIEW.View {...props(CONTROL_SETPOINT, { settings: { layout: 'stepper', step: 5 }, data: { value: { shape: 'scalar', value: 20 } }, onControl })} />);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: 25 });
  });
  it('a slider shows the formatted value and is disabled when the value is unknown and disableWhen has it', () => {
    const { rerender } = render(<CONTROL_SLIDER_VIEW.View {...props(CONTROL_SLIDER, {
      data: { value: { shape: 'scalar', value: 40 } }, format: { unit: '%' }, onControl: vi.fn(),
    })} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '40 %');
    expect(screen.getByRole('slider')).not.toBeDisabled();
    rerender(<CONTROL_SLIDER_VIEW.View {...props(CONTROL_SLIDER, { onControl: vi.fn(), settings: { disableWhen: ['unknown'] } })} />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});

describe('host hooks', () => {
  it('markdown inserts {{param_x}} from board params as escaped text; literal without params', () => {
    const settings = { content: 'Site: {{param_site}} / {{param_none}}' };
    const { container, rerender } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings, params: { site: '<b>Plant **A**</b>' } })} />);
    expect(container.textContent).toBe('Site: <b>Plant **A**</b> / —');
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('strong')).toBeNull();
    rerender(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings })} />);
    expect(container.textContent).toBe('Site: {{param_site}} / {{param_none}}');
  });
  it('markdown action links call onElementClick, and are plain text without the hook', async () => {
    const onElementClick = vi.fn();
    const settings = { content: 'Go [open valve](action:valve_1) now' };
    const { container, rerender } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings, onElementClick })} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'open valve' }));
    expect(onElementClick).toHaveBeenCalledWith('valve_1');
    expect(container.querySelector('a')).toBeNull();
    rerender(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, { settings })} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.textContent).toBe('Go open valve now');
  });
  it('markdown internal links go through resolveUrl', () => {
    const { container } = render(<CONTENT_MARKDOWN_VIEW.View {...props(CONTENT_MARKDOWN, {
      settings: { content: '[users](/admin/users)' }, resolveUrl: (u) => `/t/acme${u}`,
    })} />);
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/t/acme/admin/users');
  });
  it('image resolves internal src and href through resolveUrl, and re-checks the result', () => {
    const { container, rerender } = render(<CONTENT_IMAGE_VIEW.View {...props(CONTENT_IMAGE, {
      settings: { src: '/uploads/a.png', href: '/admin' }, resolveUrl: (u) => `/t/acme${u}`,
    })} />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/t/acme/uploads/a.png');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/t/acme/admin');
    rerender(<CONTENT_IMAGE_VIEW.View {...props(CONTENT_IMAGE, {
      settings: { src: '/uploads/a.png' }, resolveUrl: () => 'javascript:alert(1)',
    })} />);
    expect(container.querySelector('img')).toBeNull();
    rerender(<CONTENT_IMAGE_VIEW.View {...props(CONTENT_IMAGE, {
      settings: { src: 'https://x.dev/a.png' }, resolveUrl: (u) => `/t/acme${u}`,
    })} />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://x.dev/a.png');
  });
  it('quick links resolve internal hrefs, keep external ones', () => {
    render(<CONTENT_LINKS_VIEW.View {...props(CONTENT_LINKS, {
      settings: { links: [{ label: 'Users', href: '/admin/users' }, { label: 'Docs', href: 'https://kui.dev' }] },
      resolveUrl: (u) => `/t/acme${u}`,
    })} />);
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/t/acme/admin/users');
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', 'https://kui.dev/');
  });
  it('embed frame is named by the card title, else by the host', () => {
    const settings = { url: 'https://grafana.com/d/1' };
    const { container, rerender } = render(<CONTENT_EMBED_VIEW.View {...props(CONTENT_EMBED, { settings, title: 'Boiler room' })} />);
    expect(container.querySelector('iframe')?.getAttribute('title')).toBe('Boiler room');
    rerender(<CONTENT_EMBED_VIEW.View {...props(CONTENT_EMBED, { settings })} />);
    expect(container.querySelector('iframe')?.getAttribute('title')).toBe('Embedded page: grafana.com');
  });
  it('a button with a confirm policy asks first, using the policy text as the question', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CONTROL_BUTTON_VIEW.View {...props(CONTROL_BUTTON, { onControl, confirm: { mode: 'confirm', text: 'Restart the pump?' } })} />);
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onControl).not.toHaveBeenCalled();
    expect(screen.getByText('Restart the pump?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'run', confirmation: { confirmed: true } });
  });
  it('a button with a typed policy needs the exact text', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CONTROL_BUTTON_VIEW.View {...props(CONTROL_BUTTON, { onControl, confirm: { mode: 'typed', text: 'pump-1' } })} />);
    await user.click(screen.getByRole('button', { name: 'Run' }));
    const ok = screen.getByRole('button', { name: 'Confirm' });
    await user.type(screen.getByRole('textbox'), 'pump-2');
    expect(ok).toBeDisabled();
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'pump-1');
    await user.click(ok);
    expect(onControl).toHaveBeenCalledWith({ kind: 'run', confirmation: { confirmed: true, typed: 'pump-1' } });
  });
  it('a switch with a confirm policy writes only after Confirm; Cancel writes nothing', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, {
      data: { value: { shape: 'scalar', value: false } }, onControl, confirm: { mode: 'confirm' },
    })} />);
    await user.click(screen.getByRole('switch'));
    expect(onControl).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onControl).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).not.toBeChecked();
    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: true, confirmation: { confirmed: true } });
  });
  it('a switch with a typed policy requires the exact text', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CONTROL_SWITCH_VIEW.View {...props(CONTROL_SWITCH, {
      data: { value: { shape: 'scalar', value: true } }, onControl, confirm: { mode: 'typed', text: 'OFF' },
    })} />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    await user.type(screen.getByRole('textbox'), 'OFF');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: false, confirmation: { confirmed: true, typed: 'OFF' } });
  });
  it('a setpoint and a slider ask before writing under a confirm policy', async () => {
    const onControl = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const { unmount } = render(<CONTROL_SETPOINT_VIEW.View {...props(CONTROL_SETPOINT, {
      data: { value: { shape: 'scalar', value: 20 } }, onControl, confirm: { mode: 'confirm' },
    })} />);
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '22{Enter}');
    expect(onControl).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: 22, confirmation: { confirmed: true } });
    unmount();
    onControl.mockClear();
    render(<CONTROL_SLIDER_VIEW.View {...props(CONTROL_SLIDER, {
      data: { value: { shape: 'scalar', value: 40 } }, onControl, confirm: { mode: 'confirm' },
    })} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '41' } });
    fireEvent.pointerUp(slider);
    expect(onControl).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onControl).toHaveBeenCalledWith({ kind: 'set', value: 41, confirmation: { confirmed: true } });
  });
});
