# Brand assets

## Source of truth

`quorlyn-logo.png` is the official Quorlyn Technology lockup — the Q/T monogram
with its pixel dissolution, the QUORLYN wordmark and the TECHNOLOGY subtitle.
Every mark on the site is derived from this one file.

**Do not hand-edit the derived assets.** Replace this file and re-run:

```bash
npm run brand:assets
```

which regenerates, by cropping the monogram out of the lockup:

| Output                             | Used by                                            |
| ---------------------------------- | -------------------------------------------------- |
| `src/assets/brand/quorlyn-symbol.png` | `<QuorlynMark>` — navbar, footer, CTA, 404, contact |
| `src/app/icon.png`                 | favicon                                            |
| `public/brand/quorlyn-symbol.png`  | the social card, and as a distributable file       |

The script finds the widest empty horizontal band in the artwork to separate the
monogram from the wordmark, then takes a square crop with 8% breathing room. It
needs no image-processing dependency — it drives the Chromium that Playwright
already installs for `npm run audit`.

## Usage rules

- **The symbol is for dark grounds.** The wordmark in the official lockup is
  near-white and disappears on light backgrounds. The site is dark throughout,
  which is why the mark holds up everywhere it appears.
- **Never recolour or restretch it.** `<QuorlynMark>` only takes a `size`, and
  it is always square. If you need a variant, produce it from the source
  artwork, not from CSS filters.
- **Clear space:** keep at least the height of the monogram's stem clear on all
  sides. In the lockup component that is the `gap-2.5` between mark and
  wordmark — do not tighten it.
- **Minimum size:** 24px. Below that the pixel dissolution turns to mush; use
  the ring alone or nothing.

## Brand colours

These are the tokens the site is built on. They are defined once, in
`src/app/globals.css`, and sampled from the logo gradient.

| Role   | Hex       | Token            |
| ------ | --------- | ---------------- |
| Cyan   | `#00CDFD` | `--color-cyan`   |
| Azure  | `#00A6FC` | `--color-azure`  |
| Blue   | `#1757FC` | `--color-blue`   |
| Violet | `#863AFB` | `--color-violet` |
| Magenta| `#B914FC` | `--color-magenta`|
| Ground | `#05070B` | `--color-void`   |

The gradient runs cyan → magenta. It is reserved for the mark, hairline rules,
the TECHNOLOGY subtitle, the hero lattice and focus states — never as a surface
fill, and never behind body text.
