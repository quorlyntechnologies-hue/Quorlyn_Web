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
      "Web and mobile applications, including architecture, development, release and ongoing changes.",
    problem:
      "You have a product idea to build, or an existing application that has become difficult to change.",
    approach:
      "We model the data and define the system boundaries before choosing the stack. We release working features in stages so you can review them as the product develops.",
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
      "Language models, document retrieval and automation, with evaluation and fallbacks built into the system.",
    problem:
      "You have an AI use case or prototype and need to understand its quality, cost and behaviour before putting it in front of users.",
    approach:
      "We agree a task and success criteria, build evaluation examples, and integrate the model behind a replaceable interface. We compare the result with simpler approaches and include a fallback for failures.",
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
      "Deployment pipelines, monitoring and infrastructure management, with a review of running costs.",
    problem:
      "Deployments are manual, incidents are difficult to trace, or infrastructure costs are hard to explain.",
    approach:
      "We define infrastructure in code and set up automated deployment, logs, metrics and alerts. We review environment configuration, secrets and resource sizing with the team that will run the system.",
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
      "Data pipelines, warehouse models, quality checks and reporting interfaces.",
    problem:
      "Data is spread across systems, reports take manual work, or teams use different definitions for the same metric.",
    approach:
      "We agree metric definitions, model the data and build repeatable ingestion and transformation pipelines. Quality checks and monitoring accompany the dashboards or reports.",
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
      "Design systems and responsive interfaces, with accessibility checks and reusable components.",
    problem:
      "The product works but feels unfinished, inconsistent between screens, or unusable for part of its audience.",
    approach:
      "We turn design decisions into shared tokens and components, implement the interface, and check it across screen sizes. Keyboard access, contrast and other accessibility requirements are part of acceptance.",
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
      "Architecture and code reviews, technology selection, and written migration or remediation plans.",
    problem:
      "You are considering a rebuild, migration or platform change and need a technical review before committing to it.",
    approach:
      "We review the codebase and the team's budget, timeline and constraints. You receive a written recommendation with options, trade-offs, an effort estimate and an order for the work, including whether a change is needed at all.",
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
