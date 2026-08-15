import { QuorlynMark } from "@/components/brand/QuorlynMark";
import { Container } from "@/components/ui/Container";

/**
 * Shown across the admin area when Supabase is not configured.
 *
 * The alternative — a crash, or a login form that can never succeed — tells
 * whoever opens this nothing. This states exactly which variables are missing
 * and what to do, which is the whole point of a setup state.
 */
export function SetupNotice() {
  const missing = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", set: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      set: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    { name: "SUPABASE_SERVICE_ROLE_KEY", set: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
  ];

  return (
    <Container size="narrow" className="flex min-h-dvh flex-col justify-center py-20">
      <QuorlynMark size={40} />

      <p className="mt-8 font-mono text-label tracking-[0.2em] text-subtle uppercase">
        Admin — not configured
      </p>
      <h1 className="mt-5 text-h2 text-fg">The backend is not connected yet</h1>
      <p className="mt-6 text-lead leading-relaxed text-muted">
        The public site works without it — inquiries are validated and logged, and visitors are
        told plainly that submissions are not yet being stored. The admin area needs a Supabase
        project before it can do anything.
      </p>

      <ul className="mt-10 overflow-hidden rounded-lg border border-line">
        {missing.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0"
          >
            <code className="font-mono text-sm text-fg">{item.name}</code>
            <span
              className={
                item.set
                  ? "font-mono text-[11px] tracking-[0.14em] text-success uppercase"
                  : "font-mono text-[11px] tracking-[0.14em] text-danger uppercase"
              }
            >
              {item.set ? "set" : "missing"}
            </span>
          </li>
        ))}
      </ul>

      <ol className="mt-10 space-y-3 text-sm leading-relaxed text-muted">
        <li>
          <span className="font-mono text-accent">01</span> — Create a free project at
          supabase.com, then copy the URL and keys from Project Settings → API.
        </li>
        <li>
          <span className="font-mono text-accent">02</span> — Put them in{" "}
          <code className="font-mono text-fg">.env.local</code> (see{" "}
          <code className="font-mono text-fg">.env.example</code>).
        </li>
        <li>
          <span className="font-mono text-accent">03</span> — Apply{" "}
          <code className="font-mono text-fg">supabase/migrations/</code> and create the first
          admin. Both steps are in <code className="font-mono text-fg">docs/BACKEND-SETUP.md</code>.
        </li>
      </ol>
    </Container>
  );
}
