"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Scroll reveal via IntersectionObserver — no animation library, no scroll
 * listener, no layout reads.
 *
 * Content is rendered and readable at all times; the class only animates
 * opacity and transform, and `prefers-reduced-motion` neutralises it in CSS.
 * Observation stops after the first reveal so nothing re-animates on scroll-up.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger in ms. Keep total stagger under ~300ms across a group. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // The tag union makes React infer an intersection of every element's ref
  // type. Narrowing to one concrete tag keeps the polymorphic API without it.
  const Component = Tag as "div";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount reveals immediately, so above-the-fold
    // content never waits for a scroll event that may not come.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={cn("reveal", className)}
      data-visible={visible ? "true" : "false"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
