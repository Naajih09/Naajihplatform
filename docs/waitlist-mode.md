# Product Waitlist

The waitlist mode lets people create accounts before the NaajihBiz launch while keeping those accounts outside the product dashboard until access is ready.

## Configuration

- Set `WAITLIST_MODE=true` for the API to mark new non-admin accounts as waiting for early access.
- Set `VITE_WAITLIST_MODE=true` for the user app to show the waitlist entry page and route waitlisted users there.
- Set both values to `false` when opening the product for normal signup.

## Admin Operations

- The public email waitlist is managed at `/admin/waitlist`.
- Accounts awaiting product access are managed at `/admin/early-access-users`.
- Mark an account notified after sending its launch/access email.

## Database Migration

The original waitlist columns were renamed to generic product-waitlist fields. Apply the forward migration from `apps/api`:

```bash
pnpm exec prisma migrate deploy --schema prisma/schema.prisma
```