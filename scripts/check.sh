#!/usr/bin/env bash

set -euo pipefail

echo "==> lint"
pnpm lint

echo "==> typecheck"
pnpm typecheck

echo "==> unit tests"
pnpm test:unit

echo "==> build"
pnpm build

echo "==> openspec validate"
openspec validate --all
