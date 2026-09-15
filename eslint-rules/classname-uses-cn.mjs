// classname-uses-cn — a `className` value built from a template literal
// with interpolation or from `+` string concatenation must go through
// `cn()` instead (AGENTS.md Component Authoring Rules, #4: "cn() for
// classNames — no template literals, no string concatenation"). A plain
// static template literal (no interpolation, e.g. `` `flex gap-2` ``) is
// equivalent to a string and is not flagged — only ones that actually
// concatenate dynamic pieces are what the rule cares about.
//
// This does not try to detect "already wrapped in cn(...)" by walking back
// up through the expression — a template literal or `+` expression that is
// itself an *argument* to cn(...) is fine and is not what this visits (the
// violation is the raw expression appearing directly as the className
// value, not nested inside a cn() call).

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require className to be built with cn(...), not a template literal or string concatenation.',
    },
    schema: [],
    messages: {
      useCn:
        "className should be built with cn(...) from '@/libs/utils/cn', not a template literal or string concatenation (AGENTS.md Component Authoring Rules, #4).",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'className') return;
        const value = node.value;
        if (!value || value.type !== 'JSXExpressionContainer') return;

        const expr = value.expression;
        if (expr.type === 'TemplateLiteral' && expr.expressions.length > 0) {
          context.report({ node: expr, messageId: 'useCn' });
        } else if (expr.type === 'BinaryExpression' && expr.operator === '+') {
          context.report({ node: expr, messageId: 'useCn' });
        }
      },
    };
  },
};

export default rule;
