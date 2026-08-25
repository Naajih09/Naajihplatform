# Conference Mode (Feature Flag)

This document explains the `CONFERENCE_MODE` feature flag and how to operate it.

Overview
- `CONFERENCE_MODE` enables a temporary signup flow for conference attendees. When `true`, new non-admin signups are marked as conference waitlist users instead of normal users.

Environment variables
- API: set `CONFERENCE_MODE=true` in `apps/api/.env` (or environment at runtime).
- Frontend: set `VITE_CONFERENCE_MODE=true` in `apps/user-web/.env` and `apps/admin-web/.env` if needed.

What the code does
- Adds `isConferenceWaitlist` and `conferenceNotifiedAt` to the `User` model.
- Adds a shared helper `isConferenceMode()` to gate behavior.
- Signup flow marks users as waitlisted when the flag is enabled.
- Admin UI exposes a conference signups list and an action to mark users notified.

Post-conference shutdown steps
1. Set `CONFERENCE_MODE=false` in production and any running `.env` files.
2. Optionally run a backfill or promotion job to convert waitlisted users to normal users, if desired. Example SQL to promote all waitlisted users:

```sql
UPDATE "User"
SET "isConferenceWaitlist" = false
WHERE "isConferenceWaitlist" = true;
```

3. Clear or archive the `conferenceNotifiedAt` values as appropriate.

Running migrations
- Migration SQL for the new fields has been added under `apps/api/prisma/migrations/20260825000000_add_conference_waitlist_fields/migration.sql`.
- To apply migrations locally run from `apps/api`:

```bash
pnpm exec prisma migrate deploy --schema prisma/schema.prisma
```

Notes and troubleshooting
- If your system's npm/pnpm cache or temp directories point to an external drive, ensure that drive is mounted and writable before running `prisma migrate` or `pnpm install`.
- If you hit `ENOSPC` on `C:`, consider pointing the npm cache to a drive with free space:

```powershell
New-Item -ItemType Directory -Force 'E:\npm-cache' | Out-Null
$env:NPM_CONFIG_CACHE='E:\npm-cache'
pnpm install
```
