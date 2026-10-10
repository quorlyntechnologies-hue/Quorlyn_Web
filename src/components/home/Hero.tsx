import { LogoScene } from "@/components/brand/LogoScene";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";
import { company } from "@/content/company";

/** The four lines under the fold — what the company does, stated flatly. */
const capabilities = [
  { label: "Product engineering", detail: "Web · Mobile" },
  { label: "AI engineering", detail: "LLM · Retrieval" },
  { label: "Platform & cloud", detail: "Infra · CI/CD" },
  { label: "Data engineering", detail: "Pipelines · Warehouse" },
];

export function Hero() {
  return (
    <section className="hero-section relative overflow-hidden border-b border-line">
      <Container className="hero-layout relative">
        <div className="hero-copy">
          <Content>
            <h1 className="hero-title text-fg">
              Software your team
              <br />
              can maintain.
            </h1>
          </Content>

          <Content>
            <p className="mt-8 max-w-[54ch] text-lead text-muted">
              We design, build and run web, mobile and AI-enabled systems from {company.location.locality}, {company.location.country}.
              We plan the architecture, release working software in stages, and document
              the code and infrastructure for your team.
            </p>
          </Content>

          <Content>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg" className="group">
                Start a project
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="secondary">
                See what we do
              </ButtonLink>
            </div>
          </Content>
        </div>
        <LogoScene />
      </Container>

      {/* Capability strip — establishes scope immediately, without cards. */}
      <div className="capability-strip relative border-t border-line">
        <Container>
          <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
            {capabilities.map((item, i) => (
              <Content
                as="li"
                key={item.label}
                className={
                  // Hairlines drawn per-cell so the 2-col mobile grid and the
                  // 4-col desktop grid both read as one continuous table.
                  "border-line px-0 py-5 lg:px-6 lg:first:pl-0 lg:last:pr-0 " +
                  (i % 2 === 0 ? "pr-4 lg:pr-6" : "border-l pl-4 lg:border-l-0 lg:pl-6") +
                  (i < 2 ? " border-b lg:border-b-0" : "")
                }
              >
                <p className="text-h4 font-medium text-fg">{item.label}</p>
                <p className="mt-1.5 text-sm text-subtle">
                  {item.detail}
                </p>
              </Content>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
