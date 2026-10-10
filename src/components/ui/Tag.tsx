import { cn } from "@/lib/cn";

/** Compact taxonomy text; these labels do not behave like buttons. */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "pending";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-sm leading-snug",
        tone === "default" && "text-muted",
        tone === "accent" && "text-accent",
        // Pending items must not read as shipped work — hence the dashed edge,
        // which carries the meaning without relying on colour alone.
        tone === "pending" && "border-b border-dashed border-line-strong text-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}
