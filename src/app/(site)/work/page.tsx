import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { projects, workFocusAreas } from "@/content/projects";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Work",
  description: "Published work by Quorlyn Technology, including Tripper Driving Simulator on Playgama.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Work — Quorlyn Technology", url: "/work" },
};

export default function WorkPage() {
  const hasProjects = projects.length > 0;
  return (
    <>
      <PageHeader
        title={hasProjects ? "Published work" : "Project work"}
        lead={hasProjects
          ? "Products we have built and released. Explore the project or try it for yourself."
          : "We have no published case studies yet. These are the kinds of projects we can take on; see our services for the approach and deliverables."}
      />
      <Section>
        <Container>
          {hasProjects ? (
            <ul>
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectPreview project={project} headingLevel={2} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <SectionHeading title="Projects we can take on" />
              <ul className="mt-12">
                {workFocusAreas.map((area) => (
                  <li key={area.index} className="grid gap-3 border-t border-line py-7 md:grid-cols-12 md:gap-8">
                    <h3 className="text-h3 text-fg md:col-span-4">{area.title}</h3>
                    <p className="max-w-[65ch] leading-relaxed text-muted md:col-span-8">{area.body}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Section>
      <CTASection
        title="Have a project like these?"
        body="Tell us what you need to build or change. We can discuss the scope and how to approach it."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])),
      }} />
    </>
  );
}
