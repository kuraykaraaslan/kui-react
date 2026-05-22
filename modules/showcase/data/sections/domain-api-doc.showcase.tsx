'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { StatusCodeBadge } from '@/modules/domains/api-doc/StatusCodeBadge';
import { HttpMethodBadge } from '@/modules/domains/api-doc/HttpMethodBadge';
import { SecurityBadge } from '@/modules/domains/api-doc/SecurityBadge';
import { SecuritySchemeBadge } from '@/modules/domains/api-doc/SecuritySchemeBadge';
import { SchemaViewer } from '@/modules/domains/api-doc/SchemaViewer';
import { ParameterTable } from '@/modules/domains/api-doc/ParameterTable';
import { ResponseCard } from '@/modules/domains/api-doc/ResponseCard';
import { CodeSamplePanel } from '@/modules/domains/api-doc/CodeSamplePanel';
import { EndpointRow } from '@/modules/domains/api-doc/EndpointRow';
import { ServerSelector } from '@/modules/domains/api-doc/ServerSelector';
import { ApiTagSection } from '@/modules/domains/api-doc/ApiTagSection';
import { OperationPanel } from '@/modules/domains/api-doc/OperationPanel';
import { AuthSchemeCard } from '@/modules/domains/api-doc/AuthSchemeCard';
import { OAuthFlowDiagram } from '@/modules/domains/api-doc/OAuthFlowDiagram';
import { ApiKeyTokenCard } from '@/modules/domains/api-doc/ApiKeyTokenCard';
import type { Operation, Parameter, ApiResponse, SchemaObject, ApiServer, ApiSpec } from '@/modules/domains/api-doc/types';

/* ─── sample data ─── */

const userSchema: SchemaObject = {
  type: 'object',
  description: 'A user account object',
  required: ['id', 'email', 'name'],
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique identifier', readOnly: true },
    email: { type: 'string', format: 'email', description: 'Email address' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    role: { type: 'string', enum: ['admin', 'editor', 'viewer'], description: 'User role' },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    active: { type: 'boolean', default: true },
  },
};

const listSchema: SchemaObject = {
  type: 'object',
  properties: {
    data: { type: 'array', items: userSchema },
    total: { type: 'integer', description: 'Total items', example: 42 },
    page: { type: 'integer', example: 1 },
    pageSize: { type: 'integer', example: 20 },
  },
};

const errorSchema: SchemaObject = {
  type: 'object',
  required: ['code', 'message'],
  properties: {
    code: { type: 'string', example: 'NOT_FOUND' },
    message: { type: 'string' },
    details: { type: 'array', items: { type: 'object' }, nullable: true },
  },
};

const sampleParameters: Parameter[] = [
  {
    parameterId: 'p1',
    name: 'userId',
    in: 'path',
    required: true,
    description: 'Unique identifier of the user',
    schema: { type: 'string', format: 'uuid' },
  },
  {
    parameterId: 'p2',
    name: 'page',
    in: 'query',
    required: false,
    description: 'Page number (1-based)',
    schema: { type: 'integer', minimum: 1, default: 1, example: 1 },
  },
  {
    parameterId: 'p3',
    name: 'pageSize',
    in: 'query',
    required: false,
    description: 'Results per page',
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 20, example: 20 },
  },
  {
    parameterId: 'p4',
    name: 'Authorization',
    in: 'header',
    required: true,
    description: 'Bearer token',
    schema: { type: 'string', pattern: '^Bearer .+$' },
  },
  {
    parameterId: 'p5',
    name: 'role',
    in: 'query',
    required: false,
    description: 'Filter by role',
    schema: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
    deprecated: true,
  },
];

const sampleResponses: ApiResponse[] = [
  {
    responseId: 'r1',
    statusCode: '200',
    description: 'Successful response',
    content: {
      'application/json': { schema: listSchema },
    },
  },
  {
    responseId: 'r2',
    statusCode: '401',
    description: 'Unauthorized — missing or invalid token',
    content: {
      'application/json': { schema: errorSchema },
    },
  },
  {
    responseId: 'r3',
    statusCode: '404',
    description: 'User not found',
    content: {
      'application/json': { schema: errorSchema },
    },
  },
  {
    responseId: 'r4',
    statusCode: '500',
    description: 'Internal server error',
  },
];

