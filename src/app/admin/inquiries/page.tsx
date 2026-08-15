import type { Metadata } from "next";
import Link from "next/link";

import { AdminChrome } from "@/components/admin/AdminChrome";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminBackendReady, requireInquiryAccess } from "@/lib/auth/dal";
import { cn } from "@/lib/cn";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { inquiryStatuses, type Inquiry, type InquiryStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Inquiries" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type SearchParams = { q?: string; status?: string; page?: string };

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (!adminBackendReady()) return <SetupNotice />;

  const session = await requireInquiryAccess();
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const status = inquiryStatuses.some((s) => s.value === params.status)
    ? (params.status as InquiryStatus)
    : null;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const supabase = await createSupabaseServerClient();

  let rows: Inquiry[] = [];
  let total = 0;
  let loadError: string | null = null;

  if (supabase) {
    let request = supabase
      .from("inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (status) request = request.eq("status", status);

    if (query) {
      // Escape PostgREST's or() delimiters — an unescaped comma or paren in the
      // search box would otherwise change the shape of the filter.
      const safe = query.replace(/[,()]/g, " ");
      request = request.or(
        `name.ilike.%${safe}%,email.ilike.%${safe}%,company.ilike.%${safe}%,reference.ilike.%${safe}%`,
      );
    }

    const { data, count, error } = await request;
    rows = (data ?? []) as Inquiry[];
    total = count ?? 0;
    if (error) loadError = error.message;
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (next: Partial<SearchParams>) => {
    const sp = new URLSearchParams();
    const merged = { q: query, status: status ?? "", page: String(page), ...next };
    if (merged.q) sp.set("q", merged.q);
    if (merged.status) sp.set("status", merged.status);
    if (merged.page && merged.page !== "1") sp.set("page", merged.page);
    const qs = sp.toString();
    return qs ? `/admin/inquiries?${qs}` : "/admin/inquiries";
  };

  return (
    <AdminChrome session={session} current="/admin/inquiries">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-label tracking-[0.2em] text-subtle uppercase">Inquiries</p>
          <h1 className="mt-3 text-h2 text-fg">
            {total} {total === 1 ? "inquiry" : "inquiries"}
            {status || query ? " matching" : ""}
          </h1>
        </div>

        {/* GET form: filters live in the URL, so a filtered view is shareable
            and survives a refresh. */}
        <form method="get" className="flex flex-wrap items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="inquiry-search" className="sr-only">
            Search inquiries
          </label>
          <input
            id="inquiry-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, email, company, reference"
            className="h-10 w-64 rounded-md border border-line bg-elevated/60 px-3.5 text-sm text-fg placeholder:text-subtle focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/25"
          />
          <button
            type="submit"
            className="h-10 rounded-md border border-line px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            Search
          </button>
        </form>
      </div>

      <nav aria-label="Filter by status" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={buildHref({ status: "", page: "1" })}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                !status
                  ? "border-cyan/30 bg-cyan/10 text-accent"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              All
            </Link>
          </li>
          {inquiryStatuses.map((option) => (
            <li key={option.value}>
              <Link
                href={buildHref({ status: option.value, page: "1" })}
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors",
                  status === option.value
                    ? "border-cyan/30 bg-cyan/10 text-accent"
                    : "border-line text-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {loadError && (
        <p role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/[0.06] px-5 py-4 text-sm text-danger">
          Could not load inquiries: {loadError}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center text-muted">
          {query || status
            ? "Nothing matches those filters."
            : "No inquiries yet. They will appear here as soon as the form is submitted."}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">Project inquiries, newest first</caption>
            <thead>
              <tr className="border-b border-line bg-white/[0.02]">
                {["Reference", "From", "Project type", "Received", "Status"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-line last:border-b-0 hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-mono text-[12px] text-accent hover:underline"
                    >
                      {inquiry.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className="block text-fg">{inquiry.name}</span>
                    <span className="block text-sm text-muted">
                      {inquiry.company ?? inquiry.email}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{inquiry.project_type}</td>
                  <td className="px-5 py-4 text-sm text-muted">
                    <time dateTime={inquiry.created_at}>
                      {new Date(inquiry.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inquiry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: String(page - 1) })}
                className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm text-muted hover:border-line-strong hover:text-fg"
              >
                Previous
              </Link>
            )}
            {page < pageCount && (
              <Link
                href={buildHref({ page: String(page + 1) })}
                className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm text-muted hover:border-line-strong hover:text-fg"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </AdminChrome>
  );
}
