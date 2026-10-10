import { Content } from "@/components/ui/Content";
import { cn } from "@/lib/cn";

/** A heading and optional explanation, without a duplicated section caption. */
export function SectionHeading({
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Content className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <Tag
        className={cn(
          "text-h2 text-fg",
          align === "left" && "max-w-[19ch] sm:max-w-[24ch]",
          align === "center" && "max-w-[22ch]",
        )}
      >
        {title}
      </Tag>

      {lead && (
        <p className={cn("mt-5 max-w-[62ch] text-lead text-muted", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </Content>
  );
}

/** Section wrapper — one vertical rhythm for the whole site. */
export function Section({
  children,
  id,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** `sunken` marks a band as a different surface without adding a border. */
  tone?: "default" | "sunken";
}) {
  return (
    <section
      id={id}
      className={cn(
        "site-section scroll-mt-24 py-20 sm:py-24 lg:py-28",
        tone === "sunken" && "bg-surface/40",
        className,
      )}
    >
      {children}
    </section>
  );
}
