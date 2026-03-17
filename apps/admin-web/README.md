# Naajih Admin Web

Admin console for platform operations, moderation, and academy management.

## Features

- Admin authentication and dashboard stats
- User management and account actions
- Pitch moderation (approve/reject)
- Verification review workflow
- Audit logs
- Academy programs, modules, lessons, tasks, submissions

## Setup

```bash
pnpm install
```

## Environment Variables

Create `apps/admin-web/.env`:

- `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api`)

## Development

```bash
pnpm --filter ./apps/admin-web dev
```

## Build

```bash
pnpm --filter ./apps/admin-web build
```
