# Goldly MVP Monorepo

Goldly is a second-hand precious metals marketplace for gold/silver bars and coins only.

## Monorepo Structure

- `apps/mobile` – React Native TypeScript mobile app (shared UI oriented)
- `apps/web` – React web marketplace
- `apps/admin` – React admin dashboard
- `packages/shared` – shared types, zod schemas, and utility constants
- `server` – Express + Socket.IO + Prisma API
- `infra` – docker-compose for PostgreSQL + MinIO local storage

## Core Marketplace Rules

- Only metal types: `GOLD` and `SILVER`
- Only item types: `BAR` and `COIN`
- Payments and shipping are **outside** the app
- KYC and listing approval must be done by admins before trust/live visibility

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## IMPORTANT: Run commands from the repo root

Your errors indicate commands were run from `C:\Users\deept` instead of the cloned project folder.

### Correct sequence on Windows (PowerShell or CMD)

```bat
cd C:\path\to\Goldly
npm install
copy server\.env.example server\.env
npm run infra:up
npm run prisma:migrate -w @goldly/server
npm run prisma:seed -w @goldly/server
npm run dev -w @goldly/server
```

In a second terminal:

```bat
cd C:\path\to\Goldly
npm run dev -w @goldly/web
```

In a third terminal:

```bat
cd C:\path\to\Goldly
npm run dev -w @goldly/admin
```

## Quick Start (cross-platform)

```bash
cp server/.env.example server/.env
npm install
npm run infra:up
npm run prisma:migrate -w @goldly/server
npm run prisma:seed -w @goldly/server
npm run dev -w @goldly/server
npm run dev -w @goldly/web
npm run dev -w @goldly/admin
npm run dev -w @goldly/mobile
```

## One-command bootstrap

```bash
npm run bootstrap
```

This starts infra and applies/seeds DB.

## Testing

```bash
npm run test -w @goldly/server
```

## Common Troubleshooting

### 1) `ENOENT ... C:\Users\<you>\package.json`
You are not in the project directory.

Fix:

```bat
cd C:\path\to\Goldly
npm install
```

### 2) `cd infra && docker compose up -d` path not found
Same root cause: wrong current directory.

Fix:

```bat
cd C:\path\to\Goldly
npm run infra:up
```

### 3) Docker command not found
Install Docker Desktop and ensure `docker` is in PATH.

### 4) Port already in use
Stop local services using ports `5432`, `9000`, `9001` or edit `infra/docker-compose.yml`.

## Security / Validation

- JWT access + refresh tokens
- Role-based authorization (`USER`, `ADMIN`)
- `zod` request validation
- `helmet`, `cors`, `express-rate-limit`
- File upload limits + mime checks

## Spot Price Strategy

- Spot price API abstraction via `SpotPriceProvider`
- Cache TTL: 60 seconds server-side

## WebSocket Events (Socket.IO)

- `chat:join` – join conversation room
- `chat:message` – send message
- `chat:new-message` – receive new message in room

## API Highlights

- `/api/auth` signup/login/refresh/logout
- `/api/users/me` profile + settings
- `/api/kyc` submit KYC + status
- `/api/listings` CRUD + browse filters + mark sold
- `/api/reviews` create listing reviews
- `/api/notifications` in-app notifications feed
- `/api/admin/*` approvals, reports, moderation, audit
