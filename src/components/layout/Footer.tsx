import Link from "next/link";

import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { Container } from "@/components/ui/Container";
import { company, contact, socials } from "@/content/company";
import { services } from "@/content/services";

const columnLinkClass =
  "inline-flex py-1.5 text-sm text-muted transition-colors duration-150 ease-precise hover:text-fg";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <Container className="relative">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label="Quorlyn Technology — home"
              className="inline-flex items-center gap-3 rounded-sm"
            >
              <QuorlynMark size={36} />
              <span className="flex flex-col leading-none">
                <span className="font-brand text-lg font-normal tracking-[0.28em] text-wordmark">
                  QUORLYN
                </span>
                <span className="text-gradient-subtitle mt-1.5 font-mono text-[9px] tracking-[0.42em]">
                  TECHNOLOGY
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{company.descriptor}</p>

            <p className="mt-6 text-sm text-subtle">
              {company.location.locality}, {company.location.country}
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3 lg:col-span-7 lg:gap-8">
            <div>
              <h2 className="font-sans text-sm font-semibold tracking-normal text-fg">
                Company
              </h2>
              <ul className="mt-4 flex flex-col">
                <li>
                  <Link href="/about" className={columnLinkClass}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/work" className={columnLinkClass}>
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/services" className={columnLinkClass}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={columnLinkClass}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-sm font-semibold tracking-normal text-fg">
                Services
              </h2>
              <ul className="mt-4 flex flex-col">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services#${service.slug}`} className={columnLinkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-sm font-semibold tracking-normal text-fg">
                Contact
              </h2>
              <ul className="mt-4 flex flex-col">
                {contact.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className={columnLinkClass}>
                      {contact.email}
                    </a>
                  </li>
                ) : (
                  <li className="py-1.5 text-sm text-subtle">
                    <Link href="/contact" className="underline underline-offset-4 hover:text-fg">
                      Use the contact form
                    </Link>
                  </li>
                )}

                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={columnLinkClass}>
                      {contact.phone}
                    </a>
                  </li>
                )}

                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={columnLinkClass}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-subtle">
            © {year} {company.legalName}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center text-sm text-subtle transition-colors duration-150 hover:text-muted"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="inline-flex min-h-11 items-center text-sm text-subtle transition-colors duration-150 hover:text-muted"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
