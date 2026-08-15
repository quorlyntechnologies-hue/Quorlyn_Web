import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeading";

/** Sits directly under the hero: what the company is, in one paragraph, with
 *  the operating constraints that follow from it listed alongside. */
const commitments = [
  {
    label: "Scope",
    body: "Fixed in writing before the build starts, with the trade-offs named.",
  },
  {
    label: "Visibility",
    body: "Running software in a real environment from the first week onward.",
  },
  {
    label: "Ownership",
    body: "You keep the code, the infrastructure and the accounts. No lock-in.",
  },
];

export function Positioning() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-label tracking-[0.2em] text-subtle uppercase">
                <span className="text-accent">00</span>
                What we are
              </p>
            </Reveal>

            <Reveal delay={80}>
              {/* Deliberately set at h2 size rather than display: this is a
                  paragraph doing a heading's job, and it must stay readable. */}
              <p className="mt-6 font-display text-h2 leading-[1.18] text-fg">
                A small engineering team that takes a system from the first
                architecture decision to the release after launch.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 space-y-5 text-lead text-muted">
                <p>
                  Most software does not fail at launch. It fails eighteen months later, when a
                  change that should take a day takes a quarter, and nobody left on the team knows
                  why the system is shaped the way it is.
                </p>
                <p>
                  We build for that moment. Typed boundaries, migrations, tests where they earn
                  their keep, and decisions written down while the reasoning is still fresh — so the
                  second year of a product costs less than the first.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-14">
            <Reveal delay={200}>
              <div className="rounded-lg border border-line bg-surface/50 p-6 sm:p-8">
                <p className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
                  How we work
                </p>
                <dl className="mt-6 space-y-6">
                  {commitments.map((item) => (
                    <div key={item.label} className="border-t border-line pt-5 first:border-0 first:pt-0">
                      <dt className="font-display text-h4 text-fg">{item.label}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
