import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators } from "@/content/principles";

/**
 * Differentiators on a hairline grid.
 *
 * The oversized index numerals do the visual work here — no icons, because a
 * generic glyph next to "Plainly stated trade-offs" adds nothing a reader can use.
 */
export function WhyQuorlyn() {
  return (
    <Section>
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Why Quorlyn"
          title="What you are actually choosing"
          lead="Positioning, not credentials — we are new, and would rather be judged on how we work than on a client list."
        />

        <div className="mt-14 grid mosaic overflow-hidden rounded-lg border border-line sm:grid-cols-2">
          {differentiators.map((item, i) => (
            <Reveal
              key={item.index}
              delay={Math.min(i * 70, 210)}
              className="group relative bg-void p-7 transition-colors duration-300 ease-precise hover:bg-surface sm:p-9"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[2.5rem] leading-none font-medium text-line-strong transition-colors duration-300 group-hover:text-cyan/40"
              >
                {item.index}
              </span>
              <h3 className="mt-5 text-h3 text-fg">{item.title}</h3>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
