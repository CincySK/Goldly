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

## Sync your local branch with GitHub first

If you still see Prisma relation errors that don't match this README, your local branch is likely behind.

```bat
git fetch origin
git checkout Goldly
git pull --rebase origin Goldly
```

Then verify the latest commit and clean generated artifacts:

```bat
git log --oneline -n 3
del /q server\tests\*.js
```


Your errors indicate commands were run from `C:\Users\deept` instead of the cloned project folder.

### Correct sequence on Windows (PowerShell or CMD)

### Branch sanity check (run this first)

```bat
npm run doctor -w @goldly/server
```

If this command fails with missing scripts/relations, your branch is older than the latest fixes and Prisma will fail until you sync to the updated branch/PR.


If you get `Missing script: doctor`, your local branch is older than the latest fixes.
Run these checks:

```bat
type server\package.json
dir server\scripts
```

Expected in `server/package.json` scripts: `setup:env`, `prisma:setup`, `doctor`.
If missing, your local checkout does not include the updated commits yet.

```bat
cd C:\path\to\Goldly
npm install
npm run setup:env -w @goldly/server
npm run infra:up
npm run prisma:setup -w @goldly/server
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


### 0) If `npm run setup:env -w @goldly/server` fails
The file exists in current versions. If it is missing locally, update your branch first:

```bat
git pull
```

Then run:

```bat
npm run setup:env -w @goldly/server
```

### Recommended command order (after sync)

```bat
npm run setup:env -w @goldly/server
npm run prisma:generate -w @goldly/server
npm run prisma:setup -w @goldly/server
npm run prisma:seed -w @goldly/server
```


### If `server/.env.example` is missing
Use the setup script instead of manual copy. It will:
1) copy from `server/.env.example` when present, or
2) create `server/.env` with safe local defaults.

```bat
npm run setup:env -w @goldly/server
```

## Quick Start (cross-platform)

```bash
npm run setup:env -w @goldly/server
npm install
npm run infra:up
npm run prisma:setup -w @goldly/server
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

## Demo credentials

- User: `user@goldly.local` / `User12345!`
- Admin: `admin@goldly.local` / `Admin1234!`

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
Install Docker Desktop and ensure `docker` is in PATH, then restart terminal and run `docker --version`.

If Docker cannot be installed, use a hosted PostgreSQL and set `DATABASE_URL` manually in `server/.env` to continue backend-only testing.

### 4) Port already in use
Stop local services using ports `5432`, `9000`, `9001` or edit `infra/docker-compose.yml`.


### 5) Prisma relation validation (P1012)
If you still see old schema validation errors, ensure your local repo is up-to-date and regenerate Prisma client:

```bat
git pull
npm run prisma:generate -w @goldly/server
```

### 6) `@prisma/client did not initialize yet`
Run generate before seed/migrate (already handled by scripts in latest repo):

```bat
npm run prisma:setup -w @goldly/server
npm run prisma:seed -w @goldly/server
```


### 7) `Missing script: setup:env` or `prisma:setup`
Your branch is on an older commit. Verify with:

```bat
npm run --workspace=@goldly/server
```

Then sync to the latest branch/PR and rerun `npm run doctor -w @goldly/server`.


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
