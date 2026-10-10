import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
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
    body: "Working software released in stages, with progress you can review.",
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
            <Content>
              <h2 className="text-h2 text-fg">
                From architecture to the next release
              </h2>
            </Content>

            <Content>
              <div className="mt-8 space-y-5 text-lead text-muted">
                <p>
                  A product needs work after its first release: new features, changing data,
                  deployment updates and fixes. Your team needs to understand how it was built.
                </p>
                <p>
                  We document technical decisions, version database changes, and test the parts
                  a change could break. You keep the code, infrastructure and accounts.
                </p>
              </div>
            </Content>
          </div>

          <div className="lg:col-span-5 lg:pt-14">
            <Content>
              <div className="border-t border-line pt-6">
                <h3 className="text-h4 text-fg">
                  How we work
                </h3>
                <dl className="mt-6 space-y-6">
                  {commitments.map((item) => (
                    <div key={item.label} className="border-t border-line pt-5 first:border-0 first:pt-0">
                      <dt className="text-h4 font-medium text-fg">{item.label}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Content>
          </div>
        </div>
      </Container>
    </Section>
  );
}
