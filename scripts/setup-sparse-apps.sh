#!/usr/bin/env bash
set -euo pipefail

# Configure sparse-checkout for the apps submodule to include only selected apps.
# Default selection: _template and demo-showcase

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SUBMODULE_DIR="$ROOT_DIR/apps"

if [ ! -d "$SUBMODULE_DIR/.git" ]; then
  echo "[ERROR] apps submodule is not initialized." >&2
  echo "Run: git submodule update --init --recursive" >&2
  exit 1
fi

echo "[INFO] Enabling sparse-checkout for apps submodule..."
(
  cd "$SUBMODULE_DIR"
  git sparse-checkout init --cone
  git sparse-checkout set _template demo-showcase
  echo "[OK] Sparse tree set to: _template demo-showcase"
  echo "[HINT] To include 3D-template later: git sparse-checkout set _template demo-showcase 3D-template"
)

echo "[DONE] apps sparse-checkout configured."

