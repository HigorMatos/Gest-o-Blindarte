#!/usr/bin/env bash
set -euo pipefail

pnpm install

docker compose up -d

pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
pnpm --filter api prisma:seed

pnpm dev
