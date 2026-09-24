'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { TabGroup } from '@/modules/ui/TabGroup';
import { Badge } from '@/modules/ui/Badge';
import { SchemaViewer } from './SchemaViewer';
import { ParameterTable } from './ParameterTable';
import { ResponseCard } from './ResponseCard';
import { CodeSamplePanel } from './CodeSamplePanel';
import { SecuritySchemeBadge } from './SecuritySchemeBadge';
import type { Operation } from './types';

type Props = {
  operation: Operation;
  className?: string;
};

export function OperationPanel({ operation, className }: Props) {
  const params       = operation.parameters ?? [];
  const pathParams   = params.filter((p) => p.in === 'path');
  const queryParams  = params.filter((p) => p.in === 'query');
  const headerParams = params.filter((p) => p.in === 'header');
  const cookieParams = params.filter((p) => p.in === 'cookie');

  const requestBodyContent = operation.requestBody?.content
    ? Object.entries(operation.requestBody.content)
    : [];

  const tabs = [
    {
      id: 'params',
      label: 'Parameters',
      badge: params.length
        ? <Badge variant="neutral" size="sm">{params.length}</Badge>
        : undefined,
      content: (
        <div className="space-y-4 p-4">
          {!params.length && (
            <p className="text-sm text-text-disabled text-center py-4">No parameters.</p>
          )}
          {pathParams.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Path</h4>
              <ParameterTable parameters={pathParams} />
            </section>
          )}
          {queryParams.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Query</h4>
              <ParameterTable parameters={queryParams} />
            </section>
          )}
          {headerParams.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Headers</h4>
              <ParameterTable parameters={headerParams} />
            </section>
          )}
          {cookieParams.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Cookies</h4>
              <ParameterTable parameters={cookieParams} />
            </section>
          )}
        </div>
      ),
    },
    {
      id: 'body',
      label: 'Request Body',
      badge: operation.requestBody ? <Badge variant="primary" size="sm">1</Badge> : undefined,
      content: (
        <div className="p-4 space-y-4">
          {!operation.requestBody ? (
            <p className="text-sm text-text-disabled text-center py-4">No request body.</p>
          ) : (
            <>
              {operation.requestBody.required && (
                <Badge variant="error" size="sm">required</Badge>
              )}
              {operation.requestBody.description && (
                <p className="text-sm text-text-secondary">{operation.requestBody.description}</p>
              )}
              {requestBodyContent.map(([mime, obj]) => (
                <div key={mime}>
                  <p className="text-xs font-mono text-text-disabled mb-2">{mime}</p>
                  {obj.schema && <SchemaViewer schema={obj.schema} />}
                </div>
              ))}
            </>
          )}
        </div>
      ),
    },
    {
      id: 'responses',
      label: 'Responses',
      badge: (operation.responses?.length ?? 0) > 0
        ? <Badge variant="neutral" size="sm">{operation.responses!.length}</Badge>
        : undefined,
      content: (
        <div className="p-4 space-y-2">
          {!(operation.responses?.length) ? (
            <p className="text-sm text-text-disabled text-center py-4">No responses defined.</p>
          ) : (
            operation.responses.map((res) => (
              <ResponseCard
                key={res.responseId}
                response={res}
                defaultOpen={res.statusCode.startsWith('2')}
              />
            ))
          )}
        </div>
      ),
    },
    ...(operation.codeSamples?.length
      ? [{
          id: 'samples',
          label: 'Code Samples',
          content: (
            <div className="p-4">
              <CodeSamplePanel samples={operation.codeSamples} />
            </div>
          ),
        }]
      : []),
  ];

  return (
    <div className={cn('rounded-xl border border-border bg-surface-base overflow-hidden', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-surface-raised space-y-2">
        {operation.deprecated && (
          <div className="flex items-center gap-2 text-xs text-warning-fg bg-warning-subtle rounded px-3 py-1.5">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            This operation is deprecated.
          </div>
        )}

        {operation.description && (
          <p className="text-sm text-text-secondary">{operation.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {(operation.tags ?? []).map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
          ))}
          {operation.security?.map((scheme, i) => {
            const [[name]] = Object.entries(scheme);
            return <SecuritySchemeBadge key={i} type="http" name={name} size="sm" />;
          })}
        </div>

        {operation.externalDocs && (
          <a
            href={operation.externalDocs.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            External docs
            <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <TabGroup tabs={tabs} />
    </div>
  );
}
