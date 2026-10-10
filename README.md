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
| `npm run brand:geometry` | Trace and verify the official logo for the 3D hero               |
| `npm run brand:poster` | Capture the live mesh as a static poster — needs a local preview   |
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

The confirmed live database failure, local contact-form result and backend
repair steps are recorded in **[docs/CONTACT-HANDOFF.md](docs/CONTACT-HANDOFF.md)**.

Everything degrades gracefully. With no environment at all, public pages render,
the inquiry form validates and tells visitors plainly that their message has
not been sent, and `/admin` shows a setup notice naming the missing variables.

## Still open

1. **Public contact details are blank in the unconfigured local preview.**
   `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` and
   `NEXT_PUBLIC_STREET_ADDRESS` are unset here, so the footer, contact page and
   `Organization` structured data omit them. The deployed site's values depend
   on its hosting environment.

2. **Client case studies are not supplied.** Published product work includes
   Tripper Driving Simulator on Playgama. Client narratives and measured results
   still require approved evidence.

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
| `projects.ts`     | Published products and approved case studies; includes Tripper Driving Simulator |

### Publishing work

`projects` includes **Tripper Driving Simulator**, the user-supplied game
published on Playgama. It appears on the homepage, `/work`, and
`/work/tripper-driving-simulator`; the project route is generated statically and
included in the sitemap. The play buttons use the user's exact referral URL.
The separate listing link uses the clean public URL.

