import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/process";

/**
 * Ordered steps with concrete outputs.
 *
 * A sticky heading holds context on the left while the steps scroll past on the
 * right, each anchored to a restrained solid rail. On narrow screens the
 * rail moves to the leading edge and the layout collapses to one column.
 */
export function Process() {
  return (
    <Section id="process">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                title="How a project runs"
                lead="Scope, design, build, test, release and maintain. We agree the depth of each stage around the project."
              />
            </div>
          </div>

          <ol className="relative lg:col-span-7">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[7px] w-px bg-line-strong"
            />

            {processSteps.map((step) => (
              <Content
                as="li"
                key={step.index}
                className="group relative pb-10 pl-10 last:pb-0 sm:pl-12"
              >
                {/* Node. Filled square, not a dot — the pixel motif again. */}
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 flex size-[15px] items-center justify-center"
                >
                  <span className="size-[7px] bg-accent ring-4 ring-void" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-sm font-medium text-accent tabular-nums">
                    {step.index}
                  </span>
                  <h3 className="text-h3 text-fg">{step.title}</h3>
                </div>

                <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">{step.body}</p>

                <p className="mt-4 text-sm text-subtle">
                  <span className="font-medium">Deliverable: </span>{step.output}
                </p>
              </Content>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
