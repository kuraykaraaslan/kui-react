// no-default-export — modules/ui, modules/app, modules/domains export named
// functions only (AGENTS.md Component Authoring Rules, #2), so tree-shaking
// and IDE auto-import both work predictably. The one known legitimate
// exception (a next/dynamic wrapper, e.g. modules/domains/event/VenueLeafletMap.tsx)
// gets a normal eslint-disable-next-line comment rather than special-cased
// detection logic here — simpler, and the exception is visible in the diff
// that adds it.

const SCOPE_RE = /[\\/]modules[\\/](ui|app|domains)[\\/]/;

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid default exports in modules/ui, modules/app, modules/domains — use a named export.',
    },
    schema: [],
    messages: {
      forbidden:
        'Default exports are forbidden in modules/ui, modules/app, modules/domains (AGENTS.md Component Authoring Rules, #2). Use a named export. If this is a next/dynamic wrapper, disable this rule for the line with a comment explaining why.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (!SCOPE_RE.test(filename.split('\\').join('/'))) return {};

    return {
      ExportDefaultDeclaration(node) {
        context.report({ node, messageId: 'forbidden' });
      },
    };
  },
};

export default rule;
