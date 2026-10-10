---
name: "Quorlyn Technology"
description: "A source-derived dimensional logo, clear engineering copy and open reading layouts on soft off-white."
colors:
  void: "#f7f7f4"
  surface: "#efefeb"
  elevated: "#ffffff"
  sunken: "#e8e9e5"
  fg: "#17212b"
  muted: "#4e5a67"
  subtle: "#606b76"
  line: "#17212b1f"
  line-strong: "#17212b80"
  control: "#7a838b"
  cyan: "#00cdfd"
  azure: "#00a6fc"
  blue: "#1757fc"
  violet: "#863afb"
  magenta: "#b914fc"
  brand-white: "#f8f8f8"
  wordmark: "#17212b"
  accent: "#1757fc"
  danger: "#b42332"
  success: "#187342"
  action: "#17212b"
  action-fg: "#f7f7f4"
  action-hover: "#1757fc"
  action-pressed: "#1245c9"
typography:
  display:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.45rem + 5.6vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  h1:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.55rem + 3vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  h2:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.7vw, 2.625rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3125rem, 1.2rem + 0.5vw, 1.625rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  h4:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.02rem + 0.2vw, 1.1875rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  hero:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.0625rem + 0.35vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  sm:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-plex-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  xs: "3px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
spacing:
  gutter: "1.25rem"
  gutter-md: "2rem"
  gutter-xl: "2.5rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "7": "1.75rem"
  "8": "2rem"
  "10": "2.5rem"
  section: "5rem"
  section-sm: "6rem"
  section-lg: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-fg}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-ghost:
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  input:
    backgroundColor: "color-mix(in srgb, var(--color-elevated) 60%, transparent)"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  tag:
    textColor: "{colors.muted}"
  technology-row:
    padding: "1.75rem 0"
---

# Design System: Quorlyn Technology

## Direction

Quorlyn uses a soft off-white public ground, dark ink, one consistent IBM Plex Sans interface family. Its source-derived Q/T monogram supplies the dimensional visual and the original cyan-to-magenta colors. Open rows and fine dividers organize the engineering content. Only the homepage hero runs a live scene; secondary pages and closing calls to action focus on their content. The staff area retains its dark palette.

The cleanup removes generic visual decoration and unsupported marketing copy. The typography follow-up unifies headings, reading text and controls in IBM Plex Sans while preserving the company's logo lettering, light theme and requested continuous 3D hero. Runtime tokens live in `src/app/globals.css`; this document and `.impeccable/design.json` describe the implemented result.

## Colors

Public page ground is `#f7f7f4`, foreground `#17212b`, supporting copy `#4e5a67`, and small text `#606b76`. `#1757fc` identifies links, active states and keyboard focus. Primary actions use dark ink with off-white text, blue hover and deeper-blue pressed states. Error and success colors carry written feedback.

The monogram preserves the source cyan, azure, blue, violet and magenta. The small TECHNOLOGY subtitle retains its original narrower gradient. Headings, reading surfaces and social-card backgrounds use solid colors. No gradient headline, decorative background lattice, radial page wash or button glow remains.

The authenticated staff area uses the existing dark tokens through a server-rendered theme marker, matching native controls and viewport metadata.

## Typography

All fonts are self-hosted through `next/font`:

- **IBM Plex Sans:** every interface heading, paragraph, navigation link, form field, button and status label, including staff screens. Body text uses weight 400 at 17px with 1.6 leading; supporting text is 15px. Controls and short titles use weight 500; h1/h2 use 600. Section headings use 1.18 leading and -0.015em tracking; smaller h3/h4 use 1.3 and -0.01em. Lead copy scales from 18px to 21px.
- **Space Grotesk:** only the original live QUORLYN wordmark at weight 400. It does not style interface headings.
- **JetBrains Mono:** actual enquiry reference codes, code/file/configuration values and the official TECHNOLOGY subtitle. Service/process numbers use Plex Sans at 15px with tabular numerals. Ordinary labels have no forced uppercase or expanded tracking.

The hero says **“Software your team / can maintain.”** Its desktop size is `clamp(2.5rem, 4.6vw, 3.75rem)`, with weight 600, 1.12 leading and -0.025em tracking. Tablet uses the existing larger single-column scale; phone uses `clamp(1.875rem, 8.5vw, 3.5rem)` to retain the two-line phrase at narrow widths. The implemented header and section scales are recorded in the frontmatter.

