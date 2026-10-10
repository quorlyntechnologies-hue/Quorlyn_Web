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
    title: "Scope",
    body: "We discuss the users, existing systems, constraints and budget, then agree the problem to solve and how to judge the result.",
    output: "Scope, constraints, success criteria",
  },
  {
    index: "02",
    title: "Design",
    body: "We design the interface and architecture together, recording decisions in the data model, schemas and reusable components.",
    output: "Design system, data model, architecture",
  },
  {
    index: "03",
    title: "Build",
    body: "We implement and deploy working features in stages. You can review the software as it develops and use those reviews to guide the next changes.",
    output: "Working software, in an environment",
  },
  {
    index: "04",
    title: "Test",
    body: "We test application logic and interfaces, check accessibility and performance against the agreed requirements, and address the findings before release.",
    output: "Test coverage, audit results, fixes",
  },
  {
    index: "05",
    title: "Release",
    body: "We prepare deployment, monitoring and a tested rollback before releasing to production. The runbook records how to operate the system.",
    output: "Production release, monitoring, runbook",
  },
  {
    index: "06",
    title: "Maintain",
    body: "After release, we review usage, cost and performance to plan further changes, or hand over the documented system to your team.",
    output: "Iteration cycle or documented handover",
  },
];
