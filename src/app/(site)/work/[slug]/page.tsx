import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

/**
 * Case study template.
 *
 * `projects` is currently empty, so this route generates no pages — it exists
 * so publishing a case study is a content change, not an engineering task.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — Quorlyn Technology`,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const sections = [
    { label: "Challenge", body: project.challenge },
    { label: "Approach", body: project.approach },
    { label: "Solution", body: project.solution },
  ];

  return (
    <>
      <PageHeader
        eyebrow={project.category}
        title={project.title}
        lead={project.summary}
        meta={[
          { label: "Client", value: project.client ?? "Under NDA" },
          { label: "Year", value: project.year },
          { label: "Category", value: project.category },
          { label: "Stack", value: project.technologies.slice(0, 3).join(", ") },
        ]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-12 lg:col-span-8">
              {sections.map((section, i) => (
                <Reveal key={section.label} delay={Math.min(i * 60, 180)}>
                  <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                    {section.label}
                  </h2>
                  <p className="mt-4 text-lead leading-relaxed text-muted">{section.body}</p>
                </Reveal>
              ))}

              {project.images.map((image) => (
                <Reveal key={image.src}>
                  <figure className="overflow-hidden rounded-lg border border-line">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1600}
                      height={1000}
                      className="h-auto w-full"
                      sizes="(min-width: 1024px) 60rem, 100vw"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-32">
                <Reveal className="rounded-lg border border-line bg-surface/50 p-6">
                  <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                    Technology
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Tag>{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Rendered only when measured, client-approved numbers exist. */}
                {project.metrics.length > 0 && (
                  <Reveal delay={80} className="rounded-lg border border-line bg-surface/50 p-6">
                    <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
                      Outcome
                    </h2>
                    <dl className="mt-5 space-y-5">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt className="text-sm text-muted">{metric.label}</dt>
                          <dd className="mt-1 font-display text-h3 text-fg">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                )}

                <Reveal delay={140}>
                  <Link
                    href="/work"
                    className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-accent uppercase"
                  >
                    All work
                    <ArrowRight />
                  </Link>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection
        eyebrow="Similar problem?"
        title="Tell us where yours differs"
        body="The useful conversation is usually about the constraint that makes your version harder than this one."
      />
    </>
  );
}
