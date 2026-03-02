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

## Quick Start

```bash
cp server/.env.example server/.env
npm install
cd infra && docker compose up -d
cd ..
npm run prisma:migrate -w @goldly/server
npm run prisma:seed -w @goldly/server
npm run dev -w @goldly/server
npm run dev -w @goldly/web
npm run dev -w @goldly/admin
npm run dev -w @goldly/mobile
```

## Testing

```bash
npm run test -w @goldly/server
```

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