const sampleOperation: Operation = {
  operationId: 'op-list-users',
  operationKey: 'list-users',
  summary: 'List users',
  description: 'Returns a paginated list of users. Requires admin role.',
  method: 'GET',
  tags: ['Users'],
  parameters: sampleParameters,
  responses: sampleResponses,
  security: [{ BearerAuth: [] }],
  codeSamples: [
    {
      lang: 'curl',
      label: 'cURL',
      source: `curl -X GET 'https://api.example.com/v1/users?page=1&pageSize=20' \\
  -H 'Authorization: Bearer <token>' \\
  -H 'Accept: application/json'`,
    },
    {
      lang: 'javascript',
      label: 'JavaScript',
      source: `const response = await fetch('https://api.example.com/v1/users?page=1', {
  headers: {
    'Authorization': 'Bearer <token>',
    'Accept': 'application/json',
  },
});
const data = await response.json();`,
    },
    {
      lang: 'python',
      label: 'Python',
      source: `import requests

response = requests.get(
    'https://api.example.com/v1/users',
    params={'page': 1, 'pageSize': 20},
    headers={'Authorization': 'Bearer <token>'},
)
data = response.json()`,
    },
  ],
};

const postOperation: Operation = {
  operationId: 'op-create-user',
  operationKey: 'create-user',
  summary: 'Create user',
  description: 'Creates a new user account.',
  method: 'POST',
  tags: ['Users'],
  parameters: [sampleParameters[3]],
  requestBody: {
    requestBodyId: 'rb1',
    required: true,
    description: 'New user payload',
    content: {
      'application/json': { schema: userSchema },
    },
  },
  responses: [
    { responseId: 'r5', statusCode: '201', description: 'User created', content: { 'application/json': { schema: userSchema } } },
    { responseId: 'r6', statusCode: '400', description: 'Validation error', content: { 'application/json': { schema: errorSchema } } },
    { responseId: 'r7', statusCode: '409', description: 'Email already exists', content: { 'application/json': { schema: errorSchema } } },
  ],
  codeSamples: [
    {
      lang: 'curl',
      label: 'cURL',
      source: `curl -X POST 'https://api.example.com/v1/users' \\
  -H 'Authorization: Bearer <token>' \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"jane@example.com","name":"Jane Doe","role":"editor"}'`,
    },
  ],
};

const deleteOperation: Operation = {
  operationId: 'op-delete-user',
  operationKey: 'delete-user',
  summary: 'Delete user',
  method: 'DELETE',
  tags: ['Users'],
  parameters: [sampleParameters[0], sampleParameters[3]],
  responses: [
    { responseId: 'r8', statusCode: '204', description: 'Deleted successfully' },
    { responseId: 'r9', statusCode: '404', description: 'User not found', content: { 'application/json': { schema: errorSchema } } },
  ],
  deprecated: true,
};

const sampleServers: ApiServer[] = [
  { serverId: 'srv1', url: 'https://api.example.com/v1', description: 'Production', environment: 'production' },
  { serverId: 'srv2', url: 'https://staging-api.example.com/v1', description: 'Staging', environment: 'staging' },
  { serverId: 'srv3', url: 'http://localhost:3000/v1', description: 'Local dev', environment: 'development' },
];

