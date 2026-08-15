import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Public site chrome: skip link, navigation, main landmark, footer.
 *
 * Lives here rather than in the root layout so `/admin` can opt out — staff
 * working a lead should not be one stray click from the marketing site, and the
 * public footer's service links are noise in that context.
 *
 * Shared by `(site)/layout.tsx` and the global `not-found.tsx`, which sits
 * outside the route group but should still look like the website.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-fg focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
