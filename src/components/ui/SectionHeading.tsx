import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Every section opens the same way: an indexed mono eyebrow above a display
 * heading, with an optional lead paragraph held to a reading measure.
 *
 * The index (`01`, `02`, …) is the site's structural signature — it reads as
 * technical documentation rather than marketing, and it gives long scrolling
 * pages a sense of position.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <div
        className={cn(
          "flex items-center gap-3 font-mono text-label tracking-[0.2em] uppercase",
          align === "center" && "justify-center",
        )}
      >
        {index && <span className="text-accent">{index}</span>}
        <span className="text-subtle">{eyebrow}</span>
      </div>

      <Tag
        className={cn(
          "mt-5 text-h2 text-fg",
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
    </Reveal>
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
        "scroll-mt-24 py-20 sm:py-24 lg:py-32",
        tone === "sunken" && "bg-surface/40",
        className,
      )}
    >
      {children}
    </section>
  );
}
