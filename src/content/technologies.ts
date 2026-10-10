/**
 * Technologies grouped by layer.
 *
 * A wall of vendor logos says nothing about judgement, so each group carries a
 * one-line rationale instead. Listing a technology here means the team works
 * with it — keep the lists honest and short rather than exhaustive.
 */

export type TechGroup = {
  id: string;
  label: string;
  /** Why this layer is chosen the way it is. */
  note: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    note: "Typed, component-driven, server-rendered by default. The browser gets as little JavaScript as the feature actually needs.",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vite", "React Native"],
  },
  {
    id: "backend",
    label: "Backend",
    note: "Explicit system boundaries and typed interfaces keep application rules separate from framework code.",
    items: ["Node.js", "TypeScript", "Python", "FastAPI", "REST", "GraphQL"],
  },
  {
    id: "ai",
    label: "AI & ML",
    note: "Model integration includes evaluation examples, quality checks and a fallback when a request fails.",
    items: ["Claude API", "Vector search", "RAG pipelines", "LangGraph", "PyTorch", "ONNX"],
  },
  {
    id: "data",
    label: "Data",
    note: "One definition per metric, versioned alongside the code that computes it. Pipelines are re-runnable by design.",
    items: ["PostgreSQL", "dbt", "Airflow", "DuckDB", "Pandas", "SQL"],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    note: "Infrastructure as code from the first environment, so the path to production is reviewable like any other change.",
    items: ["Docker", "GitHub Actions", "Terraform", "AWS", "Cloudflare", "Vercel"],
  },
  {
    id: "storage",
    label: "Databases & Storage",
    note: "We start with relational storage and evaluate other options when the workload needs them. Schema changes are versioned migrations.",
    items: ["PostgreSQL", "Redis", "SQLite", "S3", "Prisma", "Drizzle"],
  },
];