The game's description, release year and developer credit were checked against
[its public listing](https://playgama.com/game/tripper-driving-simulator).
Its official cover is stored locally as a 1920 × 1080 WebP (146,164 bytes) with
an origin sidecar. The cover is self-hosted; the game opens on Playgama instead of loading an
embedded player. The cover's source URL is recorded in its provenance sidecar.

Append a `Project` object for additional approved work. Product overviews can be
published without client-case narratives. Missing technology, challenge,
approach, solution and measured outcomes are omitted. Use actual image
dimensions. If the list becomes empty, the Work views show the existing focus
areas rather than invented work.

`metrics` must only ever hold measured numbers approved for publication. Leave
it empty when evidence is absent; the outcome block is omitted.

## Design system

Every token is defined once, in `@theme` at the top of `src/app/globals.css`:
colour, type scale, radius, shadow, easing, breakpoints. Components consume
tokens (`text-fg`, `bg-surface`, `ease-precise`) and never raw hex.

A few rules the code follows, worth knowing before extending it:

- **Soft off-white is the public ground.** Dark ink carries text; the source
  logo keeps its full colors. Staff screens keep their established dark palette.
- **The original logo keeps its gradients.** Headings use solid ink; primary
  actions use dark ink with off-white text and a solid blue hover state.
- **Open reading layouts.** Services, technology, principles and work use rows
  or columns with fine dividers. No decorative background grids, blurred cards,
  glowing buttons or repeated oversized logo reliefs.
- **Short control transitions and one moving hero.** The logo's pixels settle
  over 1.6 seconds, then gentle rotation and floating continue in a 12-second
  cycle. Reading content is static, without scroll entrances or observers.
  Reduced motion shows a still image and never initializes WebGL.

**IBM Plex Sans** is the interface family for headings, body text, navigation,
buttons, forms and staff screens. Reading copy is 17px/400, supporting copy is
15px, controls and short titles use 500, and h1/h2 use 600. Ordinary labels and
ordered indices use the same family, without decorative monospace or expanded
tracking. **Space Grotesk** remains only in the original QUORLYN wordmark;
**JetBrains Mono** is limited to the TECHNOLOGY subtitle and actual code/reference
values. Fonts are self-hosted through `next/font`.

Vercel Analytics loads only for Vercel production deployments
(`VERCEL_ENV=production`). Enable Web Analytics in the project's dashboard before
deploying. Local `next start` and preview deployments do not request the hosted
insights script or queue custom events.

Company facts, service identifiers, deliverables and tool lists are maintained
in `src/content`. Add claims about clients, outcomes or team members only when
approved evidence is available.

## The hero visual

`src/components/brand/LogoScene.tsx` progressively loads a Three.js scene only
when the hero is visible and motion is permitted. The geometry is traced from
the official logo's alpha channel, retaining the Q/T opening, crossbar, tail,
and left-hand square fragments. The tracing script compares its silhouette
with the source and requires at least 99% overlap. The trace is a derivative;
the official artwork remains the authority.

The mesh has shallow extrusion, narrow bevels, satin materials, the existing
brand ramp, and a generated neutral RoomEnvironment filtered with PMREM for
reflections. The canvas stays transparent over the off-white page. ACES exposure is
1.1. A fading pale studio floor carries a ShadowMaterial catcher at opacity 0.2;
the key light uses filtered PCF shadows with radius 8, a 2048 map at viewport
widths of 1024px and above, and a 1024 map below that breakpoint. Only the key
light casts shadows. Its fragments settle once, followed by a
12-second rotation and floating cycle on desktop and touch devices. Yaw stays
within roughly sixteen degrees of the resting angle so the logo remains readable.
A fine pointer adds roughly three degrees of tilt. The keyboard-accessible pause button,
off-screen state, tab visibility, and reduced-motion preference jointly control
the loop. DPR is capped at 1.5 on narrow scenes and 2 elsewhere. Unmounting
disposes the renderer, textures, geometry, materials, and observers.

The contour source is 2,761 bytes (984 bytes when gzipped), and the mesh is
generated locally. There is no GLB or Draco decoder to download. These sizes
describe the geometry data; the progressively loaded Three.js bundle is separate.

`public/brand/quorlyn-relief.webp` is a transparent capture of that same mesh.
It appears immediately, remains visible without JavaScript or WebGL, and
replaces the live scene after context loss or a reduced-motion change. It is
confined to the homepage hero; secondary pages and closing bands use plain
reading layouts. The 900 × 900 poster is 62,068 bytes after removing the grid.
Static image imports give the derivatives content-hashed URLs on each build.

To regenerate after an approved logo change:

```bash
npx playwright install chromium --only-shell
npm run brand:geometry
npm run dev -- --port 3017
# in another terminal, with that preview running:
npm run brand:poster
```

`BRAND_PREVIEW_URL` selects another local preview URL for the poster command.
The poster script also needs `cwebp` (the WebP command-line encoder). It replaces
the image atomically and refreshes its provenance sidecar. Both scripts
operate on local assets and do not publish anything. Keep asset provenance with
the regenerated files.

## Audit

`npm run audit` runs against a running production build and exits non-zero on
failure, so it can gate a deploy:

- axe-core across all 9 routes — WCAG 2.0/2.1/2.2 A + AA, plus best practices
- no horizontal scroll at 320/390/768/1280/1728, measured with the
  `overflow-x: clip` safety net disabled so genuine overflow cannot hide
- no console errors or uncaught exceptions
- live 3D: nonblank render, continuing frame changes on desktop and mobile,
  stable paused frames, keyboard/touch pause/resume, scroll and visibility gates,
  live reduced-motion changes, and context-loss fallback
- reduced motion and unsupported WebGL: a loaded poster, with no running loop
- no JavaScript: readable hero copy and actions
- service-specific enquiry preselection
- contact form: invalid input never reaches the API, valid input does, honeypot
  accepted silently

Playwright and axe-core are devDependencies only and ship nothing to the
browser. If you would rather not carry them, delete `scripts/audit.mjs` and both
packages — but `scripts/extract-brand-assets.mjs` uses the same Chromium, so
regenerate the brand assets first.

## Deployment

Public pages are statically rendered; the staff routes and `/api/inquiries`
and `/api/health` run on demand. Use a host that supports Next.js. Set the
environment variables above, then point `company.url` in
`src/content/company.ts` at the production domain — canonical URLs, the sitemap,
robots and Open Graph tags all derive from it.
