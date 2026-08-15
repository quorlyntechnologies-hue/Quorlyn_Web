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
    note: "Boring where it should be boring. Explicit boundaries, typed contracts, and no framework magic in the domain layer.",
    items: ["Node.js", "TypeScript", "Python", "FastAPI", "REST", "GraphQL"],
  },
  {
    id: "ai",
    label: "AI & ML",
    note: "Model choice is an implementation detail behind an interface. What matters is the evaluation set and the fallback path.",
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
    note: "Relational until there is a measured reason not to be. Schema changes ship as migrations, never by hand.",
    items: ["PostgreSQL", "Redis", "SQLite", "S3", "Prisma", "Drizzle"],
  },
];
