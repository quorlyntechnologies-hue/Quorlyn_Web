# Backend setup

Everything below is on a genuinely free plan, and none of the three services
require a card. Total time is about 30 minutes.

The site works before you do any of this — public pages render, the form
validates and tells visitors honestly that submissions are not yet stored, and
`/admin` shows a setup notice listing exactly which variables are missing. Work
through the sections in order and each capability switches on.

---

## 1. Supabase — database, auth, admin (required)

**Free plan:** 500 MB database, 1 GB storage, 5 GB egress, 50,000 monthly active
users, 2 active projects. No card.

**The one catch:** free projects **pause after 7 days without a database
request**, and a paused project means the inquiry form starts failing. This repo
handles it — `vercel.json` runs a daily cron against `/api/health`, which makes
one trivial query. Keep that cron.

1. Create a project at [supabase.com](https://supabase.com). Choose the region
   closest to your users — Singapore or Mumbai for Nepal.
2. Copy **Project Settings → API** into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

   The service role key bypasses every security policy. It is server-only. If it
   ever appears in a browser bundle, a screenshot or a support ticket, rotate it.

3. Apply the migrations. Either paste each file from `supabase/migrations/` into
   the SQL editor in filename order, or use the CLI:

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. Create the first admin. Supabase Auth has no public sign-up here, so make the
   account by hand:

   **Authentication → Users → Add user** — set an email and a strong password,
   and tick *Auto Confirm User*.

   Then run this in the SQL editor, substituting the address:

   ```sql
   insert into public.profiles (id, email, full_name, role, can_view_inquiries)
   select id, email, 'Your Name', 'admin', true
   from auth.users
   where email = 'you@quorlyn.com.np'
   on conflict (id) do update
     set role = 'admin', can_view_inquiries = true, is_active = true;
   ```

   A Supabase Auth account on its own grants nothing. The `profiles` row is what
   makes someone staff.

5. Sign in at `/admin/login`.

### Adding colleagues later

Same two steps — create the user, then insert a profile. Use `'editor'` for
content staff. Editors do **not** see inquiries unless you also set
`can_view_inquiries = true`; leads are commercially sensitive and personal, so
access is an explicit grant rather than something a role quietly confers.

### Checking the policies actually hold

Worth doing once, because "I could not see the button" is not a test:

```sql
-- Should return zero rows. If it returns inquiries, RLS is not on.
set role anon;
select * from public.inquiries;
reset role;
```

---

## 2. Resend — transactional email (optional)

**Free plan:** 3,000 emails/month, **capped at 100/day**, one verified domain.
The daily cap binds first: each inquiry sends two emails (visitor confirmation
plus your notification).

1. Create an account at [resend.com](https://resend.com), add
   `quorlyn.com.np`, and add the DKIM/SPF records it gives you to Cloudflare DNS.
2. Create an API key → `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to a sender on the verified domain, and `CONTACT_INBOX` to
   wherever notifications should land.

Until this is configured, inquiries are still stored — the send is logged to the
server console instead and the reference of any unnotified lead is printed, so
nothing is lost. Swapping providers means adding one file under
`src/lib/email/providers/` and changing `EMAIL_PROVIDER`; no call sites move.

---

## 3. Cloudflare Turnstile — bot protection (optional)

**Free plan:** 1M siteverify calls/month, 20 widgets. No card.

1. Cloudflare dashboard → **Turnstile** → Add site. Widget mode **Managed**.
2. Add `quorlyn.com.np` and `localhost` as hostnames.
3. Site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, secret → `TURNSTILE_SECRET_KEY`.

Unset, the widget does not render and the server records the check as skipped —
so local development is unaffected. The honeypot and rate limits work either way.

---

## 4. Deploy to Vercel

1. Push to GitHub, then import the repo at
   [vercel.com/new](https://vercel.com/new). Next.js is detected; no build
   configuration needed.
2. Add every variable from `.env.local` under **Settings → Environment
   Variables**. Add `CRON_SECRET` too — any long random string.
3. Point the domain at Vercel from Cloudflare DNS. Keep Cloudflare proxying for
   CDN and WAF.
4. Confirm the cron appears under **Settings → Cron Jobs**. Without it, Supabase
   pauses after a quiet week.
5. Set `company.url` in `src/content/company.ts` to the production origin —
   canonical URLs, the sitemap, robots and Open Graph all derive from it.

Analytics needs nothing: `@vercel/analytics` is cookieless and starts reporting
on first deploy. Custom funnel events go through `src/lib/analytics.ts`.

---

## Verifying it end to end

```bash
npm run build && npm start     # one terminal
npm run audit                  # another — a11y, layout, form behaviour
curl localhost:3000/api/health # should report every service as "ok"
```

Then submit a real inquiry and check that:

- the success panel shows a `QRN-<year>-<n>` reference
- the row appears at `/admin/inquiries`
- both emails arrive
- submitting six times in an hour from one connection is rejected

## Seed data

`supabase/seed.sql` inserts five obviously fictional inquiries for exercising
the admin UI. Every reference is in a `QRN-DEMO-*` block that cannot collide
with real ones, and every body is prefixed `DEMO RECORD`. Never run it against
production. Remove with:

```sql
delete from public.inquiries where reference like 'QRN-DEMO-%';
```
