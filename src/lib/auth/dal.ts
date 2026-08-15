import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/supabase/types";

/**
 * Data Access Layer.
 *
 * Per the Next.js authentication guide, `proxy.ts` performs only an optimistic
 * cookie check — it cannot be the authorization boundary, because it runs on
 * prefetches and never touches the database. Real checks happen here, as close
 * to the data as possible, and every protected page or action calls one of
 * these functions before reading anything.
 *
 * `cache()` memoises per render pass, so a layout and its pages verifying the
 * same session cost one round trip rather than several.
 */

export type Session = {
  userId: string;
  email: string;
  profile: Profile;
};

/**
 * Returns the signed-in staff member, or null.
 *
 * Uses `getUser()` rather than `getSession()`: getSession trusts the cookie as
 * stored, while getUser revalidates the token with Supabase. On a route that
 * guards commercially sensitive data, that round trip is worth it.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // A Supabase Auth account is not staff access. The profile row is.
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active) return null;

  return { userId: user.id, email: user.email ?? profile.email, profile };
});

/** Redirects to sign-in unless the caller is active staff. */
export async function requireStaff(returnTo?: string): Promise<Session> {
  const session = await getSession();
  if (!session) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/admin/login${next}`);
  }
  return session;
}

/** Redirects unless the caller is an admin. Editors are sent to the dashboard. */
export async function requireAdmin(): Promise<Session> {
  const session = await requireStaff();
  if (session.profile.role !== "admin") redirect("/admin?denied=admin");
  return session;
}

/**
 * Redirects unless the caller may read leads. Admins always may; editors need
 * the explicit `can_view_inquiries` grant.
 */
export async function requireInquiryAccess(): Promise<Session> {
  const session = await requireStaff();
  const allowed = session.profile.role === "admin" || session.profile.can_view_inquiries;
  if (!allowed) redirect("/admin?denied=inquiries");
  return session;
}

/** Whether the admin area can function at all. Drives the setup notice. */
export const adminBackendReady = () => isSupabaseConfigured;
