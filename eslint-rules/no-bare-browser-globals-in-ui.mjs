// no-bare-browser-globals-in-ui — modules/ui must stay SSR-safe: a
// `window`/`document` access that runs at module-evaluation time (i.e. not
// inside any function) throws immediately on every server render.
//
// Deliberately narrow: this flags only module-scope access, not every
// window/document reference in modules/ui (13 files do that today, but
// they're all inside useEffect/handlers/guards already — this codebase
// builds and renders its 18 themes successfully, so a broader heuristic
// trying to also require an isBrowser/useEffect/handler wrapper around
// every in-function access would need to correctly recognise event
// handlers passed by reference (not just inline arrow functions) and
// existing typeof-window guards, which is exactly the kind of rule that's
// wrong 20% of the time and trains people to reach for eslint-disable
// instead of actually reading it. Module-scope access is unambiguous and
// catches the one crash-on-every-request class of bug; see
// docs/dev/phase-1-ci-and-gates.md section 1.4 for the fuller rule this
// was scoped down from, and why.

// context.getAncestors() was removed in ESLint 9's flat-config rule API —
// use context.sourceCode.getAncestors(node) instead (it now needs the node
// passed explicitly, since context no longer implicitly tracks "current").
function isInsideFunction(context, node) {
  return context.sourceCode
    .getAncestors(node)
    .some((n) => n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid module-scope (outside any function) access to window/document in modules/ui — throws on every server render.',
    },
    schema: [],
    messages: {
      bare: '{{name}} accessed at module scope (outside any function) in modules/ui — this throws on every server render. Move the access inside a function (a component, a useEffect, an event handler) or guard it with isBrowser from @/libs/utils/isBrowser.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (!/[\\/]modules[\\/]ui[\\/][^\\/]*\.tsx?$/.test(filename.split('\\').join('/'))) return {};

    return {
      'MemberExpression > Identifier.object[name=/^(window|document)$/]'(node) {
        if (isInsideFunction(context, node)) return;
        context.report({ node, messageId: 'bare', data: { name: node.name } });
      },
    };
  },
};

export default rule;
