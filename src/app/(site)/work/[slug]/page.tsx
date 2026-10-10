import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Content } from "@/components/ui/Content";
import { Section } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

/**
 * Published project template. Missing case-study narrative, stack and measured
 * results are omitted rather than filled with guessed implementation details.
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

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const sections = [
    { label: "About the game", body: project.overview },
    { label: "Challenge", body: project.challenge },
    { label: "Approach", body: project.approach },
    { label: "Solution", body: project.solution },
  ].filter((section) => section.body);
  const [cover, ...additionalImages] = project.images;

  return (
    <>
      <PageHeader
        category={project.category}
        title={project.title}
        lead={project.summary}
        actions={project.publication && (
          <ButtonLink href={project.publication.actionUrl} size="lg" className="group">
            {project.publication.actionLabel}<ArrowRight />
          </ButtonLink>
        )}
        meta={[
          ...(project.client ? [{ label: "Client", value: project.client }] : []),
          { label: "Year", value: project.year },
          ...(project.publication ? [{ label: "Platform", value: project.publication.platform }] : []),
          ...(project.technologies.length ? [{ label: "Stack", value: project.technologies.slice(0, 3).join(", ") }] : []),
        ]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-12 lg:col-span-8">
              {cover && (
                <figure className="overflow-hidden rounded-md">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    width={cover.width}
                    height={cover.height}
                    sizes="(min-width: 1280px) 50rem, (min-width: 1024px) 60vw, 100vw"
                    className="h-auto w-full"
                  />
                </figure>
              )}
              {sections.map((section) => (
                <Content key={section.label}>
                  <h2 className="text-h3 text-fg">
                    {section.label}
                  </h2>
                  <p className="mt-4 text-lead leading-relaxed text-muted">{section.body}</p>
                </Content>
              ))}

              {additionalImages.map((image) => (
                <Content key={image.src}>
                  <figure className="overflow-hidden rounded-lg border border-line">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="h-auto w-full"
                      sizes="(min-width: 1024px) 60rem, 100vw"
                    />
                  </figure>
                </Content>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-32">
                {project.publication && (
                  <Content className="border-t border-line pt-6">
                    <h2 className="text-h4 text-fg">Published on {project.publication.platform}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      The public listing credits Quorlyn Technology Private Limited as the developer.
                    </p>
                    <a
                      href={project.publication.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-accent hover:underline"
                    >
                      View game listing<ArrowRight />
                    </a>
                  </Content>
                )}
                {project.technologies.length > 0 && <Content className="border-t border-line pt-6">
                  <h2 className="text-h4 text-fg">
                    Technology
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Tag>{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </Content>}

                {/* Rendered only when measured, client-approved numbers exist. */}
                {project.metrics.length > 0 && (
                  <Content className="border-t border-line pt-6">
                    <h2 className="text-h4 text-fg">
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
                  </Content>
                )}

                <Content>
                  <Link
                    href="/work"
                    className="group inline-flex min-h-11 items-center gap-2 text-sm text-accent"
                  >
                    All work
                    <ArrowRight />
                  </Link>
                </Content>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Have a project in mind?"
        body="Tell us what you want to build. We can discuss the scope and how to approach it."
      />
    </>
  );
}
