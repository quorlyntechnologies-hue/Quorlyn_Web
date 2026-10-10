import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { projects, workFocusAreas } from "@/content/projects";

/**
 * Work section.
 *
 * Published products and approved case studies share the real work list.
 * When empty, show capabilities without representing them as completed work.
 */
export function WorkPreview() {
  const hasProjects = projects.length > 0;

  return (
    <Section id="work" tone="sunken" className="border-y border-line">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title={hasProjects ? "Published work" : "Projects we can take on"}
            lead={
              hasProjects
                ? "Explore a project we have built and released."
                : "We have no published client case studies yet. These are the kinds of projects we can work on."
            }
          />
          <Content className="shrink-0">
            <ButtonLink href="/work" variant="secondary" className="group">
              {hasProjects ? "All work" : "More on our focus"}
              <ArrowRight />
            </ButtonLink>
          </Content>
        </div>

        {hasProjects ? (
          <ul className="mt-12">
            {projects.slice(0, 4).map((project) => (
              <Content as="li" key={project.slug}>
                <ProjectPreview project={project} />
              </Content>
            ))}
          </ul>
        ) : (
          <ul className="mt-12">
            {workFocusAreas.map((area) => (
              <Content
                as="li"
                key={area.index}
                className="grid gap-3 border-t border-line py-7 md:grid-cols-12 md:gap-8"
              >
                <h3 className="text-h3 text-fg md:col-span-4">{area.title}</h3>
                <p className="max-w-[65ch] leading-relaxed text-muted md:col-span-8">{area.body}</p>
              </Content>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
