import Link from "next/link";

import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { cn } from "@/lib/cn";

/**
 * The full lockup: symbol + QUORLYN wordmark + TECHNOLOGY subtitle.
 *
 * The wordmark is live text rather than an outlined path so it renders in the
 * brand typeface at any size, stays selectable, and needs no separate asset.
 */
export function Logo({
  href = "/",
  size = "md",
  showSubtitle = true,
  className,
}: {
  href?: string | null;
  size?: "sm" | "md";
  showSubtitle?: boolean;
  className?: string;
}) {
  const markSize = size === "sm" ? 26 : 32;

  // Wordmark weight and tracking follow the official lockup: QUORLYN light and
  // widely tracked, TECHNOLOGY beneath it in the brand gradient. Text color
  // adapts to the page ground; the official symbol pixels are unchanged.
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <QuorlynMark size={markSize} priority />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-brand font-normal text-wordmark",
            size === "sm" ? "text-[15px] tracking-[0.26em]" : "text-[17px] tracking-[0.28em]",
          )}
        >
          QUORLYN
        </span>
        {showSubtitle && (
          <span className="text-gradient-subtitle mt-[5px] font-mono text-[8px] tracking-[0.42em]">
            TECHNOLOGY
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Quorlyn Technology — home"
      className="inline-flex rounded-sm transition-opacity duration-150 ease-precise hover:opacity-80"
    >
      {content}
    </Link>
  );
}
