import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators } from "@/content/principles";

/**
 * Open columns separated by hairlines keep the working principles readable.
 */
export function WhyQuorlyn() {
  return (
    <Section>
      <Container>
        <SectionHeading
          title="Work directly with the engineers"
          lead="The people who scope the project write the code. Here is how we approach that work."
        />

        <div className="principles-grid mt-14 grid gap-x-12 sm:grid-cols-2">
          {differentiators.map((item) => (
            <Content
              key={item.index}
              className="group relative border-t border-line py-8 sm:py-10"
            >
              <h3 className="text-h3 text-fg">{item.title}</h3>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{item.body}</p>
            </Content>
          ))}
        </div>
      </Container>
    </Section>
  );
}
