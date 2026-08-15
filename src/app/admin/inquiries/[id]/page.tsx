import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { addInquiryNote, updateInquiryStatus } from "@/app/admin/actions";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminBackendReady, requireInquiryAccess } from "@/lib/auth/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { inquiryStatuses, type Inquiry, type InquiryNote } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Inquiry" };
export const dynamic = "force-dynamic";

type NoteWithAuthor = InquiryNote & { profiles: { full_name: string | null; email: string } | null };

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!adminBackendReady()) return <SetupNotice />;

  const session = await requireInquiryAccess();
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return <SetupNotice />;

  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle<Inquiry>();

  if (!inquiry) notFound();

  const { data: notes } = await supabase
    .from("inquiry_notes")
    .select("*, profiles(full_name, email)")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false });

  const noteList = (notes ?? []) as NoteWithAuthor[];

  const details: Array<[string, string | null]> = [
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Company", inquiry.company],
    ["Project type", inquiry.project_type],
    ["Budget", inquiry.budget],
    ["Timeline", inquiry.timeline],
    ["Prefers", inquiry.preferred_contact],
    ["Came from", inquiry.source_path],
  ];

  return (
    <AdminChrome session={session} current="/admin/inquiries">
      <Link
        href="/admin/inquiries"
        className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase hover:text-fg"
      >
        ← All inquiries
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-label tracking-[0.18em] text-accent">{inquiry.reference}</p>
          <h1 className="mt-3 text-h2 text-fg">{inquiry.name}</h1>
          <p className="mt-2 text-muted">
            <a href={`mailto:${inquiry.email}`} className="text-accent hover:underline">
              {inquiry.email}
            </a>
            {inquiry.company && <span> · {inquiry.company}</span>}
          </p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <section>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
              Project description
            </h2>
            {/* whitespace-pre-wrap preserves the visitor's paragraphing; the
                value is React-escaped, never dangerouslySetInnerHTML. */}
            <p className="mt-4 rounded-lg border border-line bg-surface/40 p-6 leading-relaxed whitespace-pre-wrap text-fg">
              {inquiry.message}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-h3 text-fg">Internal notes</h2>
            <p className="mt-2 text-sm text-subtle">
              Visible to staff only. Never shown to the client.
            </p>

            <form action={addInquiryNote} className="mt-6">
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <label htmlFor="note-body" className="sr-only">
                Add a note
              </label>
              <textarea
                id="note-body"
                name="body"
                rows={3}
                required
                maxLength={4000}
                placeholder="Called — they want to start in October."
                className="w-full resize-y rounded-md border border-line bg-elevated/60 px-4 py-3 text-fg placeholder:text-subtle focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/25"
              />
              <button
                type="submit"
                className="mt-3 inline-flex h-10 items-center rounded-md bg-fg px-5 text-sm font-medium text-void transition-colors hover:bg-white"
              >
                Add note
              </button>
            </form>

            {noteList.length > 0 && (
              <ul className="mt-8 space-y-4">
                {noteList.map((note) => (
                  <li key={note.id} className="rounded-lg border border-line bg-surface/30 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm text-fg">
                        {note.profiles?.full_name || note.profiles?.email || "Removed user"}
                      </span>
                      <time
                        dateTime={note.created_at}
                        className="font-mono text-[10px] tracking-[0.1em] text-subtle uppercase"
                      >
                        {new Date(note.created_at).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <p className="mt-2 leading-relaxed whitespace-pre-wrap text-muted">
                      {note.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-lg border border-line bg-surface/40 p-6">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">
              Status
            </h2>
            <form action={updateInquiryStatus} className="mt-4 flex flex-wrap gap-2">
              <input type="hidden" name="id" value={inquiry.id} />
              <label htmlFor="status-select" className="sr-only">
                Change status
              </label>
              <select
                id="status-select"
                name="status"
                defaultValue={inquiry.status}
                className="h-10 flex-1 rounded-md border border-line bg-elevated px-3 text-sm text-fg focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/25"
              >
                {inquiryStatuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="h-10 rounded-md border border-line px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                Update
              </button>
            </form>
          </div>

          <dl className="mt-6 overflow-hidden rounded-lg border border-line">
            {details
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line px-5 py-3.5 last:border-b-0"
                >
                  <dt className="w-28 shrink-0 font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">
                    {label}
                  </dt>
                  <dd className="flex-1 text-sm break-words text-fg">{value}</dd>
                </div>
              ))}
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-3.5">
              <dt className="w-28 shrink-0 font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">
                Received
              </dt>
              <dd className="flex-1 text-sm text-fg">
                <time dateTime={inquiry.created_at}>
                  {new Date(inquiry.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </dd>
            </div>
          </dl>

          <a
            href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: your project inquiry (${inquiry.reference})`)}`}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-fg px-5 text-sm font-medium text-void transition-colors hover:bg-white"
          >
            Reply by email
          </a>
        </aside>
      </div>
    </AdminChrome>
  );
}
