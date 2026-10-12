/**
 * The script API of the automation `logic.script` block, as the editor shows it (phase 06 §6.4 and §6.5 of
 * next-boilerplate, and the router's own help for the same block): the signature line over the code field and the
 * reference in the node panel's Help tab. JavaScript only. One list, so the line and the help cannot drift apart.
 * English markdown, drawn by `help/markdown.tsx` (escaped).
 */

/** the name a code param carries in `ParamSpec.api` when it is such a script */
export const SCRIPT_API = 'automation-script';

/** what the script gets and what it may return, in one read-only line */
export const SCRIPT_SIGNATURE = 'msg, node, context, flow, global, env  →  return msg | [a, b] | [[a, b]] | "label" | nothing';

export const SCRIPT_API_HELP = `# Script API

The code runs once for each message, in an isolated JavaScript sandbox with no network, no files and no timers.

## What the code sees

| Name | What it is |
|---|---|
| \`msg\` | the message, a copy you may change; \`msg.metadata\` is writable except the system fields, \`msg.msgType\` and \`msg.originator\` are read only |
| \`node.send(msg)\` | send a message on output 1 at once (\`node.send([a, b])\` picks outputs as a return does) |
| \`node.status({ fill, shape, text })\` | the status shown under the block |
| \`node.warn(value)\`, \`node.error(text)\` | write to the block's log; they never reach the server log |
| \`context\`, \`flow\`, \`global\` | \`get("key")\` and \`set("key", value)\`: this block, this flow, all flows |
| \`env.get(name)\` | a flow parameter |
| \`console.log(value)\` | the same log as \`node.warn\` |

## What it may return

- \`return msg\` sends the message on output 1.
- \`return [a, b]\` sends \`a\` on output 1 and \`b\` on output 2, up to 4 outputs; \`null\` in the list sends nothing there.
- \`return [[a, b]]\` sends both on output 1.
- \`return "label"\` sends the incoming message on the output with that name.
- Returning nothing sends nothing: the message stops here.

## Helpers

- \`bytes\`: \`fromHex\`, \`toHex\`, \`fromBase64\`, \`toBase64\`, \`sha256\`, \`toText\`, \`fromText\`, \`readUint\`, \`readInt\`, \`readFloat\`, \`writeUint\`, \`writeInt\`, \`writeFloat\`; also \`TextEncoder\` and \`TextDecoder\`.
- \`num\`: \`round(value, digits)\` rounds half up on the shortest decimal; \`toHex(value, { bytes, bigEndian, prefix })\`.
- \`bits\`: \`fromBytes\`, \`fromInt\`, \`toInt\`, \`get\`.
- \`obj\`: \`flatten(value, { separator, exclude, pathInKey })\`.
- \`time\`: \`parse\`, \`format\`, \`add\`, \`fields\` with patterns like \`yyyy-MM-dd HH:mm:ss\` and IANA zones.

## Not there

\`require\`, \`import()\`, \`eval\`, \`Function\`, \`fetch\`, timers (use a Delay block), \`process\`, \`Buffer\`, \`WebAssembly\`, \`SharedArrayBuffer\`. There is no \`util\` object. A very long script (over 8 KiB) gets a warning.
`;
