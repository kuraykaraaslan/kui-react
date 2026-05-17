'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faServer, faShieldHalved, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import type { OAuthFlowType, OAuthScope } from './types';

type OAuthFlowDiagramProps = {
  flow: OAuthFlowType;
  authorizationUrl?: string | null;
  tokenUrl?: string | null;
  refreshUrl?: string | null;
  scopes?: OAuthScope[];
  className?: string;
};

const flowLabel: Record<OAuthFlowType, string> = {
  authorizationCode: 'Authorization Code',
  implicit:          'Implicit',
  password:          'Password',
  clientCredentials: 'Client Credentials',
};

const flowSteps: Record<OAuthFlowType, string[]> = {
  authorizationCode: [
    'User clicks "Sign in"',
    'Redirect to /authorize',
    'User grants consent',
    'Code returned to app',
    'Exchange code for token',
  ],
  implicit: [
    'User clicks "Sign in"',
    'Redirect to /authorize',
    'Token returned in URL fragment',
  ],
  password: [
    'App collects username + password',
    'POST credentials to /token',
    'Access token returned',
  ],
  clientCredentials: [
    'App authenticates with client ID + secret',
    'POST to /token',
    'Access token returned',
  ],
};

export function OAuthFlowDiagram({
  flow,
  authorizationUrl,
  tokenUrl,
  refreshUrl,
  scopes,
  className,
}: OAuthFlowDiagramProps) {
  const steps = flowSteps[flow];

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
            OAuth 2.0 Flow
          </p>
          <p className="text-base font-semibold text-text-primary mt-0.5">{flowLabel[flow]}</p>
        </div>
        <Badge variant="primary" size="sm">
          <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 mr-1" aria-hidden="true" />
          {flow}
        </Badge>
      </div>

      {/* Actors */}
      <div className="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
        <Actor icon={faUser} label="User" />
        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-text-disabled" aria-hidden="true" />
        <Actor icon={faServer} label="Your App" />
        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-text-disabled" aria-hidden="true" />
        <Actor icon={faShieldHalved} label="Auth Server" />
      </div>

      {/* Steps */}
      <ol className="space-y-1.5">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-text-primary"
          >
            <span
              className={cn(
                'shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full',
                'bg-primary-subtle text-primary text-[10px] font-bold font-mono',
              )}
            >
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {/* Endpoints */}
      {(authorizationUrl || tokenUrl || refreshUrl) && (
        <dl className="border-t border-border pt-3 space-y-1.5">
          {authorizationUrl && (
            <UrlRow label="Authorization URL" url={authorizationUrl} />
          )}
          {tokenUrl && <UrlRow label="Token URL" url={tokenUrl} />}
          {refreshUrl && <UrlRow label="Refresh URL" url={refreshUrl} />}
        </dl>
      )}

      {/* Scopes */}
      {scopes && scopes.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-text-disabled mb-2">
            Available scopes
          </p>
          <ul className="space-y-1">
            {scopes.map((s) => (
              <li key={s.name} className="flex items-start gap-2 text-xs">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-3 h-3 text-success mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <code className="font-mono text-text-primary font-semibold">{s.name}</code>
                  {s.description && (
                    <span className="text-text-secondary"> — {s.description}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Actor({ icon, label }: { icon: typeof faUser; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
      <span className="text-[10px] font-medium text-text-secondary truncate">{label}</span>
    </div>
  );
}

function UrlRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">
        {label}
      </dt>
      <dd className="font-mono text-xs text-text-primary break-all">{url}</dd>
    </div>
  );
}
