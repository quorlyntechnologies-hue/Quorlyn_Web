/**
 * Positioning statements — how the company intends to work.
 *
 * These are commitments, not claims about a track record. Nothing here asserts
 * a client, a result, a headcount or a year of experience.
 */

export type Principle = {
  index: string;
  title: string;
  body: string;
};

/** Homepage — "Why Quorlyn". Differentiators, stated as method. */
export const differentiators: Principle[] = [
  {
    index: "01",
    title: "Engineers scope the project",
    body: "The people writing the code take part in scope, estimates and architecture. You can discuss a technical decision directly with them.",
  },
  {
    index: "02",
    title: "Changes are documented",
    body: "Typed interfaces, versioned database migrations and tests help the next engineer understand a change. We record the reasoning behind technical decisions.",
  },
  {
    index: "03",
    title: "Interfaces work across devices",
    body: "Shared components keep screens consistent. Responsive layouts and accessibility checks are included in the work and its acceptance criteria.",
  },
  {
    index: "04",
    title: "Recommendations include trade-offs",
    body: "We explain the cost and constraints of the options, including a smaller build, a different tool or keeping the existing system.",
  },
];

/** About page — the longer-form philosophy. */
export const beliefs: Principle[] = [
  {
    index: "01",
    title: "Choose tools around the system",
    body: "We model the data and system boundaries first. Tool selection follows the problem, the team maintaining it and the budget available to run it.",
  },
  {
    index: "02",
    title: "Make the code readable",
    body: "We favour explicit code and predictable behaviour, especially in the parts that must not break. Documentation records decisions while the reasoning is still fresh.",
  },
  {
    index: "03",
    title: "Prepare the release",
    body: "We deploy to a working environment during development. A deployment pipeline, monitoring and a tested rollback are part of preparing the first production release.",
  },
  {
    index: "04",
    title: "Include accessibility in acceptance",
    body: "Keyboard access, readable contrast, semantic markup and reduced-motion support belong in the agreed acceptance criteria and implementation checks.",
  },
  {
    index: "05",
    title: "Measure before optimising",
    body: "We collect measurements before changing performance, AI features, infrastructure spend or database indexes. The measurements guide what to change and whether it helped.",
  },
  {
    index: "06",
    title: "Raise constraints early",
    body: "We discuss scope, scaling concerns and costs when they become clear, so the team can decide how to proceed before committing more work.",
  },
];
