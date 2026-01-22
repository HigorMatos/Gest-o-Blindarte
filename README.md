# Gest-o-Blindarte MVP

Monorepo com **NestJS + Prisma** (API) e **Next.js** (Web), usando **pnpm workspaces**.

## Requisitos
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

## Setup rápido
```bash
pnpm install

docker compose up -d

pnpm --filter api prisma:migrate
pnpm --filter api prisma:seed

pnpm dev
```

### Acesso
- API: http://localhost:3001/docs
- Web: http://localhost:3000

### Usuário admin (seed)
- **email:** admin@gesto.local
- **senha:** admin123

## Scripts úteis
```bash
pnpm dev                # web + api
pnpm dev:api            # apenas api
pnpm dev:web            # apenas web
pnpm --filter api prisma:studio
```

## Observações
- Uploads locais ficam em `apps/api/uploads` (preparado para S3).
- O modelo permite expansão para múltiplas NFs por contrato/OS.
