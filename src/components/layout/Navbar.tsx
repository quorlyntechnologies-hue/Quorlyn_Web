"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { nav } from "@/content/company";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The bar only changes at one threshold — a single state flip, not a value
  // that tracks scroll position, so there is nothing to animate per frame.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the panel is open it owns the viewport: background scroll is locked,
  // Escape closes and returns focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }

      // Focus trap — the panel is the only reachable region while open.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Every link inside the panel closes it. Handled on click rather than by
  // watching `pathname`, which would be a render-triggering effect and would
  // also fire on navigations the panel had nothing to do with.
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ease-precise",
        scrolled || menuOpen
          ? "border-b border-line bg-void"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo size="sm" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative flex h-11 items-center rounded-sm px-3.5 text-sm transition-colors duration-150 ease-precise",
                    isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {/* Active state is a brand hairline, not a colour swap alone. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3.5 -bottom-px h-px transition-opacity duration-200",
                      isActive(item.href) ? "bg-accent opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Visibility lives on a wrapper, not on the button. Button's base
              class sets `inline-flex`, and Tailwind emits that after `hidden`
              in the cascade — so `hidden` on the button itself would lose
              regardless of class order. Below sm the panel carries the CTA. */}
          <span className="hidden sm:flex">
            <ButtonLink href="/contact" size="sm" className="group">
              Start a project
              <ArrowRight />
            </ButtonLink>
          </span>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 hover:bg-fg/5 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-300 ease-precise",
                  menuOpen ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-300 ease-precise",
                  menuOpen ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile panel. Rendered only when open so its links stay out of the tab
          order on desktop and for screen readers when closed. */}
      {menuOpen && (
        <div
          ref={panelRef}
          id="mobile-menu"
          className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-void lg:hidden"
        >
          <Container className="flex min-h-full flex-col py-8">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {nav.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-baseline gap-4 py-5 font-display text-h3 transition-colors duration-150",
                        isActive(item.href) ? "text-fg" : "text-muted",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-10">
              <ButtonLink href="/contact" size="lg" onClick={closeMenu} className="group w-full">
                Start a project
                <ArrowRight />
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
