# RulesetEditor

- **id:** `iot-ruleset-editor`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/ruleset/RulesetEditor/index.tsx`
- **status:** stable
- **since:** 2026-05

Drag-and-drop visual rule chain editor — build telemetry pipelines with Trigger, Filter, Switch, Transform, and Action nodes.

## Variants

### With pre-loaded chain

```tsx
<RulesetEditor
  initialNodes={nodes}
  initialEdges={edges}
/>
```

### Empty canvas (editable)

```tsx
<RulesetEditor />
```

## Full source

```tsx
'use client';
// Drag nodes from palette onto the canvas.
// Click output ports (filled) → input ports (hollow) to wire them.
// Click an edge to delete it. Select a node to reveal the delete button.

export function RulesetEditor({ initialNodes, initialEdges, readOnly, className }) {
  // ...
}
```
