/**
 * Single source of truth for company facts.
 *
 * RULE: everything in `company` is a verified fact. Anything not yet confirmed
 * lives in `pending` and is rendered by the UI as an explicit placeholder —
 * never as a claim. Do not move a value out of `pending` until it is real.
 */

export const company = {
  name: "Quorlyn Technology",
  legalName: "Quorlyn Technology Private Limited",
  shortName: "Quorlyn",
  domain: "quorlyn.com.np",
  url: "https://quorlyn.com.np",

  /** One line, used in the footer, meta description and JSON-LD. */
  descriptor:
    "A software engineering company building web, mobile and AI-enabled products — from architecture through to production.",

  founded: "2026",

  location: {
    locality: "Kathmandu",
    region: "Bagmati",
    country: "Nepal",
    countryCode: "NP",
  },
} as const;

/**
 * Not yet supplied. The UI reads these and renders a labelled placeholder when
 * a value is empty, so the site is never blocked on them and never invents them.
 *
 * Populate via .env.local (see .env.example) or by editing this file directly.
 */
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  /** Street-level address, once the company chooses to publish one. */
  streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS ?? "",
} as const;

/** Add entries as accounts go live. An empty list renders no social row at all. */
export const socials: Array<{ label: string; href: string }> = [];

export const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
] as const;
