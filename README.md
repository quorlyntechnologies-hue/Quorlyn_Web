# Quorlyn Technology — website

Marketing site and lead-management platform for Quorlyn Technology Private
Limited (Kathmandu, Nepal). Next.js 16 App Router, TypeScript, Tailwind CSS v4,
Supabase. Public pages are statically rendered; only the admin area and two API
routes run on demand.

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000
```

## Commands

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Dev server                                                          |
| `npm run build`        | Production build (type-checks as part of the build)                 |
| `npm start`            | Serve the production build                                          |
| `npm run lint`         | ESLint                                                              |
| `npm run brand:assets` | Regenerate the symbol, favicon and social-card art from the logo    |
| `npm run audit`        | Accessibility, layout and inquiry-flow audit — needs `npm start`    |

## Architecture

```
src/
  app/
    (site)/        public pages — route group, adds nav + footer, not in URLs
    admin/         staff area — own chrome, own auth, noindex
    api/
      inquiries/   public lead capture
      health/      status probe + Supabase keep-alive (daily cron)
  lib/
    supabase/      browser, session and service-role clients
    auth/dal.ts    authorization, next to the data
    email/         provider-agnostic transactional mail
    security/      rate limiting, Turnstile
  proxy.ts         session refresh + optimistic /admin gate
supabase/
  migrations/      schema and RLS — the source of truth for the database
  seed.sql         obviously-fake demo data, never for production
```

**Authorization has two layers, deliberately.** `proxy.ts` (Next 16's renamed
middleware) does a cookie-only check to bounce signed-out visitors early — it
runs on prefetches and cannot query the database, so it is a UX shortcut, not a
boundary. Real checks live in `src/lib/auth/dal.ts`, memoised with React
`cache()`, and every protected page and server action calls one before touching
data. Underneath both, Postgres RLS denies `anon` on every table.

**The anon key is public** — it ships in the browser bundle. Nothing relies on
it being secret. Public form submissions go through the server route using the
service-role key, which is `server-only` and never bundled.

## Setup

Full walkthrough in **[docs/BACKEND-SETUP.md](docs/BACKEND-SETUP.md)**: Supabase,
Resend, Turnstile, Vercel, and creating the first admin account.

Everything degrades gracefully. With no environment at all, public pages render,
the inquiry form validates and tells visitors plainly that submissions are not
yet stored, and `/admin` shows a setup notice naming the missing variables.

## Still open

1. **Public contact details are blank.** `NEXT_PUBLIC_CONTACT_EMAIL`,
   `NEXT_PUBLIC_CONTACT_PHONE` and `NEXT_PUBLIC_STREET_ADDRESS` are unset, so
   the footer, contact page and `Organization` structured data omit them
   rather than showing a placeholder.

2. **No published case studies.** `src/content/projects.ts` is an empty array by
   design — see below.

3. **Phases B–D are not built.** Services, projects, blog, careers, job
   applications and FAQ remain content files rather than CMS-managed tables; the
   AI assistant is not started. The Phase A schema is deliberately narrow so the
   first deploy carries only tables that are actually used.

`src/app/(site)/privacy/page.tsx` and `terms/page.tsx` describe what this site
actually does today. Analytics is now present — cookieless and aggregate — and
the privacy page says so. Keep them in step, and have both reviewed by a
qualified adviser before launch.

## Content lives in `src/content`

Copy is data, not markup. Editing these files updates every page that reads
them; no component changes required.

| File              | Contents                                                          |
| ----------------- | ----------------------------------------------------------------- |
| `company.ts`      | Legal name, location, domain, nav, contact details                |
| `services.ts`     | The six services — problem, approach, deliverables, technologies  |
| `technologies.ts` | Stack by layer, each with the reasoning behind it                 |
| `process.ts`      | The six engagement stages                                         |
| `principles.ts`   | Positioning statements (homepage) and philosophy (about)          |
| `projects.ts`     | Case studies — **currently empty, intentionally**                 |

### Publishing the first case study

`projects` is an empty array. While it stays empty, `/work` renders an honest
"nothing published yet" state describing the kind of work the team takes on.
Append one `Project` object and the page, the homepage section and the sitemap
all switch over — `/work/[slug]` already exists as the template.

`metrics` must only ever hold measured numbers the client has approved for
publication. Leave it empty and the outcome block is omitted; there is no
placeholder statistic anywhere in this codebase and there should never be one.

## Design system

Every token is defined once, in `@theme` at the top of `src/app/globals.css`:
colour, type scale, radius, shadow, easing, breakpoints. Components consume
tokens (`text-fg`, `bg-surface`, `ease-precise`) and never raw hex.

A few rules the code follows, worth knowing before extending it:

- **Dark is the ground, not a theme.** There is no light mode; the brand mark
  only reads on near-black.
- **The gradient is an accent, never a surface.** It marks the logo, hairline
  rules, the hero lattice and focus rings. `primary` buttons are a light solid,
  not a gradient — white on cyan fails AA contrast.
- **Hairlines over fills.** Structure is drawn with 1px borders. Use the
  `.mosaic` utility for panel grids: cells carry their own inset outline, so a
  row that does not divide evenly leaves empty space rather than a stray lit
  rectangle.
- **Motion is 150–300ms, opacity and transform only.** `prefers-reduced-motion`
  removes all of it, and no content depends on an animation to become readable.

Three typefaces, each with a job: **Space Grotesk** for display, **Inter** for
body and UI, **JetBrains Mono** for indices, labels and technical annotation
only — never for reading copy. All self-hosted through `next/font`.

## The hero visual

`src/components/home/HeroLattice.tsx` is a canvas field whose pixel *density*
traces the logo's own geometry — ring, crossbar, stem, and the dissolution
scattering off the left flank — so the mark is latent in the noise. A slow wave
crosses it, briefly resolving whatever it passes.

It costs one `fillRect` per cell per frame; the shape field is computed once per
layout. The loop stops when the hero scrolls out of view or the tab is hidden,
DPR is capped at 2, and `prefers-reduced-motion` paints a single static frame
and never starts a loop. It is decorative and `aria-hidden`: the hero reads
correctly if it never paints at all.

## Audit

`npm run audit` runs against a running production build and exits non-zero on
failure, so it can gate a deploy:

- axe-core across all 8 routes — WCAG 2.0/2.1/2.2 A + AA, plus best practices
- no horizontal scroll at 320/390/768/1280/1728, measured with the
  `overflow-x: clip` safety net disabled so genuine overflow cannot hide
- no console errors or uncaught exceptions
- reduced motion: every revealed element visible, hero canvas still painting
- contact form: invalid input never reaches the API, valid input does, honeypot
  accepted silently

Playwright and axe-core are devDependencies only and ship nothing to the
browser. If you would rather not carry them, delete `scripts/audit.mjs` and both
packages — but `scripts/extract-brand-assets.mjs` uses the same Chromium, so
regenerate the brand assets first.

## Deployment

Static except `/api/contact`, so it runs anywhere that supports Next.js. Set the
environment variables above, then point `company.url` in
`src/content/company.ts` at the production domain — canonical URLs, the sitemap,
robots and Open Graph tags all derive from it.
