/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately dependency-free — `clsx` + `tailwind-merge` would be ~8kB for
 * behaviour this site does not need.
 *
 * The trade-off: this does NOT resolve conflicting utilities. Later classes in
 * the string do not win; whichever Tailwind emits last in the stylesheet does.
 * So never pass a utility that fights one baked into a component's base class —
 * `display` is the usual trap. Put layout concerns like `hidden sm:flex` on a
 * wrapper element instead.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
