# modules/domains/api-doc

API documentation domain — OpenAPI-style endpoint, schema, parameter, and auth-scheme presentation components.

## Files

```
ApiKeyTokenCard.tsx
ApiTagSection.tsx
AuthSchemeCard.tsx
CodeSamplePanel.tsx
EndpointRow.tsx
HttpMethodBadge.tsx
OAuthFlowDiagram.tsx
OperationPanel.tsx
ParameterTable.tsx
ResponseCard.tsx
SchemaViewer.tsx
SecurityBadge.tsx
SecuritySchemeBadge.tsx
ServerSelector.tsx
StatusCodeBadge.tsx
index.ts
types.ts
```

## Parity

Shared with EJS. Counterpart: `/home/kuray/02_EJS_Components/modules/domain/api-doc/` and `views/theme/api-doc/`.

## Conventions

1. `'use client';` at top.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Types in `types.ts` (Zod schemas) — keep shape parity with the EJS counterpart.

See [/AGENTS.md](../../../AGENTS.md).
