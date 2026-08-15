import type { Metadata } from "next";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { nav } from "@/content/company";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Global 404. Sits outside the `(site)` route group so it catches unmatched
 * URLs anywhere, and therefore applies the public chrome itself.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-lattice mask-fade-b absolute inset-0 opacity-40"
        />

        <Container className="relative flex min-h-[70dvh] flex-col items-center justify-center py-32 text-center">
          <QuorlynMark size={44} />

          <p className="mt-8 font-mono text-label tracking-[0.24em] text-subtle uppercase">
            Error 404
          </p>

          <h1 className="mt-5 max-w-[16ch] text-h1 text-fg">
            This page did not resolve
          </h1>

          <p className="mt-6 max-w-[52ch] text-lead text-muted">
            The address is wrong, or the page has moved. Everything the site has
            is one of these:
          </p>

          <nav aria-label="Site sections" className="mt-8">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <ButtonLink href={item.href} variant="secondary" size="sm">
                    {item.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </nav>

          <ButtonLink href="/" size="lg" className="group mt-10">
            Back to the homepage
            <ArrowRight />
          </ButtonLink>
        </Container>
      </section>
    </SiteChrome>
  );
}
