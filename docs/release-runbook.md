# Dejabooom release runbook

Use this runbook first in staging with Stripe test mode. Record the deployment URL, commit SHA, UTC timestamp, order ID, Stripe event IDs, recommendation job ID, and outcome for every scenario. Never copy secret values into the evidence.

## 1. Configure staging

1. Set every variable in `.env.example` in the staging environment. Use a public HTTPS `NEXT_PUBLIC_SITE_URL` and a monitored `NEXT_PUBLIC_SUPPORT_EMAIL`.
2. Use a dedicated staging PostgreSQL database, a Stripe test secret and webhook secret, a server-only OpenAI key, and a verified Resend sender.
3. Run `RELEASE_ENV=staging npm run validate:release-env` in an environment that has the staging variables.
4. Run `npm run db:deploy`, then `npm run db:seed` once. Confirm the active destination count is 32 and each active destination has attributes.
5. Register `/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, and `checkout.session.async_payment_failed`.
6. Configure the scheduler to call `/api/internal/recommendations/process` with `Authorization: Bearer <CRON_SECRET>` at least once per minute. A successful idle response is `{ "processed": 0 }`.

PowerShell equivalent for environment validation:

```powershell
$env:RELEASE_ENV = "staging"
npm run validate:release-env
```

## 2. Validate the normal customer journey

1. Submit a valid two-day profile and a valid five-day profile. Confirm each reaches the single AI service checkout.
2. Complete Stripe test checkout. Confirm the signed webhook returns 2xx, the order becomes `PAID`, and exactly one recommendation job exists.
3. Confirm the worker completes the job, the recommendation becomes `GENERATED`, and the itinerary contains exactly the requested number of days.
4. Confirm Resend accepted the reveal email. Open its private link and verify destination, narrative, itinerary, planning notes, external-booking disclaimer, and `noindex` metadata.
5. Replay the same Stripe event and invoke the worker again. Confirm there is no second charge, order, job, or generated recommendation.

## 3. Validate recovery and refusal paths

- Submit constraints with no viable destination. The questionnaire must retain the draft, explain how to adjust it, and must not create a Checkout session.
- Force Stripe session creation to fail. The customer must return to the service-selection page with “No payment was taken,” and the local order must be `FAILED`.
- Complete a delayed test payment. `checkout.session.async_payment_succeeded` must move the order to `PAID` and enqueue one job.
- Send `checkout.session.async_payment_failed` and an expired Checkout event. Confirm the order is not processed as paid.
- Make OpenAI fail once, then recover. Confirm the persisted job retries and eventually completes.
- Make Resend reject the reveal email once, then recover. Confirm the recommendation stays `FAILED`, the job retries the stored encrypted reveal link without another OpenAI generation, and `GENERATED` is set only after Resend accepts delivery.
- Open a missing or expired reveal link. Confirm the support address is visible and the protected content is not shown.
- Load checkout success for pending, canceled, failed, generation-failed, and generated orders. Confirm each status is accurate.

## 4. Production gate

1. Obtain business/legal approval of Terms, Privacy, Refunds, and the AI/travel disclaimer, including the launch refund rules and support address.
2. Run `npm ci`, `npm run audit:prod`, and `npm run check` from a clean checkout at the release SHA.
3. Set production variables and run `RELEASE_ENV=production npm run validate:release-env`. The Stripe validator requires an `sk_live_` key in production.
4. Apply production migrations and seed only if the production catalog is empty. Confirm backups and rollback ownership.
5. Verify the production domain and DNS, remove deployment protection only for the intended public deployment, and confirm the webhook and scheduler target that same domain.
6. Perform one controlled live purchase. Confirm the charge, webhook, job, email, private reveal, support path, and refund procedure; then record final approval.
