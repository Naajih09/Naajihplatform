# Naajih User Web

User-facing web app for founders, investors, and aspiring business owners.

## Features

- Auth (signup/login) with role-based UX
- Dashboard and profile management
- Pitch creation and discovery
- Connections and messaging
- Verification requests
- Subscriptions (Paystack/OPay)
- Academy learning experience and certificates

## Setup

```bash
pnpm install
```

## Environment Variables

Create `apps/user-web/.env`:

- `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api`)
- `VITE_CALENDLY_URL` (e.g. `https://calendly.com/your-org/office-hours`)
- `VITE_SUBSCRIPTION_AMOUNT_NGN` (e.g. `5000`)
- `VITE_TRIAL_DAYS` (e.g. `14`)

## Development

```bash
pnpm --filter ./apps/user-web dev
```

## Build

```bash
pnpm --filter ./apps/user-web build
```
