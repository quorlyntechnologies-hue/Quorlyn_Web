/**
 * Case studies.
 *
 * INTENTIONALLY EMPTY. Quorlyn has no published client work yet, and inventing
 * a portfolio would misrepresent the company to exactly the people it is trying
 * to earn trust from. The /work page detects the empty list and renders an
 * honest "no published work yet" state instead of filler.
 *
 * To publish a case study, append an object below — the page, the index grid
 * and the homepage section all read from this array, so nothing else changes.
 *
 * `metrics` must only ever contain measured numbers the client has approved for
 * publication. If there is no measured result, leave the array empty; the UI
 * omits the block entirely rather than showing a placeholder statistic.
 */

export type Project = {
  slug: string;
  title: string;
  category: string;
  /** Client name, or `null` while under NDA / not yet cleared to publish. */
  client: string | null;
  year: string;
  /** One-line summary for the index grid. */
  summary: string;
  challenge: string;
  approach: string;
  solution: string;
  technologies: string[];
  /** Approved, measured outcomes only. Empty is a valid and honest state. */
  metrics: Array<{ label: string; value: string }>;
  /** Paths under /public. Omit rather than shipping a grey placeholder box. */
  images: Array<{ src: string; alt: string }>;
};

export const projects: Project[] = [];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/**
 * Shown on /work while `projects` is empty. These describe the kind of problem
 * the team is set up to take on — framed as capability, never as history.
 */
export const workFocusAreas = [
  {
    index: "01",
    title: "Products from zero",
    body: "A validated idea that needs architecture, an interface and a first production release — with the engineering set up so the second release is easier than the first.",
  },
  {
    index: "02",
    title: "Systems under strain",
    body: "An existing codebase that has outgrown its original shape: slow deploys, fragile releases, or a data model fighting the product it now has to support.",
  },
  {
    index: "03",
    title: "AI with a real job",
    body: "A specific task where language models measurably outperform the alternative — scoped, evaluated, and integrated with fallbacks rather than bolted on.",
  },
];