const sampleSpec: ApiSpec = {
  specId: 'spec-1',
  openapi: '3.1.0',
  status: 'ACTIVE',
  info: {
    infoId: 'info-1',
    title: 'Example API',
    version: '1.2.0',
    description: 'A sample REST API demonstrating the ApiDocViewer component.',
    contact: { name: 'API Support', email: 'api@example.com' },
    license: { name: 'MIT' },
  },
  servers: sampleServers,
  tags: [
    { tagId: 'tag-users', name: 'Users', description: 'User management endpoints' },
    { tagId: 'tag-auth', name: 'Auth', description: 'Authentication & authorization' },
  ],
  paths: [
    {
      pathItemId: 'pi1',
      path: '/users',
      operations: [sampleOperation, postOperation],
    },
    {
      pathItemId: 'pi2',
      path: '/users/{userId}',
      operations: [deleteOperation],
    },
    {
      pathItemId: 'pi3',
      path: '/auth/token',
      operations: [
        {
          operationId: 'op-auth-token',
          operationKey: 'auth-token',
          summary: 'Obtain access token',
          method: 'POST',
          tags: ['Auth'],
          parameters: [],
          requestBody: {
            requestBodyId: 'rb2',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                  },
                },
              },
            },
          },
          responses: [
            {
              responseId: 'r10',
              statusCode: '200',
              description: 'Token issued',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                      expiresIn: { type: 'integer', example: 3600 },
                    },
                  },
                },
              },
            },
            { responseId: 'r11', statusCode: '401', description: 'Invalid credentials' },
          ],
        },
      ],
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: { schemeId: 'ss1', name: 'BearerAuth', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      ApiKeyAuth: { schemeId: 'ss2', name: 'ApiKeyAuth', type: 'apiKey', apiKeyName: 'X-API-Key', apiKeyIn: 'header' },
      OAuth2: { schemeId: 'ss3', name: 'OAuth2', type: 'oauth2' },
    },
  },
};

/* ─── showcase builder ─── */

