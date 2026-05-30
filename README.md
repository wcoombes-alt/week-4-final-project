# Exit Date

Exit Date is a multi-step financial runway calculator for professionals who want a concrete date, savings target, and first 30-day action plan before leaving a corporate role.

## What is included

- Next.js App Router with Tailwind CSS v4
- Google-only Auth.js sign-in with database sessions
- PostgreSQL schema managed by Drizzle ORM migrations
- Four-step interactive calculator with live totals
- Email capture gate and downloadable/printable blueprint
- Owner-only leads page with CSV export
- Light/dark theme toggle

## Required environment variables

Create `.env.local` with these names:

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=http://localhost:3003
```

## Run locally

```bash
npm install
npm run db:migrate
npm run dev
```

Then open `http://localhost:3003`.

For Google sign-in in local development, the OAuth client must include this
authorized redirect URI:

```text
http://localhost:3003/api/auth/callback/google
```

## Database commands

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

Use migrations for schema changes. Do not use `drizzle-kit push` on a shared database.

## Notes

The calculator is an estimate-only planning tool and is not financial, legal, tax, or investment advice.
