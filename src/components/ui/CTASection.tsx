import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The closing conversion band. Used at the foot of every page, so its copy is
 * a prop — a visitor who has read the services page should not be asked the
 * same question as one arriving from the homepage.
 */
export function CTASection({
  eyebrow = "Next step",
  title = "Have something worth building?",
  body = "Tell us what you are trying to make work. If we are not the right team for it, we will say so — and point you at who might be.",
  primaryLabel = "Start a conversation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-lattice absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="bg-cta-bloom absolute inset-0" />

      <Container className="relative">
        <div className="flex flex-col items-center py-24 text-center sm:py-28 lg:py-36">
          <Reveal>
            <QuorlynMark size={44} />
          </Reveal>

          <Reveal delay={70}>
            <p className="mt-8 font-mono text-label tracking-[0.2em] text-subtle uppercase">
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={130}>
            <h2 className="mt-5 max-w-[18ch] text-h1 text-fg">{title}</h2>
          </Reveal>

          <Reveal delay={190}>
            <p className="mt-6 max-w-[56ch] text-lead text-muted">{body}</p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={primaryHref} size="lg" className="group">
                {primaryLabel}
                <ArrowRight />
              </ButtonLink>
              {secondaryLabel && secondaryHref && (
                <ButtonLink href={secondaryHref} size="lg" variant="secondary">
                  {secondaryLabel}
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