## Layout

The default container is at most 78rem wide. Gutters grow from 1.25rem to 2rem at 48rem and 2.5rem at 80rem. Sections use 5rem vertical padding, then 6rem at 40rem and 7rem at 64rem. Legal content uses the narrower container.

Desktop hero copy and the logo sit in two columns. Below 64rem, copy and actions precede the centered mark. Phone actions stack, with useful touch targets. The four-item capability strip is two columns on phones and four on desktop.

Services remain a linked index. Technology uses a definition list: layer, selection rationale and actual tool names; columns stack naturally on mobile. Principles use open columns. Work focus areas use open rows. The six process stages retain their useful order and a solid rail. Internal-page headers show the title, explanation and relevant factual metadata, without duplicated captions or oversized background logos.

## Depth and motion

Depth belongs to the actual logo: shallow extrusion, narrow bevels, satin faces, cube fragments and directional light. The page canvas is transparent; neutral RoomEnvironment/PMREM reflections come from the environment, independently of the visible background. ACES exposure is 1.1. A fading pale ground supports a ShadowMaterial catcher at opacity 0.2. One key light casts PCF shadows, radius 8, using 2048 maps at viewport widths of 1024px and above and 1024 maps below. The decorative scene grid was removed.

The fragments assemble once over 1.6 seconds, followed by continuous bounded rotation and floating in a 12-second cycle on desktop and touch devices. Fine pointers add a small tilt. A keyboard-accessible pause control, viewport intersection, tab visibility and reduced-motion preference govern rendering. Reduced motion never initializes the renderer. The matching poster remains usable without JavaScript or WebGL and after context loss; a high-resolution official crop covers poster-loading failure.

Only the homepage initializes this live scene. Its still is a fallback, not repeated decoration on internal pages or closing bands. Reading sections have no scroll entrances or animation observers. Controls use short 150–320ms state transitions without glows. The 500ms poster-to-live crossfade is confined to the hero.

## Components

Buttons use stable solid fills, modest 10px corners and visible focus. Secondary actions have an opaque pale surface and control border. Medium controls start at 44px high; large hero actions start at 48px. Labels can wrap without overflow.

Form fields use visible borders, a white-toned fill and solid blue focus with a small focus ring. Required/optional annotations use readable 15px plain text. Errors identify whether a message was sent and give a recovery action; configuration names stay in staff/setup documentation. Success confirms a recorded enquiry and frames two working days as a reply target, not a guarantee or a claim that an email was delivered.

Tags are ordinary taxonomy text, not decorative pills. Reading sections are unboxed. Radius tokens remain available for controls, real media and state feedback, rather than being applied to every text group. The `.mosaic` utility remains for staff metrics where separate cells organize actual data.

The fixed public header becomes solid off-white after scrolling or opening the menu. Desktop links show an active underline. The mobile menu preserves focus trapping, Escape dismissal, native scrolling and its project action, without decorative numbers. Footer headings and legal links use normal reading type.

## Content and evidence

Legal name, location, founded year, domain, service identifiers, deliverables, tool lists and process outputs remain sourced from the repository. Editorial copy explains capabilities and method without unsupported cost savings, delivery schedules or exaggerated experience. There are no invented clients, metrics or people. Published work includes Tripper Driving Simulator on Playgama, with sourced cover art, a plain overview and a direct play action. The shared project preview uses the existing type, colors, modest media rounding and open rows. Empty client-case narrative, technology and metric sections are omitted. The three work focus areas remain the fallback if no projects are published. Missing client names are omitted rather than described as “Under NDA.” Sitemap dates are omitted until an actual content-modification date is available.

## Extension rules

- Use the original brand artwork and verified content sources.
- Explain the problem, approach and deliverables in plain language.
- Keep existing routes, service anchors and enquiry mappings.
- Give controls visible focus and written error feedback.
- Regenerate the hero still from the actual mesh and retain provenance.

- Invent founder quotes, clients, team biographies, testimonials, metrics or delivery guarantees.
- Turn missing portfolio evidence into placeholder content.
- Add gradient headings, neon hover glows or blurred decorative cards.
- Animate reading sections or hide copy until it enters the viewport.
- Expose backend configuration instructions to public visitors.
