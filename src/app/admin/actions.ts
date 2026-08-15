"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession, requireInquiryAccess } from "@/lib/auth/dal";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { inquiryStatuses, type InquiryStatus } from "@/lib/supabase/types";

/**
 * Admin server actions.
 *
 * Every one re-verifies authorization through the DAL. Server Actions are
 * publicly reachable endpoints — being unable to see a button in the UI is not
 * a check, and an action that trusts its arguments is an open API.
 */

/** Appends to the audit trail. Never throws: a logging failure must not roll
 *  back the action the user actually asked for. */
async function recordAudit(entry: {
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  detail?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;

  const { error } = await admin.from("audit_logs").insert({
    actor_id: entry.actorId,
    actor_email: entry.actorEmail,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    detail: entry.detail ?? null,
  });

  if (error) console.error("[audit] failed to record", entry.action, error.message);
}

export async function updateInquiryStatus(formData: FormData) {
  const session = await requireInquiryAccess();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as InquiryStatus;

  if (!id) return;
  // Never trust a submitted enum value — an arbitrary string here would be a
  // database error at best.
  if (!inquiryStatuses.some((s) => s.value === status)) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  // Written through the session client, so RLS still decides whether this
  // person may touch the row.
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);

  if (error) {
    console.error("[admin] status update failed", error.message);
    return;
  }

  await recordAudit({
    actorId: session.userId,
    actorEmail: session.email,
    action: "inquiry.status_changed",
    entityType: "inquiry",
    entityId: id,
    detail: { status },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
}

export async function addInquiryNote(formData: FormData) {
  const session = await requireInquiryAccess();

  const inquiryId = String(formData.get("inquiryId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!inquiryId || !body || body.length > 4000) return;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from("inquiry_notes").insert({
    inquiry_id: inquiryId,
    author_id: session.userId,
    body,
  });

  if (error) {
    console.error("[admin] note insert failed", error.message);
    return;
  }

  await recordAudit({
    actorId: session.userId,
    actorEmail: session.email,
    action: "inquiry.note_added",
    entityType: "inquiry",
    entityId: inquiryId,
  });

  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function signOut() {
  const session = await getSession();
  const supabase = await createSupabaseServerClient();

  if (supabase) await supabase.auth.signOut();

  if (session) {
    await recordAudit({
      actorId: session.userId,
      actorEmail: session.email,
      action: "auth.signed_out",
      entityType: "session",
      entityId: session.userId,
    });
  }

  redirect("/admin/login");
}
