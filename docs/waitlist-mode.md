# Product Waitlist

The waitlist mode lets people create normal NaajihBiz accounts before launch while keeping those accounts outside the product dashboard until access is ready. New signups are saved as user accounts, so they can use their existing credentials when the product opens.

## Configuration

- Set `WAITLIST_MODE=true` for the API to mark new non-admin accounts as waiting for early access.
- Set `VITE_WAITLIST_MODE=true` for the user app to show the waitlist entry page and route waitlisted users there.
- Set both values to `false` when opening the product for normal signup.

## Admin Operations

- Accounts awaiting product access are managed at `/admin/early-access-users`.
- The separate email-only list at `/admin/waitlist` is not the signup path used by the user app.
- Mark an account notified after sending its launch/access email.

## Opening Access

After confirming launch email delivery, set `WAITLIST_MODE=false` on the API and `VITE_WAITLIST_MODE=false` on the user app, then deploy both. Existing accounts are retained; users can sign in with the email and password they created during signup and continue to the normal dashboard. No waitlist data deletion or account recreation is needed.

## Database Migration

The original waitlist columns were renamed to generic product-waitlist fields. Apply the forward migration from `apps/api`:

```bash
pnpm exec prisma migrate deploy --schema prisma/schema.prisma
```
