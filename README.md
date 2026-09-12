# Dejabooom

Dejabooom is a Next.js MVP for AI-personalized surprise trip planning.

The product sells the planning experience, not travel inventory. Customers create
a trip profile, choose a planning service, pay through hosted checkout, and
receive a private AI-personalized surprise trip recommendation. Flights, hotels,
activities, visas, and insurance are booked directly with third-party providers.

## Requirements

- Node.js 22 or newer
- npm 11.6.2 or newer
- PostgreSQL, hosted with Supabase or Neon for shared environments

The recommended Node version is declared in `.nvmrc`.

## Quick Start

```bash
git clone https://github.com/edisra10/dejabooom.git
cd dejabooom
npm install
cp .env.example .env.local
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000 after the dev server starts.

## Environment Variables

Copy `.env.example` to `.env.local` and replace placeholder values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public app URL for metadata, checkout redirects, emails, and reveal links. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Public, monitored support address shown to customers. |
| `DATABASE_URL` | PostgreSQL connection string for Prisma. |
| `OPENAI_API_KEY` | Server-side OpenAI API key. Never expose to the client. |
| `OPENAI_RECOMMENDATION_MODEL` | Recommendation personalization model. Defaults to `gpt-5-mini`. |
| `OPENAI_TIMEOUT_MS` | OpenAI request timeout in milliseconds. |
| `STRIPE_SECRET_KEY` | Stripe server secret key for hosted checkout. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret. |
| `PLANNING_SERVICE_CURRENCY` | Currency used by planning-service products. |
| `AI_SURPRISE_TRIP_NAME` | Display name for the first service tier. |
| `AI_SURPRISE_TRIP_PRICE_CENTS` | Hosted checkout amount in cents for AI Surprise Trip. |
| `RESEND_API_KEY` | Resend API key for transactional email. |
| `EMAIL_FROM` | Verified sender address for transactional email. |
| `ADMIN_ALERT_EMAIL` | Operator email for generation-error alerts. |
| `ADMIN_USERNAME` | Basic Auth username for `/admin`. |
| `ADMIN_PASSWORD` | Basic Auth password for `/admin`. |
| `REVEAL_TOKEN_ENCRYPTION_KEY` | 32-byte base64 key used to encrypt reveal tokens for admin recovery. |
| `REVEAL_TOKEN_TTL_DAYS` | Optional reveal-link expiration window. |
| `CRON_SECRET` | Bearer token protecting the durable recommendation worker endpoint. |
| `RECOMMENDATION_JOB_BATCH_SIZE` | Number of queued recommendations processed per worker invocation, capped at five. |
| `RECOMMENDATION_WEIGHTS_JSON` | Optional JSON override for deterministic scoring weights. |

Generate a reveal-token encryption key with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Product Flow

1. The landing page presents Dejabooom as a surprise travel-planning service.
2. The customer completes the multi-step trip profile questionnaire.
3. The questionnaire is validated with Zod and persisted to PostgreSQL.
4. The deterministic server-side engine applies hard filters and scores the
   curated destination catalog.
5. A destination must pass the hard filters before the AI service can be purchased.
6. The customer selects `AI Surprise Trip` and Stripe creates a hosted checkout
   session. Dejabooom never captures raw card
   details or CVV.
7. Stripe webhooks are signature-validated and idempotent.
8. Verified payments enqueue a durable PostgreSQL recommendation job.
9. OpenAI personalizes the selected destination with schema-validated structured
   output.
10. The customer receives a private `/reveal/[token]` link by email.

## Database

Prisma is configured for PostgreSQL with Prisma 7.

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Production deployments should run:

```bash
npm run db:deploy
```

The seed catalog contains approximate planning data for an initial
Mexico-focused launch. It is not real-time pricing, visa, safety, or
availability data.

## Manual Provider Setup

### Vercel

- Set all environment variables from `.env.example`.
- Use the production `NEXT_PUBLIC_SITE_URL`.
- Run `npm run db:deploy` during deployment or through a controlled release step.
- Confirm `/api/webhooks/stripe` is reachable from Stripe.
- Configure `CRON_SECRET` and invoke `/api/internal/recommendations/process`
  from a trusted scheduler to retry queued work.

### Database

- Create a PostgreSQL database in Supabase or Neon.
- Store the connection string in `DATABASE_URL`.
- Apply migrations with `npm run db:deploy`.
- Seed destinations with `npm run db:seed` once per environment.

### OpenAI

- Create an OpenAI API key and set `OPENAI_API_KEY` only on the server.
- Keep `OPENAI_RECOMMENDATION_MODEL` configured to a structured-output capable
  model.
- Monitor generation failures in `/admin` and through `ADMIN_ALERT_EMAIL`.

### Stripe

- Create hosted checkout access with a Stripe secret key.
- Configure the webhook endpoint: `/api/webhooks/stripe`.
- Subscribe to `checkout.session.completed`,
  `checkout.session.async_payment_succeeded`, `checkout.session.expired`, and
  `checkout.session.async_payment_failed`.
- Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.
- Keep planning-service prices in environment variables.

### Recommendation worker

- Stripe webhooks only verify payment and enqueue the recommendation job.
- Next.js `after()` attempts immediate processing without delaying the webhook
  response. The PostgreSQL job remains available if that attempt is interrupted.
- Call `GET /api/internal/recommendations/process` with
  `Authorization: Bearer <CRON_SECRET>` to process retries.
- Vercel Pro can schedule this endpoint every minute. Vercel Hobby permits only
  daily cron execution, so staging on Hobby should use a trusted external
  scheduler or manual invocation.
- Failed jobs retry up to three times with exponential backoff. Stale processing
  locks are released automatically.

### Resend

- Verify the sender domain or address.
- Set `RESEND_API_KEY` and `EMAIL_FROM`.
- Set `ADMIN_ALERT_EMAIL` for generation-error notifications.
- Reveal delivery failures keep the recommendation job retryable. The encrypted
  reveal token is reused so a provider outage does not require a second AI run.

## Project Structure

```text
prisma/
  migrations/                  Database migration SQL
  schema.prisma                Prisma schema
  seed.ts                      Destination catalog seed
