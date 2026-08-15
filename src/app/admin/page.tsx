import Link from "next/link";

import { AdminChrome } from "@/components/admin/AdminChrome";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminBackendReady, requireStaff } from "@/lib/auth/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

/** Counts for the header tiles. Only metrics that change a decision — no
 *  vanity numbers, per the brief's "do not create meaningless analytics". */
async function loadMetrics(canSeeInquiries: boolean) {
  if (!canSeeInquiries) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const now = Date.now();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

  // head: true fetches counts without transferring rows.
  const [total, unread, week, month, recent] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo),
    supabase
      .from("inquiries")
      .select("id, reference, name, company, project_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    total: total.count ?? 0,
    unread: unread.count ?? 0,
    week: week.count ?? 0,
    month: month.count ?? 0,
    recent: (recent.data ?? []) as Array<
      Pick<Inquiry, "id" | "reference" | "name" | "company" | "project_type" | "status" | "created_at">
    >,
    failed: Boolean(total.error),
  };
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  if (!adminBackendReady()) return <SetupNotice />;

  const session = await requireStaff("/admin");
  const { denied } = await searchParams;

  const canSeeInquiries =
    session.profile.role === "admin" || session.profile.can_view_inquiries;
  const metrics = await loadMetrics(canSeeInquiries);

  const tiles = metrics
    ? [
        { label: "New", value: metrics.unread, hint: "Awaiting first response" },
        { label: "Last 7 days", value: metrics.week, hint: "Inquiries received" },
        { label: "Last 30 days", value: metrics.month, hint: "Inquiries received" },
        { label: "Total", value: metrics.total, hint: "All time" },
      ]
    : [];

  return (
    <AdminChrome session={session} current="/admin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-label tracking-[0.2em] text-subtle uppercase">Dashboard</p>
          <h1 className="mt-3 text-h2 text-fg">
            {session.profile.full_name
              ? `Afternoon, ${session.profile.full_name.split(" ")[0]}`
              : "Overview"}
          </h1>
        </div>
      </div>

      {denied && (
        <p
          role="alert"
          className="mt-8 rounded-md border border-danger/30 bg-danger/[0.06] px-5 py-4 text-sm text-danger"
        >
          {denied === "inquiries"
            ? "Your account does not have access to inquiries. An administrator can grant it."
            : "That area is restricted to administrators."}
        </p>
      )}

      {!canSeeInquiries && (
        <p className="mt-8 rounded-lg border border-dashed border-line-strong px-6 py-8 text-muted">
          Your account is an editor without lead access, so there is nothing to show here yet.
          Content modules arrive in the next phase.
        </p>
      )}

      {metrics && (
        <>
          <dl className="mosaic mt-10 grid overflow-hidden rounded-lg border border-line sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="bg-void p-6">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">
                  {tile.label}
                </dt>
                <dd className="mt-3 font-display text-[2.25rem] leading-none text-fg">
                  {tile.value}
                </dd>
                <p className="mt-2 text-sm text-subtle">{tile.hint}</p>
              </div>
            ))}
          </dl>

          <section className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-h3 text-fg">Latest inquiries</h2>
              <Link
                href="/admin/inquiries"
                className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase hover:opacity-80"
              >
                View all
              </Link>
            </div>

            {metrics.recent.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-line-strong px-6 py-10 text-center text-muted">
                No inquiries yet. They will appear here the moment the form is submitted.
              </p>
            ) : (
              <ul className="mt-6 overflow-hidden rounded-lg border border-line">
                {metrics.recent.map((inquiry) => (
                  <li key={inquiry.id} className="border-b border-line last:border-b-0">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 transition-colors duration-150 hover:bg-white/[0.03]"
                    >
                      <span className="font-mono text-[11px] text-subtle">{inquiry.reference}</span>
                      <span className="flex-1 text-fg">
                        {inquiry.name}
                        {inquiry.company && (
                          <span className="text-muted"> · {inquiry.company}</span>
                        )}
                      </span>
                      <span className="text-sm text-muted">{inquiry.project_type}</span>
                      <StatusBadge status={inquiry.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </AdminChrome>
  );
}
