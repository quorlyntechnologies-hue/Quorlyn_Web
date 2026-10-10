# Contact form: findings and backend handoff

Checked on 10 October 2026. The website changes do not resolve the backend
failures below. No live enquiry, database insert or outbound test email was
sent during these checks.

## Live website: database check fails

A read-only request to `https://quorlyn.com.np/api/health` redirects to
`https://www.quorlyn.com.np/api/health`. The final response at
`2026-10-10T15:42:23.050Z` was **HTTP 503**:

```json
{
  "status": "degraded",
  "services": {
    "database": "error",
    "email": "ok",
    "turnstile": "ok"
  },
  "keepAlive": false
}
```

In `src/app/api/health/route.ts`, `database: "error"` means the configured
Supabase client returned an error querying `inquiries`. The server logs the
underlying message with the prefix `[health] database check failed`.
The exact message could not be retrieved: the currently accessible Vercel
account could not locate this website's deployment.

This does not establish whether credentials, the schema or the Supabase service
caused the failure. Inspect the deployment logs before choosing a repair.
`keepAlive: false` identifies an unsigned public request when `CRON_SECRET` is
set; the database query still runs. It is not the cause of this database error.

The contact API inserts an enquiry before attempting email delivery. A failed
insert returns **HTTP 502**, with `We could not save that just now. Please try
again.` Email is not attempted after that failure. This is the source-code
failure path; no production form submission was made to exercise it.

## Local preview: backend is unconfigured

This checkout has no `.env.local`. Its health response reports the database,
email and Turnstile as `not_configured`. A valid enquiry submitted in isolated
Brave desktop and touch-mobile sessions returned **HTTP 503**:

```json
{
  "error": "The inquiry system is not connected yet.",
  "code": "not_configured"
}
```

The form correctly displays `Your message has not been sent.`, preserves the
message and allows retrying. The API exits before database insertion or email
delivery. Empty submissions are blocked by validation without an API request.

## Email status is configuration, not delivery confirmation

The live health response's `email: "ok"` checks whether a provider is configured.
It does not verify the API key, sender domain, recipient or inbox arrival.
Similarly, the enquiry API's `emailed` flag currently reflects configuration,
not the actual send result. Email failures after a successful database insert
are logged; they do not undo the stored enquiry. The updated form only claims
that an enquiry was recorded, without promising a confirmation email.

## Actions for the backend owner

1. Open the Vercel project that owns `www.quorlyn.com.np` and inspect runtime
   logs for `[health] database check failed`. For failed submissions, also look
   for `[inquiries] insert failed`. Resolve the error identified there.
2. Verify the production Supabase project and these environment variables:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `SUPABASE_SERVICE_ROLE_KEY`. Confirm that the schema matches the migrations
   under `supabase/migrations/`; apply missing migrations only after reviewing
   the current database. Do not run the demonstration seed in production.
3. Verify `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM` and `CONTACT_INBOX`.
   Check the sender's verified domain and the recipient inbox in Resend. Verify
   the matching Turnstile site key/secret and allowed website hostnames.
4. Configure production variables in Vercel and redeploy if those variables
   change. For local testing, populate `.env.local` from `.env.example` and
   restart/rebuild the local server. Keep secret values outside Git and public
   issue descriptions.
5. Confirm `/api/health` reports `database: "ok"`. With an agreed test recipient,
   submit a real enquiry and check its reference, record in `/admin/inquiries`,
   visitor confirmation email and notification email to `CONTACT_INBOX`.
   Repeat the form interaction on desktop and mobile.

The full setup instructions are in [BACKEND-SETUP.md](BACKEND-SETUP.md).
Vercel applies changed environment variables to new deployments; see
[its environment-variable documentation](https://vercel.com/docs/environment-variables).

## Analytics follow-up

The reported `/_vercel/insights/script.js` 404 is separate from contact delivery.
The updated code loads analytics only on Vercel production deployments. Enable
Web Analytics in the Vercel dashboard before deploying, and verify the insights
script loads on the deployed site. This was verified locally only; hosted
analytics has not been tested.
