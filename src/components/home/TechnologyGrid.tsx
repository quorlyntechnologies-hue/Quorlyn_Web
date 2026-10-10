import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { techGroups } from "@/content/technologies";

/** Named layers, selection rationale and tools in readable rows. */
export function TechnologyGrid() {
  return (
    <Section id="technology" tone="sunken" className="border-y border-line">
      <Container>
        <SectionHeading
          title="Tools we work with"
          lead="The stack depends on your system, budget and team. These are the tools we currently work with."
        />

        <dl className="mt-12">
          {techGroups.map((group) => (
            <div key={group.id} className="grid gap-4 border-t border-line py-7 lg:grid-cols-12 lg:gap-8">
              <dt className="text-h4 font-medium text-fg lg:col-span-3">{group.label}</dt>
              <dd className="leading-relaxed text-muted lg:col-span-5">{group.note}</dd>
              <dd className="text-sm leading-relaxed text-subtle lg:col-span-4">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
