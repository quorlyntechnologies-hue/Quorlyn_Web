/** How an engagement runs, stage by stage. Describes method, not guarantees. */

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
  /** What exists at the end of the stage. */
  output: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    body: "We map the problem before the solution: users, constraints, existing systems, and the decision that actually needs making. Where the scope is larger than the budget, we say so at this stage rather than the last one.",
    output: "Scope, constraints, success criteria",
  },
  {
    index: "02",
    title: "Design",
    body: "Interface and architecture are designed together, because one constrains the other. Decisions become tokens, components and schemas — artefacts the build can use directly.",
    output: "Design system, data model, architecture",
  },
  {
    index: "03",
    title: "Engineer",
    body: "Work ships in vertical slices behind a real deployment pipeline. Something usable runs early and keeps running, so progress is observable rather than reported.",
    output: "Working software, in an environment",
  },
  {
    index: "04",
    title: "Validate",
    body: "Automated tests for the logic, real devices for the interface, and a pass against accessibility and performance budgets. Findings are fixed before launch, not filed after it.",
    output: "Test coverage, audit results, fixes",
  },
  {
    index: "05",
    title: "Launch",
    body: "Release is a routine event: automated deploys, monitoring in place beforehand, and a rollback that has been tested. The first day in production should be uneventful.",
    output: "Production release, monitoring, runbook",
  },
  {
    index: "06",
    title: "Evolve",
    body: "After launch the work is measurement and iteration — usage, cost, performance, and the next most valuable change. Or a clean handover, if that is what the team needs.",
    output: "Iteration cycle or documented handover",
  },
];
