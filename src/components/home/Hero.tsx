import { HeroLattice } from "@/components/home/HeroLattice";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
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
    <section className="relative overflow-hidden border-b border-line">
      {/* Visual ground. The mask keeps the lattice off the headline's column
          on wide screens and pushes it below the copy on small ones. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [mask-image:radial-gradient(130%_85%_at_60%_100%,#000_20%,transparent_80%)] lg:[mask-image:radial-gradient(66%_125%_at_84%_48%,#000_42%,transparent_80%)]"
      >
        <HeroLattice />
      </div>

      {/* A single violet bloom, low opacity, anchoring the composition's weight
          to the right. This is the only ambient glow on the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-32 hidden size-[36rem] rounded-full bg-violet/[0.07] blur-[120px] lg:block"
      />

      <Container className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-24 sm:py-28 lg:min-h-[46rem] lg:py-32">
        <div className="max-w-4xl">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-label tracking-[0.2em] text-subtle uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-cyan/60" />
              Software engineering — {company.location.locality}, {company.location.country}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-display text-fg">
              We build software
              <br />
              that <span className="text-gradient-brand">holds up</span>.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-2xl text-lead text-muted">
              Quorlyn Technology designs, builds and runs web, mobile and AI-enabled systems. We
              start at the architecture, ship in slices you can use, and leave you with something
              your team can keep changing after we are gone.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg" className="group">
                Start a project
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="secondary">
                See what we do
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Capability strip — establishes scope immediately, without cards. */}
      <div className="relative border-t border-line bg-void/40 backdrop-blur-sm">
        <Container>
          <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
            {capabilities.map((item, i) => (
              <Reveal
                as="li"
                key={item.label}
                delay={i * 60}
                className={
                  // Hairlines drawn per-cell so the 2-col mobile grid and the
                  // 4-col desktop grid both read as one continuous table.
                  "border-line px-0 py-5 lg:px-6 lg:first:pl-0 lg:last:pr-0 " +
                  (i % 2 === 0 ? "pr-4 lg:pr-6" : "border-l pl-4 lg:border-l-0 lg:pl-6") +
                  (i < 2 ? " border-b lg:border-b-0" : "")
                }
              >
                <p className="font-display text-h4 text-fg">{item.label}</p>
                <p className="mt-1.5 font-mono text-[11px] tracking-[0.1em] text-subtle uppercase">
                  {item.detail}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
