import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Content } from "@/components/ui/Content";
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
        title="An engineering company in Kathmandu"
        lead="Quorlyn Technology builds web, mobile and AI-enabled systems. We are a small team, founded in 2026, with engineers involved from scoping through implementation."
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
                  title="A small team, directly involved"
                />
              </div>
            </div>

            <div className="space-y-6 text-lead leading-relaxed text-muted lg:col-span-7">
              <Content>
                <p>
                  Quorlyn Technology Private Limited is a software engineering company registered in
                  Nepal and based in Kathmandu. We build web and mobile products, AI-enabled
                  features, the cloud infrastructure underneath them, and the data systems that make
                  any of it measurable.
                </p>
              </Content>
              <Content>
                <p>
                  We are a new company. We document project decisions, release working software
                  for review, and discuss constraints as they become clear. No client case studies
                  are published yet.
                </p>
              </Content>
              <Content>
                <p>
                  The team is deliberately small. The people scoping your project are the people
                  writing the code. You can discuss the scope and technical decisions directly
                  with them.
                </p>
              </Content>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sunken" className="border-y border-line">
        <Container>
          <SectionHeading
            title="How we make engineering decisions"
            lead="These principles guide our recommendations, implementation and handover."
          />

          <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
            {beliefs.map((belief) => (
              <Content
                key={belief.index}
                className="border-t border-line py-7"
              >
                <h3 className="text-h3 text-fg">{belief.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{belief.body}</p>
              </Content>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
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
