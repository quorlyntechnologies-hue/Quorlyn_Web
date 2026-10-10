import { Container } from "@/components/ui/Container";
import { Content } from "@/components/ui/Content";

/**
 * Shared masthead for every page below the homepage.
 *
 * Reading pages use clear type and a plain ground; the live logo belongs to home.
 */
export function PageHeader({
  category,
  title,
  lead,
  actions,
  meta,
}: {
  category?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  /** Optional label/value pairs shown as a technical strip under the lead. */
  meta?: Array<{ label: string; value: string }>;
}) {
  return (
    <header className="page-masthead relative overflow-hidden border-b border-line">
      <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24">
        <Content>
          <h1 className="max-w-[22ch] text-h1 text-fg">{title}</h1>
          {category && <p className="mt-4 text-sm text-muted">{category}</p>}
        </Content>

        {lead && (
          <Content>
            <p className="mt-7 max-w-[64ch] text-lead text-muted">{lead}</p>
          </Content>
        )}

        {actions && <Content className="mt-8">{actions}</Content>}

        {meta && meta.length > 0 && (
          <Content>
            <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-subtle">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Content>
        )}
      </Container>
    </header>
  );
}
