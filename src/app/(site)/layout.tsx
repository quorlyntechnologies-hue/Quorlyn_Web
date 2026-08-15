import { SiteChrome } from "@/components/layout/SiteChrome";

/**
 * Layout for the public marketing site.
 *
 * `(site)` is a route group: it adds this layout without appearing in any URL,
 * so `/about` stays `/about`. Its only job is to keep the public chrome off
 * `/admin`, which renders its own.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
