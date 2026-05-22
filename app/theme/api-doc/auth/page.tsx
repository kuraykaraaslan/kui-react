import type { Metadata } from 'next';
import { AuthSchemeCard } from '@/modules/domains/api-doc/AuthSchemeCard';
import { OAuthFlowDiagram } from '@/modules/domains/api-doc/OAuthFlowDiagram';
import { ApiKeyTokenCard } from '@/modules/domains/api-doc/ApiKeyTokenCard';
import { CodeSamplePanel } from '@/modules/domains/api-doc/CodeSamplePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Authentication', THEME_TITLES['api-doc']),
  description: 'Authentication and authorization schemes supported by the API.',
};

const AUTH_CODE_SAMPLE = `// Step 1 · Redirect the user to the authorization endpoint
window.location.href = 'https://api.example.com/oauth/authorize?' + new URLSearchParams({
  response_type: 'code',
  client_id:     'YOUR_CLIENT_ID',
  redirect_uri:  'https://app.example.com/callback',
  scope:         'read:users write:users',
  state:         crypto.randomUUID(),
});

// Step 2 · Exchange the code for a token (on your server)
const res = await fetch('https://api.example.com/oauth/token', {
  method:  'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body:    new URLSearchParams({
    grant_type:    'authorization_code',
    code:          codeFromQuery,
    redirect_uri:  'https://app.example.com/callback',
    client_id:     'YOUR_CLIENT_ID',
    client_secret: process.env.CLIENT_SECRET!,
  }),
});

const { access_token, refresh_token, expires_in } = await res.json();`;

const API_KEY_CURL = `# Authenticate every request with the X-API-Key header
curl -X GET https://api.example.com/v1/users \\
  -H "X-API-Key: sk_live_5fXa92bc8eP1q7n2yKv8u9Hd" \\
  -H "Accept: application/json"`;

export default function ApiDocAuthPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      {/* Page header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-disabled">
          <FontAwesomeIcon icon={faShield} className="w-3 h-3" aria-hidden="true" />
          Authentication
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Authenticate your requests</h1>
        <p className="text-text-secondary max-w-2xl">
          The API supports three authentication schemes. Pick the one that matches your integration model.
          OAuth 2.0 is recommended for user-facing applications; API keys for server-to-server use only.
        </p>
      </header>

      {/* Scheme picker */}
      <section aria-labelledby="schemes">
        <h2 id="schemes" className="text-lg font-bold text-text-primary mb-4">
          Supported schemes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AuthSchemeCard
            name="OAuth 2.0"
            type="oauth2"
            description="Industry-standard delegated authorisation. Recommended for any app acting on a user's behalf."
            recommended
            metaItems={[
              { label: 'Header', value: 'Authorization' },
              { label: 'Flows', value: 'Authorization Code' },
            ]}
            href="#oauth-flow"
          />
          <AuthSchemeCard
            name="X-API-Key"
            type="apiKey"
            description="Simple static-key auth. Best for trusted server-to-server traffic. Rotate keys frequently."
            metaItems={[
              { label: 'In', value: 'header' },
              { label: 'Name', value: 'X-API-Key' },
            ]}
            href="#api-key"
          />
          <AuthSchemeCard
            name="Bearer JWT"
            type="http"
            description="Send a short-lived JWT in the Authorization header. Useful behind your own SSO."
            metaItems={[
              { label: 'Scheme', value: 'bearer' },
              { label: 'Format', value: 'JWT' },
            ]}
            href="#bearer"
          />
        </div>
      </section>

      {/* OAuth flow */}
      <section id="oauth-flow" aria-labelledby="oauth-h" className="space-y-4 scroll-mt-20">
        <h2 id="oauth-h" className="text-lg font-bold text-text-primary">
          OAuth 2.0 Authorization Code
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <OAuthFlowDiagram
            flow="authorizationCode"
            authorizationUrl="https://api.example.com/oauth/authorize"
            tokenUrl="https://api.example.com/oauth/token"
            refreshUrl="https://api.example.com/oauth/refresh"
            scopes={[
              { name: 'read:users', description: 'Read user profiles' },
              { name: 'write:users', description: 'Create or update users' },
              { name: 'webhooks:manage', description: 'Configure outgoing webhooks' },
              { name: 'admin', description: 'Full administrative access (restricted)' },
            ]}
          />
          <CodeSamplePanel
            samples={[
              { lang: 'js', label: 'JavaScript', source: AUTH_CODE_SAMPLE },
            ]}
          />
        </div>
      </section>

      {/* API keys */}
      <section id="api-key" aria-labelledby="key-h" className="space-y-4 scroll-mt-20">
        <h2 id="key-h" className="text-lg font-bold text-text-primary">
          API keys
        </h2>
        <p className="text-sm text-text-secondary max-w-3xl">
          You can issue multiple API keys per workspace. Each key is scoped and revocable.
          Never embed a key in client-side code or commit one to source control.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <ApiKeyTokenCard
            name="Production key"
            token="sk_live_5fXa92bc8eP1q7n2yKv8u9Hd"
            environment="production"
            createdAt={new Date('2026-03-12')}
            lastUsedAt={new Date('2026-05-16')}
            scopes={['users:read', 'users:write', 'webhooks:manage']}
          />
          <ApiKeyTokenCard
            name="Staging key"
            token="demo_staging_token_REDACTED"
            environment="staging"
            createdAt={new Date('2026-04-01')}
            lastUsedAt={null}
            scopes={['users:read']}
          />
        </div>

        <CodeSamplePanel
          samples={[{ lang: 'shell', label: 'cURL', source: API_KEY_CURL }]}
        />

        <div className="rounded-lg border border-warning/40 bg-warning-subtle text-warning p-4 flex items-start gap-3">
          <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold">Treat API keys as passwords.</p>
            <p className="mt-1 text-warning/90">
              Rotate them every 90 days, scope them tightly, and revoke any key that leaks into logs,
              error reports, or version control.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
