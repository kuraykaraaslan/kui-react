// use-client-header — every component file under modules/ui, modules/app,
// modules/domains must start with a `'use client';` directive, per
// AGENTS.md's Component Authoring Rules. Encodes the rule that was, before
// this, enforced only by prose and by the four files phase 0 of
// docs/dev/ found violating it.
//
// Scoped to .tsx only, matching both the actual (working, building) codebase
// convention and the original phase-0 audit's own methodology
// (`find modules/ui modules/app -name '*.tsx'`) — a .ts file with no JSX
// (types, utility logic, non-component helpers) does not need the
// directive, and the codebase has many of them (XxxTypes.ts data-shape
// files, sanitize.ts, tree.ts, useFormState.ts, printTicket.ts, ...). Only
// .tsx files, which are what can actually contain the client-only React
// bits (hooks, event handlers, JSX) the directive exists for, are checked.

import path from 'node:path';

const SCOPE_RE = /[\\/]modules[\\/](ui|app|domains)[\\/]/;

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Require a 'use client' directive at the top of every modules/ui, modules/app, modules/domains file (except type/barrel/data/store files).",
    },
    schema: [],
    messages: {
      missing:
        "Missing \"'use client';\" directive. Every component file in modules/ui, modules/app, and modules/domains must start with it (AGENTS.md Component Authoring Rules, #1).",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    const normalized = filename.split(path.sep).join('/');
    if (!SCOPE_RE.test(normalized)) return {};
    if (!normalized.endsWith('.tsx')) return {};

    return {
      Program(node) {
        const first = node.body[0];
        const hasDirective =
          first &&
          first.type === 'ExpressionStatement' &&
          first.expression.type === 'Literal' &&
          first.expression.value === 'use client';
        if (!hasDirective) {
          context.report({ node, messageId: 'missing' });
        }
      },
    };
  },
};

export default rule;
