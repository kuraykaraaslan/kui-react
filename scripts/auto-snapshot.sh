#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

OUT="public/registry/components.json"
SRC_DIRS=(modules/showcase modules/registry modules/ui)

if [ -f "$OUT" ] && [ -z "$(find "${SRC_DIRS[@]}" -newer "$OUT" -type f \( -name '*.ts' -o -name '*.tsx' \) -print -quit 2>/dev/null)" ]; then
  exit 0
fi

if curl -sf --max-time 1 http://localhost:3000/llms.txt 2>/dev/null | grep -q kui-react; then
  npm run registry:snapshot --silent
else
  echo "[auto-snapshot] sources changed but no dev server on :3000 — skipping. Run 'npm run dev' and retry." >&2
  exit 0
fi
