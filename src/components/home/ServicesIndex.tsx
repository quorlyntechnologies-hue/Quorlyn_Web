import Link from "next/link";

import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";

/**
 * Services as a technical index rather than a card grid.
 *
 * Full-width rows read as a table of contents — they scan faster than cards,
 * scale to any number of services, and avoid the three-identical-boxes pattern
 * that makes a site look generated.
 */
export function ServicesIndex() {
  return (
    <Section id="services" tone="sunken" className="border-y border-line">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="01"
            eyebrow="Services"
            title="Six ways we tend to be useful"
            lead="Engagements usually start with one of these and grow into the others as the system does."
          />
          <Reveal delay={120} className="shrink-0">
            <ButtonLink href="/services" variant="secondary" className="group">
              All services
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="mt-14 border-t border-line">
          {services.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={Math.min(i * 50, 200)}>
              <Link
                href={`/services#${service.slug}`}
                className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-b border-line py-7 transition-colors duration-200 ease-precise hover:bg-white/[0.02] sm:grid-cols-12 sm:py-8"
              >
                <span className="font-mono text-label tracking-[0.14em] text-subtle transition-colors duration-200 group-hover:text-accent sm:col-span-1">
                  {service.index}
                </span>

                <h3 className="text-h3 text-fg sm:col-span-4">{service.title}</h3>

                <p className="text-sm leading-relaxed text-muted sm:col-span-6">
                  {service.summary}
                </p>

                <span className="hidden justify-end text-subtle transition-colors duration-200 group-hover:text-fg sm:col-span-1 sm:flex">
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
