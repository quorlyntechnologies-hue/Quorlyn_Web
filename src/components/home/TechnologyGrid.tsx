import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { techGroups } from "@/content/technologies";

/**
 * Technologies by layer, each with the reasoning that governs the choice.
 *
 * A logo wall communicates nothing except that a team has heard of things. The
 * note above each list is the part that carries information, so it is set
 * larger than the technology names themselves.
 */
export function TechnologyGrid() {
  return (
    <Section id="technology" tone="sunken" className="border-y border-line">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Technology"
          title="The stack, and why it is that stack"
          lead="We work across these layers. Selection is driven by the problem and the team that will inherit the system — not by what is currently interesting."
        />

        <div className="mt-14 grid mosaic overflow-hidden rounded-lg border border-line lg:grid-cols-3">
          {techGroups.map((group, i) => (
            <Reveal
              key={group.id}
              delay={Math.min(i * 60, 240)}
              className="flex flex-col bg-void p-7 sm:p-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h4 tracking-[0.08em] text-fg uppercase">
                  {group.label}
                </h3>
                <span aria-hidden="true" className="font-mono text-[11px] text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div aria-hidden="true" className="rule-brand mt-4 opacity-40" />

              <p className="mt-5 text-sm leading-relaxed text-muted">{group.note}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 max-w-[70ch] text-sm text-subtle">
            This list reflects what the team works with today. It is not a menu — if a project is
            better served by something not on it, we will say so.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