export function buildApiDocDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'api-doc-status-code-badge',
      title: 'StatusCodeBadge',
      category: 'Domain',
      abbr: 'SC',
      description: 'Displays an HTTP status code with a semantic color and an optional human-readable label.',
      filePath: 'modules/domains/api-doc/StatusCodeBadge.tsx',
      sourceCode: `import { StatusCodeBadge } from '@/modules/domains/api-doc/StatusCodeBadge';

<StatusCodeBadge code={200} />
<StatusCodeBadge code={201} />
<StatusCodeBadge code={404} />
<StatusCodeBadge code={500} showLabel={false} />`,
      variants: [
        {
          title: 'All status families',
          preview: (
            <div className="flex flex-wrap gap-2">
              <StatusCodeBadge code={200} />
              <StatusCodeBadge code={201} />
              <StatusCodeBadge code={204} />
              <StatusCodeBadge code={301} />
              <StatusCodeBadge code={400} />
              <StatusCodeBadge code={401} />
              <StatusCodeBadge code={403} />
              <StatusCodeBadge code={404} />
              <StatusCodeBadge code={422} />
              <StatusCodeBadge code={429} />
              <StatusCodeBadge code={500} />
              <StatusCodeBadge code={503} />
            </div>
          ),
          code: `<StatusCodeBadge code={200} />
<StatusCodeBadge code={201} />
<StatusCodeBadge code={204} />
<StatusCodeBadge code={301} />
<StatusCodeBadge code={400} />
<StatusCodeBadge code={404} />
<StatusCodeBadge code={500} />`,
        },
        {
          title: 'Without label',
          preview: (
            <div className="flex flex-wrap gap-2">
              <StatusCodeBadge code={200} showLabel={false} />
              <StatusCodeBadge code={404} showLabel={false} />
              <StatusCodeBadge code={500} showLabel={false} />
            </div>
          ),
          code: `<StatusCodeBadge code={200} showLabel={false} />
<StatusCodeBadge code={404} showLabel={false} />
<StatusCodeBadge code={500} showLabel={false} />`,
        },
      ],
    },
    {
      id: 'api-doc-http-method-badge',
      title: 'HttpMethodBadge',
      category: 'Domain',
      abbr: 'HM',
      description: 'Color-coded badge for HTTP methods — GET, POST, PUT, PATCH, DELETE, and more.',
      filePath: 'modules/domains/api-doc/HttpMethodBadge.tsx',
      sourceCode: `import { HttpMethodBadge } from '@/modules/domains/api-doc/HttpMethodBadge';

<HttpMethodBadge method="GET" />
<HttpMethodBadge method="POST" size="lg" />`,
      variants: [
        {
          title: 'All methods — medium (default)',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'] as const).map((m) => (
                <HttpMethodBadge key={m} method={m} />
              ))}
            </div>
          ),
          code: `{(['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','TRACE'] as const).map((m) => (
  <HttpMethodBadge key={m} method={m} />
))}`,
        },
        {
          title: 'Sizes',
          preview: (
            <div className="flex flex-wrap items-center gap-3">
              <HttpMethodBadge method="GET" size="sm" />
              <HttpMethodBadge method="GET" size="md" />
              <HttpMethodBadge method="GET" size="lg" />
              <HttpMethodBadge method="DELETE" size="sm" />
              <HttpMethodBadge method="DELETE" size="md" />
              <HttpMethodBadge method="DELETE" size="lg" />
            </div>
          ),
          code: `<HttpMethodBadge method="GET" size="sm" />
<HttpMethodBadge method="GET" size="md" />
<HttpMethodBadge method="GET" size="lg" />`,
        },
      ],
    },
    {
      id: 'api-doc-security-badge',
      title: 'SecurityBadge',
      category: 'Domain',
      abbr: 'SB',
      description: 'Inline badge representing an API security scheme type with a matching icon and color.',
      filePath: 'modules/domains/api-doc/SecurityBadge.tsx',
      sourceCode: `import { SecurityBadge } from '@/modules/domains/api-doc/SecurityBadge';

<SecurityBadge type="apiKey" />
<SecurityBadge type="oauth2" name="OAuth 2.0 (custom)" />`,
      variants: [
        {
          title: 'All scheme types',
          preview: (
            <div className="flex flex-wrap gap-2">
              <SecurityBadge type="apiKey" />
              <SecurityBadge type="http" />
              <SecurityBadge type="oauth2" />
              <SecurityBadge type="openIdConnect" />
              <SecurityBadge type="mutualTLS" />
            </div>
          ),
          code: `<SecurityBadge type="apiKey" />
<SecurityBadge type="http" />
<SecurityBadge type="oauth2" />
<SecurityBadge type="openIdConnect" />
<SecurityBadge type="mutualTLS" />`,
        },
        {
          title: 'Custom names',
          preview: (
            <div className="flex flex-wrap gap-2">
              <SecurityBadge type="apiKey" name="X-API-Key" />
              <SecurityBadge type="oauth2" name="OAuth 2.0 (PKCE)" />
              <SecurityBadge type="http" name="Bearer JWT" />
            </div>
          ),
          code: `<SecurityBadge type="apiKey" name="X-API-Key" />
<SecurityBadge type="oauth2" name="OAuth 2.0 (PKCE)" />
<SecurityBadge type="http" name="Bearer JWT" />`,
        },
      ],
    },
    {
      id: 'api-doc-security-scheme-badge',
      title: 'SecuritySchemeBadge',
      category: 'Domain',
      abbr: 'SS',
      description: 'Badge variant of SecurityBadge that uses the design-system Badge component for consistent styling.',
      filePath: 'modules/domains/api-doc/SecuritySchemeBadge.tsx',
      sourceCode: `import { SecuritySchemeBadge } from '@/modules/domains/api-doc/SecuritySchemeBadge';

<SecuritySchemeBadge type="oauth2" />
<SecuritySchemeBadge type="apiKey" name="X-API-Key" size="sm" />`,
      variants: [
        {
          title: 'All scheme types',
          preview: (
            <div className="flex flex-wrap gap-2">
              <SecuritySchemeBadge type="apiKey" />
              <SecuritySchemeBadge type="http" />
              <SecuritySchemeBadge type="oauth2" />
              <SecuritySchemeBadge type="openIdConnect" />
              <SecuritySchemeBadge type="mutualTLS" />
            </div>
          ),
          code: `<SecuritySchemeBadge type="apiKey" />
<SecuritySchemeBadge type="http" />
<SecuritySchemeBadge type="oauth2" />
<SecuritySchemeBadge type="openIdConnect" />
<SecuritySchemeBadge type="mutualTLS" />`,
        },
        {
          title: 'Small size with custom names',
          preview: (
            <div className="flex flex-wrap gap-2">
              <SecuritySchemeBadge type="apiKey" name="X-API-Key" size="sm" />
              <SecuritySchemeBadge type="http" name="Bearer JWT" size="sm" />
              <SecuritySchemeBadge type="oauth2" name="Google OAuth" size="sm" />
            </div>
          ),
          code: `<SecuritySchemeBadge type="apiKey" name="X-API-Key" size="sm" />
<SecuritySchemeBadge type="http" name="Bearer JWT" size="sm" />
<SecuritySchemeBadge type="oauth2" name="Google OAuth" size="sm" />`,
        },
      ],
    },
    {
      id: 'api-doc-schema-viewer',
      title: 'SchemaViewer',
      category: 'Domain',
      abbr: 'SV',
      description: 'Interactive JSON Schema tree viewer with type coloring, constraint display, and collapsible nodes.',
      filePath: 'modules/domains/api-doc/SchemaViewer.tsx',
      sourceCode: `import { SchemaViewer } from '@/modules/domains/api-doc/SchemaViewer';

<SchemaViewer schema={userSchema} title="User" />`,
      variants: [
        {
          title: 'Object schema',
          preview: <SchemaViewer schema={userSchema} title="User" />,
          code: `const userSchema = {
  type: 'object',
  required: ['id', 'email', 'name'],
  properties: {
    id: { type: 'string', format: 'uuid', readOnly: true },
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
    active: { type: 'boolean', default: true },
  },
};

<SchemaViewer schema={userSchema} title="User" />`,
        },
        {
          title: 'Nested / array schema',
          preview: <SchemaViewer schema={listSchema} title="PaginatedUsers" />,
          code: `const listSchema = {
  type: 'object',
  properties: {
    data: { type: 'array', items: userSchema },
    total: { type: 'integer', description: 'Total items' },
    page: { type: 'integer' },
    pageSize: { type: 'integer' },
  },
};

<SchemaViewer schema={listSchema} title="PaginatedUsers" />`,
        },
      ],
    },
    {
      id: 'api-doc-parameter-table',
      title: 'ParameterTable',
      category: 'Domain',
      abbr: 'PT',
      description: 'Table displaying API parameters with location (path/query/header/cookie), type, required flag, and description.',
      filePath: 'modules/domains/api-doc/ParameterTable.tsx',
      sourceCode: `import { ParameterTable } from '@/modules/domains/api-doc/ParameterTable';

<ParameterTable parameters={parameters} />`,
      variants: [
        {
          title: 'Mixed parameter locations',
          preview: <ParameterTable parameters={sampleParameters} />,
          code: `<ParameterTable parameters={[
  { parameterId: 'p1', name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
  { parameterId: 'p2', name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { parameterId: 'p3', name: 'Authorization', in: 'header', required: true, schema: { type: 'string' } },
  { parameterId: 'p4', name: 'role', in: 'query', schema: { type: 'string', enum: ['admin','editor','viewer'] }, deprecated: true },
]} />`,
        },
        {
          title: 'Path params only',
          preview: (
            <ParameterTable
              parameters={[
                { parameterId: 'pp1', name: 'orgId', in: 'path', required: true, description: 'Organisation ID', schema: { type: 'string', format: 'uuid' } },
                { parameterId: 'pp2', name: 'projectId', in: 'path', required: true, description: 'Project ID', schema: { type: 'string', format: 'uuid' } },
              ]}
            />
          ),
          code: `<ParameterTable parameters={[
  { parameterId: 'pp1', name: 'orgId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
  { parameterId: 'pp2', name: 'projectId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
]} />`,
        },
      ],
    },
    {
      id: 'api-doc-response-card',
      title: 'ResponseCard',
      category: 'Domain',
      abbr: 'RC',
      description: 'Collapsible card for a single API response showing the status code, description, and response body schema.',
      filePath: 'modules/domains/api-doc/ResponseCard.tsx',
      sourceCode: `import { ResponseCard } from '@/modules/domains/api-doc/ResponseCard';

<ResponseCard response={response} defaultOpen />`,
      variants: [
        {
          title: 'Success response (expanded)',
          preview: (
            <ResponseCard
              response={{ responseId: 'r1', statusCode: '200', description: 'Successful response', content: { 'application/json': { schema: userSchema } } }}
              defaultOpen
            />
          ),
          code: `<ResponseCard
  response={{
    statusCode: '200',
    description: 'Successful response',
    content: { 'application/json': { schema: userSchema } },
  }}
  defaultOpen
/>`,
        },
        {
          title: 'Multiple response cards',
          preview: (
            <div className="space-y-2">
              {sampleResponses.map((r) => (
                <ResponseCard key={r.responseId} response={r} defaultOpen={r.statusCode.startsWith('2')} />
              ))}
            </div>
          ),
          code: `{responses.map((r) => (
  <ResponseCard key={r.responseId} response={r} defaultOpen={r.statusCode.startsWith('2')} />
))}`,
        },
      ],
    },
    {
      id: 'api-doc-code-sample-panel',
      title: 'CodeSamplePanel',
      category: 'Domain',
      abbr: 'CP',
      description: 'Dark-themed panel showing code samples in multiple languages with tab switching and a one-click copy button.',
      filePath: 'modules/domains/api-doc/CodeSamplePanel.tsx',
      sourceCode: `import { CodeSamplePanel } from '@/modules/domains/api-doc/CodeSamplePanel';

<CodeSamplePanel samples={[
  { lang: 'curl', label: 'cURL', source: '...' },
  { lang: 'javascript', label: 'JS', source: '...' },
]} />`,
      variants: [
        {
          title: 'Multi-language sample',
          preview: (
            <CodeSamplePanel samples={sampleOperation.codeSamples!} />
          ),
          code: `<CodeSamplePanel samples={[
  { lang: 'curl', label: 'cURL', source: \`curl -X GET 'https://api.example.com/v1/users'\` },
  { lang: 'javascript', label: 'JavaScript', source: \`const res = await fetch('/users');\` },
  { lang: 'python', label: 'Python', source: \`import requests\\nr = requests.get('/users')\` },
]} />`,
        },
        {
          title: 'Single language',
          preview: (
            <CodeSamplePanel
              samples={[{
                lang: 'bash',
                label: 'Shell',
                source: `#!/bin/bash
TOKEN=$(curl -s -X POST https://api.example.com/auth/token \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"admin@example.com","password":"secret"}' | jq -r .accessToken)

curl -H "Authorization: Bearer $TOKEN" https://api.example.com/v1/users`,
              }]}
            />
          ),
          code: `<CodeSamplePanel samples={[{ lang: 'bash', label: 'Shell', source: '...' }]} />`,
        },
      ],
    },
    {
      id: 'api-doc-endpoint-row',
      title: 'EndpointRow',
      category: 'Domain',
      abbr: 'ER',
      description: 'Collapsible row representing a single API endpoint — shows the method badge, path, summary, and expands to an OperationPanel.',
      filePath: 'modules/domains/api-doc/EndpointRow.tsx',
      sourceCode: `import { EndpointRow } from '@/modules/domains/api-doc/EndpointRow';

<EndpointRow path="/users" operation={getOperation} defaultOpen />
<EndpointRow path="/users" operation={postOperation} />`,
      variants: [
        {
          title: 'GET endpoint (expanded)',
          preview: <EndpointRow path="/users" operation={sampleOperation} defaultOpen />,
          code: `<EndpointRow
  path="/users"
  operation={{ method: 'GET', summary: 'List users', ... }}
  defaultOpen
/>`,
        },
        {
          title: 'Multiple endpoints',
          preview: (
            <div className="space-y-2">
              <EndpointRow path="/users" operation={sampleOperation} />
              <EndpointRow path="/users" operation={postOperation} />
              <EndpointRow path="/users/{userId}" operation={deleteOperation} />
            </div>
          ),
          code: `<EndpointRow path="/users" operation={getOp} />
<EndpointRow path="/users" operation={postOp} />
<EndpointRow path="/users/{userId}" operation={deleteOp} />`,
        },
      ],
    },
    {
      id: 'api-doc-server-selector',
      title: 'ServerSelector',
      category: 'Domain',
      abbr: 'SE',
      description: 'Dropdown for selecting the active API server, with environment badges (production, staging, development, sandbox).',
      filePath: 'modules/domains/api-doc/ServerSelector.tsx',
      sourceCode: `import { ServerSelector } from '@/modules/domains/api-doc/ServerSelector';

<ServerSelector servers={servers} />`,
      variants: [
        {
          title: 'Multi-environment servers',
          preview: (
            <div className="max-w-sm">
              <ServerSelector servers={sampleServers} />
            </div>
          ),
          code: `<ServerSelector servers={[
  { serverId: 'srv1', url: 'https://api.example.com/v1', environment: 'production' },
  { serverId: 'srv2', url: 'https://staging-api.example.com/v1', environment: 'staging' },
  { serverId: 'srv3', url: 'http://localhost:3000/v1', environment: 'development' },
]} />`,
        },
        {
          title: 'Single server',
          preview: (
            <div className="max-w-sm">
              <ServerSelector servers={[{ serverId: 'srv1', url: 'https://api.example.com/v1', description: 'Production API', environment: 'production' }]} />
            </div>
          ),
          code: `<ServerSelector servers={[
  { serverId: 'srv1', url: 'https://api.example.com/v1', environment: 'production' },
]} />`,
        },
      ],
    },
    {
      id: 'api-doc-api-tag-section',
      title: 'ApiTagSection',
      category: 'Domain',
      abbr: 'TS',
      description: 'Collapsible section grouping endpoints under a named tag — the primary navigation unit in API documentation.',
      filePath: 'modules/domains/api-doc/ApiTagSection.tsx',
      sourceCode: `import { ApiTagSection } from '@/modules/domains/api-doc/ApiTagSection';

<ApiTagSection tag={tag} paths={paths} defaultOpen />`,
      variants: [
        {
          title: 'Users tag (expanded)',
          preview: (
            <ApiTagSection
              tag={{ tagId: 'tag-users', name: 'Users', description: 'User management endpoints' }}
              paths={[
                { pathItem: { pathItemId: 'pi1', path: '/users', operations: [sampleOperation, postOperation] } },
                { pathItem: { pathItemId: 'pi2', path: '/users/{userId}', operations: [deleteOperation] } },
              ]}
              defaultOpen
            />
          ),
          code: `<ApiTagSection
  tag={{ tagId: 'tag-users', name: 'Users', description: 'User management endpoints' }}
  paths={[
    { pathItem: { path: '/users', operations: [getOp, postOp] } },
    { pathItem: { path: '/users/{userId}', operations: [deleteOp] } },
  ]}
  defaultOpen
/>`,
        },
        {
          title: 'Collapsed by default',
          preview: (
            <ApiTagSection
              tag={{ tagId: 'tag-auth', name: 'Auth', description: 'Authentication endpoints' }}
              paths={[
                { pathItem: { pathItemId: 'pi3', path: '/auth/token', operations: sampleSpec.paths[2].operations ?? [] } },
              ]}
              defaultOpen={false}
            />
          ),
          code: `<ApiTagSection
  tag={{ name: 'Auth', description: 'Authentication endpoints' }}
  paths={[{ pathItem: { path: '/auth/token', operations: [postOp] } }]}
  defaultOpen={false}
/>`,
        },
      ],
    },
    {
      id: 'api-doc-operation-panel',
      title: 'OperationPanel',
      category: 'Domain',
      abbr: 'OP',
      description: 'Tabbed panel showing all details of an API operation — parameters, request body, responses, and code samples.',
      filePath: 'modules/domains/api-doc/OperationPanel.tsx',
      sourceCode: `import { OperationPanel } from '@/modules/domains/api-doc/OperationPanel';

<OperationPanel operation={operation} />`,
      variants: [
        {
          title: 'GET with parameters and code samples',
          preview: <OperationPanel operation={sampleOperation} />,
          code: `<OperationPanel operation={{
  method: 'GET',
  summary: 'List users',
  parameters: [...],
  responses: [...],
  codeSamples: [...],
}} />`,
          layout: 'stack',
        },
        {
          title: 'POST with request body',
          preview: <OperationPanel operation={postOperation} />,
          code: `<OperationPanel operation={{
  method: 'POST',
  summary: 'Create user',
  requestBody: { required: true, content: { 'application/json': { schema: userSchema } } },
  responses: [...],
}} />`,
          layout: 'stack',
        },
      ],
    },
    {
      id: 'api-doc-auth-scheme-card',
      title: 'AuthSchemeCard',
      category: 'Domain',
      abbr: 'AK',
      description: 'Selectable card describing a single auth scheme (apiKey, http, oauth2, openIdConnect, mutualTLS).',
      filePath: 'modules/domains/api-doc/AuthSchemeCard.tsx',
      sourceCode: `import { AuthSchemeCard } from '@/modules/domains/api-doc/AuthSchemeCard';
<AuthSchemeCard name="Bearer JWT" type="http" />`,
      variants: [
        {
          title: 'OAuth recommended',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <AuthSchemeCard
                name="OAuth 2.0"
                type="oauth2"
                description="Industry-standard authorisation framework. Suitable for third-party integrations."
                recommended
                metaItems={[
                  { label: 'Header', value: 'Authorization' },
                  { label: 'Flows', value: 'Authorization Code' },
                ]}
                href="#"
              />
            </div>
          ),
          code: `<AuthSchemeCard name="OAuth 2.0" type="oauth2" recommended description="…" href="/auth/oauth2" />`,
        },
        {
          title: 'API key',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <AuthSchemeCard
                name="X-API-Key"
                type="apiKey"
                description="Simple static-key authentication. Best for server-to-server use only."
                metaItems={[
                  { label: 'In', value: 'header' },
                  { label: 'Name', value: 'X-API-Key' },
                ]}
              />
            </div>
          ),
          code: `<AuthSchemeCard name="X-API-Key" type="apiKey" description="…" />`,
        },
      ],
    },
    {
      id: 'api-doc-oauth-flow-diagram',
      title: 'OAuthFlowDiagram',
      category: 'Domain',
      abbr: 'OF',
      description: 'Visual walkthrough of an OAuth 2.0 flow with actors, numbered steps, endpoints, and scopes.',
      filePath: 'modules/domains/api-doc/OAuthFlowDiagram.tsx',
      sourceCode: `import { OAuthFlowDiagram } from '@/modules/domains/api-doc/OAuthFlowDiagram';
<OAuthFlowDiagram flow="authorizationCode" tokenUrl="…" authorizationUrl="…" scopes={[…]} />`,
      variants: [
        {
          title: 'Authorization Code',
          layout: 'stack',
          preview: (
            <div className="max-w-xl">
              <OAuthFlowDiagram
                flow="authorizationCode"
                authorizationUrl="https://example.com/oauth/authorize"
                tokenUrl="https://example.com/oauth/token"
                refreshUrl="https://example.com/oauth/refresh"
                scopes={[
                  { name: 'read:users', description: 'Read user data' },
                  { name: 'write:users', description: 'Create or update users' },
                ]}
              />
            </div>
          ),
          code: `<OAuthFlowDiagram flow="authorizationCode" tokenUrl="…" authorizationUrl="…" scopes={[…]} />`,
        },
        {
          title: 'Client Credentials (server-to-server)',
          layout: 'stack',
          preview: (
            <div className="max-w-xl">
              <OAuthFlowDiagram
                flow="clientCredentials"
                tokenUrl="https://example.com/oauth/token"
                scopes={[{ name: 'admin', description: 'Full administrative access' }]}
              />
            </div>
          ),
          code: `<OAuthFlowDiagram flow="clientCredentials" tokenUrl="…" />`,
        },
      ],
    },
    {
      id: 'api-doc-api-key-token-card',
      title: 'ApiKeyTokenCard',
      category: 'Domain',
      abbr: 'AT',
      description: 'Card for a single API key — reveal/hide, copy-to-clipboard, env badge, last-used metadata.',
      filePath: 'modules/domains/api-doc/ApiKeyTokenCard.tsx',
      sourceCode: `import { ApiKeyTokenCard } from '@/modules/domains/api-doc/ApiKeyTokenCard';
<ApiKeyTokenCard name="Production key" token="sk_live_…" environment="production" />`,
      variants: [
        {
          title: 'Production key',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <ApiKeyTokenCard
                name="Production key"
                token="sk_live_5fXa92bc8eP1q7n2yKv8u9Hd"
                environment="production"
                createdAt={new Date('2026-03-12')}
                lastUsedAt={new Date('2026-05-16')}
                scopes={['users:read', 'users:write', 'webhooks:manage']}
              />
            </div>
          ),
          code: `<ApiKeyTokenCard name="Production key" token="sk_live_…" environment="production" scopes={[…]} />`,
        },
        {
          title: 'Staging key with revoke',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <ApiKeyTokenCard
                name="Staging key"
                token="demo_staging_token_REDACTED"
                environment="staging"
                createdAt={new Date('2026-04-01')}
                lastUsedAt={null}
                scopes={['users:read']}
                onRevoke={() => {}}
              />
            </div>
          ),
          code: `<ApiKeyTokenCard name="Staging key" token="sk_test_…" environment="staging" onRevoke={…} />`,
        },
      ],
    },
  ];
}
