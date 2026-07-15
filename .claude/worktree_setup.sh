#!/usr/bin/env bash
# idempotent: skip install when the lockfile hash matches the last run
set -euo pipefail

command -v direnv >/dev/null && direnv allow .

hash_file="node_modules/.setup_hash"
lock_hash=$(shasum -a 256 package-lock.json | cut -d' ' -f1)
if [[ -f "$hash_file" && "$(cat "$hash_file")" == "$lock_hash" ]]; then
  exit 0
fi

# npm ci wipes node_modules, so the hash is written after; direnv exec pins
# the install to the project flake toolchain instead of the ambient node
if command -v direnv >/dev/null; then
  direnv exec . npm ci
else
  npm ci
fi
echo "$lock_hash" > "$hash_file"
