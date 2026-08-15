import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Button states are carried by color, border and a brand ring — never by
 * layout. Nothing here changes an element's box on hover, so rows of buttons
 * can't jitter and reflow neighbours.
 *
 * `primary` is a light solid rather than a gradient fill: white-on-cyan fails
 * AA, and reserving the gradient for the mark and hairlines keeps it meaningful.
 */
// No `whitespace-nowrap`: a long label must wrap inside its container rather
// than push the page wider than the viewport. `max-w-full` keeps the box inside
// its parent even when the label is a single unbreakable word.
const base =
  "relative inline-flex max-w-full items-center justify-center gap-2 rounded-md text-center " +
  "font-medium transition-[background-color,color,border-color,box-shadow,opacity] " +
  "duration-200 ease-precise select-none " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-void hover:bg-white active:bg-[#d6dde8] " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-glow",
  secondary:
    "border border-line bg-surface/60 text-fg backdrop-blur-sm " +
    "hover:border-line-strong hover:bg-elevated active:bg-surface",
  ghost: "text-muted hover:text-fg hover:bg-white/5 active:bg-white/10",
};

/** Sizes keep every target at or above the 44px comfortable-touch floor. */
const sizes: Record<Size, string> = {
  sm: "h-10 px-3.5 text-sm",
  md: "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-body",
  lg: "h-12 px-6 text-body sm:h-14 sm:px-8",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (external) {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}

/** The arrow used on forward-moving CTAs. Nudges on hover; never wraps. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-200 ease-precise group-hover:translate-x-0.5",
        className,
      )}
    >
      <path
        d="M3 8h9.5M9 4.5 12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
