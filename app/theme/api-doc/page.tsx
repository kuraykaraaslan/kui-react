import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFileContract, faUpRightFromSquare, faShield } from '@fortawesome/free-solid-svg-icons';
import { ApiTagSection } from '@/modules/domains/api-doc/ApiTagSection';
import { SecuritySchemeBadge } from '@/modules/domains/api-doc/SecuritySchemeBadge';
import { StatusCodeBadge } from '@/modules/domains/api-doc/StatusCodeBadge';
import { Badge } from '@/modules/ui/Badge';
import { SAMPLE_SPEC } from './api-doc.data';
import type { PathItem } from '@/modules/domains/api-doc/types';

export const metadata: Metadata = {
  title: { absolute: `${SAMPLE_SPEC.info.title} ${SAMPLE_SPEC.info.version}` },
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  ACTIVE:     'success',
  DRAFT:      'warning',
  DEPRECATED: 'error',
  SUNSET:     'neutral',
};

/* Build tag → pathItems map (server-side) */
function buildTagMap(paths: PathItem[]): Map<string, PathItem[]> {
  const map = new Map<string, PathItem[]>();
  for (const pathItem of paths) {
    for (const op of pathItem.operations ?? []) {
      const tags = op.tags?.length ? op.tags : ['Default'];
      for (const tag of tags) {
        if (!map.has(tag)) map.set(tag, []);
        const existing = map.get(tag)!;
        if (!existing.find((p) => p.pathItemId === pathItem.pathItemId)) {
          existing.push(pathItem);
        }
      }
    }
  }
  return map;
}

export default function ApiDocPage() {
  const { info, status, openapi, tags, components, servers } = SAMPLE_SPEC;
  const tagMap = buildTagMap(SAMPLE_SPEC.paths);

  const securitySchemes = components?.securitySchemes
    ? Object.entries(components.securitySchemes)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">

      {/* ── API info header ── */}
      <header className="space-y-5 pt-2">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-text-primary">{info.title}</h1>
              <Badge variant={STATUS_VARIANT[status] ?? 'neutral'}>{status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-disabled">
              <span>OpenAPI {openapi}</span>
              <span aria-hidden="true">·</span>
              <span>v{info.version}</span>
              {info.summary && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans text-text-secondary">{info.summary}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {info.description && (
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">{info.description}</p>
        )}

        {/* Contact / license / terms row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary">
          {info.contact?.email && (
            <a
              href={`mailto:${info.contact.email}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" aria-hidden="true" />
              {info.contact.name ?? info.contact.email}
            </a>
          )}
          {info.license && (
            info.license.url ? (
              <a
                href={info.license.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faFileContract} className="w-3 h-3" aria-hidden="true" />
                {info.license.name}
                <FontAwesomeIcon icon={faUpRightFromSquare} className="w-2.5 h-2.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faFileContract} className="w-3 h-3" aria-hidden="true" />
                {info.license.name}
              </span>
            )
          )}
          {info.termsOfService && (
            <a
              href={info.termsOfService}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              Terms of Service
              <FontAwesomeIcon icon={faUpRightFromSquare} className="w-2.5 h-2.5" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Security schemes */}
        {securitySchemes.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShield} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Security schemes</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {securitySchemes.map(([name, scheme]) => (
                <div key={name} className="flex items-start gap-2">
                  <SecuritySchemeBadge type={scheme.type} name={name} />
                  {scheme.description && (
                    <span className="text-xs text-text-secondary leading-5">{scheme.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common response codes quick reference */}
        <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Common responses</p>
          <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
            {(['200', '201', '204', '400', '401', '403', '404', '422', '429'] as const).map((code) => (
              <StatusCodeBadge key={code} code={code} />
            ))}
          </div>
        </div>
      </header>

      {/* ── Divider ── */}
      <hr className="border-border" />

      {/* ── Tag sections ── */}
      <div className="space-y-8">
        {[...tagMap.entries()].map(([tagName, pathItems]) => {
          const tagDef = tags.find((t) => t.name === tagName) ?? { tagId: tagName, name: tagName };

          return (
            <section key={tagName} id={`tag-${tagName}`} className="scroll-mt-20">
              <ApiTagSection
                tag={tagDef}
                paths={pathItems.map((pathItem) => ({ pathItem }))}
                defaultOpen
              />
            </section>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-text-disabled">
        <span>
          {info.title} · v{info.version} · OpenAPI {openapi}
        </span>
        {info.contact?.email && (
          <a href={`mailto:${info.contact.email}`} className="hover:text-text-primary transition-colors">
            {info.contact.email}
          </a>
        )}
      </footer>
    </div>
  );
}
