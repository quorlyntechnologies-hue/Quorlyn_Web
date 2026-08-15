import Link from "next/link";

import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { projects, workFocusAreas } from "@/content/projects";

/**
 * Work section.
 *
 * With no published case studies, this renders the honest state: what the team
 * is set up to take on, and an explicit line saying nothing is published yet.
 * Adding entries to `projects` switches it to the real grid automatically.
 */
export function WorkPreview() {
  const hasProjects = projects.length > 0;

  return (
    <Section id="work" tone="sunken" className="border-y border-line">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow="Work"
            title={hasProjects ? "Selected engagements" : "What we are built to take on"}
            lead={
              hasProjects
                ? "A closer look at how the work is scoped, built and measured."
                : "Quorlyn is new, and we have no client work cleared for publication yet. Rather than fill this space, here is the kind of problem the team is set up for."
            }
          />
          <Reveal delay={120} className="shrink-0">
            <ButtonLink href="/work" variant="secondary" className="group">
              {hasProjects ? "All work" : "More on our focus"}
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>

        {hasProjects ? (
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {projects.slice(0, 4).map((project, i) => (
              <Reveal as="li" key={project.slug} delay={Math.min(i * 70, 210)}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-line bg-void p-7 transition-colors duration-300 ease-precise hover:border-line-strong hover:bg-surface sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <Tag tone="accent">{project.category}</Tag>
                    <span className="font-mono text-[11px] text-subtle">{project.year}</span>
                  </div>
                  <h3 className="mt-5 text-h3 text-fg">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                    Read case study
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="mt-14 grid mosaic overflow-hidden rounded-lg border border-line md:grid-cols-3">
            {workFocusAreas.map((area, i) => (
              <Reveal
                as="li"
                key={area.index}
                delay={Math.min(i * 70, 210)}
                className="flex flex-col bg-void p-7 sm:p-9"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] tracking-[0.16em] text-accent"
                >
                  {area.index}
                </span>
                <h3 className="mt-4 text-h3 text-fg">{area.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{area.body}</p>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
