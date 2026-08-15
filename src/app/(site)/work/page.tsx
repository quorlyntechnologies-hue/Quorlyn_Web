import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { projects, workFocusAreas } from "@/content/projects";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The kind of engineering problems Quorlyn Technology takes on, and how our case studies are structured. No client work is published yet.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Work — Quorlyn Technology", url: "/work" },
};

/** What every published case study will contain. Shown while the index is
 *  empty so the page states its own standard of evidence up front. */
const caseStudyStructure = [
  { label: "Challenge", body: "The situation as the client described it, and the constraint that made it hard." },
  { label: "Approach", body: "What we chose to do, what we chose not to, and why." },
  { label: "Solution", body: "The system as built — architecture, interface, infrastructure." },
  { label: "Technology", body: "Everything in the stack, including what was already there." },
  { label: "Outcome", body: "Measured results only, published with the client's agreement. Where nothing was measured, we say nothing." },
];

export default function WorkPage() {
  const hasProjects = projects.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={hasProjects ? "Selected engagements" : "No published case studies yet"}
        lead={
          hasProjects
            ? "How each project was scoped, built and measured."
            : "Quorlyn is a new company. Rather than dress this page with invented projects and borrowed metrics, here is the work we are set up for and the standard any case study here will have to meet."
        }
      />

      {hasProjects ? (
        <Section>
          <Container>
            <ul className="grid gap-6 md:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal as="li" key={project.slug} delay={Math.min(i * 70, 210)}>
                  <Link
                    href={`/work/${project.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-line bg-surface/40 p-7 transition-colors duration-300 ease-precise hover:border-line-strong hover:bg-surface sm:p-8"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <Tag tone="accent">{project.category}</Tag>
                      <span className="font-mono text-[11px] text-subtle">{project.year}</span>
                      {project.client && (
                        <span className="font-mono text-[11px] text-subtle">{project.client}</span>
                      )}
                    </div>
                    <h2 className="mt-5 text-h3 text-fg">{project.title}</h2>
                    <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                      Read case study
                      <ArrowRight />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ) : (
        <>
          <Section>
            <Container>
              <SectionHeading
                index="01"
                eyebrow="Focus"
                title="Where we are most useful"
                lead="Three shapes of problem the team is built around. If yours looks like one of these, the first conversation will be a short one."
              />

              <ul className="mt-14 grid mosaic overflow-hidden rounded-lg border border-line md:grid-cols-3">
                {workFocusAreas.map((area, i) => (
                  <Reveal
                    as="li"
                    key={area.index}
                    delay={Math.min(i * 70, 210)}
                    className="flex flex-col bg-void p-7 sm:p-9"
                  >
                    <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
                      {area.index}
                    </span>
                    <h3 className="mt-4 text-h3 text-fg">{area.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{area.body}</p>
                  </Reveal>
                ))}
              </ul>
            </Container>
          </Section>

          <Section tone="sunken" className="border-y border-line">
            <Container>
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-32">
                    <SectionHeading
                      index="02"
                      eyebrow="Standard"
                      title="What a case study here will contain"
                      lead="So that when this page fills up, you know what you are reading — and what we have chosen not to claim."
                    />
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <ol className="overflow-hidden rounded-lg border border-line">
                    {caseStudyStructure.map((row, i) => (
                      <Reveal
                        as="li"
                        key={row.label}
                        delay={Math.min(i * 50, 200)}
                        className="grid gap-2 border-b border-line bg-void/60 p-6 last:border-b-0 sm:grid-cols-12 sm:gap-6 sm:p-7"
                      >
                        <h3 className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase sm:col-span-4">
                          {row.label}
                        </h3>
                        <p className="leading-relaxed text-muted sm:col-span-8">{row.body}</p>
                      </Reveal>
                    ))}
                  </ol>

                  <Reveal delay={220} className="mt-6">
                    <p className="text-sm leading-relaxed text-subtle">
                      No metric appears on this site unless it was measured on a real system and the
                      client agreed to its publication.
                    </p>
                  </Reveal>
                </div>
              </div>
            </Container>
          </Section>
        </>
      )}

      <CTASection
        eyebrow="First project"
        title="Someone has to be the first case study"
        body="Early clients get a disproportionate amount of our attention, and a team that has every reason to make the work worth writing about."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
            ]),
          ),
        }}
      />
    </>
  );
}
