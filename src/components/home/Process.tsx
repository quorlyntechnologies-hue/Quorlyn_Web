import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/process";

/**
 * Process as an instrumented spine.
 *
 * A sticky heading holds context on the left while the steps scroll past on the
 * right, each anchored to a node on a brand-gradient rail. On narrow screens the
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
                index="04"
                eyebrow="Process"
                title="Six stages, in the order they actually happen"
                lead="The shape is consistent; the depth of each stage is not. A two-week integration and a nine-month platform build run the same sequence at different weights."
              />
            </div>
          </div>

          <ol className="relative lg:col-span-7">
            {/* The rail. Gradient runs cyan → violet top to bottom, mirroring
                the mark's own transition. */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-cyan via-blue to-violet opacity-45"
            />

            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.index}
                delay={Math.min(i * 60, 240)}
                className="group relative pb-10 pl-10 last:pb-0 sm:pl-12"
              >
                {/* Node. Filled square, not a dot — the pixel motif again. */}
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 flex size-[15px] items-center justify-center"
                >
                  <span className="size-[7px] bg-cyan shadow-node transition-transform duration-300 ease-precise group-hover:scale-125" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-label tracking-[0.16em] text-accent">
                    {step.index}
                  </span>
                  <h3 className="text-h3 text-fg">{step.title}</h3>
                </div>

                <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">{step.body}</p>

                <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">
                  Output — {step.output}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
