/** Static content wrapper; headings and reading copy need no animation code. */
export function Content({
  children,
  className,
  as: Element = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
}) {
  return <Element className={className}>{children}</Element>;
}
