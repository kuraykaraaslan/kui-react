// Pure safety logic of the Content widgets (markdown, image, links, embed). No React: the
// templates' save-time rules and the views' render-time checks use the same functions.
//
// Ported from next-boilerplate `modules/dashboard/ui/data-widgets/content-logic.ts` (phase 14).
// The rule across all four: an author-supplied string is DATA until proven otherwise. Markdown is
// parsed to a node tree that React renders (no HTML string is ever built, so raw HTML in the source
// is shown as text, never executed); URLs pass an allow-list of schemes; the embed URL also refuses
// private hosts.

// ── URLs ───────────────────────────────────────────────────────────────────

export interface SafeLink { href: string; external: boolean }

const CONTROL = /[\u0000-\u001f\u007f\s]/;

/**
 * Link target allow-list: an INTERNAL path (`/x`, never `//host`, never a backslash trick),
 * `https:`, `http:` or `mailto:`. Anything else (`javascript:`, `data:`, `vbscript:`, a scheme-less
 * host) is null, so a link is dropped rather than made inert-but-present. Control characters and
 * whitespace are refused outright because browsers strip them before resolving a scheme
 * (`java\tscript:`).
 */
export function resolveLink(raw: unknown): SafeLink | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim();
  if (!v || v.length > 2048 || CONTROL.test(v)) return null;
  if (/^\/(?![/\\])/.test(v)) return { href: v, external: false };
  try {
    const u = new URL(v);
    if (u.protocol === 'https:' || u.protocol === 'http:' || u.protocol === 'mailto:') return { href: u.toString(), external: true };
  } catch { /* not absolute */ }
  return null;
}

/** Image source allow-list: an internal path or `https:` / `http:`. No `data:` (SVG can carry script in some contexts). */
export function resolveImageSrc(raw: unknown): string | null {
  const link = resolveLink(raw);
  if (!link || link.href.startsWith('mailto:')) return null;
  return link.href;
}

/**
 * An internal path rewritten by the host (e.g. a tenant prefix), then checked again: the rewritten
 * address must still pass the same allow-list, or the link is dropped. External links are untouched.
 */
export function hostLink(link: SafeLink | null, resolveUrl?: (url: string) => string): SafeLink | null {
  if (!link || link.external || !resolveUrl) return link;
  return resolveLink(resolveUrl(link.href));
}

/** An image source rewritten by the host when internal, then checked again. */
export function hostImageSrc(raw: unknown, resolveUrl?: (url: string) => string): string | null {
  const src = resolveImageSrc(raw);
  if (!src || !resolveUrl || !src.startsWith('/')) return src;
  return resolveImageSrc(resolveUrl(src));
}

// ── Embed ──────────────────────────────────────────────────────────────────

export type EmbedResult =
  | { ok: true; url: string; host: string }
  | { ok: false; reason: 'empty' | 'invalid' | 'scheme' | 'credentials' | 'host' | 'port' };

function ipv4Blocked(h: string): boolean {
  const p = h.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 100 && b >= 64 && b <= 127)   // carrier-grade NAT
    || (a === 169 && b === 254)             // link-local, cloud metadata
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 192 && b === 0)
    || (a === 198 && (b === 18 || b === 19));
}

function ipv6Blocked(h: string): boolean {
  const v = h.toLowerCase();
  if (v === '::' || v === '::1') return true;
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(v);
  if (mapped) return ipv4Blocked(mapped[1]);
  if (v.startsWith('::ffff:')) return true;                        // hex-spelled mapped IPv4
  return /^(fc|fd|fe[89ab]|ff)/.test(v);                           // ULA, link-local, multicast
}

/** A hostname that names no public internet host. */
export function isPrivateHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (!h) return true;
  if (h.includes(':')) return ipv6Blocked(h);
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return ipv4Blocked(h);
  // Exotic numeric spellings that URL did not normalise to IPv4 are refused.
  if (/^[0-9x.]+$/i.test(h)) return true;
  if (!h.includes('.')) return true;                                // `intranet`, `localhost`
  return /\.(local|localhost|internal|intranet|lan|home|corp|test|example|invalid)$/.test(h);
}

/**
 * The embed gate. The BROWSER loads the URL, so the risk is the viewer's browser being pointed at
 * an internal address (admin consoles, router pages, metadata endpoints) or a credentialed URL.
 * Hence: `https:` only, no `user:pass@`, default port only, no private/loopback/link-local/single-label host.
 */
export function resolveEmbedUrl(raw: unknown): EmbedResult {
  if (typeof raw !== 'string' || !raw.trim()) return { ok: false, reason: 'empty' };
  const v = raw.trim();
  if (v.length > 2048 || CONTROL.test(v)) return { ok: false, reason: 'invalid' };
  let u: URL;
  try { u = new URL(v); } catch { return { ok: false, reason: 'invalid' }; }
  if (u.protocol !== 'https:') return { ok: false, reason: 'scheme' };
  if (u.username || u.password) return { ok: false, reason: 'credentials' };
  if (u.port && u.port !== '443') return { ok: false, reason: 'port' };
  if (isPrivateHostname(u.hostname)) return { ok: false, reason: 'host' };
  return { ok: true, url: u.toString(), host: u.hostname };
}

