import Image from "next/image";

import symbol from "@/assets/brand/quorlyn-symbol.png";
import { cn } from "@/lib/cn";

/**
 * The Quorlyn symbol — the Q/T monogram with its pixel dissolution.
 *
 * This renders the official artwork rather than a redrawn approximation. The
 * asset is cropped out of `public/brand/quorlyn-logo.png` by
 * `npm run brand:assets`, so the mark on the site can never drift from the
 * logo the company actually uses. Replacing the source file and re-running
 * that script updates the navbar, footer, CTA band, 404, contact confirmation,
 * favicon and social card together.
 *
 * A static import gives Next the intrinsic dimensions, so the box is reserved
 * before the image loads and the header never shifts.
 */
export function QuorlynMark({
  size = 32,
  className,
  /** Only set when the mark stands alone as a link or image. Inside a lockup
   *  the adjacent wordmark already names it, so it stays decorative. */
  title,
  priority,
}: {
  size?: number;
  className?: string;
  title?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={symbol}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0", className)}
      // The symbol is square and never renders above ~48 CSS px.
      sizes={`${size}px`}
    />
  );
}
