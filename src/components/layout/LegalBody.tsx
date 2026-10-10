import { Content } from "@/components/ui/Content";

/**
 * Typographic wrapper for legal prose.
 *
 * Legal pages are the one place with unstyled nested markup, so the styling is
 * applied here with descendant selectors rather than adding @tailwindcss/typography
 * for two documents.
 */
export function LegalBody({
  children,
  updated,
}: {
  children: React.ReactNode;
  updated: string;
}) {
  return (
    <Content>
      <p className="text-sm text-subtle">{updated}</p>

      <div
        className={
          "mt-10 space-y-6 leading-relaxed text-muted " +
          "[&_h2]:mt-12 [&_h2]:text-h3 [&_h2]:text-fg first:[&_h2]:mt-0 " +
          "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80 " +
          "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        }
      >
        {children}
      </div>
    </Content>
  );
}
