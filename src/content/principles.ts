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
    title: "Engineering-first",
    body: "Scope, estimates and architecture come from the people who will write the code. There is no layer between the conversation and the build.",
  },
  {
    index: "02",
    title: "Built to be changed",
    body: "Most of a system's cost arrives after launch. We optimise for the change you have not thought of yet: typed boundaries, migrations, tests where they earn their keep.",
  },
  {
    index: "03",
    title: "Design as engineering",
    body: "Interfaces are held to the same standard as the systems behind them — tokens over one-off styles, accessibility and responsive behaviour as acceptance criteria.",
  },
  {
    index: "04",
    title: "Plainly stated trade-offs",
    body: "Every technical decision costs something. We name the cost, including when the honest recommendation is a smaller build, a different tool, or nothing at all.",
  },
];

/** About page — the longer-form philosophy. */
export const beliefs: Principle[] = [
  {
    index: "01",
    title: "The problem outranks the stack",
    body: "Technology choice is downstream of the domain. We model the data and the boundaries first, then pick tools that fit the problem, the team that will inherit it, and the budget it has to run on. A stack chosen for its novelty becomes someone else's maintenance burden.",
  },
  {
    index: "02",
    title: "Software is read more than it is written",
    body: "Code is a communication medium with a long lifespan. We favour explicit over clever, boring over novel in the places that must not break, and documentation written while the reasoning is still fresh.",
  },
  {
    index: "03",
    title: "Shipping is a discipline, not an event",
    body: "Work goes to a real environment early and often. A pipeline, monitoring and a tested rollback exist before the first release, which is what makes launch day uneventful.",
  },
  {
    index: "04",
    title: "Accessibility is correctness",
    body: "An interface that excludes part of its audience is not finished. Keyboard access, contrast, semantics and reduced-motion support are part of the definition of done, not a remediation phase.",
  },
  {
    index: "05",
    title: "Measure before optimising",
    body: "Performance work without a measurement is decoration. We instrument first, fix what the data points at, and leave the rest alone — the same applies to AI features, infrastructure spend and database indexes.",
  },
  {
    index: "06",
    title: "Say the difficult thing early",
    body: "Scope that will not fit, an approach that will not scale, a request that will cost more than it returns — all of it is cheaper to raise in week one. We would rather have an awkward conversation than deliver a comfortable failure.",
  },
];