src/
  app/                         Next.js app router pages
  components/landing/          Landing page visual components
  components/ui/               Reusable UI primitives
  features/trip-profile/       Questionnaire components, schema, types, storage
  server/
    analytics/                 Server-side event logging without sensitive data
    checkout/                  Planning-service product configuration
    db/                        Prisma client
    email/                     Transactional email service and templates
    payments/                  Stripe helpers and webhook utilities
    recommendations/           Scoring engine and OpenAI itinerary generation
    security/                  Rate limiting and reveal-token helpers
```

## Validation

Run these before opening a pull request:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` runs lint, TypeScript, tests, and the production build in sequence.

GitHub Actions runs the same validation on pull requests and pushes to `main`.

## Available Scripts

- `npm run dev` - Start the local Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript without emitting files
- `npm run test` - Run Vitest unit tests
- `npm run audit:prod` - Fail on unapproved high or critical runtime dependency
  alerts; exact Prisma build-tool exceptions are documented in the audit script
- `npm run validate:release-env` - Validate required staging/production settings without printing secrets
- `npm run check` - Run all local validation commands
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create/apply local development migrations
- `npm run db:deploy` - Apply migrations in production
- `npm run db:seed` - Seed the destination catalog

## Security Notes

- Raw card data and CVV are never requested or stored by Dejabooom.
- Passport numbers and identity documents are never requested.
- Reveal URLs use high-entropy tokens and store only token hashes by default.
- Reveal token recovery in `/admin` requires `REVEAL_TOKEN_ENCRYPTION_KEY`.
- `/admin` is protected by Basic Auth through middleware.
- OpenAI calls run server-side and validate structured output with Zod.
- Checkout and questionnaire rate limits are shared through PostgreSQL rather
  than isolated in each server process.

## Known Limitations

- No customer account system yet.
- No direct flight, hotel, or activity booking.
- No real-time pricing or availability.
- Destination data is curated and approximate.
- The launch service supports one AI-selected destination and itineraries of two
  to five days. Concierge review and customer selection from finalists are not
  offered in the launch scope.

See [`docs/release-runbook.md`](docs/release-runbook.md) for the staging journey,
failure cases, production gate, and evidence to record before launch.
