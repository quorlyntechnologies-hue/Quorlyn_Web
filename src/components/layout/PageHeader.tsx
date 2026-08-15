import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared masthead for every page below the homepage.
 *
 * Deliberately quieter than the hero — the lattice appears only as a static
 * grid, so internal pages feel like the same site without re-running the
 * homepage's entrance every time.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Optional label/value pairs shown as a technical strip under the lead. */
  meta?: Array<{ label: string; value: string }>;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="bg-lattice mask-fade-b pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 size-[30rem] rounded-full bg-blue/[0.06] blur-[110px]"
      />

      <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-label tracking-[0.2em] text-subtle uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-cyan/60" />
            {eyebrow}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-[16ch] text-h1 text-fg">{title}</h1>
        </Reveal>

        {lead && (
          <Reveal delay={140}>
            <p className="mt-7 max-w-[64ch] text-lead text-muted">{lead}</p>
          </Reveal>
        )}

        {meta && meta.length > 0 && (
          <Reveal delay={200}>
            <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </Container>
    </header>
  );
}
