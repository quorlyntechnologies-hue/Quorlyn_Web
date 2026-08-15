/**
 * Service definitions.
 *
 * These describe capability and approach — how Quorlyn works on a given kind of
 * problem — not track record. No client names, no outcome figures, no counts.
 * Edit the copy freely; the shape is what the Services page and homepage read.
 */

export type Service = {
  slug: string;
  index: string;
  title: string;
  /** One line for the homepage grid. */
  summary: string;
  /** The problem this exists to solve, in the client's words. */
  problem: string;
  /** How Quorlyn approaches it. Method, not promises. */
  approach: string;
  deliverables: string[];
  technologies: string[];
};

export const services: Service[] = [
  {
    slug: "product-engineering",
    index: "01",
    title: "Product Engineering",
    summary:
      "End-to-end delivery of web and mobile products — architecture, build, release and the iteration after.",
    problem:
      "An idea is validated but there is no team to build it, or an existing build has stalled against its own architecture.",
    approach:
      "We start from the domain rather than the framework: model the data, define the boundaries, then choose the stack that fits. Work ships in vertical slices, so something real is running early and every week after.",
    deliverables: [
      "Technical architecture and data model",
      "Production web or mobile application",
      "CI/CD pipeline and environments",
      "Test suite and documentation",
      "Handover or ongoing engineering",
    ],
    technologies: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "React Native"],
  },
  {
    slug: "ai-engineering",
    index: "02",
    title: "AI Engineering",
    summary:
      "Language models, retrieval and automation wired into real systems — scoped to what measurably works.",
    problem:
      "There is a plausible AI use case, but no clear path from demo to something dependable enough to put in front of users.",
    approach:
      "We scope to a task with a measurable success criterion, build an evaluation set before the feature, and keep the model behind an interface we can swap. Where a deterministic system is cheaper and more reliable, we say so.",
    deliverables: [
      "Use-case scoping and feasibility assessment",
      "Retrieval and context pipeline",
      "Evaluation harness and quality baselines",
      "Production integration with fallbacks",
      "Cost and latency instrumentation",
    ],
    technologies: ["Python", "TypeScript", "Claude API", "Vector search", "LangGraph", "FastAPI"],
  },
  {
    slug: "platform-cloud",
    index: "03",
    title: "Platform & Cloud",
    summary:
      "The infrastructure underneath: deployment, observability, cost control and the ability to change safely.",
    problem:
      "Deploys are manual and tense, incidents are diagnosed by guesswork, and nobody can say what the infrastructure actually costs.",
    approach:
      "Infrastructure as code from the first environment, with observability treated as a feature rather than an add-on. We optimise for a team's ability to change things safely, not for a diagram.",
    deliverables: [
      "Infrastructure as code",
      "Automated build and deployment pipeline",
      "Logging, metrics and alerting",
      "Environment and secrets strategy",
      "Cost review and right-sizing",
    ],
    technologies: ["Docker", "GitHub Actions", "Terraform", "AWS", "Cloudflare", "PostgreSQL"],
  },
  {
    slug: "data-engineering",
    index: "04",
    title: "Data Engineering",
    summary:
      "Pipelines, warehouses and interfaces that turn operational data into something a team can act on.",
    problem:
      "The data exists across several systems, but answering a question takes days and two people disagree on the number.",
    approach:
      "One definition per metric, versioned with the code that computes it. We build the pipeline to be re-runnable and the model to be explainable before building anything that visualises it.",
    deliverables: [
      "Ingestion and transformation pipelines",
      "Warehouse schema and metric definitions",
      "Data quality checks and monitoring",
      "Dashboards and reporting interfaces",
    ],
    technologies: ["Python", "SQL", "dbt", "PostgreSQL", "Airflow", "DuckDB"],
  },
  {
    slug: "interface-design",
    index: "05",
    title: "Interface Design & Engineering",
    summary:
      "Design systems and front-end implementation held to the same standard as the systems behind them.",
    problem:
      "The product works but feels unfinished, inconsistent between screens, or unusable for part of its audience.",
    approach:
      "Design decisions become tokens and components rather than static files, so the interface stays consistent as it grows. Accessibility and responsive behaviour are acceptance criteria, not a later pass.",
    deliverables: [
      "Design tokens and component library",
      "Responsive interface implementation",
      "Accessibility audit and remediation",
      "Interaction and motion specification",
    ],
    technologies: ["Figma", "React", "Tailwind CSS", "TypeScript", "Storybook", "WCAG 2.2"],
  },
  {
    slug: "technical-consulting",
    index: "06",
    title: "Technical Consulting",
    summary:
      "Architecture review, technology selection and a written path forward when a decision is expensive to reverse.",
    problem:
      "A rebuild, a migration or a platform choice is on the table and the cost of getting it wrong is measured in quarters.",
    approach:
      "We review the system and the constraints around it — team, budget, timeline — and produce a written recommendation with the trade-offs stated plainly, including the option of doing nothing.",
    deliverables: [
      "Architecture and codebase review",
      "Technology selection with trade-offs",
      "Migration or remediation plan",
      "Effort and sequencing estimate",
    ],
    technologies: [],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
