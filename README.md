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
- `RESEND_API_KEY`
- `RESEND_FROM`
- `PASSWORD_RESET_TTL_MINUTES`
- `PASSWORD_RESET_EXPOSE_LINK`
- `BETA_TEST_MODE`
- `ENABLE_SWAGGER`
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
- `KEEP_ALIVE_URL`

Set `KEEP_ALIVE_URL` to the deployed API origin, for example `https://your-api.example.com`, if the host sleeps after inactivity. The API will ping `KEEP_ALIVE_URL/health` every 10 minutes. If unset, it falls back to `BACKEND_URL` or `APP_BASE_URL`; if none are present, keep-alive stays disabled.

For Gmail delivery, set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` to the Gmail address, and `SMTP_PASS` to a Gmail app password.

For deployed transactional email, prefer Resend over Gmail SMTP because some hosts block or time out outbound SMTP ports. Set `RESEND_API_KEY` and `RESEND_FROM` in the deployed API environment. When `RESEND_API_KEY` is present, the API sends email through Resend over HTTPS and only falls back to SMTP if Resend fails.

For temporary beta testing without a verified email domain, set both `BETA_TEST_MODE=true` and `PASSWORD_RESET_EXPOSE_LINK=true` to return the reset link in the forgot-password response. Turn both off before production use.

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
