import { cn } from "@/lib/cn";

/** Small mono chip for technologies, categories and statuses. */
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
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none tracking-[0.06em] whitespace-nowrap",
        tone === "default" && "border-line bg-white/[0.03] text-muted",
        tone === "accent" && "border-cyan/25 bg-cyan/[0.07] text-accent",
        // Pending items must not read as shipped work — hence the dashed edge,
        // which carries the meaning without relying on colour alone.
        tone === "pending" && "border-dashed border-line-strong bg-transparent text-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}
