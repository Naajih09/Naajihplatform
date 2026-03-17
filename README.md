# Naajih Platform

Naajih Platform is a B2B networking and pitch platform connecting entrepreneurs with investors. It supports verified profiles, pitch discovery, connections, messaging, and a learning academy for aspiring founders.

## Apps

- `apps/user-web`: User-facing web app (founders, investors, aspiring founders)
- `apps/admin-web`: Admin console (moderation, verification, academy management)
- `apps/api`: NestJS API (auth, pitches, connections, messages, verification, academy, payments)

## Packages

- `packages/ui`: Shared UI components
- `packages/eslint-config`: Shared ESLint rules
- `packages/typescript-config`: Shared TypeScript configs
- `packages/tailwind-config`: Shared Tailwind config

## Core Features

- Authentication and role-based access (entrepreneur, investor, aspiring, admin)
- Pitch creation and discovery with filters
- Connection requests and network management
- Direct messaging with notifications
- Verification requests and admin approval workflow
- Subscription payments (Paystack, OPay)
- Academy programs, modules, lessons, tasks, submissions, certificates

## Tech Stack

- Backend: NestJS 11, Prisma 5, PostgreSQL
- Frontend: React 19, React Router v7, Redux Toolkit, Tailwind CSS
- Monorepo: Turborepo + pnpm

## Requirements

- Node.js >= 18
- pnpm 10.26
- PostgreSQL

## Setup

```bash
pnpm install
```

### Environment Variables

Backend (apps/api/.env):
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SEED_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `APP_BASE_URL`
- `CERT_LOGO_URL`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `OPAY_SECRET_KEY`
- `OPAY_MERCHANT_ID`
- `OPAY_PUB_KEY`
- `OPAY_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`

Frontend (apps/user-web/.env, apps/admin-web/.env):
- `VITE_API_BASE_URL`

### Prisma

```bash
cd apps/api
pnpm prisma generate
pnpm prisma db push
```

## Development

```bash
pnpm dev
```

To run a single app:

```bash
pnpm --filter ./apps/api dev
pnpm --filter ./apps/user-web dev
pnpm --filter ./apps/admin-web dev
```

## Default Ports

- API: `3000` (see `apps/api/src/main.ts`)
- Web apps: Vite chooses the first available port (commonly `5173`)

## Build

```bash
pnpm build
```

## Lint and Typecheck

```bash
pnpm lint
pnpm check-types
```

## Webhooks

Paystack and OPay webhook verification uses the raw request body. Ensure:
- `PAYSTACK_WEBHOOK_SECRET` and `OPAY_WEBHOOK_SECRET` are set.
- Reverse proxies do not modify the body before it reaches the API.

## Scripts

See `package.json` for all scripts. Common ones:
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm check-types`
- `pnpm format`
