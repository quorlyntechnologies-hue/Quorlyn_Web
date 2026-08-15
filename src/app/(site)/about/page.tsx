import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/content/company";
import { beliefs } from "@/content/principles";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "Quorlyn Technology is a software engineering company registered in Nepal, building web, mobile and AI-enabled systems. How we work, and what we believe about building software.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About — Quorlyn Technology", url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A company built around how software actually ages"
        lead="Quorlyn Technology is an engineering company in Kathmandu. We are new, deliberately small, and more interested in systems that stay workable than in shipping something impressive once."
        meta={[
          { label: "Registered", value: company.legalName },
          { label: "Based in", value: `${company.location.locality}, ${company.location.country}` },
          { label: "Founded", value: company.founded },
          { label: "Focus", value: "Product, AI, platform, data" },
        ]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  index="01"
                  eyebrow="Who we are"
                  title="Small, technical, and direct about it"
                />
              </div>
            </div>

            <div className="space-y-6 text-lead leading-relaxed text-muted lg:col-span-7">
              <Reveal>
                <p>
                  Quorlyn Technology Private Limited is a software engineering company registered in
                  Nepal and based in Kathmandu. We build web and mobile products, AI-enabled
                  features, the cloud infrastructure underneath them, and the data systems that make
                  any of it measurable.
                </p>
              </Reveal>
              <Reveal delay={60}>
                <p>
                  We are early. There is no decade of case studies here and we are not going to
                  manufacture one. What we can be judged on is the way the work is run: what gets
                  written down, how quickly something real reaches an environment you can open, and
                  whether the difficult parts of a project get raised in week one or week twelve.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  The team is deliberately small. The people scoping your project are the people
                  writing the code, which removes the layer where estimates usually go wrong and
                  context usually gets lost.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sunken" className="border-y border-line">
        <Container>
          <SectionHeading
            index="02"
            eyebrow="What we believe"
            title="Six positions we build from"
            lead="These are opinions, not neutral best practice. They shape what we recommend and occasionally what we decline."
          />

          <div className="mt-14 grid mosaic overflow-hidden rounded-lg border border-line lg:grid-cols-2">
            {beliefs.map((belief, i) => (
              <Reveal
                key={belief.index}
                delay={Math.min(i * 60, 240)}
                className="group flex flex-col bg-void p-7 transition-colors duration-300 ease-precise hover:bg-surface sm:p-9"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[2.25rem] leading-none font-medium text-line-strong transition-colors duration-300 group-hover:text-cyan/40"
                >
                  {belief.index}
                </span>
                <h3 className="mt-5 text-h3 text-fg">{belief.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{belief.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading index="03" eyebrow="Team" title="The people, once there are people to name" />
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                {/* Honest empty state. The dashed edge marks it as unpopulated
                    structure rather than a designed element — and it is the
                    slot a real team grid drops into later. */}
                <div className="rounded-lg border border-dashed border-line-strong p-8 sm:p-10">
                  <p className="font-mono text-label tracking-[0.18em] text-subtle uppercase">
                    Not yet published
                  </p>
                  <p className="mt-5 text-lead leading-relaxed text-muted">
                    We are not listing a team page with stock photographs and invented job titles.
                    When the founding team is ready to be named publicly, their names, roles and
                    actual work will appear here.
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">
                    In the meantime, the fastest way to judge us is to send a real problem and see
                    what comes back.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Work with us"
        title="Bring us something difficult"
        body="An architecture you are unsure about, a build that has stalled, or a product that only exists as a document. All three are good first conversations."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />
    </>
  );
}
