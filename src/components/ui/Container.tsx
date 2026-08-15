import { cn } from "@/lib/cn";

/**
 * The single source of horizontal rhythm. Max width and gutters come from CSS
 * variables that step up at md/xl, so every page shares one measure and no
 * section can invent its own inset.
 */
export function Container({
  children,
  className,
  size = "default",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** `narrow` is for long-form reading measure (~65ch). */
  size?: "default" | "narrow" | "wide";
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-(--gutter)",
        size === "default" && "max-w-(--container-max)",
        size === "narrow" && "max-w-3xl",
        size === "wide" && "max-w-[92rem]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
