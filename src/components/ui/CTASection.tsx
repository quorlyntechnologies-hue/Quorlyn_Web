import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";

/**
 * The closing conversion band. Used at the foot of every page, so its copy is
 * a prop — a visitor who has read the services page should not be asked the
 * same question as one arriving from the homepage.
 */
export function CTASection({
  title = "Tell us about your project",
  body = "Describe what you need to build or change, what is getting in the way, and any budget or deadline you have in mind.",
  primaryLabel = "Start a project",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="closing-cta relative overflow-hidden border-t border-line">
      <Container className="relative">
        <div className="cta-content flex flex-col items-start py-24 sm:py-28 lg:py-32">
          <Content>
            <h2 className="max-w-[22ch] text-h1 text-fg">{title}</h2>
          </Content>

          <Content>
            <p className="mt-6 max-w-[56ch] text-lead text-muted">{body}</p>
          </Content>

          <Content>
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
          </Content>
        </div>
      </Container>
    </section>
  );
}
