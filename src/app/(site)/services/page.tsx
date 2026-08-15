import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { services } from "@/content/services";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product engineering, AI engineering, platform and cloud, data engineering, interface design and technical consulting — what each involves and how Quorlyn approaches it.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services — Quorlyn Technology", url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we do, and how we go about it"
        lead="Six capabilities, described by the problem each one solves rather than by a list of adjectives. Most engagements combine two or three."
      />

      {/* In-page index. On a page this long, a jump list is worth more than
          another decorative section. */}
      <div className="border-b border-line bg-surface/40">
        <Container>
          <nav aria-label="Services on this page" className="py-6">
            <ul className="mask-fade-edges -mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {services.map((service) => (
                <li key={service.slug} className="shrink-0">
                  <Link
                    href={`#${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-sm text-muted transition-colors duration-150 ease-precise hover:border-line-strong hover:text-fg"
                  >
                    <span className="font-mono text-[11px] text-subtle">{service.index}</span>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>

      {services.map((service, i) => (
        <Section
          key={service.slug}
          id={service.slug}
          tone={i % 2 === 1 ? "sunken" : "default"}
          className={i % 2 === 1 ? "border-y border-line" : undefined}
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              {/* Left rail: the identifier. Sticky on desktop so the heading
                  stays with its content through a long block. */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <Reveal>
                    <span className="font-mono text-label tracking-[0.2em] text-accent">
                      {service.index}
                    </span>
                    <h2 className="mt-4 text-h2 text-fg">{service.title}</h2>
                    <p className="mt-5 leading-relaxed text-muted">{service.summary}</p>

                    {service.technologies.length > 0 && (
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <li key={tech}>
                            <Tag>{tech}</Tag>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <Reveal className="rounded-lg border border-line bg-void/60 p-6 sm:p-7">
                    <h3 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                      The problem
                    </h3>
                    <p className="mt-4 leading-relaxed text-fg">{service.problem}</p>
                  </Reveal>

                  <Reveal delay={80} className="rounded-lg border border-line bg-void/60 p-6 sm:p-7">
                    <h3 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                      Our approach
                    </h3>
                    <p className="mt-4 leading-relaxed text-fg">{service.approach}</p>
                  </Reveal>
                </div>

                <Reveal delay={140} className="mt-8">
                  <h3 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                    Typical deliverables
                  </h3>
                  {/* Hairline rows rather than a gap-px mosaic: deliverable
                      counts are odd as often as even, and an unfilled grid cell
                      in a mosaic renders as a stray lit rectangle. */}
                  <ul className="mt-4 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 border-b border-line py-3.5 text-sm text-muted"
                      >
                        <span aria-hidden="true" className="mt-[7px] size-[5px] shrink-0 bg-cyan/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={200} className="mt-8">
                  {/* Visible label stays short so it never wraps at 320px; the
                      accessible name keeps the service in it, so a screen
                      reader listing links does not hear six identical entries. */}
                  <ButtonLink
                    href={`/contact?service=${service.slug}`}
                    variant="secondary"
                    aria-label={`Discuss ${service.title} with Quorlyn`}
                    className="group"
                  >
                    Discuss this service
                    <ArrowRight />
                  </ButtonLink>
                </Reveal>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <CTASection
        eyebrow="Scoping"
        title="Not sure which of these you need?"
        body="That is a normal place to start. Describe the situation and we will tell you what the work actually looks like — including if it is smaller than you expected."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
      />
    </>
  );
}
