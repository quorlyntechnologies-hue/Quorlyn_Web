import type { Metadata, Viewport } from "next";

/**
 * Admin shell.
 *
 * The public site's Navbar and Footer live in the site route group, so this segment
 * deliberately renders its own chrome — staff should never be one stray click
 * from the marketing site while working a lead.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Quorlyn Admin" },
  // Belt and braces alongside the Disallow in robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { themeColor: "#05070b", colorScheme: "dark" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div data-theme="dark" className="min-h-dvh bg-void text-fg">{children}</div>;
}