/**
 * The sandbox of every embed frame: scripts may run INSIDE the frame but it is an opaque origin
 * (`allow-same-origin` is deliberately absent), so even a URL resolving to the app's own origin
 * cannot reach cookies, storage or DOM. Popups stay sandboxed. No top navigation, modals or downloads.
 */
export const EMBED_SANDBOX = 'allow-scripts allow-popups allow-forms allow-presentation';
export const EMBED_REFERRER_POLICY = 'no-referrer';

/** The permissions an author may switch OFF (the setting's option values), each one token of `EMBED_SANDBOX`. */
export const EMBED_PERMISSIONS = ['scripts', 'forms', 'popups', 'presentation'] as const;

/**
 * The sandbox for an author's permission list. A setting can only REMOVE permissions from
 * `EMBED_SANDBOX`, never add one: anything not in `EMBED_PERMISSIONS` (`same-origin`,
 * `top-navigation`, a crafted string) is ignored. Not a list = the full default set.
 * An empty result is the strictest sandbox (`sandbox=""`).
 */
export function embedSandbox(allow: unknown): string {
  if (!Array.isArray(allow)) return EMBED_SANDBOX;
  const wanted = new Set(allow.filter((x): x is string => typeof x === 'string'));
  return EMBED_PERMISSIONS.filter((p) => wanted.has(p)).map((p) => `allow-${p}`).join(' ');
}

// ── Links ──────────────────────────────────────────────────────────────────

export interface QuickLink {
  label: string;
  description: string;
  icon: string | null;
  iconColor?: unknown;
  color?: unknown;
  link: SafeLink;
}

/** Repeater rows → links. A row with no label or an unsafe target is dropped; capped. */
export function toQuickLinks(raw: unknown, max = 24): QuickLink[] {
  const out: QuickLink[] = [];
  for (const r of Array.isArray(raw) ? raw : []) {
    if (out.length >= max) break;
    if (typeof r !== 'object' || r === null) continue;
    const o = r as Record<string, unknown>;
    const label = typeof o.label === 'string' ? o.label.trim() : '';
    const link = resolveLink(o.href);
    if (!label || !link) continue;
    out.push({
      label: label.slice(0, 80),
      description: typeof o.description === 'string' ? o.description.slice(0, 160) : '',
      icon: typeof o.icon === 'string' && o.icon ? o.icon : null,
      iconColor: o.iconColor,
      color: o.color,
      link,
    });
  }
  return out;
}

// ── Template rules ─────────────────────────────────────────────────────────

type Rule = (v: Record<string, unknown>) => Array<{ path: string; message: string }>;

/** Save-time: a link field must be an internal path, https, http or mailto. */
export const safeLinkRule = (key: string, label: string): Rule => (v) =>
  typeof v[key] === 'string' && v[key] !== '' && !resolveLink(v[key])
    ? [{ path: key, message: `${label} must be an internal path (/…) or an https, http or mailto address` }]
    : [];

/** Save-time: an image address must be an internal path, https or http. */
export const safeImageRule = (key: string): Rule => (v) =>
  typeof v[key] === 'string' && v[key] !== '' && !resolveImageSrc(v[key])
    ? [{ path: key, message: 'The image must be an internal path (/…) or an https or http address' }]
    : [];

/** Save-time: an embed address must pass the embed gate. */
export const safeEmbedRule = (key: string): Rule => (v) => {
  if (typeof v[key] !== 'string' || v[key] === '') return [];
  const r = resolveEmbedUrl(v[key]);
  return r.ok ? [] : [{ path: key, message: 'Only a public https address can be embedded (no private hosts, ports or credentials)' }];
};

/** Save-time: every repeater row's target must be a safe link. */
export const safeRowLinksRule = (key: string, field: string): Rule => (v) => {
  const rows = Array.isArray(v[key]) ? (v[key] as Array<Record<string, unknown>>) : [];
  const out: Array<{ path: string; message: string }> = [];
  rows.forEach((row, i) => {
    const target = row && typeof row === 'object' ? row[field] : undefined;
    if (typeof target === 'string' && target !== '' && !resolveLink(target)) {
      out.push({ path: `${key}.${i}.${field}`, message: 'Target must be an internal path (/…) or an https, http or mailto address' });
    }
  });
  return out;
};

/** Save-time: a positive step. */
export const positiveStep = (key: string): Rule => (v) =>
  typeof v[key] === 'number' && (v[key] as number) <= 0 ? [{ path: key, message: 'Step must be greater than 0' }] : [];
